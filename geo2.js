const svg = document.getElementById('geo')

let scale = 100
const origin = { //origin of axes
    x: 350,
    y: 350
}
const angularFreq = Math.PI * 2 / 500
const orbitWidth = 0.75

function drawPolyline(period, distance, mint, maxt, width, color) {
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
    polyline.setAttribute("stroke", color)
    polyline.setAttribute("stroke-width", width)
    polyline.setAttribute("fill", "transparent")

    svg.appendChild(polyline)

    drawOrbit(period, distance, mint, maxt, polyline)
}

function drawOrbit(period, distance, mint, maxt, element) {
    mint = mint / angularFreq
    maxt = maxt / angularFreq
    var points = []
    var x, y
    for (var t = mint; t < maxt + 2; t++) {
        x = Math.cos(angularFreq * t) * scale + Math.cos(period * angularFreq * t) * distance * scale + origin.x
        y = Math.sin(angularFreq * t) * scale + Math.sin(period * angularFreq * t) * distance * scale + origin.y
        points.push([x, y])
    }

    element.setAttribute("points", points.join(" "))
}

const mercFactor = Math.PI * 14 / 44;
for (let i = 0; i < 22; i++) {
    const min = mercFactor * i * 2
    const max = min + mercFactor

    // Mercury
    //drawPolyline(29 / 7, 0.387, min, max, orbitWidth, 'black');
}

const venusFactor = 16 * Math.PI / 10
for (let i = 0; i < 5; i++) {
    const min = venusFactor * i * 2
    const max = min + venusFactor

    //drawPolyline(13 / 8, 0.723, min, max, orbitWidth, 'black')
}

const marsFactor = 30 * Math.PI / 14
for (let i = 0; i < 7; i++) {
    const min = marsFactor * i * 2
    const max = min + marsFactor

    //drawPolyline(8 / 15, 1.523, min, max, orbitWidth, 'black')
}

//drawPolyline(1, 0, 0, 2 * Math.PI, 20, 'black')

for (let i = 0; i < 7; i++) {
    const min = marsFactor * (i * 2 + 1)
    const max = min + marsFactor

    //drawPolyline(8 / 15, 1.523, min, max, orbitWidth, 'black')
}
for (let i = 0; i < 5; i++) {
    const min = venusFactor * (i * 2 + 1)
    const max = min + venusFactor

    //drawPolyline(13 / 8, 0.723, min, max, orbitWidth, 'black')
}
for (let i = 0; i < 22; i++) {
    const min = mercFactor * (i * 2 + 1)
    const max = min + mercFactor

    // Mercury
    //drawPolyline(29 / 7, 0.387, min, max, orbitWidth, 'black');
}

// Moon
scale = scale * 0.1
drawPolyline(1, 0, 0, 2 * Math.PI, 0.5, 'black')