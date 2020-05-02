import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const citiesRaw = []; // TODO

// NOTE: you don't have to do China and Korea, do any maps you like other than USA/Germany
const connectionsChina = [] // TODO
const connectionsKorea = [] // TODO

export class seedMapsIan1588443634320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const mapNames = []; // TODO
        const maps: Map[] = mapNames.map((name) => {
          const map = new Map();
          map.name = name;
          return map;
        });
    
        await queryRunner.manager.save(maps);
        
        const cities: City[] = citiesRaw.map(c => {
          const city = new City();
    
          city.name = c.name;
          city.region = c.region;
          city.map = maps.find(m => m.name === c.map);
    
          return city;
        });
    
        await queryRunner.manager.save(cities);

        const connections: Connection[] = [
            ...connectionsChina.map(c => ({ ...c, map: maps.find(m => m.name === 'China') })), // TODO, if you did maps other than China and Korea
            ...connectionsKorea.map(c => ({ ...c, map: maps.find(m => m.name === 'Korea') }))
          ].map(c => {
            const connection = new Connection();
            connection.cost = c.cost;
            connection.map = c.map;
            connection.cities = c.cityNames.map(cityName => {
              return cities.find(city => city.name === cityName);
            });
      
            return connection;
          });
      
          await queryRunner.manager.save(connections);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
