import { Game } from "../../entity/Game";
import { Player } from "../../entity/Player";

export const savePlayer = (
  player: Player,
  game: Game
): void => {
  game.playerOrder = game.playerOrder.map((p) => p.id === player.id ? ({
    ...p,
    ...player
  }) : p);
}
