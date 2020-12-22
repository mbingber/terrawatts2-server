import { GameState } from "../types/gameState";
import { createSelector } from "reselect";
import { Plant } from "../../entity/Plant";
import { City } from "../../entity/City";
import { Game } from "../../entity/Game";

export const selectPlantsOffProps = (_: GameState, props: { plantList: Plant[] }) => props.plantList;
export const selectCityList = (_: GameState, props: { cityList: City[] }) => props.cityList;

export const selectHybridChoice = (_: GameState, props: { hybridChoice?: { coal: number; oil: number } }) => props.hybridChoice;

export const selectPlantIdsFromProps = (_: GameState, props: { plantIds: string[] }) => props.plantIds;

export const selectPlantMap = createSelector(
  selectPlantsOffProps,
  (plants) => plants.reduce<Record<string, Plant>>((acc, plant) => {
    acc[plant.id] = plant;
    return acc;
  }, {})
);

export const selectCityDataMap = createSelector(
  selectCityList,
  (cities) => cities.reduce<Record<string, City>>((acc, city) => {
    acc[city.id] = city;
    return acc;
  }, {})
);

export const selectMapName = (_: GameState, props: { game: Game }) => props.game.map.name;
