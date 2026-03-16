const grid = [
    ["", "", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "", ""],
    ["", "", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "", ""],
    ["", "", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "o", "", "", "", "", "", "", ""]
];

const zone = document.querySelector('main')
let intershoot = null
let intermoove = null
let interShootEnnemi = null
let score = 0
let directionEnnemis = "right"

// Gestion clavier
document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft") mooveplayer("left")
    if (e.key === "ArrowRight") mooveplayer("right")
    if (e.key === " ") shoot()
});

// Affichage du jeu
function game() {
    zone.innerHTML = ""
    grid.forEach(row => {
        const div = document.createElement("div")
        div.classList.add("ligne")
        zone.appendChild(div)

        row.forEach(cell => {
            const cellContainer = document.createElement("div")
            cellContainer.classList.add("cell")
            const img = document.createElement("img")

            switch(cell) {
                case "x":
                    img.src = "./assets/images/chasseurtie-removebg-preview.png"
                    break
                case "o":
                    img.src = "./assets/images/millenniumfalcon.png"
                    break
                case "i":
                    img.src = "./assets/images/tire.png"
                    break
                case "j":
                    img.src = "./assets/images/tireenemie.png"
                    break
            }

            if(img.src) cellContainer.appendChild(img)
            div.appendChild(cellContainer)
        })
    })
}

// Déplacement joueur
function mooveplayer(direction) {
    const ground = grid[grid.length - 1]
    const pos = ground.indexOf("o")

    if (direction === "left" && pos > 0) {
        ground[pos] = ""
        ground[pos - 1] = "o"
    }

    if (direction === "right" && pos < ground.length - 1) {
        ground[pos] = ""
        ground[pos + 1] = "o"
    }

    game()
    if (!checkDefaite()) checkwin()
}

// Menu principal
function menu() {
    clearInterval(intermoove)
    clearInterval(intershoot)
    clearInterval(interShootEnnemi)

    zone.innerHTML = ""
    score = 0
    updatescore()

    const zonemenu = document.createElement("div")
    zonemenu.classList.add("menuzone")
    zone.appendChild(zonemenu)

    const imgPlay = document.createElement("img")
    imgPlay.classList.add("titre")
    imgPlay.src = "./assets/images/BTNPLAY.png"
    zonemenu.appendChild(imgPlay)

    imgPlay.addEventListener("click", () => {
        game()

        // Déplacement ennemis
        intermoove = setInterval(mooveennemie, 500)
        // Tir des ennemis
        interShootEnnemi = setInterval(() => {
            shootEnnemi()
            moveShootEnnemi()
        }, 700)
    })
}

// Déplacement ennemis gauche ↔ droite + descente
function mooveennemie() {
    let changeDir = false
    // Vérifier si un ennemi touche le bord
    for (let i = 0; i < grid.length - 1; i++) {
        if (directionEnnemis === "right" && grid[i][grid[i].length - 1] === "x") changeDir = true
        if (directionEnnemis === "left" && grid[i][0] === "x") changeDir = true
    }

    // Changer de direction + descendre si nécessaire
    if (changeDir) {
        directionEnnemis = directionEnnemis === "right" ? "left" : "right"

        for (let i = grid.length - 2; i >= 0; i--) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === "x") {
                    grid[i][j] = ""
                    grid[i + 1][j] = "x"
                }
            }
        }
    } else {
        // Déplacement latéral
        if (directionEnnemis === "right") {
            for (let i = grid.length - 2; i >= 0; i--) {
                for (let j = grid[i].length - 2; j >= 0; j--) {
                    if (grid[i][j] === "x") {
                        grid[i][j] = ""
                        grid[i][j + 1] = "x"
                    }
                }
            }
        } else if (directionEnnemis === "left") {
            for (let i = grid.length - 2; i >= 0; i--) {
                for (let j = 1; j < grid[i].length; j++) {
                    if (grid[i][j] === "x") {
                        grid[i][j] = ""
                        grid[i][j - 1] = "x"
                    }
                }
            }
        }
    }

    game()
    if (!checkDefaite()) checkwin()
}

// Tir joueur
function shoot() {
    clearInterval(intershoot)
    const ground = grid[grid.length - 1]
    const pos = ground.indexOf("o")
    grid[grid.length - 2][pos] = "i"

    intershoot = setInterval(() => {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === "i") {
                    if (grid[i - 1] && grid[i - 1][j] === "x") {
                        grid[i][j] = ""
                        grid[i - 1][j] = ""
                        score += 10
                        updatescore()
                    } else {
                        grid[i][j] = ""
                        if (i - 1 >= 0) grid[i - 1][j] = "i"
                    }
                }
            }
        }
        game()
    }, 100)
}

// Tir des ennemis
function shootEnnemi() {
    let ennemis = []
    for (let i = 0; i < grid.length - 1; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "x") ennemis.push({ i, j })
        }
    }
    if (ennemis.length === 0) return

    const tir = ennemis[Math.floor(Math.random() * ennemis.length)]
    const { i, j } = tir

    if (i + 1 < grid.length && grid[i + 1][j] === "") grid[i + 1][j] = "j"
}

function moveShootEnnemi() {
    for (let i = grid.length - 2; i >= 0; i--) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "j") {
                if (grid[i + 1][j] === "o") {
                    defaite()
                    return
                }
                grid[i][j] = ""
                if (i + 1 < grid.length) grid[i + 1][j] = "j"
            }
        }
    }
    game()
    checkDefaite()
}

// Vérification de défaite
function checkDefaite() {
    const playerRow = grid.length - 1
    const playerPos = grid[playerRow].indexOf("o")

    // Collision avec un tir ennemi uniquement si il touche le joueur
    if (playerPos !== -1 && grid[playerRow][playerPos] === "j") {
        defaite()
        return true
    }

    // Collision avec un ennemi
    if (grid[playerRow].includes("x")) {
        defaite()
        return true
    }

    // Ennemi atteint la ligne juste au-dessus du joueur
    if (grid[playerRow - 1].includes("x")) {
        defaite()
        return true
    }

    return false
}

// Score
function updatescore() {
    const scoreboard = document.getElementById("scoreboard")
    scoreboard.textContent = "Score : " + score
}

// Vérification victoire
function checkwin() {
    const enemyLeft = grid.some(row => row.includes("x"))
    if (!enemyLeft || score >= 360) victoire()
}

// Victoire
function victoire() {
    clearInterval(interShootEnnemi)
    clearInterval(intermoove)
    clearInterval(intershoot)

    zone.innerHTML = ""

    const msg = document.createElement("h2")
    msg.classList.add("victoire")
    msg.textContent = "Victoire !"
    zone.appendChild(msg)

    const btnRestart = document.createElement("button")
    btnRestart.textContent = "Restart"
    zone.appendChild(btnRestart)

    btnRestart.addEventListener("click", menu)
}

// Défaite
function defaite() {
    clearInterval(interShootEnnemi)
    clearInterval(intermoove)
    clearInterval(intershoot)

    zone.innerHTML = ""

    const msg = document.createElement("h2")
    msg.classList.add("defaite")
    msg.textContent = "Défaite !"
    zone.appendChild(msg)

    const btnRestart = document.createElement("button")
    btnRestart.textContent = "Restart"
    zone.appendChild(btnRestart)

    btnRestart.addEventListener("click", function (){
        menu()
    })
}

// Lancement du menu
menu()