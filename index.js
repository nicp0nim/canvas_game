const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y =  y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, veloocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.veloocity = veloocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.veloocity.x
        this.y = this.y + this.veloocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, veloocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.veloocity = veloocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.veloocity.x
        this.y = this.y + this.veloocity.y
    }
}

const x = canvas.width / 2
const y = canvas.height / 2
const player = new Player(x, y, 20, 'grey')
const projectiles = []
const enemies = []

function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (30 - 5) + 5
        const color = 'red'

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
    
        const veloocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(
            x,
            y,
            radius,
            color,
            veloocity
        ))
    }, 2000)
}

let animationID

function animate() {
    animationID = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((projectile, index) => {
        projectile.update()

        if (projectile.x - projectile.radius < 0) {
            setTimeout(() => {
                console.log('rm')
                projectiles.splice(index, 1)
            }, 0);
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationID)
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {    
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0);
            }
        })
    })
}

addEventListener('click', (event) => {
    console.log(projectiles)
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    const veloocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'black',
        veloocity
    ))
})

spawnEnemy()
animate()