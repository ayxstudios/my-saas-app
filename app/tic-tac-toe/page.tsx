import TicTacToe from './TicTacToe'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <TicTacToe />
    </main>
  )
}
