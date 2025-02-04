"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;

const choices: Choice[] = ["rock", "paper", "scissors"];

const getComputerChoice = (): Choice => {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

const getResult = (playerChoice: Choice, computerChoice: Choice): Result => {
  if (playerChoice === computerChoice) return "draw";
  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "win";
  }
  return "lose";
};

const choiceEmojis: Record<Choice, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

const iconVariants = {
  initial: { scale: 1, borderColor: "transparent", borderWidth: "0px" },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
  selected: {
    scale: 1.05,
    borderColor: "#FF69B4",
    borderWidth: "2px",
    transition: { type: "spring", stiffness: 300 },
  },
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, ties: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const [playWinSound] = useSound("/sounds/win.mp3");
  const [playLoseSound] = useSound("/sounds/lose.mp3");
  const [playTieSound] = useSound("/sounds/tie.mp3");

  const handleChoice = (choice: Choice) => {
    setIsAnimating(true);
    setPlayerChoice(choice);
    setTimeout(() => {
      const computer = getComputerChoice();
      setComputerChoice(computer);
      const newResult = getResult(choice, computer);
      setResult(newResult);
      setScore((prevScore) => {
        if (newResult === "win") {
          playWinSound();
          return { ...prevScore, wins: prevScore.wins + 1 };
        } else if (newResult === "lose") {
          playLoseSound();
          return { ...prevScore, losses: prevScore.losses + 1 };
        } else {
          playTieSound();
          return { ...prevScore, ties: prevScore.ties + 1 };
        }
      });
      setIsAnimating(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const getResultColor = (result: Result) => {
    switch (result) {
      case "win":
        return "text-green-500";
      case "lose":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const totalGames = score.wins + score.losses + score.ties;
  const winRate =
    totalGames > 0
      ? ((score.wins / totalGames) * 100).toFixed(1).replace(/\.0$/, "")
      : "0";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-geist-sans">
      <h1 className="text-5xl font-bold mb-8 text-white">
        Rock Paper Scissors
      </h1>
      <div className="mb-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg w-80">
        <h2 className="text-2xl font-bold text-white mb-2">Score</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-green-300">{score.wins}</p>
            <p className="text-sm text-white">Wins</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-300">{score.losses}</p>
            <p className="text-sm text-white">Losses</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-300">{score.ties}</p>
            <p className="text-sm text-white">Ties</p>
          </div>
        </div>
        <p className="mt-4 text-lg text-white text-center">
          Win Rate: <span className="font-bold text-green-300">{winRate}%</span>
        </p>
      </div>
      <div className="flex gap-4 mb-8">
        {choices.map((choice) => (
          <motion.div
            key={choice}
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            animate={playerChoice === choice ? "selected" : "initial"}
            className="rounded-full flex items-center justify-center"
            style={{
              borderColor: playerChoice === choice ? "#FF69B4" : "transparent",
              borderWidth: "2px",
              width: "88px",
              height: "88px",
            }}
          >
            <Button
              onClick={() => handleChoice(choice)}
              disabled={isAnimating}
              className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 transition-all duration-200 h-20 w-20 rounded-full flex items-center justify-center text-4xl"
            >
              {choiceEmojis[choice]}
            </Button>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ scale: 0 }}
            className="text-6xl mb-8 text-white"
          >
            🤔
          </motion.div>
        )}
      </AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-lg shadow-xl"
        >
          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="text-center">
              <p className="text-xl mb-2">You chose</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-6xl"
              >
                {playerChoice && choiceEmojis[playerChoice]}
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-xl mb-2">Computer chose</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-6xl"
              >
                {computerChoice && choiceEmojis[computerChoice]}
              </motion.div>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-3xl font-bold mb-4 ${getResultColor(result)}`}
          >
            {result === "draw" ? "It's a tie!" : `You ${result}!`}
          </motion.p>
          <Button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
