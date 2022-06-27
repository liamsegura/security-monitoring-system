    class MainController {
        
        //Building

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

        newBuilding(req, res){
            res.render("newBuilding.ejs")
        }

        createBuilding (req, res){
            const Building = req.models.Building
            //converts number of rooms to object structure
            function pushToArr(num){
                let arr = []
                let sum = 0
                for(let i = 0; i < num;i++){
                arr.push({room: sum+= 1, details: null})
                }
                return arr
            }
            const roomNumberArr = pushToArr(req.body.rooms)
            req.body.rooms = roomNumberArr

            Building.create(req.body, (err) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.redirect('/')
                }
            })
        }

        async viewBuilding(req, res){
            const id = req.params.id
            const BuildingMODEL = req.models.Building
            const building = await BuildingMODEL.findById(id).populate({
                path: 'rooms',
                populate: [{
                 path: 'details',
                 model: 'Resident'
                }]
             }).exec()
                try {
                    const rooms = await building.rooms
                    res.render('building.ejs', {rooms, building})  
                } catch (error) {
                    
                }
                    
            }
                    
            

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

        buildingDestroy(req, res){
            const id = req.params.id
            const Building = req.models.Building
            Building.findByIdAndDelete(id, (err, buildings) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.redirect('/removedBuildings')
                }
            })
        }
        
        // completedPage(req, res){
        //     const Todo = req.models.Todo
        //     Todo.find({}, (err, todos) => {
        //         if(err){
        //         res.status(400).send(err)
        //         }else{
        //             res.render('completed.ejs', {todos})
        //         }
        //     })
        // }
            
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

        async createResident (req, res){
            const Resident = req.models.Resident
            const BuildingMODEL = req.models.Building
            const date = new Date().toLocaleString()

            const buildingFound = await BuildingMODEL.findById(req.body.building).populate({
                path: 'rooms',
                populate: [{
                 path: 'details',
                 model: 'Resident'
                }]
             }).exec()

            
            const person = await Resident.create(req.body)
            
            const objIndex = await buildingFound.rooms.findIndex((obj => obj.room == person.roomnumber))
            console.log(objIndex)
            person.seen.push(date)
            console.log(person.seen)
            buildingFound.rooms[objIndex].details = person
            await person.save()
            await buildingFound.save()

                    res.redirect(`/building/${req.body.building}`)
                }
            

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

            complete(req, res){
                const id = req.params.id
                const Resident = req.models.Resident
                Resident.findByIdAndUpdate(id, {
                    $set: req.body
                }, {new: true} .then(result => {
                    console.log(result)
                    res.json('Success')
                }))
                .catch(error => console.error(error))

        }

            //callback
        // residentRemove(req, res){
        //     const residentID = req.params.residentID
        //     const buildingID = req.params.buildingID
        //     const Resident = req.models.Resident
        //     const Building = req.models.Building
        //     Resident.findByIdAndUpdate(residentID, {listed: false}, {new: true}, (err, resident) => {
        //         if(err){
        //             res.status(400).send(err)
        //         }else{
        //             const foundBuilding = Building.findById(buildingID)
        //             // foundBuilding.checkout.push(residentID)
        //             // foundBuilding.save()
        //             console.log(foundBuilding.name)
        //             res.redirect(`/building/${buildingID}`)
        //         }
        //     })
           
        // }

          async residentRemove(req, res){
            const residentID = req.params.residentID
            const buildingID = req.params.buildingID
            const Resident = req.models.Resident
            const Building = req.models.Building
            
            await Resident.findByIdAndUpdate(residentID, {listed: false}, {new: true})
            const foundBuilding = await Building.findById(buildingID)
                    foundBuilding.checkout.push(residentID)
                    foundBuilding.save()
                    console.log(foundBuilding.checkout)
                    res.redirect(`/building/${buildingID}`)
                }
          

  
        async removedResidents(req, res){
            const id = req.params.id
            const BuildingMODEL = req.models.Building
            const building = await BuildingMODEL.findById(id).populate({
                path: 'checkout',
                model: 'Resident'
             }).exec()
           
                try {
                    const checkedout = await building.checkout
                    res.render('checkoutList.ejs', {checkedout, building})  
                } catch (error) {
                    
                }
                    
            }
              
                            

}
 
export default MainController