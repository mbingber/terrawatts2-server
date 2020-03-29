const dotenv = require("dotenv");
const { parse } = require("pg-connection-string");
dotenv.config();

const isProd = !!process.env.DATABASE_URL;

const connectionObj = {
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: "terrawatts2"
};

if (isProd) {
   const databaseUrl = process.env.DATABASE_URL;
   const connectionOptions = parse(databaseUrl);

   connectionObj.name = connectionOptions.name;
   connectionObj.host = connectionOptions.host;
   connectionObj.post = connectionOptions.port;
   connectionObj.username = connectionOptions.username;
   connectionObj.password = connectionOptions.password;
   connectionObj.database = connectionOptions.database;
   connectionObj.extra = {
      ssl: true
   };
}

module.exports = {
   ...connectionObj,
   type: "postgres",
   synchronize: true,
   logging: false,
   entities: [
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
