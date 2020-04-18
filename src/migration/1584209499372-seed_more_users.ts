import { MigrationInterface, QueryRunner } from 'typeorm';
import { User, Color } from '../entity/User';

const usersRaw = [{
  username: 'washington',
  preferredColor: Color.BLACK
}, {
  username: 'adams',
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
