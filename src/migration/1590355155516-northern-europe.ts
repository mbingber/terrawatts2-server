import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const MAP_NAME = 'Northern Europe';

const citiesRaw = [
    {
        name: 'Nykobing Falster',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Kobenhavn',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Odense',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Esbjerg',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Aarhus',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Aalborg',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Ringkobing',
	country: 'Denmark',
        region: 1
    },
    {
        name: 'Arendal',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Stavenger',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Bergen',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Oslo',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Trondheim',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Bodo',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Tromso',
	country: 'Norway',
        region: 2
    },
    {
        name: 'Karlstad',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Karlstad',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Goteborg',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Jonkoping',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Malmo',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Kristianstad',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Linkoping',
	country: 'Sweden',
        region: 3
    },
    {
        name: 'Orebro',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Stockholm',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Uppsala',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Vasteras',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Sundsvall',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Ostersund',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Lulea',
	country: 'Sweden',
        region: 4
    },
    {
        name: 'Oulu',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Kuopio',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Tampere',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Pori',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Turku',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Espoo',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Helsinki',
	country: 'Finland',
        region: 5
    },
    {
        name: 'Tallinn',
	country: 'Estonia',
        region: 6
    },
    {
        name: 'Tartu',
	country: 'Estonia',
        region: 6
    },
    {
        name: 'Riga',
	country: 'Latvia',
        region: 6
    },
    {
        name: 'Daugavpils',
	country: 'Latvia',
        region: 6
    },
    {
        name: 'Vilnius',
	country: 'Lithuania',
        region: 6
    },
    {
        name: 'Kaunas',
	country: 'Lithuania',
        region: 6
    },
    {
        name: 'Klaipeda',
	country: 'Lithuania',
        region: 6
    }
];

const connectionsRaw = [
    { cityNames: ['Nykobing Falster', 'Kobenhavn'], cost: 6 },
    { cityNames: ['Nykobing Falster', 'Odense'], cost: 8 },
    { cityNames: ['Kobenhavn', 'Malmo'], cost: 3 },
    { cityNames: ['Kobenhavn', 'Jonkoping'], cost: 10 },
    { cityNames: ['Kobenhavn', 'Goteborg'], cost: 18 },
    { cityNames: ['Kobenhavn', 'Aarhus'], cost: 10 },
    { cityNames: ['Kobenhavn', 'Odense'], cost: 7 },
    { cityNames: ['Odense', 'Aarhus'], cost: 7 },
    { cityNames: ['Odense', 'Esbjerg'], cost: 5 },
    { cityNames: ['Esbjerg', 'Aarhus'], cost: 5 },
    { cityNames: ['Esbjerg', 'Ringkobing'], cost: 4 },
    { cityNames: ['Aarhus', 'Aalborg'], cost: 7 },
    { cityNames: ['Aalborg', 'Goteborg'], cost: 11 },
    { cityNames: ['Aalborg', 'Arendal'], cost: 16 },
    { cityNames: ['Aalborg', 'Ringkobing'], cost: 5 },
    { cityNames: ['Ringkobing', 'Arendal'], cost: 19 },
    { cityNames: ['Arendal', 'Goteborg'], cost: 19 },
    { cityNames: ['Arendal', 'Oslo'], cost: 7 },
    { cityNames: ['Arendal', 'Stavenger'], cost: 8 },
    { cityNames: ['Stavenger', 'Oslo'], cost: 11 },
    { cityNames: ['Stavenger', 'Bergen'], cost: 9 },
    { cityNames: ['Bergen', 'Oslo'], cost: 15 },
    { cityNames: ['Bergen', 'Trondheim'], cost: 17 },
    { cityNames: ['Oslo', 'Goteborg'], cost: 11 },
    { cityNames: ['Oslo', 'Karlstad'], cost: 7 },
    { cityNames: ['Oslo', 'Ostersund'], cost: 18 },
    { cityNames: ['Oslo', 'Trondheim'], cost: 17 },
    { cityNames: ['Trondheim', 'Ostersund'], cost: 9 },
    { cityNames: ['Trondheim', 'Bodo'], cost: 21 },
    { cityNames: ['Bodo', 'Ostersund'], cost: 18 },
    { cityNames: ['Bodo', 'Lulea'], cost: 16 },
    { cityNames: ['Bodo', 'Tromso'], cost: 17 },
    { cityNames: ['Tromso', 'Lulea'], cost: 19 },
    { cityNames: ['Tromso', 'Oulu'], cost: 25 },
    { cityNames: ['Lulea', 'Oulu'], cost: 13 },
    { cityNames: ['Lulea', 'Pori'], cost: 22 },
    { cityNames: ['Lulea', 'Sundsvall'], cost: 16 },
    { cityNames: ['Lulea', 'Ostersund'], cost: 17 },
    { cityNames: ['Ostersund', 'Sundsvall'], cost: 7 },
    { cityNames: ['Ostersund', 'Karlstad'], cost: 16 },
    { cityNames: ['Sundsvall', 'Pori'], cost: 17 },
    { cityNames: ['Sundsvall', 'Vasteras'], cost: 10 },
    { cityNames: ['Sundsvall', 'Uppsala'], cost: 11 },
    { cityNames: ['Vasteras', 'Uppsala'], cost: 2 },
    { cityNames: ['Vasteras', 'Stockholm'], cost: 4 },
    { cityNames: ['Vasteras', 'Orebro'], cost: 5 },
    { cityNames: ['Uppsala', 'Pori'], cost: 17 },
    { cityNames: ['Uppsala', 'Turku'], cost: 15 },
    { cityNames: ['Uppsala', 'Stockholm'], cost: 2 },
    { cityNames: ['Stockholm', 'Orebro'], cost: 7 },
    { cityNames: ['Stockholm', 'Lingkoping'], cost: 7 },
    { cityNames: ['Stockholm', 'Visby'], cost: 12 },
    { cityNames: ['Orebro', 'Lingkoping'], cost: 3 },
    { cityNames: ['Orebro', 'Karlstad'], cost: 4 },
    { cityNames: ['Karlstad', 'Lingkoping'], cost: 7 },
    { cityNames: ['Karlstad', 'Goteborg'], cost: 9 },
    { cityNames: ['Karlstad', 'Jonkoping'], cost: 9 },
    { cityNames: ['Goteborg', 'Jonkoping'], cost: 4 },
    { cityNames: ['Lingkoping', 'Jonkoping'], cost: 5 },
    { cityNames: ['Lingkoping', 'Kristianstad'], cost: 9 },
    { cityNames: ['Lingkoping', 'Visby'], cost: 9 },
    { cityNames: ['Jonkoping', 'Kristianstad'], cost: 8 },
    { cityNames: ['Jonkoping', 'Malmo'], cost: 10 },
    { cityNames: ['Malmo', 'Kristianstad'], cost: 3 },
    { cityNames: ['Kristianstad', 'Visby'], cost: 13 },
    { cityNames: ['Visby', 'Klaipeda'], cost: 19 },
    { cityNames: ['Visby', 'Riga'], cost: 20 },
    { cityNames: ['Klaipeda', 'Riga'], cost: 8 },
    { cityNames: ['Klaipeda', 'Kaunas'], cost: 7 },
    { cityNames: ['Kaunas', 'Riga'], cost: 8 },
    { cityNames: ['Kaunas', 'Vilnius'], cost: 3 },
    { cityNames: ['Kaunas', 'Daugavpils'], cost: 7 },
    { cityNames: ['Daugavpils', 'Tartu'], cost: 9 },
    { cityNames: ['Vilnius', 'Daugavpils'], cost: 5 },
    { cityNames: ['Riga', 'Daugavpils'], cost: 7 },
    { cityNames: ['Riga', 'Tartu'], cost: 7 },
    { cityNames: ['Riga', 'Tallinn'], cost: 11 },
    { cityNames: ['Tartu', 'Tallinn'], cost: 5 },
    { cityNames: ['Tallinn', 'Helsinki'], cost: 7 },
    { cityNames: ['Tallinn', 'Espod'], cost: 7 },
    { cityNames: ['Espod', 'Helsinki'], cost: 2 },
    { cityNames: ['Espod', 'Tampere'], cost: 5 },
    { cityNames: ['Espod', 'Turku'], cost: 4 },
    { cityNames: ['Helsinki', 'Tampere'], cost: 6 },
    { cityNames: ['Turku', 'Tampere'], cost: 5 },
    { cityNames: ['Turku', 'Pori'], cost: 3 },
    { cityNames: ['Pori', 'Tampere'], cost: 4 },
    { cityNames: ['Pori', 'Oulu'], cost: 15 },
    { cityNames: ['Tempere', 'Oulu'], cost: 14 },
    { cityNames: ['Tempere', 'Kuopio'], cost: 10 },
    { cityNames: ['Oulu', 'Kuopio'], cost: 10 }
];

export class seedNorthernEuropeMap1590355155516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const mapNames = ['Northern Europe'];
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