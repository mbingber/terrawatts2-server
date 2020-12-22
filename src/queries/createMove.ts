import { ActionType, Resources, Move } from "../entity/Move";

interface MoveArgsBase {
  actionType: ActionType;
}

interface PutUpPlantArgs extends MoveArgsBase {
  actionType: ActionType.PUT_UP_PLANT;
  plantId?: string;
  bid: number;
}

interface BidOnPlantArgs extends MoveArgsBase {
  actionType: ActionType.BID_ON_PLANT;
  bid?: number;
}

interface DiscardPlantArgs extends MoveArgsBase {
  actionType: ActionType.DISCARD_PLANT;
  plantId: string;
  hybridChoice?: { coal: number; oil: number };
}

interface BuyResourcesArgs extends MoveArgsBase {
  actionType: ActionType.BUY_RESOURCES;
  resources: Resources;
  cost: number;
}

interface BuyCitiesArgs extends MoveArgsBase {
  actionType: ActionType.BUY_CITIES;
  cityIds: string[];
  cost: number;
}

interface PowerUpArgs extends MoveArgsBase {
  actionType: ActionType.POWER_UP;
  plantIds: string[];
  hybridChoice?: { coal: number; oil: number };
}

export type MoveArgs = PutUpPlantArgs | BidOnPlantArgs | DiscardPlantArgs | BuyResourcesArgs | BuyCitiesArgs | PowerUpArgs;

export const createMove = (args: MoveArgs): Move => {
  const move = new Move();
  Object.keys(args).forEach(arg => move[arg] = args[arg]);
  return move;
};
