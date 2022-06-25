// document.getElementById('update-btn').addEventListener('click', updateEntry)


const removeBuilding = document.querySelectorAll('.remove')
const deleteBuilding = document.querySelectorAll('.delete')

Array.from(removeBuilding).forEach(building => {
    building.addEventListener('click', buildingRemove)
})

Array.from(deleteBuilding).forEach(building => {
    building.addEventListener('click', buildingDelete)
})

// async function updateEntry(){
//     try {
//         const response = await fetch('updateEntry', {
//             method: 'put',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 buildingName: document.getElementsByName('buildingName')[0].value,
//                 buildingRoomNumber: document.getElementsByName('buildingRoomNumber')[0].value,
//                 clientName: document.getElementsByName('clientName')[0].value,
//                 buildingLocation: document.getElementsByName('buildingLocation')[0].value
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     } catch (error) {
//         console.log(`error ${error}`)
//     }
// }




async function buildingRemove(){

    const bName = this.parentNode.parentNode.childNodes[3].innerHTML
    console.log(bName)
    // const nRooms = this.parentNode.childNodes[3].innerText
        try {
            const response = await fetch('/removeBuilding', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'buildingName': bName,
                })
              })
            const data = await response.json()
            console.log(data)
            window.location.reload()

        } catch (error) {
            console.log(`error: ${error}`)
        }
}


// function buildingDeleteAlert(){
//     prompt('Are you sure you want to delete this entry? Once it is deleted it cannot be retrieved')
//         if(prompt() == 'ok'){
//             buildingDelete()
//             }
// }

async function buildingDelete(){

    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
       
    const bName = this.parentNode.parentNode.childNodes[3].innerHTML
    console.log(bName)
        try {
            const response = await fetch('/deleteBuilding', {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'buildingName': bName,
                })
              })
            const data = await response.json()
            console.log(data)
            window.location.reload()

        } catch (error) {
            console.log(`error: ${error}`)
        }
}
}




function pushToArr(num){
    let arr = []
    let sum = 0
    for(let i = 0; i < num;i++){
    arr.push({number: sum+= 1, name: null})
    }
    console.log(arr)
}


const clicked = (e) => {
  e.preventDefault()
confirm('Are you sure you want to submit this form?');
}