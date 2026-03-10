import { useEffect, useState } from "react";
import questions from "../data/questions.js";

const MAX_ATTEMPTS = 5;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ScopeWordle() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [questionPool, setQuestionPool] = useState([]);
  const [game, setGame] = useState(null);

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [learned, setLearned] = useState([]);

  const [showInstructions, setShowInstructions] = useState(true);
  const [finished, setFinished] = useState(false);

  const WORD = game ? game.word.toUpperCase() : "";

  function loadNextQuestion(pool) {
    if (pool.length === 0) {
      setFinished(true);
      setMessage("🎉 Part Completed! You answered all questions.");
      return;
    }

    const next = pool[0];
    const remaining = pool.slice(1);

    setGame(next);
    setQuestionPool(remaining);

    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
  }

  const startPart = (part) => {
    const shuffled = shuffle(questions[part]);

    setSelectedPart(part);
    setQuestionPool(shuffled.slice(1));
    setGame(shuffled[0]);

    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setLearned([]);

    setFinished(false);
    setShowInstructions(false);
  };

  const resetGame = () => {
    loadNextQuestion(questionPool);
  };

  const checkGuess = (guess) => {
    if (guess === WORD) {
      setGuesses((prev) => [...prev, guess]);
      setMessage("🎉 Correct!");

      setLearned((prev) => [...prev, { word: WORD, hint: game.hint }]);

      setTimeout(resetGame, 1500);
      return;
    }

    const updated = [...guesses, guess];
    setGuesses(updated);
    setMessage("Try Again");

    if (updated.length >= MAX_ATTEMPTS) {
      setMessage("❌ New Question...");
      setTimeout(resetGame, 1500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showInstructions || finished || !game) return;

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
            }, 200);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses, WORD, showInstructions, game, finished]);

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
              className={`w-15 h-15 flex items-center justify-center rounded-xl text-2xl font-bold border border-slate-600 shadow-md
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
      {showInstructions && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-blue-700 rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6">
              How to Play
            </h2>

            <div className="text-slate-300 space-y-3 text-left mb-6">
              <p>• Read the hint carefully.</p>
              <p>• Type letters using your keyboard.</p>
              <p>• Once typed, letters cannot be deleted.</p>
              <p>
                • You have <b>{MAX_ATTEMPTS} attempts</b>.
              </p>
              <p>• Green = correct position.</p>
              <p>• Yellow = wrong position.</p>
              <p>• Gray = not in the word.</p>
            </div>

            <p className="text-indigo-400 font-semibold mb-4">Select Part</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startPart("part1")}
                className="px-5 py-3 bg-indigo-600 rounded-lg"
              >
                Part 1
              </button>

              <button
                onClick={() => startPart("part2")}
                className="px-5 py-3 bg-indigo-600 rounded-lg"
              >
                Part 2
              </button>

              <button
                onClick={() => startPart("part3")}
                className="px-5 py-3 bg-indigo-600 rounded-lg"
              >
                Part 3
              </button>
            </div>
          </div>
        </div>
      )}

      {game && (
        <div className="flex gap-12 w-full max-w-7xl items-start">
          {/* LEFT PANEL */}
          <div className="flex flex-col items-center flex-grow">
            <h1 className="text-5xl font-extrabold text-indigo-400 mb-8">
              Scope Wordle
            </h1>

            {finished ? (
              <div className="bg-slate-800 border border-green-500 p-10 rounded-xl text-center">
                <h2 className="text-3xl font-bold text-green-400 mb-4">
                  🎉 SUCCESS!
                </h2>

                <p className="text-slate-300 mb-6">
                  You answered all questions in this part.
                </p>

                <button
                  onClick={() => setShowInstructions(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Play Another Part
                </button>
              </div>
            ) : (
              <>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-8 max-w-xl text-center">
                  <p className="text-indigo-400 font-semibold mb-2">Hint</p>

                  <p className="text-slate-200">{game.hint}</p>
                </div>

                <div className="space-y-3 mb-6">{rows}</div>
              </>
            )}

            {message && !finished && (
              <div className="px-6 py-2 rounded-full bg-indigo-600 font-semibold">
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
                    <p className="font-bold text-indigo-400">{item.word}</p>

                    <p className="text-sm text-slate-300">{item.hint}</p>
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
