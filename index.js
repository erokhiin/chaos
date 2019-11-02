function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min
}

function drawPixel(ctx, x, y) {
  const r = getRandomInt(100, 255)
  const g = getRandomInt(100, 255)
  const b = getRandomInt(100, 255)
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
  ctx.beginPath()
  ctx.arc(x, y, 1, 0, Math.PI * 2, true)
  ctx.fill()
}

;(function draw() {
  let isSliderInited = false
  let speed = 10
  const basePoints = []

  function renderUi() {
    if (!isSliderInited) {
      let slider = document.querySelector('.speed input')

      slider.addEventListener('change', (e) => {
        speed = Number(e.target.value)
      })

      isSliderInited = true
    }
  
    const uiEl = document.querySelector('.ui')
    uiEl.innerHTML = ''
    basePoints.forEach((point, i) => {
      const pointEl = document.createElement('div')
      pointEl.className = 'point'
      pointEl.innerHTML = `
        <div>x: ${point.x.toFixed(2)}</div>
        <div>y: ${point.y.toFixed(2)}</div>
      `
      pointEl.addEventListener('click', () => removePoint(i, point))
      uiEl.appendChild(pointEl)
    })
  }

  const canvas = document.querySelector('canvas')
  const dpi = window.devicePixelRatio || 1
  canvas.width = canvasWidth = window.innerWidth * dpi
  canvas.height = canvasHeight = window.innerHeight * dpi
  const ctx = canvas.getContext('2d')

  function render(point) {
    ctx.fillRect(point.x, point.y, 1, 1)
    drawPixel(ctx, point.x, point.y, 255, 0, 0, 255)
  }

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
  let id

  function doTriangle(end) {
    if (basePoints.length < 3) return
    currPoint = pointBetween(currPoint, takeRandomBasePoint())
    render(currPoint)

    if (++currentI < end) {
      if (++inThisLoop < speed) {
        doTriangle(end)
      } else {
        inThisLoop = 0
        id = window.requestAnimationFrame(() => doTriangle(end))
      }
    }
  }

  canvas.addEventListener('click', e => {
    stopWorking()
    const basePoint = { x: e.clientX * dpi, y: e.clientY * dpi }
    basePoints.push(basePoint)
    startWorking()
  })

  function removePoint(i) {
    stopWorking()
    basePoints.splice(i, 1)
    startWorking()
  }

  function stopWorking() {
    window.cancelAnimationFrame(id)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function startWorking() {
    id = window.requestAnimationFrame(() => doTriangle(Infinity))
    renderUi()
  }

  console.log('end')
  renderUi(app)
})()
