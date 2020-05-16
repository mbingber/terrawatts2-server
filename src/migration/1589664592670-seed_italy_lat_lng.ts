import {MigrationInterface, QueryRunner} from "typeorm";
import axios from "axios";
import { City } from "../entity/City";
import { Map } from "../entity/Map";

const COUNTRY = "Italy";

const getLatLng = async (cityName: string): Promise<{ lat: number; lng: number }> => {
  const name = cityName.replace(/ /g, "+");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name},+${COUNTRY}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(url);

  if (response.data.results.length === 0) {
      console.log("COULD NOT FIND: ", cityName);
      return { lat: 0, lng: 0 };
  } else {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
  }

}

export class seedItalyLatLng1589664592670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const map = await queryRunner
          .manager
          .getRepository(Map)
          .findOne({
            where: {
              name: COUNTRY
            }
          });
        
        const cities = await queryRunner
          .manager
          .getRepository(City)
          .find({
            where: { map }
          });
    
        const promises = cities.map((city) => {
          return getLatLng(city.name)
            .then(({ lat, lng }) => {
              city.lat = lat;
              city.lng = lng;
            })
        });
    
        return Promise.all(promises)
          .then(() => queryRunner.manager.save(cities));
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
      }

}
