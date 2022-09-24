//Populates the database with information of all pokemon from the PokeAPI.
const fetch = require('node-fetch');

var userArgs = process.argv.slice(2);

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log("Connection successful"));

const Pokemon = require('./models/pokemon');
const PokemonInstance = require('./models/pokemoninstance');
const Type = require('./models/type');
const Nature = require('./models/nature');

var pokemons = [];
var pokemonInstances = [];
var types = [];
var natures = [];

function natureCreate(name, increasedStat, decreasedStat, likesFlavor, hatesFlavor) {
    const natureDetail = {name: name, increased_stat: increasedStat, decreased_stat: decreasedStat, likes_flavor: likesFlavor, hates_flavor: hatesFlavor, is_verified: true};
    const nature = new Nature(natureDetail);

    nature.save((err, product) => {
        if(err) {
            return err;
        }
        console.log("New Nature: " + product);
    })
    natures.push(nature);
}

function typeCreate(name) {
    const typeDetail = {name: name, is_verified: true};
    const type = new Type(typeDetail);

    type.save((err, product) => {
        if(err) {
            return err;
        }
        console.log("New Type: " + product);
    })
    types.push(type);
}

function pokemonCreate(name, price, numberInStock, image, types, weight, height) {
    const pokemonDetail = {name: name, price: price, number_in_stock:numberInStock, image: image, types: types, weight: weight, height: height, is_verified: true};
    const pokemon = new Pokemon(pokemonDetail);

    pokemon.save((err, product)=> {
        if(err) {
            console.log(err);
            return err;
        }
       console.log("New Pokemon: " + product);
    })
    pokemons.push(pokemon);
}

function pokemonInstanceCreate(pokemon, status, birthDate, dateReceived, nature) {
    const pokemonInstanceDetail = {pokemon: pokemon, status: status, birth_date: birthDate, date_received: dateReceived, nature: nature};
    const pokemonInstance = new PokemonInstance(pokemonInstanceDetail);

    pokemonInstance.save((err, product) => {
        if(err) {
            console.log(err);
            return err;
        }
        console.log("New Pokemon Instance: " + product);
    })
    pokemonInstances.push(pokemonInstance);
}

function priceRandomizer() {
    let price;
    let rarity = Math.floor(Math.random() * 100);
    if(rarity < 1) price = Math.floor((Math.random() * 10)) * 1000 + 5000;
    else if (rarity < 10) price = Math.floor((Math.random() * 10)) * 400 + 1000;
    else if (rarity < 50) price = Math.floor((Math.random() * 50)) * 10 + 500;
    else if (rarity < 99) price = Math.floor((Math.random() * 40)) * 10 + 50;
    else price = Math.floor((Math.random() * 49)) + 1;

    return Math.round(price);
}

function createRandomPokemonInstances(pokemon) {
    let numInstancesToCreate = Math.floor(Math.random() * 3);
    for(let i = 0; i < numInstancesToCreate; i++) {
        let statusNum = Math.floor(Math.random() * 4);
        let status;
        switch(statusNum){
            case 0: 
                status = "Available";
                break;
            case 1:
                status = "Adopted";
                break;
            case 2: 
                status = "Undergoing Rehabilitation";
                break;
            default:
                status = 'Fainted';
        }
        let birthDate = Date.now() - (60 * 60 * 24 * 7 * 1000) - Math.floor(Math.random() * 1000) * 60 * 60 * 24 * 1000;
        let dateReceived = Date.now();
        let natureIndex = Math.floor(Math.random() * natures.length);
        pokemonInstanceCreate(pokemon, status, birthDate, dateReceived, natures[natureIndex]);
    }
}

let naturePromise = new Promise((resolve, reject) => {
    const fetchData = fetch('https://pokeapi.co/api/v2/nature?limit=100');
    const jsonData = fetchData.then(fd => fd.json());
    jsonData.then(jd => {
        jd.results.forEach((result, index) => {
            const name = result.name;
            const urlData = fetch(result.url);
            const urlJson = urlData.then(urlResult => urlResult.json());
            urlJson.then(data => {
                if(data.increased_stat === null) natureCreate(name, null, null, null, null);
                else natureCreate(name, data.increased_stat.name, data.decreased_stat.name, data.likes_flavor.name, data.hates_flavor.name);
            }).catch(err => {if(err) console.log(err)})
        })
    });

naturePromise.then(() => {
    const fetchData = fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const jsonData = fetchData.then(fd => fd.json());
    jsonData.then(jd => {
        jd.results.forEach((result, index) => {
            const name = result.name;
            const urlData = fetch(result.url)
            const urlJson = urlData.then(urlResult => urlResult.json())
            urlJson.then(data => {
                let pokeTypes = new Promise((resolve, reject) => {
                    let typeList = [];
                    for (const typeSlot of data.types) {
                        let typeIndex = new Promise((resolve, reject) => {
                            let type = typeSlot.type;
                            let indexLocation = types.map(type => type.name).indexOf(type.name);
                            if(indexLocation === -1) {
                                typeCreate(type.name);
                                indexLocation = types.length - 1;
                            }
                            resolve(indexLocation);
                        })
                        typeIndex.then(index => {
                            typeList.push(types[index]);
                        });
                    }
                    resolve(typeList);
                });
                let pokemon = pokeTypes.then(typesResult => {
                    pokemonCreate(name, priceRandomizer(), 0, data.sprites.other['official-artwork'].front_default, typesResult, data.weight, data.height);
                });
                pokemon.then(() => {
                    createRandomPokemonInstances(pokemons[pokemons.length - 1]); 
                });
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err))});
});