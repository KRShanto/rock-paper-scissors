import RockPaperScissors from "./components/rock-paper-scissors"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rock Paper Scissors Game",
  description: "An interactive and fun Rock Paper Scissors game",
}

export default function Home() {
  return (
    <main>
      <RockPaperScissors />
    </main>
  )
}

