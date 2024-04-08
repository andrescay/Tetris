import './style.css'

// 1. Initialize

const canvas = document.querySelector('#board')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const canvasNextPiece = document.querySelector('#next_piece')
const contextNextPiece = canvasNextPiece.getContext('2d')

const scaleNextPiece = 8
canvasNextPiece.width = BLOCK_SIZE * scaleNextPiece / 2
canvasNextPiece.height = BLOCK_SIZE * scaleNextPiece / 2

contextNextPiece.scale(BLOCK_SIZE / 2, BLOCK_SIZE / 2)

let score = 0

const PIECES = [
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ]
]

const board = createBoard(BOARD_HEIGHT, BOARD_WIDTH)

const piece = {
  position: { x: 5, y: 3 },
  shape: PIECES[Math.floor(Math.random() * PIECES.length)]
}

const nextpiece = {
  position: { x: 3, y: 3 },
  shape: PIECES[Math.floor(Math.random() * PIECES.length)]
}
let pieceWidth = nextpiece.shape[0].length
let pieceHeight = nextpiece.shape.length
let startX = Math.floor(scaleNextPiece / 2 - pieceWidth / 2)
let startY = Math.floor(scaleNextPiece / 2 - pieceHeight / 2)
// console.log(`pieceHeight ${pieceHeight}`)

// 2. Game loop

let dropCounter = 0
let lastTime = 0

function update (time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
    if (checkCollition()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  // Draw the board
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = '#A0153E  '
        context.fillRect(x, y, 1, 1)
      }
    })
  })
  // Draw the piece
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = '#FF204E'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
  // Draw the next-piece board
  contextNextPiece.fillStyle = '#000'
  contextNextPiece.fillRect(0, 0, canvasNextPiece.width, canvasNextPiece.height)
  // Draw the next piece
  nextpiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        contextNextPiece.fillStyle = '#FF204E'
        contextNextPiece.fillRect(x + startX, y + startY, 1, 1)
      }
    })
  })

  document.querySelector('span').innerText = score
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollition()) {
      piece.position.x++
    }
  }
  if (event.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollition()) {
      piece.position.x--
    }
  }
  if (event.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollition()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  if (event.key === 'ArrowUp') {
    const rotatetedPiece = []
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotatetedPiece.push(row)
    }
    const initialPice = piece.shape
    piece.shape = rotatetedPiece
    if (checkCollition()) {
      piece.shape = initialPice
    }
  }
})

function checkCollition () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  piece.shape = nextpiece.shape
  nextpiece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  pieceWidth = nextpiece.shape[0].length
  pieceHeight = nextpiece.shape.length
  startX = Math.floor(scaleNextPiece / 2 - pieceWidth / 2)
  startY = Math.floor(scaleNextPiece / 2 - pieceHeight / 2)
  const minPosition = 3
  const maxPosition = BOARD_WIDTH - minPosition
  piece.position.x = Math.floor(Math.random() * (maxPosition - minPosition)) + minPosition
  piece.position.y = 0
  if (checkCollition()) {
    window.alert('Game over!')
    score = 0
    board.forEach((row) => row.fill(0))
  }
}

function removeRows () {
  board.forEach((row, x) => {
    if (row.every(value => value === 1)) {
      board.splice(x, 1)
      board.unshift(new Array(BOARD_WIDTH).fill(0))
      score += 10
    }
  })
}

update()

// 3. Board

function createBoard (height, length) {
  const newBoard = []
  // Eliminar el -1 en producción ya que se agrega después una línea para probar
  for (let i = 0; i < height; i++) {
    const row = new Array(length).fill(0)
    newBoard.push(row)
  }
  return newBoard
}
