import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const MAP_NAME = 'Seattle';

const citiesRaw = [
    {
        name: 'Physics house',
        region: 1,
        lat: 420,
        lng: 420
    },
    {
        name: '',
        region: 1,
        lat: 420,
        lng: 420
    },
];

const connectionsRaw = [
    { cityNames: ['Place1', 'Place2'], cost: 420 },
    { cityNames: ['Place1', 'Place2'], cost: 420 },
];

export class seedSeattleMap1589666552224 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const map = new Map();
        map.name = MAP_NAME;

        await queryRunner.manager.save(map);

        const cities: City[] = citiesRaw.map(c => {
            const city = new City();

            city.name = c.name;
            city.region = c.region;
            city.lat = c.lat;
            city.lng = c.lng;
            city.map = map;

            return city;
        });

        await queryRunner.manager.save(cities);

        const connections: Connection[] = connectionsRaw.map(c => {
            const connection = new Connection();
            connection.cost = c.cost;
            connection.map = map;
            connection.cities = c.cityNames.map(cityName => {
              const city = cities.find(city => city.name === cityName);
              if (!city) {
                console.log("CITY NOT FOUND:", cityName);
              }
              return city;
            });
      
            return connection;
        });

        await queryRunner.manager.save(connections);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
