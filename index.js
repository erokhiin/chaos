function renderUi({ points, removePoint }) {
  const uiEl = document.querySelector('.ui')
  uiEl.innerHTML = ''
  points.forEach((point, i) => {
    const pointEl = document.createElement('div')
    pointEl.className = 'point'
    pointEl.innerHTML = `
      <div>x: ${point.x.toFixed(2)}</div>
      <div>y: ${point.y.toFixed(2)}</div>
    `
    pointEl.addEventListener('click', () => {
      removePoint(i, point)
    })
    uiEl.appendChild(pointEl)
  })
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min
}

function drawPixel(ctx, x, y) {
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(x, y, 1, 0, Math.PI * 2, true)
  ctx.fill()
}

;(function draw() {
  const canvas = document.querySelector('canvas')
  const basePoints = []

  canvas.width = canvasWidth = window.innerWidth - 100
  canvas.height = canvasHeight = window.innerHeight - 100
  const ctx = canvas.getContext('2d')

  function render(point) {
    ctx.fillRect(point.x, point.y, 1, 1)
    drawPixel(ctx, point.x, point.y, 255, 0, 0, 255)
  }

  const side = Math.min(canvasWidth, canvasHeight)

  renderUi({
    points: basePoints,
    removePoint: (i, point) => {
      basePoints.splice(i, 1)
    },
  })

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
  let timeout
  function doTriangle(end) {
    if (basePoints.length < 3) return
    currPoint = pointBetween(currPoint, takeRandomBasePoint())
    render(currPoint)

    if (++currentI < end) {
      if (++inThisLoop < 5000) {
        doTriangle(end)
      } else {
        inThisLoop = 0
        timeout = window.setTimeout(() => doTriangle(end), 0)
      }
    }
  }
  canvas.addEventListener('click', e => {
    const basePoint = { x: e.clientX, y: e.clientY }
    basePoints.push(basePoint)
    restart()
  })
  function restart() {
    window.clearTimeout(timeout)
    doTriangle(30000)
  }
  console.log('end')
})()
