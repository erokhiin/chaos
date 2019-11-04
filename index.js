function getRandomInt(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

function drawPixel(ctx, x, y, i) {
  ctx.fillStyle = `hsl(${(i % 310) + 1}, 70%, 60%)`
  ctx.beginPath()
  ctx.arc(x, y, 1, 0, Math.PI * 2, true)
  ctx.fill()
}

;(function draw() {
  let speed = 10
  let coefficient = 1
  const basePoints = [
    { x: 50, y: 50 },
    { x: 600, y: 50 },
    { x: 600, y: 600 },
    { x: 50, y: 600 },
  ]

  function setCoeff(coeff) {
    stopWorking()
    coefficient = coeff
    startWorking()
  }

  function initStaticUi() {
    let slider = document.querySelector('.speed input')
    slider.addEventListener('change', e => {
      speed = Number(e.target.value)
    })
    const coefficientInput = document.querySelector('.coefficient input')
    coefficientInput.addEventListener('change', e =>
      setCoeff(Number(e.target.value)),
    )
    const buttonmin = document.querySelector('.button-min')
    buttonmin.addEventListener('click', () => setCoeff(coefficient - 1))
    const buttonpls = document.querySelector('.button-pls')
    buttonpls.addEventListener('click', () => setCoeff(coefficient + 1))
  }

  initStaticUi()

  function renderUi() {
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
    drawPixel(ctx, point.x, point.y, currentI)
  }
  function pointBetween(a, b) {
    return {
      x: (a.x + coefficient * b.x) / (1 + coefficient),
      y: (a.y + coefficient * b.y) / (1 + coefficient),
    }
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
    const basePoint = {
      x: Math.round(e.clientX) * dpi,
      y: Math.round(e.clientY) * dpi,
    }
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

  startWorking()
  renderUi(app)
  console.log('started')
})()
