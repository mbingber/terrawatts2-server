import { getRepository } from "typeorm";
import { Game } from "../entity/Game";

export const findGameById = async (id: number): Promise<Game> => {
  const gameRepository = getRepository(Game);
      
  return gameRepository
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.map', 'map')
    .leftJoinAndSelect('game.playerOrder', 'player')
    .leftJoinAndSelect('game.activePlayer', 'activePlayer')
    .leftJoinAndSelect('game.plants', 'plantInstance')
    .leftJoinAndSelect('game.cities', 'cityInstance')
    .leftJoinAndSelect('game.plantPhaseEvents', 'plantPhaseEvent')
    .leftJoinAndSelect('game.auction', 'auction')
    .leftJoinAndSelect('player.user', 'user')
    .leftJoinAndSelect('player.plants', 'playerPlantInstance')
    .leftJoinAndSelect('playerPlantInstance.plant', 'playerPlantInstancePlant')
    .leftJoinAndSelect('plantInstance.plant', 'plant')
    .leftJoinAndSelect('plantInstance.player', 'plantInstancePlayer')
    .leftJoinAndSelect('cityInstance.city', 'city')
    .leftJoinAndSelect('cityInstance.players', 'cityInstancePlayer')
    .leftJoinAndSelect('plantPhaseEvent.player', 'plantPhaseEventPlayer')
    .leftJoinAndSelect('plantPhaseEvent.plant', 'plantPhaseEventPlantInstance')
    .leftJoinAndSelect('plantPhaseEventPlantInstance.plant', 'plantPhaseEventPlantInstancePlant')
    .leftJoinAndSelect('auction.plant', 'auctionPlantInstance')
    .leftJoinAndSelect('auctionPlantInstance.plant', 'auctionPlant')
    .leftJoinAndSelect('auction.leadingPlayer', 'auctionLeaderPlayer')
    .leftJoinAndSelect('auction.activePlayer', 'auctionActivePlayer')
    .leftJoinAndSelect('auction.passedPlayers', 'auctionPassedPlayer')
    .where('game.id = :id', { id })
    .orderBy("player.turnOrder")
    .getOne()
}
