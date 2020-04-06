import { getRepository } from "typeorm";
import { Game } from "../entity/Game";
import { redis } from "../redis";
import { CityInstance } from "../entity/CityInstance";
import { PlantInstance, PlantStatus } from "../entity/PlantInstance";
import { PlantPhaseEvent } from "../entity/PlantPhaseEvent";
import { Auction } from "../entity/Auction";
import { Player } from "../entity/Player";
import { performance } from "perf_hooks";

export const findGameById = async (id: number): Promise<Game> => {
  const start = performance.now();
  const gameRepository = getRepository(Game);
  const cityInstanceRepository = getRepository(CityInstance);
  const plantInstanceRepository = getRepository(PlantInstance);
  const plantPhaseEventRepository = getRepository(PlantPhaseEvent);

  // const storedGameJSON = await redis.get(id);
  // if (storedGameJSON) {
  //   try {
  //     const game = JSON.parse(storedGameJSON);
  //     if (game && game.id) {
  //       return game;
  //     }
  //   } catch {}
  // }

      
  const game = await gameRepository
    .createQueryBuilder("game")
    .leftJoinAndSelect("game.map", "map")
    .leftJoinAndSelect("game.playerOrder", "player")
    .leftJoinAndSelect("game.auction", "auction")
    .leftJoinAndSelect("player.user", "user")
    .where("game.id = :id", { id })
    .orderBy("player.turnOrder")
    .getOne();

  const mainQueryEnd = performance.now();

  game.cities = await cityInstanceRepository
    .find({
      where: { game },
      relations: ['city', 'players']
    });

  game.plants = await plantInstanceRepository
    .find({
      where: { game },
      relations: ['plant', 'player']
    });

  game.plantPhaseEvents = await plantPhaseEventRepository
    .find({
      where: { game, turn: game.turn },
      relations: ['player']
    });

  const ownedPlants = game.plants.filter((plant) => plant.status === PlantStatus.OWNED);

  game.playerOrder = game.playerOrder.map((player) => {
    return {
      ...player,
      plants: ownedPlants.filter((plant) => plant.player.id === player.id)
    }
  });

  game.activePlayer = game.playerOrder.find((player) => player.id === game.activePlayerId);

  game.plantPhaseEvents = game.plantPhaseEvents.map((event) => ({
    ...event,
    plant: event.plantInstanceId && game.plants.find((p) => p.id === event.plantInstanceId)
  }));

  if (game.auction) {
    game.auction.plant = game.plants.find((p) => p.id === game.auction.plantInstanceId);
    game.auction.activePlayer = game.playerOrder.find((p) => p.id === game.auction.activePlayerId);
    game.auction.leadingPlayer = game.playerOrder.find((p) => p.id === game.auction.leadingPlayerId);
    game.auction.passedPlayers = game.playerOrder.filter((p) => game.auction.passedPlayerIds.includes(p.id));
  }

  const endOfQuery = performance.now();
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("MAIN QUERY TIME", mainQueryEnd - start);
  console.log("WHOLE QUERY TIME", endOfQuery - start);

  return game;
}

