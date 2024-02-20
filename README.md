Inventory Management
An inventory management app with a pokemon adoption theme. Initial pokemon are fetched from the PokeAPI, with the inventory changed through CRUD operations. This was accomplished through Express.js, Node.js

## Installation and Setup Instructions


Requirements: `node` and `npm` installed globally on your machine.  


Clone this repository


.env file contents:

Set MONGODB_URI with your own mongodb link. 


Installation:


`npm install`  


To Start Server:


`npm start`  


To Visit App:


`localhost:3000`  


## Reflection


In order to practice CRUD operations, I created a pokemon-adoption themed website that allows users to create, read, update, and delete various pokemon, nature, types, and pokemon instances. 

In implementing this, I went with a MVC structure using Express.js, Node.js, Mongoose and pug. I populated the database with the original 151 pokemon using pokeapi, a RESTful API. I also randomly populated the database with pokemon instances based on this data, adding properties tailored for the app such as adoption status. 


A challenge I faced while developing this app was adding a property to be saved in the database that was dependent on other database items. I wanted to be able to determine the value of the property without having to make additional database calls to check the other items. To accomplish this, I learned and implemented post and pre schema middleware, updating the property when there is a database call that needs to be made anyways. 
