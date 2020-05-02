Prereqs:

node v12, yarn

Setup:

yarn
yarn build
yarn start

TODO: database setup instructions

Instructions for adding maps:
1) Clone this repository
2) Checkout a new branch
3) Open up the file src/migration/xxxxxxx-seed_usa_and_germany_maps (this is your template)
4) Open up the file src/migration/xxxxxxx-seed_maps_ian
5) Everywhere there is a TODO in the Ian file, enter data following the template in the USA/Germany file
6) Important to give every city a region number, 1-6. Assign numbers to regions however makes sense to you
7) Open up the file src/logic/createGame/getRegions
8) Fill out the object `edgesByMap`, showing which regions share borders (this is used to randomize starting regions)
9) Make a pull request

Mike will:
1) Merge the pull request (or ask for changes)
2) Seed the latitude and longitude for the cities
3) Front end work: map config, new option when creating game