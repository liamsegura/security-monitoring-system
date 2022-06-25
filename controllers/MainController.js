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

            Building.create(req.body, (err, todo) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.redirect('/')
                }
            })
        }

        viewBuilding(req, res){
            const id = req.params.id
            const Building = req.models.Building
            Building.findById(id, (err, building) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    let rooms = building.rooms
                    res.render('building.ejs', {rooms, building})
                }
            })
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
            console.log(id)
            res.render("newResident.ejs", {id: id})
            }
        //     const id = req.params.id
        //     const Building = req.models.Building
        //     Building.findById(id, (err, building) => {
        //         if(err){
        //             res.status(400).send(err)
        //         }else{
        //             console.log(id)
        //             res.render('newResident.ejs', {id, building})
        //         }
        //     })
        // }


}
 
export default MainController