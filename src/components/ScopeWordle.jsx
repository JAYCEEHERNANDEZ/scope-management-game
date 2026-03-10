import { useState, useEffect } from "react";
import questions from "../data/questions.js";

const MAX_ATTEMPTS = 5;

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

export default function ScopeWordle() {

  const [game, setGame] = useState(getRandomQuestion());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [learned, setLearned] = useState([]);

  // NEW: instructions popup
  const [showInstructions, setShowInstructions] = useState(true);

  const WORD = game.word.toUpperCase();

  const resetGame = () => {
    setGame(getRandomQuestion());
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

      if (showInstructions) return;

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

  }, [currentGuess, guesses, WORD, showInstructions]);

  const getColor = (letter, index) => {

    if (!letter) return "bg-slate-700";

    if (WORD[index] === letter)
      return "bg-green-500 text-white";

    if (WORD.includes(letter))
      return "bg-yellow-400 text-black";

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

      {/* INSTRUCTIONS MODAL */}
      {showInstructions && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">

            <h2 className="text-3xl font-bold text-indigo-400 mb-6">
              How to Play
            </h2>

            <div className="text-slate-300 space-y-4 text-left">

              <p>• Read the hint carefully.</p>

              <p>• Type letters using your keyboard.</p>

              <p>• Once a letter is typed, it <b>cannot be deleted.</b></p>

              <p>• You have <b>{MAX_ATTEMPTS} attempts</b> to guess the word.</p>

              <p>• Green = correct letter and position.</p>

              <p>• Yellow = correct letter but wrong position.</p>

              <p>• Gray = letter not in the word.</p>

            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
            >
              Start Game
            </button>

          </div>

        </div>

      )}

      {/* MAIN LAYOUT */}
      <div className="flex gap-12 w-full max-w-7xl items-start">

        {/* LEFT PANEL */}
        <div className="flex flex-col items-center flex-grow min-w-0">

          <h1 className="text-5xl font-extrabold text-indigo-400 mb-8 tracking-wide">
            Scope Wordle
          </h1>

          {/* Hint */}
          <div className="bg-slate-800 border border-slate-700 shadow-xl p-6 rounded-xl mb-8 max-w-xl text-center">

            <p className="text-indigo-400 font-semibold text-lg mb-2">
              Hint
            </p>

            <p className="text-slate-200 text-lg">
              {game.hint}
            </p>

          </div>

          {/* Board */}
          <div className="space-y-3 mb-6 overflow-x-auto">
            {rows}
          </div>

          {/* Message */}
          {message && (
            <div className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-lg">
              {message}
            </div>
          )}

          {/* Instructions Reminder */}
          
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[420px] flex-shrink-0">

          <div className="w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6">

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

    </div>

  );

}
