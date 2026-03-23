'use client'

import { useState } from 'react'

type Square = 'X' | 'O' | null

function calculateWinner(squares: Square[]): Square {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function TicTacToe() {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)

  function handleClick(index: number) {
    if (squares[index] || winner) return
    const next = squares.slice()
    next[index] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : `Next: ${xIsNext ? 'X' : 'O'}`

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xl font-semibold">{status}</p>

      <div className="grid grid-cols-3 gap-2">
        {squares.map((value, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 text-4xl font-bold border-2 border-gray-400 rounded-lg bg-white hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            disabled={!!value || !!winner}
          >
            <span className={value === 'X' ? 'text-blue-600' : 'text-red-500'}>
              {value}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Restart
      </button>
    </div>
  )
}
