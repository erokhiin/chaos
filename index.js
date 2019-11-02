;(function draw() {
  const canvas = document.querySelector('canvas')
  canvas.width = canvasWidth = window.innerWidth - 100
  canvas.height = canvasHeight = window.innerHeight - 100
  const ctx = canvas.getContext('2d')
  const canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)

  function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min
  }

  function drawPixel(x, y) {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, Math.PI * 2, true)
    ctx.fill()
  }

  function render(point) {
    ctx.fillRect(point.x, point.y, 1, 1)
    drawPixel(point.x, point.y, 255, 0, 0, 255)
  }

  const side = Math.min(canvasWidth, canvasHeight)

  const A = { x: 0, y: side }
  const B = { x: side / 2, y: 0 }
  const C = { x: side, y: side }
  const basePoints = [A, B, C]

  function pointBetween(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  }

  function takeRandomBasePoint() {
    return basePoints[getRandomInt(0, basePoints.length - 1)]
  }

  function generateRandomPoint() {
    return { x: getRandomInt(0, 100), y: getRandomInt(0, 100) }
  }

  let currentI = 0
  let inThisLoop = 0
  let currPoint = generateRandomPoint()
  function doTriangle(end) {
    currPoint = pointBetween(currPoint, takeRandomBasePoint())
    render(currPoint)

    if (++currentI < end) {
      if (++inThisLoop < 5000) {
        doTriangle(end)
      } else {
        inThisLoop = 0
        window.setTimeout(() => doTriangle(end), 0)
      }
    }
  }

  doTriangle(Infinity)
  console.log('end')
})()
