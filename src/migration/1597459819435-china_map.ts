import axios from "axios";
import {MigrationInterface, QueryRunner} from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";
import { Connection } from "../entity/Connection";

const citiesRaw = [{
    name: 'Karamay',
    region: 1,
}, {
    name: 'Wulumuqi',
    region: 1,
}, {
    name: 'Kuerle',
    region: 1,
}, {
    name: 'Hami',
    region: 1,
}, {
    name: 'Xining',
    region: 1,
}, {
    name: 'Yinghuan',
    region: 1,
}, {
    name: 'Lanzhou',
    region: 1,
}, {
    name: 'Baotou',
    region: 3,
}, {
    name: 'Beijing',
    region: 2,
}, {
    name: 'Tangshan',
    region: 2,
}, {
    name: 'Tianjin',
    region: 2,
}, {
    name: 'Shenyang',
    region: 2,
}, {
    name: 'Changchun',
    region: 2,
}, {
    name: 'Taiyuan',
    region: 2,
}, {
    name: 'Qiqhaer',
    region: 3,
}, {
    name: 'Hegang',
    region: 3,
}, {
    name: 'Haerbin',
    region: 3,
}, {
    name: 'Jilin',
    region: 3,
}, {
    name: 'Fushun',
    region: 3,
}, {
    name: 'Anshan',
    region: 3,
}, {
    name: 'Dalian',
    region: 3,
}, {
    name: 'Xian',
    region: 4,
}, {
    name: 'Chengdu',
    region: 4,
}, {
    name: 'Chongqing',
    region: 4,
}, {
    name: 'Guiyang',
    region: 4,
}, {
    name: 'Kunming',
    region: 4,
}, {
    name: 'Nanning',
    region: 4,
}, {
    name: 'Haikou',
    region: 4,
}, {
    name: 'Wuhan',
    region: 5,
}, {
    name: 'Changsha',
    region: 5,
}, {
    name: 'Guangzhou',
    region: 5,
}, {
    name: 'Hong Kong',
    region: 5,
}, {
    name: 'Chaozhou',
    region: 5,
}, {
    name: 'Fuzhou',
    region: 5,
}, {
    name: 'Nanchang',
    region: 5,
}, {
    name: 'Hangzhou',
    region: 6,
}, {
    name: 'Shanghai',
    region: 6,
}, {
    name: 'Nanjing',
    region: 6,
}, {
    name: 'Zhengzhou',
    region: 6,
}, {
    name: 'Shijiazhuang',
    region: 6,
}, {
    name: 'Jinan',
    region: 6,
}, {
    name: 'Qingoao',
    region: 6,
}];

const connectionsRaw = [
    { cityNames: ['Karamay', 'Wulumuqi'], cost: 7 },
    { cityNames: ['Karamay', 'Kuerle'], cost: 12 },
    { cityNames: ['Wulumuqi', 'Kuerle'], cost: 9 },
    { cityNames: ['Wulumuqi', 'Hami'], cost: 12 },
    { cityNames: ['Kuerle', 'Hami'], cost: 15 },
    { cityNames: ['Hami', 'Xining'], cost: 25 },
    { cityNames: ['Hami', 'Yinghuan'], cost: 25 },
    { cityNames: ['Xining', 'Yinghuan'], cost: 11 },
    { cityNames: ['Xining', 'Lanzhou'], cost: 6 },
    { cityNames: ['Xining', 'Chengdu'], cost: 20 },
    { cityNames: ['Yinghuan', 'Lanzhou'], cost: 9 },
    { cityNames: ['Yinghuan', 'Baotou'], cost: 9 },
    { cityNames: ['Yinghuan', 'Taiyuan'], cost: 14 },
    { cityNames: ['Lanzhou', 'Taiyuan'], cost: 18 },
    { cityNames: ['Lanzhou', 'Xian'], cost: 15 },
    { cityNames: ['Lanzhou', 'Chengdu'], cost: 16 },
    { cityNames: ['Baotou', 'Taiyuan'], cost: 9 },
    { cityNames: ['Baotou', 'Beijing'], cost: 14 },
    { cityNames: ['Taiyuan', 'Beijing'], cost: 10 },
    { cityNames: ['Taiyuan', 'Xian'], cost: 12 },
    { cityNames: ['Taiyuan', 'Zhengzhou'], cost: 11 },
    { cityNames: ['Taiyuan', 'Shijiazhuang'], cost: 5 },
    { cityNames: ['Beijing', 'Tangshan'], cost: 3 },
    { cityNames: ['Beijing', 'Shijiazhuang'], cost: 6 },
    { cityNames: ['Tangshan', 'Tianjin'], cost: 0 },
    { cityNames: ['Tangshan', 'Shenyang'], cost: 11 },
    { cityNames: ['Tianjin', 'Shijiazhuang'], cost: 5 },
    { cityNames: ['Tianjin', 'Jinan'], cost: 6 },
    { cityNames: ['Shenyang', 'Changchun'], cost: 5 },
    { cityNames: ['Shenyang', 'Fushun'], cost: 0 },
    { cityNames: ['Shenyang', 'Anshan'], cost: 2 },
    { cityNames: ['Changchun', 'Jilin'], cost: 2 },
    { cityNames: ['Changchun', 'Haerbin'], cost: 5 },
    { cityNames: ['Changchun', 'Qiqhaer'], cost: 9 },
    { cityNames: ['Qiqhaer', 'Hegang'], cost: 11 },
    { cityNames: ['Qiqhaer', 'Haerbin'], cost: 6 },
    { cityNames: ['Hegang', 'Haerbin'], cost: 7 },
    { cityNames: ['Haerbin', 'Jilin'], cost: 5 },
    { cityNames: ['Jilin', 'Fushun'], cost: 6 },
    { cityNames: ['Anshan', 'Dalian'], cost: 6 },
    { cityNames: ['Xian', 'Zhengzhou'], cost: 10 },
    { cityNames: ['Xian', 'Chengdu'], cost: 14 },
    { cityNames: ['Xian', 'Chongqing'], cost: 14 },
    { cityNames: ['Xian', 'Wuhan'], cost: 15 },
    { cityNames: ['Chengdu', 'Chongqing'], cost: 6 },
    { cityNames: ['Chengdu', 'Guiyang'], cost: 13 },
    { cityNames: ['Chengdu', 'Kunming'], cost: 16 },
    { cityNames: ['Kunming', 'Guiyang'], cost: 12 },
    { cityNames: ['Chongqing', 'Guiyang'], cost: 9 },
    { cityNames: ['Chongqing', 'Wuhan'], cost: 18 },
    { cityNames: ['Chongqing', 'Changsha'], cost: 16 },
    { cityNames: ['Guiyang', 'Nanning'], cost: 12 },
    { cityNames: ['Guiyang', 'Changsha'], cost: 15 },
    { cityNames: ['Guiyang', 'Guangzhou'], cost: 18 },
    { cityNames: ['Nanning', 'Haikou'], cost: 10 },
    { cityNames: ['Nanning', 'Guangzhou'], cost: 11 },
    { cityNames: ['Haikou', 'Guangzhou'], cost: 13 },
    { cityNames: ['Wuhan', 'Changsha'], cost: 6 },
    { cityNames: ['Wuhan', 'Nanchang'], cost: 6 },
    { cityNames: ['Wuhan', 'Hangzhou'], cost: 13 },
    { cityNames: ['Wuhan', 'Nanjing'], cost: 10 },
    { cityNames: ['Wuhan', 'Zhengzhou'], cost: 10 },
    { cityNames: ['Changsha', 'Nanchang'], cost: 7 },
    { cityNames: ['Changsha', 'Guangzhou'], cost: 14 },
    { cityNames: ['Guangzhou', 'Hong Kong'], cost: 4 },
    { cityNames: ['Guangzhou', 'Chaozhou'], cost: 7 },
    { cityNames: ['Guangzhou', 'Nanchang'], cost: 16 },
    { cityNames: ['Hong Kong', 'Chaozhou'], cost: 7 },
    { cityNames: ['Nanchang', 'Hangzhou'], cost: 10 },
    { cityNames: ['Nanchang', 'Fuzhou'], cost: 13 },
    { cityNames: ['Nanchang', 'Chaozhou'], cost: 14 },
    { cityNames: ['Chaozhou', 'Fuzhou'], cost: 9 },
    { cityNames: ['Fuzhou', 'Hangzhou'], cost: 13 },
    { cityNames: ['Hangzhou', 'Shanghai'], cost: 4 },
    { cityNames: ['Hangzhou', 'Nanjing'], cost: 5 },
    { cityNames: ['Shanghai', 'Nanjing'], cost: 6 },
    { cityNames: ['Nanjing', 'Zhengzhou'], cost: 12 },
    { cityNames: ['Nanjing', 'Jinan'], cost: 11 },
    { cityNames: ['Nanjing', 'Qingoao'], cost: 12 },
    { cityNames: ['Zhengzhou', 'Jinan'], cost: 7 },
    { cityNames: ['Zhengzhou', 'Shijiazhuang'], cost: 9 },
    { cityNames: ['Jinan', 'Qingoao'], cost: 6 },
    { cityNames: ['Jinan', 'Shijiazhuang'], cost: 6 }
];

const getLatLng = async (cityName: string): Promise<{ lat: number; lng: number }> => {
    const name = cityName.replace(/ /g, "+");
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name},+China&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  
    const response = await axios.get(url);
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  }

export class chinaMap1597459819435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const map = new Map();
        map.name = 'China';

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
