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
    { x: 100, y: 100 },
    { x: 550, y: 100 },
    { x: 550, y: 550 },
    { x: 100, y: 550 }
  ]

  const slider = document.querySelector('.speed input')
  const coefficientInput = document.querySelector('.coefficient input')
  const algoSelect = document.querySelector('.point-select-algorithm select')
  let selectedAlgo = algoSelect.value

  function setCoefficent(c) {
    stopWorking()
    coefficient = c
    coefficientInput.value = c
    startWorking()
  }

  function initStaticUi() {
    slider.addEventListener('change', e => {
      speed = Number(e.target.value)
    })
    coefficientInput.addEventListener('input', e =>
      setCoefficent(Number(e.target.value))
    )
    const buttonmin = document.querySelector('.button-min')
    buttonmin.addEventListener('click', () => setCoefficent(coefficient - 1))
    const buttonpls = document.querySelector('.button-pls')
    buttonpls.addEventListener('click', () => setCoefficent(coefficient + 1))
    algoSelect.addEventListener('change', () => {
      stopWorking()
      selectedAlgo = algoSelect.value
      startWorking()
    })
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
      y: (a.y + coefficient * b.y) / (1 + coefficient)
    }
  }

  let currBasePoint = 0

  const randomPointAlgos = {
    random: () => basePoints[getRandomInt(0, basePoints.length - 1)],
    neighbor: () => {
      const rnd = getRandomInt(-1, 1)
      if (rnd === -1) {
        if (currBasePoint === 0) {
          currBasePoint = basePoints.length - 1
        } else {
          currBasePoint -= 1
        }
      } else if (rnd === 1) {
        if (currBasePoint === basePoints.length - 1) {
          currBasePoint = 0
        } else {
          currBasePoint += 1
        }
      }
      return basePoints[currBasePoint]
    }
  }

  function takeRandomBasePoint() {
    return randomPointAlgos[selectedAlgo]()
  }

  function generateRandomPoint() {
    return { x: getRandomInt(0, 100), y: getRandomInt(0, 100) }
  }

  let currentI = 0
  let inThisLoop = 0
  let currPoint = generateRandomPoint()
  let id

  function doTriangle(end) {
    if (basePoints.length < 1) return
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
      y: Math.round(e.clientY) * dpi
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
