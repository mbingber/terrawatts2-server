import { getRepository } from 'typeorm';
import { Player } from '../../entity/Player';
import { User, Color } from '../../entity/User';
import * as shuffle from 'lodash.shuffle';

export const createPlayers = async (
  usernames: string[]
): Promise<Player[]> => {
  const userRepository = getRepository(User);
  const playerRepository = getRepository(Player);

  if (usernames.length < 2 || usernames.length > 6) {
    throw new Error('ERROR: invalid number of players');
  }

  const users: User[] = await userRepository.find({
    where: usernames.map(u => ({ username: u }))
  });

  if (users.length !== usernames.length) {
    throw new Error('ERROR: could not find all users');
  }

  const colorHash: Record<Color, boolean> = {
    [Color.BLACK]: true,
    [Color.RED]: true,
    [Color.GREEN]: true,
    [Color.YELLOW]: true,
    [Color.PURPLE]: true,
    [Color.BLUE]: true
  };

  // shuffle here for clockwise order
  const players: Player[] = shuffle(users)
    .map((user: User, idx: number): Player => {
      const player = new Player();

      if (user.preferredColor && colorHash[user.preferredColor]) {
        player.color = user.preferredColor;
      } else {
        player.color = Object.keys(colorHash).find(c => colorHash[c]) as Color;
      }
      colorHash[player.color] = false;

      player.clockwiseOrder = idx;
      player.user = user;
      player.money = 50;
      player.resources = {
        coal: 0,
        oil: 0,
        trash: 0,
        uranium: 0
      };

      return player;
    });

  await playerRepository.save(players);

  // shuffle here for initial turn order
  return shuffle(players);
}
