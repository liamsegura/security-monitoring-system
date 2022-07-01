    class MainController {
        
    // *********************************
    // BUILDING CONTROLLERS
    // *********************************

//view dashboard and render buildings
        async index(req, res){
            const Building = req.models.Building
            const Resident = req.models.Resident
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})

            // UpdateMODEL.collection.drop()

            Building.find({}, (err, buildings) => {
                if(err){
                res.status(400).send(err)
                }else{
                    res.render('index.ejs', {buildings, update})
                 }
             })
            }

        //view new building form
        async newBuilding(req, res){
            const Change = req.change
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})

            res.render("newBuilding.ejs", {Change, update})
        }

//create building from form
        createBuilding (req, res){
            //global model from server
            const Building = req.models.Building
            //converts number of rooms to object structure used in the building model schema
            function pushToArr(num){
                let arr = []
                let sum = 0
                for(let i = 0; i < num;i++){
                arr.push({room: sum+= 1, details: null})
                }
                return arr
            }
            //assigns obj funtion to var
            const roomNumberArr = pushToArr(req.body.rooms)
            //reasign rooms to newly built object
            req.body.rooms = roomNumberArr

            //creates building using the request body
            Building.create(req.body, (err) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.redirect('/')
                }
            })
        }

//view building on click
        async viewBuilding(req, res){
            //takes param for building id
            const id = req.params.id
            //assigns global building model
            const BuildingMODEL = req.models.Building
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})

            //finds and populates the details property attached to rooms, using the resident model
            const building = await BuildingMODEL.findById(id).populate({
                path: 'rooms',
                populate: [{
                 path: 'details',
                 model: 'Resident'
                }]
             }).exec()
             //renders the building with the building plus the room data
                try {
                    const rooms = await building.rooms
                    res.render('building.ejs', {rooms, building, update})  
                } catch (error) {
                    console.log(error)
                }
                    
            }
        
//opens form to update building
        async updateBuilding(req, res){
            const id = req.params.id
            const Building = req.models.Building
            const building = await Building.findById(id)
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})
                try {
                    console.log(building)
                    res.render('updateBuilding.ejs', {building, update})
                } catch (error) {
                    console.log(error)
                    res.status(400).send(err)
                }
        }   

//sends updated data from form
         async buildingUpdated(req, res){
            const id = req.params.id
            const Building = req.models.Building

            Building.findByIdAndUpdate(id, {$set: req.body}, {new: true})
            .then(result => {
                console.log(result)
                res.redirect(`/building/${id}`)
            })
            .catch(error => console.error(error))
        }

        
//removes building by changing listed to false
        buildingRemove(req, res){
                const id = req.params.id
                const Building = req.models.Building
                Building.findByIdAndUpdate(id, {listed: false}, {new: true}, (err, building) => {
                    if(err){
                        res.status(400).send(err)
                    }else{
                        res.redirect('/')
                    }
                })
            }

//views buildings that are listed as false
            async removedBuildings(req, res){
            const Building = req.models.Building
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})

            const findBuilding = await Building.find({})
                try{
                    res.render('removedBuildings.ejs', {findBuilding, update})
                }catch(err){
                    res.status(400).send(err) 
                }
        }

// //deletes buildings from removed buildings list. deletes from db
//         async buildingDestroy(req, res){
//             const id = req.params.id
//             const Building = req.models.Building
//             const Resident = req.models.Resident

// //finds building and delete
//             //empty arr to push resident ids from building property
//             const residentIds = []
//             const buildingId = await Building.findById(id).populate({
//                 path: 'rooms',
//                 populate: [{
//                  path: 'details',
//                  model: 'Resident'
//                 }]
//              }).exec()

//              //for each loop to loop through the rooms that have _ids and pushes them up
//             await buildingId.rooms.forEach(room => {
//                  if(room.details !== null ){
//                  residentIds.push(room.details._id)
//                  }
//              })
//             console.log(residentIds)

//             //deletes all of the ids from the resident db that were relational to the deleted building
//             await Resident.deleteMany({_id:{$in:residentIds}})

//             Building.findByIdAndDelete(id, (err, buildings) => {
//                 try{
//                     res.redirect('/removedBuildings')
//                 }catch(err){
//                     res.status(400).send(err)
//                 }
//             })
//          }
        

//deletes buildings from removed buildings list. deletes from db
async buildingDestroy(req, res){
    const id = req.params.id
    const Building = req.models.Building
    const Resident = req.models.Resident

    //deletes all residents with the building id
    await Resident.deleteMany(
        {
          building: {
            $in: id
          }
        })
    
    //deletes the building
    await Building.findByIdAndDelete(id)
        try{
            res.redirect('/removedBuildings')
        }catch(err){
            res.status(400).send(err)
        }
 }

    // *********************************
    // RESIDENT CONTROLLERS
    // *********************************


//new resident form, takes params to assign to the newly created resident    
        async newResident(req, res){
            const id = req.params.id
            const roomnumber = req.params.roomNumber
            const Building = req.models.Building
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})
            
            Building.findById(id, (err, building) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    console.log(building.rooms.room)
                    res.render('newResident.ejs', {building, room: roomnumber, update})
                }
            })
        }

//creates a resident, and pushes the data into the relating buildings room array
        async createResident (req, res){
            //global models
            const Resident = req.models.Resident
            const BuildingMODEL = req.models.Building
            //date
            const date = new Date().toLocaleString('en-GB', {timeZone: 'Europe/London'})
            


            //finds and populates room property on the relating building
            const buildingFound = await BuildingMODEL.findById(req.body.building).populate({
                path: 'rooms',
                populate: [{
                 path: 'details',
                 model: 'Resident'
                }]
             }).exec()

            //creates resident using the request body from the form
            const person = await Resident.create(req.body)
            
            //takes the roomnumber from the req.body, which is assigned automatically when you click an empty room
            //finds the index of the building rooms corresponding with the room number
            const objIndex = await buildingFound.rooms.findIndex((obj => obj.room == person.roomnumber))
            console.log(objIndex)
            //adds time stamp for seen to new resident
            person.seen.push({currentlySeen: "IN", seenTime: date})
            console.log(person.seen)
            //assigns the resident to the room corresponding with the index variable 
            buildingFound.rooms[objIndex].details = person
            //saves and redirects back to the building
            await person.save()
            await buildingFound.save()
                    
                    res.redirect(`/building/${req.body.building}`)
                    
                }
            

//views resident
            async viewResident(req, res){
                const id = req.params.id
                const residentModel = req.models.Resident
                const UpdateMODEL = req.models.Update
                const update = await UpdateMODEL.find({})

                const resident = await residentModel.findById(id).populate('building')
                    try {
                        res.render('resident.ejs', {resident, update})  
                    } catch (error) {
                        console.log(error)
                    }
                        
                }


//sends updated data from form
            async residentSeen(req, res){
                const buildingID = req.params.buildingID
                const residentID = req.params.residentID
                const Resident = req.models.Resident    
                const date = new Date().toLocaleString('en-GB', {timeZone: 'Europe/London'})
                
                const wasSeen = req.body.seenBtn

                // function addId(id, array) { if (array.length === 5) { array.pop(); } array.splice(0, 0, id); return array; } 
                const foundResident = await Resident.findByIdAndUpdate(residentID, 
                    { $push: { 
                        seen: {
                              currentlySeen: wasSeen, seenTime: date, 
                            }
                        }
                    }, {new: true})
                try{
                    console.log(foundResident)
                    res.redirect(`/building/${buildingID}`)
                
                }catch{
                    error => console.error(error)
                }}
 
//opens form to update resident
            async updateResident(req, res){
                const id = req.params.id
                const Resident = req.models.Resident
                const resident = await Resident.findById(id)
                const UpdateMODEL = req.models.Update
                const update = await UpdateMODEL.find({})

                    try {
                        console.log(resident)
                        res.render('updateResident.ejs', {resident, update})
                    } catch (error) {
                        console.log(error)
                        res.status(400).send(err)
                    }
            }

//sends updated data from form
            async residentUpdated(req, res){
                const id = req.params.id
                const Resident = req.models.Resident
                Resident.findByIdAndUpdate(id, {$set: req.body}, {new: true})
                .then(result => {
                    console.log(result)
                    res.redirect(`/resident/${id}`)
                })
                .catch(error => console.error(error))
        }


 //removes resident from building list and onto checkout list
        async residentRemove(req, res){
            //gets params
            const residentID = req.params.residentID
            const buildingID = req.params.buildingID
            //gobal models
            const Resident = req.models.Resident
            const Building = req.models.Building
            
            //finds resident and updates listed to false, so it isn't viewable on the building page
            await Resident.findByIdAndUpdate(residentID, {listed: false, checkout: req.body.checkout}, {new: true})
            //finds building
            const foundBuilding = await Building.findById(buildingID)
                    //pushes resident id into checkout array,saves then redirects back to building
                    foundBuilding.checkout.push(residentID)
                    foundBuilding.save()
                    console.log(foundBuilding.checkout)
                    res.redirect(`/building/${buildingID}`)
                }
            

//views checkout page
        async removedResidents(req, res){
            //building param
            const id = req.params.id
            //building global model
            const BuildingMODEL = req.models.Building
            const UpdateMODEL = req.models.Update
            const update = await UpdateMODEL.find({})
           
           
            //finds building by id and populates the checkout array using the Resident model
            const building = await BuildingMODEL.findById(id).populate({
                path: 'checkout',
                model: 'Resident'
             }).exec()
             //renders checkedout array and the building
                try {
                    const checkedout = await building.checkout
                    res.render('checkoutList.ejs', {checkedout, building, update})  
                } catch (error) {
                    
                }
                    
            }
              
                            
            async updateNotif(req, res){
                const Building = req.models.Building
                const UpdateMODEL = req.models.Update
                const update = await UpdateMODEL.find({})


                Building.findById(data.documentKey._id, (err, data) => {
                    if(err){
                    res.status(400).send(err)
                    }else{
                        res.render('partials/navSection.ejs', {data, update})
                    }
                })
            }

            
            //updates
            updates(req, res){
                const update = req.models.Update
                //NEED TO SEPERATE USER SESSION TO SHOW UPDATES FOR EACH USER
                update.deleteMany({}, function(err, delOK) {
                    if (err) throw err;
                    if (delOK) console.log("Collection deleted");
                })
            }
            

}
 
export default MainController