import { MigrationInterface, QueryRunner } from 'typeorm';
import { Map } from '../entity/Map';
import { City } from '../entity/City';
import { Connection } from '../entity/Connection';

const citiesRaw = [
  {
    name: 'Seattle',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Portland',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Boise',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Billings',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Cheyenne',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Denver',
    region: 1,
    map: 'USA'
  },
  {
    name: 'Omaha',
    region: 1,
    map: 'USA'
  },
  {
    name: 'San Francisco',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Los Angeles',
    region: 4,
    map: 'USA'
  },
  {
    name: 'San Diego',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Las Vegas',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Phoenix',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Salt Lake City',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Santa Fe',
    region: 4,
    map: 'USA'
  },
  {
    name: 'Houston',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Dallas',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Oklahoma City',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Kansas City',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Memphis',
    region: 5,
    map: 'USA'
  },
  {
    name: 'New Orleans',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Birmingham',
    region: 5,
    map: 'USA'
  },
  {
    name: 'Atlanta',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Jacksonville',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Tampa',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Miami',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Savannah',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Raleigh',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Norfolk',
    region: 6,
    map: 'USA'
  },
  {
    name: 'Fargo',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Duluth',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Minneapolis',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Chicago',
    region: 2,
    map: 'USA'
  },
  {
    name: 'St. Louis',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Knoxville',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Cincinnati',
    region: 2,
    map: 'USA'
  },
  {
    name: 'Detroit',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Pittsburgh',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Washington, D.C.',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Buffalo',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Philadelphia',
    region: 3,
    map: 'USA'
  },
  {
    name: 'New York',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Boston',
    region: 3,
    map: 'USA'
  },
  {
    name: 'Flensburg',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Kiel',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Cuxhaven',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Wilhelmshaven',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Bremen',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Hamburg',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Hannover',
    region: 1,
    map: 'Germany'
  },
  {
    name: 'Lubeck',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Rostock',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Torgelow',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Schwerin',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Magdeberg',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Berlin',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Frankfurt',
    region: 2,
    map: 'Germany'
  },
  {
    name: 'Osnabruck',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Munster',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Duisburg',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Essen',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Dortmund',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Dusseldorf',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Kassel',
    region: 3,
    map: 'Germany'
  },
  {
    name: 'Halle',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Leipzig',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Dresden',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Erfurt',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Fulda',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Wurzburg',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Nurnburg',
    region: 4,
    map: 'Germany'
  },
  {
    name: 'Aachen',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Koln',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Trier',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Wiesbaden',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Frankfurt an der Oder',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Saarbrucken',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Mannheim',
    region: 5,
    map: 'Germany'
  },
  {
    name: 'Freiburg',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Stuttgart',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Konstanz',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Augsburg',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Regensburg',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Munchen',
    region: 6,
    map: 'Germany'
  },
  {
    name: 'Passau',
    region: 6,
    map: 'Germany'
  },
];

const connectionsUSA = [
  { cityNames: ['New York', 'Boston'], cost:  3 },
  { cityNames: ['New York', 'Philadelphia'], cost:  0},
  { cityNames: ['New York', 'Buffalo'], cost:  8 },
  { cityNames: ['Pittsburgh', 'Buffalo'], cost:  7 },
  { cityNames: ['Washington, D.C.', 'Philadelphia'], cost:  3 },
  { cityNames: ['Pittsburgh', 'Washington, D.C.'], cost:  6 },
  { cityNames: ['Norfolk', 'Washington, D.C.'], cost:  5 },
  { cityNames: ['Raleigh', 'Norfolk'], cost:  3 },
  { cityNames: ['Raleigh', 'Pittsburgh'], cost:  7 },
  { cityNames: ['Detroit', 'Buffalo'], cost:  7 },
  { cityNames: ['Detroit', 'Pittsburgh'], cost:  6 },
  { cityNames: ['Detroit', 'Duluth'], cost:  15 },
  { cityNames: ['Detroit', 'Chicago'], cost: 7 },
  { cityNames: ['Detroit', 'Cincinnati'], cost: 4 },
  { cityNames: ['Pittsburgh', 'Cincinnati'], cost:  7 },
  { cityNames: ['Cincinnati', 'Raleigh'], cost:  15 },
  { cityNames: ['Cincinnati', 'Knoxville'], cost:  6 },
  { cityNames: ['Cincinnati', 'Chicago'], cost:  7 },
  { cityNames: ['Cincinnati', 'St. Louis'], cost: 12 },
  { cityNames: ['Knoxville', 'Atlanta'], cost:  5 },
  { cityNames: ['Atlanta', 'Raleigh'], cost:  7 },
  { cityNames: ['Raleigh', 'Savannah'], cost: 7 },
  { cityNames: ['Atlanta', 'Savannah'], cost:  7 },
  { cityNames: ['Savannah', 'Jacksonville'], cost: 0 },
  { cityNames: ['Jacksonville', 'Tampa'], cost:  4 },
  { cityNames: ['Tampa', 'Miami'], cost:  4 },
  { cityNames: ['Atlanta', 'Birmingham'], cost: 3 },
  { cityNames: ['Atlanta', 'St. Louis'], cost: 12 },
  { cityNames: ['Jacksonville', 'Birmingham'], cost: 9 },
  { cityNames: ['Jacksonville', 'New Orleans'], cost: 16 },
  { cityNames: ['Birmingham', 'New Orleans'], cost: 11 },
  { cityNames: ['Birmingham', 'Memphis'], cost:  6},
  { cityNames: ['New Orleans', 'Memphis'], cost:  7 },
  { cityNames: ['New Orleans', 'Houston'], cost: 8 },
  { cityNames: ['New Orleans', 'Dallas'], cost:  12 },
  { cityNames: ['Memphis', 'Dallas'], cost: 12 },
  { cityNames: ['Memphis', 'Oklahoma City'], cost: 14 },
  { cityNames: ['Memphis', 'Kansas City'], cost: 12 },
  { cityNames: ['Memphis', 'St. Louis'], cost: 7 },
  { cityNames: ['Chicago', 'St. Louis'], cost: 10 },
  { cityNames: ['St. Louis', 'Kansas City'], cost: 6 },
  { cityNames: ['Chicago', 'Kansas City'], cost: 8 },
  { cityNames: ['Chicago', 'Omaha'], cost: 13 },
  { cityNames: ['Chicago', 'Minneapolis'], cost: 8 },
  { cityNames: ['Chicago', 'Duluth'], cost: 12 },
  { cityNames: ['Duluth', 'Minneapolis'], cost: 5 },
  { cityNames: ['Duluth', 'Fargo'], cost: 6 },
  { cityNames: ['Fargo', 'Minneapolis'], cost: 6 },
  { cityNames: ['Omaha', 'Minneapolis'], cost: 8 },
  { cityNames: ['Omaha', 'Kansas City'], cost: 5 },
  { cityNames: ['Kansas City', 'Oklahoma City'], cost: 8 },
  { cityNames: ['Oklahoma City', 'Dallas'], cost: 3 },
  { cityNames: ['Dallas', 'Houston'], cost: 5 },
  { cityNames: ['Fargo', 'Billings'], cost: 17 },
  { cityNames: ['Billings', 'Minneapolis'], cost: 18 },
  { cityNames: ['Minneapolis', 'Cheyenne'], cost: 18 },
  { cityNames: ['Omaha', 'Cheyenne'], cost: 14 },
  { cityNames: ['Denver', 'Kansas City'], cost: 16 },
  { cityNames: ['Santa Fe', 'Kansas City'], cost: 16 },
  { cityNames: ['Oklahoma City', 'Santa Fe'], cost: 15 },
  { cityNames: ['Dallas', 'Santa Fe'], cost: 16 },
  { cityNames: ['Houston', 'Santa Fe'], cost: 21 },
  { cityNames: ['Denver', 'Santa Fe'], cost:  13 },
  { cityNames: ['Cheyenne', 'Denver'], cost: 0 },
  { cityNames: ['Billings', 'Cheyenne'], cost: 9 },
  { cityNames: ['Salt Lake City', 'Santa Fe'], cost: 28 },
  { cityNames: ['Salt Lake City', 'Denver'], cost: 21 },
  { cityNames: ['Salt Lake City', 'Boise'], cost: 8 },
  { cityNames: ['Salt Lake City', 'San Francisco'], cost: 27 },
  { cityNames: ['Salt Lake City', 'Las Vegas'], cost: 18 },
  { cityNames: ['Santa Fe', 'Phoenix'], cost: 18 },
  { cityNames: ['Santa Fe', 'Las Vegas'], cost:  27},
  { cityNames: ['Las Vegas', 'Phoenix'], cost:  15 },
  { cityNames: ['Cheyenne', 'Boise'], cost: 21 },
  { cityNames: ['Billings', 'Boise'], cost: 12 },
  { cityNames: ['Seattle', 'Billings'], cost: 9 },
  { cityNames: ['Seattle', 'Boise'], cost: 12 },
  { cityNames: ['Boise', 'Portland'] , cost: 13},
  { cityNames: ['Seattle', 'Portland'], cost: 3 },
  { cityNames: ['Boise', 'San Francisco'], cost: 23 },
  { cityNames: ['Portland', 'San Francisco'], cost: 24 },
  { cityNames: ['Las Vegas', 'San Francisco'], cost:  14},
  { cityNames: ['Las Vegas', 'Los Angeles'], cost: 9 },
  { cityNames: ['San Francisco', 'Los Angeles'], cost: 9 },
  { cityNames: ['Los Angeles', 'San Diego'], cost: 3 },
  { cityNames: ['Phoenix', 'San Diego'], cost: 14 },
  { cityNames: ['Las Vegas', 'San Diego'], cost: 9 }
];

const connectionsGermany = [
  { cityNames: ['Flensburg', 'Kiel'], cost: 4 },
  { cityNames: ['Kiel', 'Lubeck'], cost: 4 },
  { cityNames: ['Kiel', 'Hamburg'], cost: 8 },
  { cityNames: ['Hamburg', 'Cuxhaven'], cost: 11 },
  { cityNames: ['Hamburg', 'Bremen'], cost: 11 },
  { cityNames: ['Hamburg', 'Lubeck'], cost: 6 },
  { cityNames: ['Hamburg', 'Schwerin'], cost: 8 },
  { cityNames: ['Hamburg', 'Hannover'], cost: 17 },
  { cityNames: ['Cuxhaven', 'Bremen'], cost: 8 },
  { cityNames: ['Wilhelmshaven', 'Bremen'], cost: 11 },
  { cityNames: ['Wilhelmshaven', 'Osnabruck'], cost: 14 },
  { cityNames: ['Bremen', 'Hannover'], cost: 10 },
  { cityNames: ['Bremen', 'Osnabruck'], cost: 11 },
  { cityNames: ['Hannover', 'Schwerin'], cost: 19 },
  { cityNames: ['Hannover', 'Magdeberg'], cost: 15 },
  { cityNames: ['Hannover', 'Osnabruck'], cost: 16 },
  { cityNames: ['Hannover', 'Kassel'], cost: 15 },
  { cityNames: ['Hannover', 'Erfurt'], cost: 19 },
  { cityNames: ['Osnabruck', 'Kassel'], cost: 20 },
  { cityNames: ['Osnabruck', 'Munster'], cost: 7 },
  { cityNames: ['Munster', 'Essen'], cost: 6 },
  { cityNames: ['Munster', 'Dortmund'], cost: 2 },
  { cityNames: ['Essen', 'Duisburg'], cost: 0 },
  { cityNames: ['Essen', 'Dusseldorf'], cost: 2 },
  { cityNames: ['Essen', 'Dortmund'], cost: 4 },
  { cityNames: ['Dortmund', 'Kassel'], cost: 18 },
  { cityNames: ['Dortmund', 'Frankfurt'], cost: 20 },
  { cityNames: ['Dortmund', 'Koln'], cost: 10 },
  { cityNames: ['Dusseldorf', 'Aachen'], cost: 9 },
  { cityNames: ['Dusseldorf', 'Koln'], cost: 4 },
  { cityNames: ['Aachen', 'Koln'], cost: 7 },
  { cityNames: ['Aachen', 'Trier'], cost: 19 },
  { cityNames: ['Trier', 'Koln'], cost: 20 },
  { cityNames: ['Trier', 'Wiesbaden'], cost: 18 },
  { cityNames: ['Trier', 'Saarbrucken'], cost: 11 },
  { cityNames: ['Wiesbaden', 'Saarbrucken'], cost: 10 },
  { cityNames: ['Wiesbaden', 'Frankfurt'], cost: 0 },
  { cityNames: ['Wiesbaden', 'Koln'], cost: 21 },
  { cityNames: ['Wiesbaden', 'Mannheim'], cost: 11 },
  { cityNames: ['Saarbrucken', 'Mannheim'], cost: 11 },
  { cityNames: ['Saarbrucken', 'Stuttgart'], cost: 17 },
  { cityNames: ['Stuttgart', 'Mannheim'], cost: 6 },
  { cityNames: ['Stuttgart', 'Freiburg'], cost: 16 },
  { cityNames: ['Stuttgart', 'Konstanz'], cost: 16 },
  { cityNames: ['Stuttgart', 'Wurzburg'], cost: 12 },
  { cityNames: ['Stuttgart', 'Augsburg'], cost: 15 },
  { cityNames: ['Freiburg', 'Konstanz'], cost: 14 },
  { cityNames: ['Augsburg', 'Konstanz'], cost: 17 },
  { cityNames: ['Augsburg', 'Wurzburg'], cost: 19 },
  { cityNames: ['Augsburg', 'Munchen'], cost: 6 },
  { cityNames: ['Augsburg', 'Regensburg'], cost: 13 },
  { cityNames: ['Augsburg', 'Nurnburg'], cost: 18 },
  { cityNames: ['Passau', 'Munchen'], cost: 14 },
  { cityNames: ['Passau', 'Regensburg'], cost: 12 },
  { cityNames: ['Munchen', 'Regensburg'], cost: 10 },
  { cityNames: ['Nurnburg', 'Regensburg'], cost: 12 },
  { cityNames: ['Nurnburg', 'Wurzburg'], cost: 8 },
  { cityNames: ['Nurnburg', 'Erfurt'], cost: 21 },
  { cityNames: ['Wurzburg', 'Mannheim'], cost: 10 },
  { cityNames: ['Wurzburg', 'Frankfurt'], cost: 13 },
  { cityNames: ['Wurzburg', 'Fulda'], cost: 11 },
  { cityNames: ['Frankfurt', 'Fulda'], cost: 8 },
  { cityNames: ['Frankfurt', 'Kassel'], cost: 13 },
  { cityNames: ['Fulda', 'Erfurt'], cost: 13 },
  { cityNames: ['Fulda', 'Kassel'], cost: 8 },
  { cityNames: ['Erfurt', 'Kassel'], cost: 15 },
  { cityNames: ['Erfurt', 'Halle'], cost: 6 },
  { cityNames: ['Erfurt', 'Dresden'], cost: 19 },
  { cityNames: ['Frankfurt an der Oder', 'Dresden'], cost: 16 },
  { cityNames: ['Frankfurt an der Oder', 'Leipzig'], cost: 21 },
  { cityNames: ['Frankfurt an der Oder', 'Berlin'], cost: 6 },
  { cityNames: ['Dresden', 'Leipzig'], cost: 13 },
  { cityNames: ['Halle', 'Leipzig'], cost: 0 },
  { cityNames: ['Halle', 'Berlin'], cost: 17 },
  { cityNames: ['Halle', 'Magdeberg'], cost: 11 },
  { cityNames: ['Berlin', 'Torgelow'], cost: 15 },
  { cityNames: ['Berlin', 'Magdeberg'], cost: 10 },
  { cityNames: ['Berlin', 'Schwerin'], cost: 18 },
  { cityNames: ['Schwerin', 'Magdeberg'], cost: 16 },
  { cityNames: ['Schwerin', 'Torgelow'], cost: 19 },
  { cityNames: ['Schwerin', 'Lubeck'], cost: 6 },
  { cityNames: ['Schwerin', 'Rostock'], cost: 6 },
  { cityNames: ['Torgelow', 'Rostock'], cost: 19 },
];

export class seedUsaAndGermanyMaps1576442779031 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const mapNames = ['USA', 'Germany'];
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
      ...connectionsUSA.map(c => ({ ...c, map: maps.find(m => m.name === 'USA') })),
      ...connectionsGermany.map(c => ({ ...c, map: maps.find(m => m.name === 'Germany') }))
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
