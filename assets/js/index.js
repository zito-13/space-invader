const grid = [
    ["", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ""],
    ["", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ""],
    ["", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "o", "", "", "", "", "", "", ""]
]
const gridwin = [
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "o", "", "", "", "", "", "", ""]
]

const zone = document.querySelector('main')
let intershoot = null
let intermoove = null
document.addEventListener('keyup', (e) => {
    console.log(e.key);

    if (e.key == "ArrowLeft") {
        mooveplayer("left")
    } else if (e.key == "ArrowRight") {
        mooveplayer('right')
    } else if (e.key == " ") {
        shoot()
    }

})

function game() {
    zone.innerHTML = ""
    grid.forEach((row, i) => {
        const div = document.createElement("div")
        div.classList.add('ligne')
        zone.appendChild(div)

        row.forEach((cell, j) => {

            const cellcontainer = document.createElement('div')
            cellcontainer.classList.add('cell')
            let img = document.createElement('img')
            switch (cell) {
                case "x":
                    img.src = "./assets/images/chasseurtie-removebg-preview.png"
                    cellcontainer.appendChild(img)
                    break
                case "o":
                    cellcontainer.appendChild(img)
                    img.src = "./assets/images/millenniumfalcon.png"
                    break
                case "i":
                    cellcontainer.appendChild(img)
                    img.src = "./assets/images/tire.png"
                    break
                default:
                    img.src = ""
                    break
            }



            div.appendChild(cellcontainer);
        });
    });

}


function mooveplayer(direction) {
    const ground = grid[grid.length - 1]


    let position = ground.indexOf("o")

    if (direction == "left") {

        grid[grid.length - 1][position] = ""
        grid[grid.length - 1][position - 1] = "o"
    } else if (direction == "right") {


        grid[grid.length - 1][position] = ""
        grid[grid.length - 1][position + 1] = "o"
    }
    game()
    checkwin()

}

function menu() {
    zone.innerHTML = ""
    const zonemenu = document.createElement('div')
    zonemenu.classList.add = "menuzone"
    zone.appendChild(zonemenu)

    const img1 = document.createElement("img")
    img1.classList = "titre"
    img1.src = "./assets/images/BTNPLAY.png"

    zonemenu.appendChild(img1)
    img1.addEventListener('click', function () {
        game();
        mooveennemie()
    })
}

function mooveennemie() {

   
    //de haut en bas

        for (let i = grid.length - 2; i >= 0; i--) {
            for (let j = 0; j < grid[i].length; j++) {

                if (grid[i][j] === "x") {

                    grid[i][j] = ""
                    grid[i + 1][j] = "x"

                }

            }
        }
        game()
        //de gauche a droite
    
}


function interenemi() {
    interenemi = setInterval(() => {
        mooveennemie()
    }, 4000);
}


function shoot() {
    clearInterval(intershoot)
    const ground = grid[grid.length - 1]
    let position = ground.indexOf("o")
    grid[grid.length - 2][position] = "i"


   intershoot = setInterval(() => {

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i - 1] && grid[i - 1][j] == "x" && grid[i][j] == "i") {
                    grid[i][j] = ""
                    grid[i - 1][j] = ""
                }
                if (grid[i][j] === "i") {

                    grid[i][j] = ""
                    grid[i - 1][j] = "i"


                }


            }
        }
        game()



    }, 300)
    game()
    
}



function checkwin() {

    let enemyLeft = false

    for (let row of grid) {
        if (row.includes("x")) {
            enemyLeft = true
        }
    }

    if (!enemyLeft) {
        zone.innerHTML = ""
        
        
    }
    
}
menu()
interenemi()