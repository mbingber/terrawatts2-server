import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const MAP_NAME = 'Seattle';

const citiesRaw = [
    {
        name: 'Physics House',
        region: 1,
        lat: 47.67859,
        lng: -122.31594
    },
    {
        name: 'Green Lake',
        region: 1,
        lat: 47.67973,
        lng: -122.3257
    },
    {
        name: 'Ravenna',
        region: 1,
        lat: 47.67579,
        lng: -122.30652
    },
    {
        name: 'Sand Point',
        region: 1,
        lat: 47.67572, 
        lng: -122.26355
    },
    {
        name: 'Wedgwood',
        region: 1,
        lat: 47.69022,
        lng: -122.29073
    },
    {
        name: 'Lake City',
        region: 1,
        lat: 47.72033,
        lng: -122.2946
    },
    {
        name: 'Maple Leaf',
        region: 1,
        lat: 47.69587,
        lng: -133.3176
    },
    {
        name: 'Bitter Lake',
        region: 2,
        lat: 47.71957,
        lng: -122.34492
    },
    {
        name: 'Crown Hill',
        region: 2,
        lat: 47.69619,
        lng: -122.37296
    },
    {
        name: 'Greenwood',
        region: 2,
        lat: 47.69062,
        lng: -122.35529
    },
    {
        name: 'Loyal Heights',
        region: 2,
        lat: 47.68656,
        lng: -122.38773
    },
    {
        name: 'Phinney Ridge',
        region: 2,
        lat: 47.67603,
        lng: -122.35432
    },
    {
        name: 'Ballard',
        region: 2,
        lat: 47.66868,
        lng: -122.38476
    },
    {
        name: 'Fremont',
        region: 2,
        lat: 47.6514,
        lng: -122.35126
    },
    {
        name: 'Wallingford',
        region: 3,
        lat: 47.66137,
        lng: -122.33617
    },
    {
        name: 'U. District',
        region: 3,
        lat: 47.66092,
        lng: -122.31338
    },
    {
        name: 'Laurelhurst',
        region: 3,
        lat: 47.66504,
        lng: -122.27725
    },
    {
        name: 'Eastlake',
        region: 3,
        lat: 47.6431,
        lng: -122.32595
    },
    {
        name: 'Montlake',
        region: 3,
        lat: 47.63953,
        lng: -122.30204
    },
    {
        name: 'Madison Park',
        region: 3,
        lat: 47.63222,
        lng: -122.28299
    },
    {
        name: 'Capitol Hill',
        region: 3,
        lat: 47.6233,
        lng: -122.31258
    },
    {
        name: 'Magnolia',
        region: 4,
        lat: 47.65226,
        lng: -122.3929
    },
    {
        name: 'Queen Anne',
        region: 4,
        lat: 47.63717,
        lng: -122.35694
    },
    {
        name: 'South Lake Union',
        region: 4,
        lat: 47.62582,
        lng: -122.33843
    },
    {
        name: 'Seattle Center',
        region: 4,
        lat: 47.6225,
        lng: -122.35205
    },
    {
        name: 'Belltown',
        region: 4,
        lat: 47.61404,
        lng: -122.34566
    },
    {
        name: 'Downtown',
        region: 4,
        lat: 47.61118,
        lng: -122.33764
    },
    {
        name: 'First Hill',
        region: 4,
        lat: 47.61108,
        lng: -122.32086
    },
    {
        name: 'Madrona',
        region: 5,
        lat: 47.61281,
        lng: -122.28921
    },
    {
        name: 'Central District',
        region: 5,
        lat: 47.60798,
        lng: -122.30274
    },
    {
        name: 'Mount Baker',
        region: 5,
        lat: 47.57807,
        lng: -122.29795
    },
    {
        name: 'Columbia City',
        region: 5,
        lat: 47.55865,
        lng: -122.28541
    },
    {
        name: 'Seward Park',
        region: 5,
        lat: 47.55104,
        lng: -122.26599
    },
    {
        name: 'Rainier Beach',
        region: 5,
        lat: 47.53713,
        lng: -122.28111
    },
    {
        name: 'Beacon Hill',
        region: 5,
        lat: 47.55107,
        lng: -122.30202
    },
    {
        name: 'Pioneer Square',
        region: 6,
        lat: 47.60172,
        lng: -122.332
    },
    {
        name: 'I. District',
        region: 6,
        lat: 47.59836,
        lng: -122.32633
    },
    {
        name: 'SoDo',
        region: 6,
        lat: 47.57987,
        lng: -122.3342
    },
    {
        name: 'Georgetown',
        region: 6,
        lat: 47.54763,
        lng: -122.32127
    },
    {
        name: 'Alki',
        region: 6,
        lat: 47.57998,
        lng: -122.40797
    },
    {
        name: 'West Seattle',
        region: 6,
        lat: 47.56298,
        lng: -122.38682
    },
    {
        name: 'Delridge',
        region: 6,
        lat: 47.53828,
        lng: -122.36109
    }
];

const connectionsRaw = [
    { cityNames: ['Bitter Lake', 'Lake City'], cost: 13 },
    { cityNames: ['Bitter Lake', 'Maple Leaf'], cost: 13 },
    { cityNames: ['Bitter Lake', 'Greenwood'], cost: 10 },
    { cityNames: ['Bitter Lake', 'Crown Hill'], cost: 12 },
    { cityNames: ['Crown Hill', 'Greenwood'], cost: 6 },
    { cityNames: ['Crown Hill', 'Loyal Heights'], cost: 4 },
    { cityNames: ['Loyal Heights', 'Greenwood'], cost: 8 },
    { cityNames: ['Loyal Heights', 'Ballard'], cost: 3 },
    { cityNames: ['Loyal Heights', 'Phinney Ridge'], cost: 12 },
    { cityNames: ['Greenwood', 'Maple Leaf'], cost: 10 },
    { cityNames: ['Greenwood', 'Green Lake'], cost: 8 },
    { cityNames: ['Greenwood', 'Phinney Ridge'], cost: 7 },
    { cityNames: ['Phinney Ridge', 'Ballard'], cost: 14 },
    { cityNames: ['Phinney Ridge', 'Fremont'], cost: 8 },
    { cityNames: ['Phinney Ridge', 'Wallingford'], cost: 11 },
    { cityNames: ['Ballard', 'Magnolia'], cost: 6 },
    { cityNames: ['Ballard', 'Fremont'], cost: 10 },
    { cityNames: ['Fremont', 'Wallingford'], cost: 4 },
    { cityNames: ['Fremont', 'Queen Anne'], cost: 10 },
    { cityNames: ['Fremont', 'South Lake Union'], cost: 16 },
    { cityNames: ['Lake City', 'Maple Leaf'], cost: 11 },
    { cityNames: ['Lake City', 'Wedgwood'], cost: 11 },
    { cityNames: ['Lake City', 'Sand Point'], cost: 15 },
    { cityNames: ['Maple Leaf', 'Wedgwood'], cost: 8 },
    { cityNames: ['Maple Leaf', 'Physics House'], cost: 6 },
    { cityNames: ['Wedgwood', 'Physics House'], cost: 8 },
    { cityNames: ['Wedgwood', 'Ravenna'], cost: 7 },
    { cityNames: ['Wedgwood', 'Sand Point'], cost: 9 },
    { cityNames: ['Sand Point', 'Ravenna'], cost: 13 },
    { cityNames: ['Sand Point', 'Laurelhurst'], cost: 7 },
    { cityNames: ['Ravenna', 'Laurelhurst'], cost: 11 },
    { cityNames: ['Ravenna', 'Physics House'], cost: 3 },
    { cityNames: ['Ravenna', 'U. District'], cost: 6 },
    { cityNames: ['Physics House', 'U. District'], cost: 6 },
    { cityNames: ['Physics House', 'Green Lake'], cost: 3 },
    { cityNames: ['Green Lake', 'Wallingford'], cost: 8 },
    { cityNames: ['Wallingford', 'U. District'], cost: 7 },
    { cityNames: ['U. District', 'Laurelhurst'], cost: 12 },
    { cityNames: ['U. District', 'Eastlake'], cost: 10 },
    { cityNames: ['U. District', 'Montlake'], cost: 12 },
    { cityNames: ['Laurelhurst', 'Montlake'], cost: 16 },
    { cityNames: ['Eastlake', 'South Lake Union'], cost: 5 },
    { cityNames: ['Eastlake', 'Montlake'], cost: 5 },
    { cityNames: ['Eastlake', 'Capitol Hill'], cost: 7 },
    { cityNames: ['Montlake', 'Madison Park'], cost: 10 },
    { cityNames: ['Montlake', 'Capitol Hill'], cost: 7 },
    { cityNames: ['Madison Park', 'Capitol Hill'], cost: 10 },
    { cityNames: ['Madison Park', 'Madrona'], cost: 8 },
    { cityNames: ['Capitol Hill', 'South Lake Union'], cost: 7 },
    { cityNames: ['Capitol Hill', 'Downtown'], cost: 5 },
    { cityNames: ['Capitol Hill', 'First Hill'], cost: 3 },
    { cityNames: ['Capitol Hill', 'Central District'], cost: 4 },
    { cityNames: ['Capitol Hill', 'Madrona'], cost: 7 },
    { cityNames: ['Magnolia', 'Queen Anne'], cost: 15 },
    { cityNames: ['Magnolia', 'Seattle Center'], cost: 17 },
    { cityNames: ['Queen Anne', 'Seattle Center'], cost: 6 },
    { cityNames: ['Seattle Center', 'Belltown'], cost: 2 },
    { cityNames: ['Seattle Center', 'South Lake Union'], cost: 3 },
    { cityNames: ['South Lake Union', 'Downtown'], cost: 4 },
    { cityNames: ['Belltown', 'Downtown'], cost: 0 },
    { cityNames: ['Downtown', 'First Hill'], cost: 4 },
    { cityNames: ['Downtown', 'Pioneer Square'], cost: 2 },
    { cityNames: ['First Hill', 'Pioneer Square'], cost: 4 },
    { cityNames: ['First Hill', 'Central District'], cost: 3 },
    { cityNames: ['Madrona', 'Central District'], cost: 4 },
    { cityNames: ['Madrona', 'Mount Baker'], cost: 10 },
    { cityNames: ['Central District', 'Mount Baker'], cost: 7 },
    { cityNames: ['Central District', 'I. District'], cost: 6 },
    { cityNames: ['Mount Baker', 'I. District'], cost: 12 },
    { cityNames: ['Mount Baker', 'SoDo'], cost: 12 },
    { cityNames: ['Mount Baker', 'Columbia City'], cost: 8 },
    { cityNames: ['Mount Baker', 'Beacon Hill'], cost: 9 },
    { cityNames: ['Columbia City', 'Seward Park'], cost: 6 },
    { cityNames: ['Columbia City', 'Rainier Beach'], cost: 5 },
    { cityNames: ['Columbia City', 'Beacon Hill'], cost: 5 },
    { cityNames: ['Seward Park', 'Rainier Beach'], cost: 6 },
    { cityNames: ['Rainier Beach', 'Beacon Hill'], cost: 7 },
    { cityNames: ['Beacon Hill', 'Georgetown'], cost: 6 },
    { cityNames: ['Pioneer Square', 'I. District'], cost: 0 },
    { cityNames: ['I. District', 'SoDo'], cost: 4 },
    { cityNames: ['SoDo', 'Alki'], cost: 20 },
    { cityNames: ['SoDo', 'West Seattle'], cost: 18 },
    { cityNames: ['SoDo', 'Georgetown'], cost: 8 },
    { cityNames: ['Georgetown', 'Delridge'], cost: 15 },
    { cityNames: ['Delridge', 'West Seattle'], cost: 5 },
    { cityNames: ['West Seattle', 'Alki'], cost: 5 }    
];

export class seedSeattleMap1589666552225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const mapNames = ['Seattle'];
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