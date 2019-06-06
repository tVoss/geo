const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const scale = 100

const mercuryOffset = 6;
const mercuryDist = 0.387 * scale;
const mercuryOrbit = 29 / 7;

const venusDist = 0.723 * scale;
const venusOrbit = 13 / 8;

const earthDist = 1 * scale; // million

// Distance from earth in units of earth's distance from the sun
const moonDist = 0.3 * scale;
const moonOrbit = 1

// Distance from sun compared to earth
const marsDist = 1.523 * scale;
// Angular velocity compared to earth
const marsOrbit = 8 / 15;

const earth = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

function drawBackground() {
    ctx.fillStyle = '#11111122'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
}

function drawEarth() {
    drawCircle(earth.x, earth.y, 5, '#0000ff')
}

function drawMoon() {
    const moon = getPoint(0, moonDist, earth);
    drawCircle(moon.x, moon.y, 1, '#555555')
}

let sun = {
    x: 0,
    y: earthDist
}
let sunTheta = 0

function getPoint(theta, scale, offset) {
    return {
        x: Math.sin(-theta) * scale + offset.x,
        y: Math.cos(-theta) * scale + offset.y
    }
}

function drawSun(date) {

    //const percent = date.getHours() / 24 + date.getMinutes() / 24 / 60 + date.getSeconds() / 24 / 60 / 60;
    //sunTheta = percent * Math.PI * 2;
    sunTheta = Math.PI
    sun = getPoint(sunTheta, earthDist, earth)
    drawCircle(sun.x, sun.y, 10, '#ffff00')
}

function drawMercury(date) {

    const merc = getPoint(mercuryOffset + sunTheta, mercuryDist, sun)
    drawCircle(merc.x, merc.y, 1, '#ff7700')
}

function drawVenus(time) {
    const venus = getPoint(time * venusOrbit + sunTheta, venusDist, sun) 
    drawCircle(venus.x, venus.y, 3, '#00ff00')
}

function drawMars(time) {
    const mars = getPoint(time * marsOrbit + sunTheta, marsDist, sun)
    drawCircle(mars.x, mars.y, 2, '#ff0000')
}


const datettimeSpan = document.getElementById('datettime')
function updateDateText(date) {
    datettimeSpan.innerText = date.toString()
}

function tick(time) {
    time = time / 1000

    const date = new Date()

    drawBackground()
    drawEarth();
    drawMoon();
    drawSun(date);
    drawMercury(time / 100)
    drawVenus(time / 100)
    drawMars(time / 100)

    updateDateText(date)
    

    requestAnimationFrame(tick)
}

requestAnimationFrame(tick)