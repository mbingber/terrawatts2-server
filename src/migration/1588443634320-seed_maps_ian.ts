import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const citiesRaw = [
  {
    name: 'Torino',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Genova',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Milano',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Piacenza',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Bergamo',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Brescia',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Verona',
    region: 1,
    map: 'Italy'
  },
  {
    name: 'Bolzano',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Vicenza',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Padova',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Mestre',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Venezia',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Udine',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'Trieste',
    region: 2,
    map: 'Italy'
  },
  {
    name: 'La Spezia',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Pisa',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Parma',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Reggio Emilia',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Modena',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Bologna',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Ferrara',
    region: 3,
    map: 'Italy'
  },
  {
    name: 'Livorno',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Firenze',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'San Marino',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Perugia',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Ravenna',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Rimini',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Ancona',
    region: 4,
    map: 'Italy'
  },
  {
    name: 'Roma',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Pescara',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Napoli',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Salerno',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Foggia',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Bari',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Brindisi',
    region: 5,
    map: 'Italy'
  },
  {
    name: 'Taranto',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Cosenza',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Reggio Calabria',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Messina',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Palermo',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Catania',
    region: 6,
    map: 'Italy'
  },
  {
    name: 'Siracusa',
    region: 6,
    map: 'Italy'
  },
];

const connectionsItaly = [
  { cityNames: ['Torino', 'Genova'], cost:  12 },
  { cityNames: ['Torino', 'Milano'], cost:  8 },
  { cityNames: ['Genova', 'Milano'], cost:  9 },
  { cityNames: ['Genova', 'Piacenza'], cost:  7 },
  { cityNames: ['Genova', 'Parma'], cost:  11 },
  { cityNames: ['Genova', 'La Spezia'], cost:  5 },
  { cityNames: ['Milano', 'Piacenza'], cost:  4 },
  { cityNames: ['Milano', 'Bergamo'], cost:  3 },
  { cityNames: ['Milano', 'Brescia'], cost:  4 },
  { cityNames: ['Piacenza', 'Brescia'], cost:  5 },
  { cityNames: ['Piacenza', 'Parma'], cost:  4 },
  { cityNames: ['Bergamo', 'Brescia'], cost:  3 },
  { cityNames: ['Bergamo', 'Bolanzo'], cost:  12 },
  { cityNames: ['Brescia', 'Bolanzo'], cost:  12 },
  { cityNames: ['Brescia', 'Parma'], cost:  6 },
  { cityNames: ['Brescia', 'Verona'], cost:  4 },
  { cityNames: ['Verona', 'Vicenza'], cost:  3 },
  { cityNames: ['Verona', 'Padua'], cost:  5 },
  { cityNames: ['Verona', 'Ferrara'], cost:  7 },
  { cityNames: ['Verona', 'Modena'], cost:  8 },
  { cityNames: ['Verona', 'Parma'], cost:  6 },
  { cityNames: ['Bolanzo', 'Vicenza'], cost:  10 },
  { cityNames: ['Bolanzo', 'Mestre'], cost:  12 },
  { cityNames: ['Bolanzo', 'Udine'], cost:  14 },
  { cityNames: ['Vicenza', 'Padua'], cost:  3 },
  { cityNames: ['Padua', 'Mestre'], cost:  3 },
  { cityNames: ['Padua', 'Ferrara'], cost:  7 },
  { cityNames: ['Mestre', 'Venezia'], cost:  0 },
  { cityNames: ['Venezia', 'Udine'], cost:  7 },
  { cityNames: ['Venezia', 'Ravenna'], cost:  12 },
  { cityNames: ['Venezia', 'Ferrara'], cost:  9 },
  { cityNames: ['Udine', 'Trieste'], cost:  4 },
  { cityNames: ['La Spezia', 'Parma'], cost:  9 },
  { cityNames: ['La Spezia', 'Reggio Emilia'], cost:  9 },
  { cityNames: ['La Spezia', 'Pisa'], cost:  5 },
  { cityNames: ['Pisa', 'Reggio Emilia'], cost:  10 },
  { cityNames: ['Pisa', 'Bologna'], cost:  12 },
  { cityNames: ['Pisa', 'Firenze'], cost:  5 },
  { cityNames: ['Pisa', 'Livorno'], cost:  0 },
  { cityNames: ['Parma', 'Reggio Emilia'], cost:  2 },
  { cityNames: ['Reggio Emilia', 'Modena'], cost:  2 },
  { cityNames: ['Modena', 'Bologna'], cost:  3 },
  { cityNames: ['Modena', 'Ferrara'], cost:  4 },
  { cityNames: ['Bologna', 'Ferrara'], cost:  3 },
  { cityNames: ['Bologna', 'Firenze'], cost:  8 },
  { cityNames: ['Bologna', 'Ravenna'], cost:  4 },
  { cityNames: ['Ferrara', 'Ravenna'], cost:  4 },
  { cityNames: ['Livorno', 'Roma'], cost:  19 },
  { cityNames: ['Firenze', 'Roma'], cost:  20 },
  { cityNames: ['Firenze', 'Ravenna'], cost:  10 },
  { cityNames: ['Firenze', 'San Marino'], cost:  12 },
  { cityNames: ['Firenze', 'Perugia'], cost:  13 },
  { cityNames: ['San Marino', 'Perugia'], cost:  12 },
  { cityNames: ['San Marino', 'Rimini'], cost:  0 },
  { cityNames: ['Perugia', 'Roma'], cost:  13 },
  { cityNames: ['Perugia', 'Ancona'], cost:  10 },
  { cityNames: ['Ravenna', 'Rimini'], cost:  4 },
  { cityNames: ['Rimini', 'Ancona'], cost:  6 },
  { cityNames: ['Ancona', 'Roma'], cost:  17 },
  { cityNames: ['Ancona', 'Pescara'], cost:  9 },
  { cityNames: ['Roma', 'Pescara'], cost:  14 },
  { cityNames: ['Roma', 'Napoli'], cost:  14 },
  { cityNames: ['Roma', 'Foggia'], cost:  22 },
  { cityNames: ['Pescara', 'Foggia'], cost:  10 },
  { cityNames: ['Napoli', 'Salerno'], cost:  3 },
  { cityNames: ['Napoli', 'Foggia'], cost:  12 },
  { cityNames: ['Salerno', 'Foggia'], cost:  10 },
  { cityNames: ['Salerno', 'Cosenza'], cost:  18 },
  { cityNames: ['Salerno', 'Taranto'], cost:  19 },
  { cityNames: ['Salerno', 'Bari'], cost:  16 },
  { cityNames: ['Foggia', 'Bari'], cost:  8 },
  { cityNames: ['Bari', 'Brindisi'], cost:  7 },
  { cityNames: ['Bari', 'Taranto'], cost:  7 },
  { cityNames: ['Brindisi', 'Taranto'], cost:  4 },
  { cityNames: ['Taranto', 'Cosenza'], cost:  15 },
  { cityNames: ['Cosenza', 'Reggio Calabria'], cost:  13 },
  { cityNames: ['Reggio Calabria', 'Messina'], cost:  3 },
  { cityNames: ['Messina', 'Palermo'], cost:  15 },
  { cityNames: ['Messina', 'Catania'], cost:  6 },
  { cityNames: ['Palermo', 'Catania'], cost:  15 },
  { cityNames: ['Catania', 'Siracusa'], cost:  15 }
];

export class seedMapsIan1588443634320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const mapNames = ['Italy'];
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
            ...connectionsItaly.map(c => ({ ...c, map: maps.find(m => m.name === 'Italy') }))
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
