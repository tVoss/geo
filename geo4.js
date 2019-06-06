const app = new PIXI.Application()
const graphics = new PIXI.Graphics()
app.stage.addChild(graphics)
document.getElementById('geo').appendChild(app.view)

const center = { x: app.renderer.width / 2, y: app.renderer.height / 2}
app.stage.x = center.x
app.stage.y = center.y
const scale = 100
function drawCircle(x, y, r, c) {
    graphics.beginFill(c)
    graphics.drawCircle(x * 100, -y * 100, r)
    graphics.endFill()
}

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

function getDay(date) {
    const day = 1.0 + (date.getTime() - Date.UTC(2000, 0, 1)) / (3600.0 * 24.0 * 1000.0)

    const h = date.getHours();
    const M = date.getMinutes();
    const s = date.getSeconds();
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

    return { x, y, lon: lonsun }
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

const datettimeSpan = document.getElementById('datettime')
function updateDateText(date) {
    datettimeSpan.innerText = date.toString()
}
const daySpan = document.getElementById('day')
function updateDayText(day) {
    daySpan.innerText = 'Current Day: ' + day
}

function tick(timestamp) {
    const date = new Date()
    const day = getDay(date)

    updateDateText(date)
    updateDayText(day)

    const bodies = Bodies(day)
    const earthPos = { x: 0, y: 0 }
    const sunPos = getSunPos(bodies.Sun)
    const mercPos = getPlanetPos(bodies.Mercury, sunPos)
    const venusPos = getPlanetPos(bodies.Venus, sunPos)
    const marsPos = getPlanetPos(bodies.Mars, sunPos)

    drawCircle(earthPos.x, earthPos.y, 5, 0x00ff00)
    drawCircle(sunPos.x, sunPos.y, 10, 0xffff00)
    drawCircle(mercPos.x, mercPos.y, 2, 0x0000ff)
    drawCircle(venusPos.x, venusPos.y, 4, 0xff7700)
    drawCircle(marsPos.x, marsPos.y, 3, 0xff0000)

    const dayRads = -(day - Math.floor(day)) * Math.PI * 2
    app.stage.rotation = sunPos.lon - Math.PI / 2 + dayRads
    app.render()

    requestAnimationFrame(tick)
}

requestAnimationFrame(tick)