import { useState } from "react";

export default function Home() {
    const initialPlayers = [
        "Caay",
        "Manimtim",
        "Roxas",
        "Villacoba",
        "Agquiz",
        "Biadoy",
        "Layug",
        "Piliin",
        "Arizala",
        "Daluz",
        "Rosales",
        "Dayao",
        "Guyala",
        "Manalo",
        "Rendal",
        "Pagkaliwagan",
        "De Padua",
        "Labo-labo",
        "Maningat",
        "Vidal",
        "Bulan",
        "Domingo",
        "Lopez",
        "Tadas",
        "Caraig",
        "Latiza",
        "Mendoza",
        "Bagunas",
        "Causapin",
        "Estobo",
        "Lalo",
        "De Castro",
    ];

    const [remainingPlayers, setRemainingPlayers] = useState(initialPlayers);
    const [permanentEliminated, setPermanentEliminated] = useState([]);
    const [roundEliminated, setRoundEliminated] = useState([]);
    const [winner, setWinner] = useState("");
    const [picking, setPicking] = useState(false);

    function startElimination() {
        if (remainingPlayers.length === 0) return;

        setPicking(true);
        setWinner("");
        setRoundEliminated([]);

        let pool = [...remainingPlayers];

        const interval = setInterval(() => {
            if (pool.length <= 1) {
                clearInterval(interval);

                const selected = pool[0];

                setWinner(selected);

                // mark winner permanently eliminated
                setPermanentEliminated((prev) => [...prev, selected]);

                // remove from remaining
                setRemainingPlayers((prev) =>
                    prev.filter((p) => p !== selected),
                );

                setPicking(false);

                return;
            }

            const randomIndex = Math.floor(Math.random() * pool.length);

            const removed = pool[randomIndex];

            pool.splice(randomIndex, 1);

            setRoundEliminated((prev) => [...prev, removed]);
        }, 200);
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
            <div className="w-[1000px] bg-gray-800 rounded-3xl p-10 shadow-2xl">
                <h1 className="text-4xl font-bold text-center mb-2 text-purple-400">
                    🎮 Project Scope Management Elimination
                </h1>

                <p className="text-center text-gray-400 mb-6">
                    Elimination Battle Picker
                </p>

                {/* PLAYER GRID */}

                <div className="grid grid-cols-6 gap-3 mb-8">
                    {initialPlayers.map((name, index) => {
                        const isPermanent = permanentEliminated.includes(name);
                        const isRound = roundEliminated.includes(name);
                        const isWinner = winner === name;

                        return (
                            <div
                                key={index}
                                className={`p-3 rounded-lg text-center font-semibold transition-all duration-300
${
    isWinner
        ? "bg-green-500 text-black scale-110 animate-pulse"
        : isPermanent
          ? "bg-red-700 line-through opacity-50"
          : isRound
            ? "bg-red-600 line-through"
            : "bg-gray-700"
}
`}
                            >
                                {name}
                            </div>
                        );
                    })}
                </div>

                {/* WINNER */}

                {winner && (
                    <div className="text-center mb-6 animate-bounce">
                        <div className="text-2xl text-red-400 font-semibold">
                            {winner === "De Castro"
                                ? "😆 Arayko Nuel"
                                : "😈 Malas mo boy:"}
                        </div>

                        <div className="text-4xl font-bold text-green-400 mt-2">
                            {winner}
                        </div>
                    </div>
                )}

                {/* BUTTON */}

                <div className="flex justify-center">
                    <button
                        onClick={startElimination}
                        disabled={picking || remainingPlayers.length === 0}
                        className="px-10 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition disabled:bg-gray-600"
                    >
                        ⚔️ Start Elimination
                    </button>
                </div>

                {remainingPlayers.length === 0 && (
                    <p className="text-center text-red-400 mt-6">
                        All players have already been selected.
                    </p>
                )}
            </div>
        </div>
    );
}
