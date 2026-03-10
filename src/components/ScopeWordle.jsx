import { useState, useEffect } from "react";
import questions from "../data/questions.js";
import bgVideo from "../animated.mp4";

const MAX_ATTEMPTS = 5;

function getRandomQuestion(part) {
  const list = questions[part];
  return list[Math.floor(Math.random() * list.length)];
}

export default function ScopeWordle() {

  const [selectedPart, setSelectedPart] = useState(null);
  const [game, setGame] = useState(null);

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [learned, setLearned] = useState([]);

  const [showInstructions, setShowInstructions] = useState(true);

  const WORD = game ? game.word.toUpperCase() : "";

  const startPart = (part) => {
    setSelectedPart(part);
    setGame(getRandomQuestion(part));
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setShowInstructions(false);
  };

  const resetGame = () => {
    setGame(getRandomQuestion(selectedPart));
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
  };

  const checkGuess = (guess) => {

    if (guess === WORD) {

      setGuesses(prev => [...prev, guess]);
      setMessage("🎉 Correct!");

      setLearned(prev => [
        ...prev,
        {
          word: WORD,
          hint: game.hint
        }
      ]);

      setTimeout(resetGame, 2000);
      return;
    }

    const updated = [...guesses, guess];
    setGuesses(updated);
    setMessage("Try Again");

    if (updated.length >= MAX_ATTEMPTS) {
      setMessage("❌ New Question...");
      setTimeout(resetGame, 2000);
    }

  };

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (showInstructions || !game) return;

      if (e.key === "Backspace") {
        setMessage("Letters cannot be deleted");
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {

        if (currentGuess.length < WORD.length) {

          const newGuess = currentGuess + e.key.toUpperCase();
          setCurrentGuess(newGuess);

          if (newGuess.length === WORD.length) {

            setTimeout(() => {
              checkGuess(newGuess);
              setCurrentGuess("");
            }, 300);

          }

        }

      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [currentGuess, guesses, WORD, showInstructions, game]);

  const getColor = (letter, index) => {

    if (!letter) return "bg-slate-700";

    if (WORD[index] === letter) return "bg-green-500 text-white";

    if (WORD.includes(letter)) return "bg-yellow-400 text-black";

    return "bg-gray-600 text-white";

  };

  const renderRow = (guess, rowIndex) => {

    const letters = guess.split("");

    return (
      <div key={rowIndex} className="flex gap-3 justify-center">

        {[...Array(WORD.length)].map((_, i) => {

          const letter = letters[i] || "";

          return (
            <div
              key={i}
              className={`w-16 h-16 flex items-center justify-center rounded-xl text-2xl font-bold border border-slate-600 shadow-md
              ${letter ? getColor(letter, i) : "bg-slate-700 text-white"}`}
            >
              {letter}
            </div>
          );

        })}

      </div>
    );

  };

  const rows = [];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {

    if (i < guesses.length) rows.push(renderRow(guesses[i], i));
    else if (i === guesses.length) rows.push(renderRow(currentGuess, i));
    else rows.push(renderRow("", i));

  }

  return (

    <div className="min-h-screen flex justify-center items-start p-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">

      {/* INSTRUCTION MODAL WITH VIDEO */}
      {showInstructions && (

        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">

          {/* VIDEO BACKGROUND */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/80"></div>

          {/* PANEL */}
          <div className="relative bg-slate-800/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-2xl p-8 max-w-lg w-full text-center z-10">

            <h2 className="text-3xl font-bold text-indigo-400 mb-6">
              How to Play
            </h2>

            <div className="text-slate-300 space-y-3 text-left mb-6">
              <p>• Read the hint carefully.</p>
              <p>• Type letters using your keyboard.</p>
              <p>• Once typed, letters cannot be deleted.</p>
              <p>• You have <b>{MAX_ATTEMPTS} attempts</b>.</p>
              <p>• Green = correct position.</p>
              <p>• Yellow = wrong position.</p>
              <p>• Gray = not in the word.</p>
            </div>

            <p className="text-indigo-400 font-semibold mb-4">
              Select Part
            </p>

            <div className="flex gap-4 justify-center">

              <button
                onClick={() => startPart("part1")}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Part 1
              </button>

              <button
                onClick={() => startPart("part2")}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Part 2
              </button>

              <button
                onClick={() => startPart("part3")}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Part 3
              </button>

            </div>

          </div>

        </div>

      )}

      {/* MAIN GAME */}
      {game && (

        <div className="flex gap-12 w-full max-w-7xl items-start">

          {/* LEFT PANEL */}
          <div className="flex flex-col items-center flex-grow min-w-0">

            <h1 className="text-5xl font-extrabold text-indigo-400 mb-8">
              Scope Wordle
            </h1>

            <div className="bg-slate-800 border border-slate-700 shadow-xl p-6 rounded-xl mb-8 max-w-xl text-center">

              <p className="text-indigo-400 font-semibold text-lg mb-2">
                Hint
              </p>

              <p className="text-slate-200 text-lg">
                {game.hint}
              </p>

            </div>

            <div className="space-y-3 mb-6">
              {rows}
            </div>

            {message && (
              <div className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-lg">
                {message}
              </div>
            )}

          </div>

          {/* RIGHT PANEL */}
          <div className="w-[420px] flex-shrink-0">

            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6">

              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                Learned Concepts
              </h2>

              {learned.length === 0 && (
                <p className="text-slate-400 text-sm">
                  Correct answers will appear here
                </p>
              )}

              <div className="space-y-4">

                {learned.map((item, index) => (

                  <div
                    key={index}
                    className="border border-slate-700 rounded-lg p-4 bg-slate-900"
                  >

                    <p className="font-bold text-indigo-400">
                      {item.word}
                    </p>

                    <p className="text-sm text-slate-300">
                      {item.hint}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
