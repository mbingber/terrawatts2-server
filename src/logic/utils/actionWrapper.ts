import { getCurrentUser } from "../../auth/getCurrentUser"
import { findGameById } from "../../queries/findGameById";
import { ActionType, Phase, Game } from "../../entity/Game";
import { putUpPlant } from "../putUpPlant/putUpPlant";
import { bidOnPlant } from "../bidOnPlant/bidOnPlant";
import { discardPlant } from "../discardPlant/discardPlant";
import { buyResources } from "../buyResources/buyResources";
import { powerUp } from "../powerUp/powerUp";
import { buyCities } from "../buyCities/buyCities";
import { Player } from "../../entity/Player";
import { saveGame } from "./saveGame";

const actionToPhase: Record<ActionType, Phase> = {
  PUT_UP_PLANT: Phase.PLANT,
  BID_ON_PLANT: Phase.PLANT,
  DISCARD_PLANT: Phase.PLANT,
  BUY_RESOURCES: Phase.RESOURCE,
  BUY_CITIES: Phase.CITY,
  POWER_UP: Phase.POWER
};

const actionToFunction: Record<ActionType, (game: Game, me: Player, args: any) => Promise<Game>> = {
  PUT_UP_PLANT: putUpPlant,
  BID_ON_PLANT: bidOnPlant,
  DISCARD_PLANT: discardPlant,
  BUY_RESOURCES: buyResources,
  BUY_CITIES: buyCities,
  POWER_UP: powerUp
};

export const actionWrapper = (actionType: ActionType) => async (_, args, context) => {
  // authenticate
  const meUser = await getCurrentUser(context.user);
  // fetch game
  const game = await findGameById(+args.gameId);
  // game exists
  if (!game) {
    throw new Error("ERROR: game not found");
  }
  // user is playing this game
  const me = game.playerOrder.find((player) => player.user.id === meUser.id);
  if (!me) {
    throw new Error("ERROR: wrong game");
  }
  // my turn
  const activePlayer = game.actionType === ActionType.BID_ON_PLANT && game.auction ?
      game.auction.activePlayer :
      game.activePlayer;
  if (activePlayer.id !== me.id) {
    throw new Error("ERROR: not your turn");
  }
  // correct action type
  if (game.actionType !== actionType) {
    throw new Error("ERROR: incorrect actionType");
  }
  // correct phase
  if (actionToPhase[actionType] !== game.phase) {
    throw new Error("ERROR: incorrect phase");
  }

  // call action
  const updatedGame = await actionToFunction[actionType](game, me, args);
  // save game
  return saveGame(updatedGame);
}
