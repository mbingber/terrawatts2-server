import { MigrationInterface, QueryRunner } from 'typeorm';
import { User, Color } from '../entity/User';

const usersRaw = [{
  username: 'ingber',
  preferredColor: Color.BLUE
}, {
  username: 'jon',
  preferredColor: Color.YELLOW
}, {
  username: 'ian',
  preferredColor: Color.GREEN
}, {
  username: 'wags',
  preferredColor: Color.PURPLE
}, {
  username: 'washington',
  preferredColor: Color.BLACK
}, {
  username: 'a long name that will need to be truncated',
  preferredColor: Color.RED
}]

export class seedUsers1576446759682 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const users = usersRaw.map(u => {
      const user = new User();

      user.username = u.username;
      user.preferredColor = u.preferredColor;

      return user;
    });

    return queryRunner.manager.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
