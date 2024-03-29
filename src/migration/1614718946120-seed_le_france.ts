import { MigrationInterface, QueryRunner } from 'typeorm';
import axios from 'axios';
import { Map } from '../entity/Map';
import { City } from '../entity/City';
import { Connection } from '../entity/Connection';

const citiesRaw = [
  {
    name: 'Paris-1',
    region: 1,
    map: 'France'
  },
  {
    name: 'Paris-2',
    region: 1,
    map: 'France'
  },
  {
    name: 'Paris-3',
    region: 1,
    map: 'France'
  },
  {
    name: 'Orleans',
    region: 1,
    map: 'France'
  },
  {
    name: 'Tours',
    region: 1,
    map: 'France'
  },
  {
    name: 'Limoges',
    region: 1,
    map: 'France'
  },
  {
    name: 'Clermont-Ferrano',
    region: 1,
    map: 'France'
  },
  {
    name: 'Brest',
    region: 2,
    map: 'France'
  },
  {
    name: 'Rennes',
    region: 2,
    map: 'France'
  },
  {
    name: 'Angers',
    region: 2,
    map: 'France'
  },
  {
    name: 'Le Mans',
    region: 2,
    map: 'France'
  },
  {
    name: 'Caen',
    region: 2,
    map: 'France'
  },
  {
    name: 'Le Havre',
    region: 2,
    map: 'France'
  },
  {
    name: 'Rouen',
    region: 2,
    map: 'France'
  },
  {
    name: 'Calais',
    region: 3,
    map: 'France'
  },
  {
    name: 'Lille',
    region: 3,
    map: 'France'
  },
  {
    name: 'Amiens',
    region: 3,
    map: 'France'
  },
  {
    name: 'Reims',
    region: 3,
    map: 'France'
  },
  {
    name: 'Metz',
    region: 3,
    map: 'France'
  },
  {
    name: 'Nancy',
    region: 3,
    map: 'France'
  },
  {
    name: 'Strasbourg',
    region: 3,
    map: 'France'
  },
  {
    name: 'Nantes',
    region: 4,
    map: 'France'
  },
  {
    name: 'La Rochelle',
    region: 4,
    map: 'France'
  },
  {
    name: 'Bordeaux',
    region: 4,
    map: 'France'
  },
  {
    name: 'Biarritz',
    region: 4,
    map: 'France'
  },
  {
    name: 'Lourdes',
    region: 4,
    map: 'France'
  },
  {
    name: 'Toulouse',
    region: 4,
    map: 'France'
  },
  {
    name: 'Carcassonne',
    region: 4,
    map: 'France'
  },
  {
    name: 'Perpignan',
    region: 5,
    map: 'France'
  },
  {
    name: 'Montpellier',
    region: 5,
    map: 'France'
  },
  {
    name: 'Toulon',
    region: 5,
    map: 'France'
  },
  {
    name: 'Nimes',
    region: 5,
    map: 'France'
  },
  {
    name: 'Aix-en-Provence',
    region: 5,
    map: 'France'
  },
  {
    name: 'Marseille',
    region: 5,
    map: 'France'
  },
  {
    name: 'Nice',
    region: 5,
    map: 'France'
  },
  {
    name: 'Grenoble',
    region: 6,
    map: 'France'
  },
  {
    name: 'Saint Etienne',
    region: 6,
    map: 'France'
  },
  {
    name: 'Lyon',
    region: 6,
    map: 'France'
  },
  {
    name: 'Chamonix',
    region: 6,
    map: 'France'
  },
  {
    name: 'Dijon',
    region: 6,
    map: 'France'
  },
  {
    name: 'Besancon',
    region: 6,
    map: 'France'
  },
  {
    name: 'Mulhouse',
    region: 6,
    map: 'France'
  },
];

const connectionsFrance = [
  { cityNames: ['Paris-1', 'Paris-2'], cost: 0 },
  { cityNames: ['Paris-1', 'Paris-3'], cost: 0 },
  { cityNames: ['Paris-2', 'Paris-3'], cost: 0 },
  { cityNames: ['Paris-1', 'Rouen'], cost: 9 },
  { cityNames: ['Paris-1', 'Amiens'], cost: 9 },
  { cityNames: ['Paris-2', 'Reims'], cost: 9 },
  { cityNames: ['Paris-2', 'Nancy'], cost: 21 },
  { cityNames: ['Paris-2', 'Dijon'], cost: 20 },
  { cityNames: ['Paris-3', 'Caen'], cost: 12 },
  { cityNames: ['Paris-3', 'Le Mans'], cost: 10 },
  { cityNames: ['Paris-3', 'Orleans'], cost: 7 },
  { cityNames: ['Orleans', 'Le Mans'], cost: 8 },
  { cityNames: ['Orleans', 'Tours'], cost: 7 },
  { cityNames: ['Orleans', 'Limoges'], cost: 19 },
  { cityNames: ['Orleans', 'Clermont-Ferrano'], cost: 18 },
  { cityNames: ['Orleans', 'Dijon'], cost: 18 },
  { cityNames: ['Tours', 'Le Mans'], cost: 5 },
  { cityNames: ['Tours', 'Angers'], cost: 6 },
  { cityNames: ['Tours', 'La Rochelle'], cost: 13 },
  { cityNames: ['Tours', 'Limoges'], cost: 13 },
  { cityNames: ['Limoges', 'La Rochelle'], cost: 13 },
  { cityNames: ['Limoges', 'Bordeaux'], cost: 13 },
  { cityNames: ['Limoges', 'Toulouse'], cost: 19 },
  { cityNames: ['Limoges', 'Clermont-Ferrano'], cost: 12 },
  { cityNames: ['Clermont-Ferrano', 'Toulouse'], cost: 24 },
  { cityNames: ['Clermont-Ferrano', 'Montpellier'], cost: 22 },
  { cityNames: ['Clermont-Ferrano', 'Saint Etienne'], cost: 10 },
  { cityNames: ['Clermont-Ferrano', 'Lyon'], cost: 11 },
  { cityNames: ['Clermont-Ferrano', 'Dijon'], cost: 19 },
  { cityNames: ['Saint Etienne', 'Lyon'], cost: 6 },
  { cityNames: ['Saint Etienne', 'Grenoble'], cost: 10 },
  { cityNames: ['Saint Etienne', 'Montpellier'], cost: 18 },
  { cityNames: ['Saint Etienne', 'Nimes'], cost: 16 },
  { cityNames: ['Grenoble', 'Lyon'], cost: 7 },
  { cityNames: ['Grenoble', 'Chamonix'], cost: 12 },
  { cityNames: ['Grenoble', 'Nimes'], cost: 18 },
  { cityNames: ['Grenoble', 'Aix-en-Provence'], cost: 17 },
  { cityNames: ['Grenoble', 'Nice'], cost: 19 },
  { cityNames: ['Lyon', 'Chamonix'], cost: 13 },
  { cityNames: ['Lyon', 'Besancon'], cost: 16 },
  { cityNames: ['Lyon', 'Dijon'], cost: 13 },
  { cityNames: ['Chamonix', 'Besancon'], cost: 19 },
  { cityNames: ['Besancon', 'Dijon'], cost: 6 },
  { cityNames: ['Besancon', 'Mulhouse'], cost: 8 },
  { cityNames: ['Besancon', 'Nancy'], cost: 14 },
  { cityNames: ['Dijon', 'Nancy'], cost: 15 },
  { cityNames: ['Nancy', 'Mulhouse'], cost: 12 },
  { cityNames: ['Nancy', 'Strasbourg'], cost: 10 },
  { cityNames: ['Nancy', 'Metz'], cost: 3 },
  { cityNames: ['Nancy', 'Reims'], cost: 13 },
  { cityNames: ['Strasbourg', 'Mulhouse'], cost: 6 },
  { cityNames: ['Strasbourg', 'Metz'], cost: 11 },
  { cityNames: ['Metz', 'Reims'], cost: 12 },
  { cityNames: ['Reims', 'Lille'], cost: 9 },
  { cityNames: ['Reims', 'Amiens'], cost: 11 },
  { cityNames: ['Lille', 'Amiens'], cost: 7 },
  { cityNames: ['Lille', 'Calais'], cost: 7 },
  { cityNames: ['Amiens', 'Calais'], cost: 8 },
  { cityNames: ['Amiens', 'Rouen'], cost: 6 },
  { cityNames: ['Calais', 'Le Havre'], cost: 13 },
  { cityNames: ['Le Havre', 'Rouen'], cost: 5 },
  { cityNames: ['Le Havre', 'Caen'], cost: 5 },
  { cityNames: ['Rouen', 'Caen'], cost: 9 },
  { cityNames: ['Caen', 'Le Mans'], cost: 10 },
  { cityNames: ['Caen', 'Rennes'], cost: 12 },
  { cityNames: ['Le Mans', 'Rennes'], cost: 9 },
  { cityNames: ['Le Mans', 'Angers'], cost: 5 },
  { cityNames: ['Angers', 'Rennes'], cost: 7 },
  { cityNames: ['Angers', 'Nantes'], cost: 5 },
  { cityNames: ['Angers', 'La Rochelle'], cost: 12 },
  { cityNames: ['Rennes', 'Nantes'], cost: 7 },
  { cityNames: ['Rennes', 'Brest'], cost: 16 },
  { cityNames: ['Brest', 'Nantes'], cost: 19 },
  { cityNames: ['Nantes', 'La Rochelle'], cost: 9 },
  { cityNames: ['La Rochelle', 'Bordeaux'], cost: 13 },
  { cityNames: ['Bordeaux', 'Biarritz'], cost: 12 },
  { cityNames: ['Bordeaux', 'Lourdes'], cost: 14 },
  { cityNames: ['Bordeaux', 'Toulouse'], cost: 14 },
  { cityNames: ['Biarritz', 'Lourdes'], cost: 9 },
  { cityNames: ['Lourdes', 'Toulouse'], cost: 10 },
  { cityNames: ['Lourdes', 'Carcassonne'], cost: 10 },
  { cityNames: ['Lourdes', 'Perpignan'], cost: 20 },
  { cityNames: ['Toulouse', 'Carcassonne'], cost: 6 },
  { cityNames: ['Toulouse', 'Montpellier'], cost: 14 },
  { cityNames: ['Carcassonne', 'Montpellier'], cost: 9 },
  { cityNames: ['Carcassonne', 'Perpignan'], cost: 6 },
  { cityNames: ['Perpignan', 'Montpellier'], cost: 11 },
  { cityNames: ['Montpellier', 'Nimes'], cost: 3 },
  { cityNames: ['Nimes', 'Aix-en-Provence'], cost: 8 },
  { cityNames: ['Aix-en-Provence', 'Marseille'], cost: 0 },
  { cityNames: ['Aix-en-Provence', 'Nice'], cost: 8 },
  { cityNames: ['Marseille', 'Toulon'], cost: 3 },
  { cityNames: ['Toulon', 'Nice'], cost: 7 },
];

const getLatLng = async (cityName: string): Promise<{ lat: number; lng: number }> => {
  const name = cityName.replace(/ /g, "+");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name},+France&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(url);
  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
}

export class seedLeFrance1614718946120 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const map = new Map();
      map.name = "France";

      await queryRunner.manager.save(map);

      const latLngPromises = citiesRaw.map(c => {
        return getLatLng(c.name);
      });

      const latLngs = await Promise.all(latLngPromises);

      const cities: City[] = citiesRaw.map((c, i) => {
        const city = new City();

        const { lat, lng } = latLngs[i];

        city.name = c.name;
        city.region = c.region;
        city.lat = lat;
        city.lng = lng;
        city.map = map;

        return city;
      });

      await queryRunner.manager.save(cities);

      const connections: Connection[] = connectionsFrance.map(c => {
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
