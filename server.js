// *********************************
// Enabling Enviromental Variables
// *********************************
import dotenv from "dotenv"
dotenv.config()

// *********************************
// Import Dependencies
// *********************************
import express from "express"
import methodOverride from "method-override"
import cors from "cors"
import morgan from "morgan"
import MainController from "./controllers/MainController.js"
import APIController from "./controllers/APIController.js"
import mongoose from "mongoose"

// *********************************
// Global Variables & Controller Instantiation
// *********************************
const PORT = process.env.PORT || 3333
const MONGO_URI = process.env.MONGO_URI
const mainController = new MainController()
const apiController = new APIController()

// *********************************
// Mongodb connection
// *********************************

mongoose.connect(MONGO_URI)
mongoose.connection
.on("open", () => console.log("Connected to mongo"))
.on("close", () => console.log("disconnected from mongo"))
.on("error", (error) => console.log(error + "Error"))

// *********************************
// Model Objects
// *********************************

//Building
const buildingSchema = new mongoose.Schema({
    name: String,
    location: String,
    address: String,
    rooms: [{
        room: Number,
        details: {
            type: mongoose.Types.ObjectId, ref: "Resident", 
        }
    }],
    staff: Number,
    checkout:  [{}],
    listed: { type: Boolean, default: true }
}, { timestamps: true })

//building model
const Building = mongoose.model('Building', buildingSchema)

//Resident 
const residentSchema = new mongoose.Schema({
    name: String,
    dob: String,
    contact: String,
    info: String,
    building: {
        type: mongoose.Types.ObjectId, ref: "Building",
    },
    roomnumber: Number,
    seen: [],
    listed: { type: Boolean, default: true }
}, {timestamps: true})


//Resident model
const Resident = mongoose.model('Resident', residentSchema)



// *********************************
// Creating Application Object
// *********************************
const app = express()

// *********************************
// Routers
// *********************************
const MainRoutes = express.Router()
const APIRoutes = express.Router()

// *********************************
// Middleware
// *********************************
// Global Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static('public'))
app.use(morgan("tiny"))
//use models on all routes, accessable from mainController
app.use((req, res, next) => {
    req.models = {
        Building,
        Resident
    }
    next()
})
app.use("/", MainRoutes)
app.use("/api", APIRoutes)
// Router Specific Middleware
APIRoutes.use(cors())

// *********************************
// Routes that Render Pages with EJS
// *********************************
MainRoutes.get("/", mainController.index) // "/"
MainRoutes.get("/newBuilding", mainController.newBuilding) // new building form
MainRoutes.post('/createBuilding', mainController.createBuilding) // create building from form
MainRoutes.get('/building/:id', mainController.viewBuilding) // view building from /
MainRoutes.put('/building/remove/:id', mainController.buildingRemove) // remove building onto removed site list
MainRoutes.get("/removedBuildings", mainController.removedBuildings) // view removed buildings
MainRoutes.delete('/building/:id', mainController.buildingDestroy) // delete buildings from db


//Resident Routes
MainRoutes.get('/newResident/:id/:roomNumber', mainController.newResident) // view resident form
MainRoutes.post('/createResident', mainController.createResident) // create resident from form
MainRoutes.get('/resident/:id', mainController.viewResident) // view resident from building
MainRoutes.put('/remove/:buildingID/:residentID', mainController.residentRemove) //remove resident onto buildings checkout list
MainRoutes.get("/checkoutList/:id", mainController.removedResidents) // view removed residents 

// *********************************
// API Routes that Return JSON
// *********************************
APIRoutes.get("/", apiController.example) //"/api"
APIRoutes.get("/todos", apiController.getTodos)


// mongoose.connection.on('open', async () => {

    // const circle = await Building.create({
    //         name: "The Circle",
    //         address: "Western Road",
    //         rooms: [{
    //             room: 1, details:null
    //         },{
    //             room: 2, details:null
    //         },{
    //             room: 3, details:null
    //         },{
    //             room: 4, details:null
    //         },{
    //             room: 5, details:null
    //         }],
    //         staff: 2,
    //     })
      

//find building
// const building = await Building.findOne({name: "The Circle"}).populate({
//     path: 'rooms',
//     populate: [{
//      path: 'details',
//      model: 'Resident'
//     }]
//  }).exec()



// // // //create person andd add them to found building
// const person = await Resident.create({
//     name: "Jane Doe", 
//     dob: "12/5/1983", 
//     contact: "0714333455518",
//     info: "test", 
//     building: building, 
//     roomnumber: 2,
// })


// // // // //push newly created resident onto building, remove a room from capacity and save
// // // // //find index of objects in rooms and assign to var
// const objIndex = building.rooms.findIndex((obj => obj.room == person.roomnumber))
// console.log(objIndex)
// building.rooms[objIndex].details = person

// await building.save()




//  console.log(building)
// })

// *********************************
// Server Listener
// *********************************
app.listen(PORT, () => console.log(`👂Listening on Port ${PORT}👂`))