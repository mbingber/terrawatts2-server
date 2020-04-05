import { Resources } from "../../entity/Resources";
import { Player } from "../../entity/Player";
import { getRepository } from "typeorm";

export const setPlayer = async (
  playerId: number,
  resources: Resources,
  money: number
): Promise<Player> => {
  const playerRepository = getRepository(Player);

  const players = await playerRepository.findByIds([playerId]);
  if (!players || !players[0]) {
    return null;
  }

  const player = players[0];

  if (resources) {
    player.resources = resources;
  }

  if (money || money === 0) {
    player.money = money;
  }

  return playerRepository.save(player);
}