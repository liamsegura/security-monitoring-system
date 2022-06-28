    class MainController {
        
    // *********************************
    // BUILDING CONTROLLERS
    // *********************************

//view dashboard and render buildings
        index(req, res){
            const Building = req.models.Building
            Building.find({}, (err, buildings) => {
                if(err){
                res.status(400).send(err)
                }else{
                    res.render('index.ejs', {buildings})
                }
            })
        }

        //view new building form
        newBuilding(req, res){
            res.render("newBuilding.ejs")
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
                    res.render('partials/navSection.ejs', {test: req.body})
                }
            })
        }

//view building on click
        async viewBuilding(req, res){
            //takes param for building id
            const id = req.params.id
            //assigns global building model
            const BuildingMODEL = req.models.Building
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
                    res.render('building.ejs', {rooms, building})  
                } catch (error) {
                    console.log(error)
                }
                    
            }
        
//opens form to update building
        async updateBuilding(req, res){
            const id = req.params.id
            const Building = req.models.Building
            const building = await Building.findById(id)
                try {
                    console.log(building)
                    res.render('updateBuilding.ejs', {building})
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
        removedBuildings(req, res){
            const Building = req.models.Building
            Building.find({}, (err, buildings) => {
                if(err){
                res.status(400).send(err)
                }else{
                    res.render('removedBuildings.ejs', {buildings})
                }
            })
        }

//deletes buildings from removed buildings list. deletes from db
        async buildingDestroy(req, res){
            const id = req.params.id
            const Building = req.models.Building
            const Resident = req.models.Resident

//finds building and delete
            //empty arr to push resident ids from building propertie
            const residentIds = []
            const buildingId = await Building.findById(id).populate({
                path: 'rooms',
                populate: [{
                 path: 'details',
                 model: 'Resident'
                }]
             }).exec()

             //for each loop to loop through the rooms that have _ids and pushes them up
            await buildingId.rooms.forEach(room => {
                 if(room.details !== null){
                 residentIds.push(room.details._id)
                 }
             })
            console.log(residentIds)

            //deletes all of the ids from the resident db that were relational to the deleted building
            await Resident.deleteMany({_id:{$in:residentIds}})

            Building.findByIdAndDelete(id, (err, buildings) => {
                try{
                    res.redirect('/removedBuildings')
                }catch(err){
                    res.status(400).send(err)
                }
            })
         }
        


    // *********************************
    // BUILDING CONTROLLERS
    // *********************************


//new resident form, takes params to assign to the newly created resident    
        newResident(req, res){
            const id = req.params.id
            const roomnumber = req.params.roomNumber
            const Building = req.models.Building
            
            Building.findById(id, (err, building) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    console.log(building.rooms.room)
                    res.render('newResident.ejs', {building, room: roomnumber})
                }
            })
        }

//creates a resident, and pushes the data into the relating buildings room array
        async createResident (req, res){
            //global models
            const Resident = req.models.Resident
            const BuildingMODEL = req.models.Building
            //date
            const date = new Date().toLocaleString()

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
            person.seen.push(date)
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
                const resident = await residentModel.findById(id).populate('building')
                    try {
                        res.render('resident.ejs', {resident})  
                    } catch (error) {
                        console.log(error)
                    }
                        
                }

//opens form to update resident
            async updateResident(req, res){
                const id = req.params.id
                const Resident = req.models.Resident
                const resident = await Resident.findById(id)
                    try {
                        console.log(resident)
                        res.render('updateResident.ejs', {resident})
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
            //finds building by id and populates the checkout array using the Resident model
            const building = await BuildingMODEL.findById(id).populate({
                path: 'checkout',
                model: 'Resident'
             }).exec()
             //renders checkedout array and the building
                try {
                    const checkedout = await building.checkout
                    res.render('checkoutList.ejs', {checkedout, building})  
                } catch (error) {
                    
                }
                    
            }
              
                            





}
 
export default MainController