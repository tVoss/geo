const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const ToRadians = Math.PI / 180
const Bodies = d => ({
    Sun: {
        N: 0,
        i: 0,
        w: (282.9404 + 4.70935 * Math.pow(10, -5) * d) * ToRadians,
        a: 1,
        e: (0.016709 - 1.151 * Math.pow(10, -9) * d),
        M: (356.0470 + 0.9586002585 * d) * Math.PI / 180
    },
    Mercury: {
        N: (48.3313 + 3.24587 * Math.pow(10, -5) * d) * ToRadians,
        i: (7.0047 + 5.00 * Math.pow(10, -8) * d) * ToRadians,
        w: (29.1241 + 1.01444 * Math.pow(10, -5) * d) * ToRadians,
        a: 0.387098,
        e: (0.205635 + 5.59 * Math.pow(10, -10) * d),
        M: (168.6562 + 4.0923344368 * d) * ToRadians,
    },
    Venus: {
        N: (76.6799 + 2.4659 * Math.pow(10, -5) * d) * ToRadians,
        i: (3.3946 + 2.75 * Math.pow(10, -8) * d) * ToRadians,
        w: (54.8910 + 1.38374 * Math.pow(10, -5) * d) * ToRadians,
        a: 0.72333,
        e: (0.006773 - 1.302 * Math.pow(10, -9) * d),
        M: (48.0052 + 1.6021302244 * d) * ToRadians
    },
    Mars: {
        N: (49.5574 + 2.11081 * Math.pow(10, -5) * d) * ToRadians,
        i: (1.8497 - 1.78 * Math.pow(10, -8) * d) * ToRadians,
        w: (286.5016 + 2.92961 * Math.pow(10, -5) * d) * ToRadians,
        a: 1.523688,
        e: (0.093405 + 2.516 * Math.pow(10, -9) * d),
        M: (18.6021 + 0.5240207766 * d) * ToRadians
    }
})

const scale = 100
const earth = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

function drawBackground() {
    ctx.fillStyle = '#11111111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc((x * scale) + earth.x, -(y * scale) + earth.y, r, 0, 2 * Math.PI)
    ctx.fill()
}

function getDay(date) {
    // const y = date.getUTCFullYear()
    // const m = date.getUTCMonth()
    // const d = date.getUTCDate()
    // const day = 367 * y - 7 * Math.floor((y + Math.floor((m + 9) / 12)) / 4) + 275 * Math.floor(m / 9) + d - 730530
    
    const day = 1.0 + (date.getTime() - Date.UTC(2000, 0, 1)) / (3600.0 * 24.0 * 1000.0)
    
    const h = date.getUTCHours();
    const M = date.getUTCMinutes();
    const s = date.getUTCSeconds();
    const percent = h / 24 + M / 24 / 60 + s / 24 / 60 / 60
    
    return day + percent
}

function getSunPos(sun) {
    // eccentricity anomaly 
    const E = sun.M + sun.e * Math.sin(sun.M) * (1 + sun.e * Math.cos(sun.M))

    const xv = Math.cos(E) - sun.e
    const yv = Math.sqrt(1 - sun.e * sun.e) * Math.sin(E)

    const v = Math.atan2(yv, xv)
    const r = Math.sqrt(xv * xv + yv * yv)

    const lonsun = v + sun.w
    const x = -r * Math.cos(lonsun)
    const y = -r * Math.sin(lonsun)

    return { x, y }
}

function getPlanetPos(p, sunPos) {
    const E = p.M + p.e * Math.sin(p.M) * (1 + p.e * Math.cos(p.M))
    const xv = p.a * (Math.cos(E) - p.e)
    const yv = p.a * (Math.sqrt(1 - p.e * p.e) * Math.sin(E))
    const v = Math.atan2(yv, xv)
    const r = Math.sqrt(xv * xv + yv * yv)

    const xh = r * (Math.cos(p.N) * Math.cos(v + p.w) - Math.sin(p.N) * Math.sin(v + p.w) * Math.cos(p.i))
    const yh = r * (Math.sin(p.N) * Math.cos(v + p.w) + Math.cos(p.N) * Math.sin(v + p.w) * Math.cos(p.i))
    const zh = r * (Math.sin(v + p.w) * Math.sin(p.i))

    const lonecl = Math.atan2(yh, xh)
    const latecl = Math.atan2(zh, Math.sqrt(xh * xh + yh * yh))

    const xx = r * Math.cos(lonecl) * Math.cos(latecl)
    const yy = r * Math.sin(lonecl) * Math.cos(latecl)

    const x = xx + sunPos.x
    const y = yy + sunPos.y

    return { x, y }
}

function tick(timestamp) {
    const date = new Date()
    const day = getDay(date)

    updateDateText(date)
    updateDayText(day)

    const bodies = Bodies(day)
    const earthPos = {x: 0, y: 0}
    const sunPos = getSunPos(bodies.Sun)
    const mercPos = getPlanetPos(bodies.Mercury, sunPos)
    const venusPos = getPlanetPos(bodies.Venus, sunPos)
    const marsPos = getPlanetPos(bodies.Mars, sunPos)

    drawBackground()
    drawCircle(earthPos.x, earthPos.y, 5, '#00ff00')
    drawCircle(sunPos.x, sunPos.y, 10, '#ffff00')
    drawCircle(mercPos.x, mercPos.y, 2, '#0000ff')
    drawCircle(venusPos.x, venusPos.y, 4, '#ff7700')
    drawCircle(marsPos.x, marsPos.y, 3, '#ff0000')

    requestAnimationFrame(tick)
}

(() => {
    requestAnimationFrame(tick)
})()

const datettimeSpan = document.getElementById('datettime')
function updateDateText(date) {
    datettimeSpan.innerText = date.toString()
}
const daySpan = document.getElementById('day')
function updateDayText(day) {
    daySpan.innerText = 'Current Day: ' + day
}

// http://www.stjarnhimlen.se/comp/ppcomp.html