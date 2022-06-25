
//load dotenv vars
require('dotenv').config()
const { inspect } = require('util');

//import mongoose
const mongoose = require('mongoose')

// connectiom
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)

// Messages
mongoose.connection
.on('open', () => {console.log('You are connected to mongo')})
.on('close', () => {console.log('You are disconnected to mongo')})
.on('error', (error) => {console.log(error)})

// remove schema
const removeBuildingSchema = new mongoose.Schema({
    name: String,
    address: String,
    rooms: [{
        room: Number,
        details: {
            type: mongoose.Types.ObjectId, ref: "Resident", 
        },
        _id: false
    }]
}, { timestamps: true })

//create model
const RemoveBuilding = mongoose.model('RemoveBuilding', removeBuildingSchema)



// create schema
const buildingSchema = new mongoose.Schema({
    name: String,
    address: String,
    rooms: [{
        room: Number,
        details: {
            type: mongoose.Types.ObjectId, ref: "Resident", 
        },
        _id: false
    }]
}, { timestamps: true })

//create model
const Building = mongoose.model('Building', buildingSchema)

// resident schema test

const residentSchema = new mongoose.Schema({
    name: String,
    dob: String,
    number: String,
    building: {
        type: mongoose.Types.ObjectId, ref: "Building",
    },
    roomnumber: Number
}, {timestamps: true})

//Owner model
const Resident = mongoose.model('Resident', residentSchema)



mongoose.connection.on('open', async () => {



// find building
// const britannia = await Building.findOne({name: "Britannia"}).populate("residents")

  
// create building
const circle = await Building.create({
    name: "The Circle",
    address: "Western Road",
    rooms: [{
        room: 1, details:null
    },{
        room: 2, details:null
    },{
        room: 3, details:null
    },{
        room: 4, details:null
    },{
        room: 5, details:null
    }]
})

// // find building and populate resident list
// const circle = await Building.findOne({name: "The Circle"}).populate({
//     path: 'rooms',
//     populate: [{
//      path: 'details',
//      model: 'Resident'
//     }]
//  }).exec()


// // //create person andd add them to found building
// const person = await Resident.create({name: "Jane Doe", dob: "12/5/1983", number: "0714333455518", building: circle, roomnumber: 2})


// // // //push newly created resident onto building, remove a room from capacity and save
// // // //find index of objects in rooms and assign to var
// const objIndex = circle.rooms.findIndex((obj => obj.room == person.roomnumber))
// console.log(objIndex)

// circle.rooms[objIndex].details = person

// await circle.save()

//removed building test

// const changeDb = await Building.findOne({name: "The Circle"})

// await Building.deleteOne({name: "The Circle"})
// const buildingList = await RemoveBuilding.create(changeDb)
//         await Building.deleteOne({name: "The Circle"})
//         res.json('worked')

// console.log and show all data This is caused by console.log() limiting the depth of the data it will show
console.log( inspect(buildingList, { depth : null }) );
    //close conection
    mongoose.connection.close()
})

