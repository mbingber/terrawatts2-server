import { getRepository } from "typeorm";
import * as seedrandom from 'seedrandom';
import { Game } from "../entity/Game";
import { Plant } from "../entity/Plant";
import { User } from "../entity/User";
import { Context } from "../logic/types/thunks";
import { fetchMap } from "./fetchMap";
import { GameState } from "../logic/rootReducer";
import { getStore, attemptMove } from "../logic";
import { Move, ActionType } from "../entity/Move";
import { pubsub } from "../pubsub";
import { getCurrentUser } from "../auth/getCurrentUser";
import { getCityCostHelper } from "./getCityCostHelper";

export const findGameById = async (id: number): Promise<Game> => {
  const gameRepository = getRepository(Game);

  const game = await gameRepository
    .createQueryBuilder("game")
    .leftJoinAndSelect("game.map", "map")
    .leftJoinAndSelect("game.users", "user")
    .leftJoinAndSelect("game.moves", "move")
    .where("game.id = :id", { id })
    .getOne();

  game.regions = game.regions.map(Number);
  return game;
}

const buildContext = async (game: Game, user?: User, includeCityCostHelper: boolean = false): Promise<Context> => {
  const plantRepository = getRepository(Plant);

  const plantList = await plantRepository.find();
  const map = await fetchMap(game.map.name, game.regions);

  let cityCostHelper = {};

  if (includeCityCostHelper) {
    cityCostHelper = await getCityCostHelper(game.map.name, game.regions);
  }

  return {
    game,
    plantList,
    cityList: map.cities,
    cityCostHelper,
    user,
    rand: seedrandom(game.randomSeed),
  };
};

export const getGameState = async (game: Game): Promise<GameState> => {
  const context = await buildContext(game);
  return getStore(context).getState();
};

// TODO: transactional?
export const resolveMove = async (gameId: number, user: User, m: Partial<Move>) => {
  // authenticate
  await getCurrentUser(user);
  
  const game = await findGameById(gameId);
  const context = await buildContext(game, user, m.actionType === ActionType.BUY_CITIES);

  const move = new Move(m);
  move.game = game;

  const { isValid, message, state } = attemptMove(move, context);

  if (isValid) {
    // save move
    await getRepository(Move).save(move);
    // broadcast state
    await pubsub.publish(`STATE_UPDATED.${game.id}`, { gameStateUpdated: state });
    return state;
  } else {
    throw new Error("Validation error: " + message);
  }
}
