import { MigrationInterface, QueryRunner } from "typeorm";
import axios from "axios";
import { City } from "../entity/City";
import { Map } from "../entity/Map";

const getLatLng = async (cityName: string): Promise<{ lat: number; lng: number }> => {
  const name = cityName.replace(/ /g, "+");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name},+USA&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(url);
  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
}

export class seedUsaLatLng1577639664385 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const map = await queryRunner
      .manager
      .getRepository(Map)
      .findOne({
        where: {
          name: "USA"
        }
      });

    console.log("!!!!!!! map", map);
    
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
