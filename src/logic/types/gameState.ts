import { Color } from '../../entity/User';

export enum Phase {
  PLANT = 'PLANT',
  RESOURCE = 'RESOURCE',
  CITY = 'CITY',
  POWER = 'POWER'
}

export enum ActionType {
  PUT_UP_PLANT = 'PUT_UP_PLANT',
  DISCARD_PLANT = 'DISCARD_PLANT',
  BID_ON_PLANT = 'BID_ON_PLANT',
  BUY_RESOURCES = 'BUY_RESOURCES',
  BUY_CITIES = 'BUY_CITIES',
  POWER_UP = 'POWER_UP'
}

export enum PlantStatus {
  REMOVED_BEFORE_START = 'REMOVED_BEFORE_START',
  DECK = 'DECK',
  MARKET = 'MARKET',
  DISCARDED = 'DISCARDED',
  ERA_THREE = 'ERA_THREE',
  OWNED = 'OWNED'
}

export type ResourceType = 'coal' | 'oil' | 'trash' | 'uranium';

export type Resources = Record<ResourceType, number>;

export type Player = {
  username: string;
  color: Color;
  money: number;
  resources: Resources;
  clockwiseOrder: number;
}

export type PlantInfo = {
  status: PlantStatus;
  owner: string | null;
}

export type Auction = {
  plantId: string;
  bid: number;
  leader: string;
  active: string;
  passed: string[];
}

export type Info = {
  turn: number;
  era: number;
  phase: Phase;
  actionType: ActionType;
  activeUser: string;
  
}

export type PlantPhaseEvent = {
  plantId?: string;
  cost?: number;
  username: string;
}
