import { ThunkAction } from "redux-thunk";
import { GameState } from "./gameState";
import { AnyAction } from "redux";
import { Game } from "../../entity/Game";
import { Plant } from "../../entity/Plant";
import { City } from "../../entity/City";
import { User } from "../../entity/User";
import { Move } from "../../entity/Move";

export type Context = {
  game: Game;
  plantList: Plant[];
  cityList: City[];
  cityCostHelper: Record<string, Record<string, number>>;
  user?: User;
  rand: () => number;
}

export type Thunk = ThunkAction<void, GameState, Context, AnyAction>;

export type MoveThunk = (move: Move) => Thunk;
