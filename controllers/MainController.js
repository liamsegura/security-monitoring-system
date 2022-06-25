    class MainController {
        
        example(req, res){
            res.render("example.ejs", {
                text: "This is an example API Route"
            })
        }

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

        new(req, res){
            res.render("new.ejs")
        }

        create(req, res){
            const Todo = req.models.Todo
            req.body.completed = false
            Todo.create(req.body, (err, todo) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.redirect('/')
                }
            })
        }

        show(req, res){
            const id = req.params.id
            const Todo = req.models.Todo
            Todo.findById(id, (err, todo) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    res.render('show.ejs', {todo})
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
        
        completedPage(req, res){
            const Todo = req.models.Todo
            Todo.find({}, (err, todos) => {
                if(err){
                res.status(400).send(err)
                }else{
                    res.render('completed.ejs', {todos})
                }
            })
        }
            


}
 
export default MainController