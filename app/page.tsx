"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Emoji {
  emoji: string;
  names: string[];
}

interface GameStats {
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number;
  averageSpeed: number;
  maxCombo: number;
  missedEmojis: { emoji: string; correctName: string }[];
}

const GAME_DURATION = 60; // seconds

const EMOJI_DATA: Emoji[] = [
  { emoji: "😀", names: ["grinning", "happy", "smile"] },
  { emoji: "😂", names: ["joy", "laugh", "lol"] },
  { emoji: "❤️", names: ["heart", "love", "red heart"] },
  { emoji: "🔥", names: ["fire", "hot", "flame"] },
  { emoji: "⭐", names: ["star", "stars"] },
  { emoji: "🎮", names: ["game", "gaming", "controller"] },
  { emoji: "⌨️", names: ["keyboard", "typing"] },
  { emoji: "🚀", names: ["rocket", "launch"] },
  { emoji: "🎯", names: ["target", "bullseye", "dart"] },
  { emoji: "⚡", names: ["lightning", "thunder", "bolt"] },
  { emoji: "🏆", names: ["trophy", "winner", "champion"] },
  { emoji: "💪", names: ["muscle", "strong", "flex"] },
  { emoji: "🧠", names: ["brain", "mind", "think"] },
  { emoji: "💻", names: ["laptop", "computer", "pc"] },
  { emoji: "🎨", names: ["art", "paint", "palette"] },
  { emoji: "🎵", names: ["music", "note", "song"] },
  { emoji: "🍕", names: ["pizza", "slice"] },
  { emoji: "🌟", names: ["star", "sparkle", "glowing star"] },
  { emoji: "💎", names: ["diamond", "gem", "jewel"] },
  { emoji: "🔑", names: ["key", "keys"] },
  { emoji: "🦋", names: ["butterfly"] },
  { emoji: "🌈", names: ["rainbow"] },
  { emoji: "🌞", names: ["sun"] },
  { emoji: "🌙", names: ["moon"] },
  { emoji: "⭐️", names: ["star"] },
  { emoji: "☁️", names: ["cloud"] },
  { emoji: "⚽", names: ["soccer", "football"] },
  { emoji: "🏀", names: ["basketball"] },
  { emoji: "🏈", names: ["football", "american football"] },
  { emoji: "⚾", names: ["baseball"] },
  { emoji: "🎾", names: ["tennis"] },
  { emoji: "🏐", names: ["volleyball"] },
  { emoji: "🎲", names: ["dice", "game"] },
  { emoji: "🎸", names: ["guitar", "music"] },
  { emoji: "🎤", names: ["microphone", "sing"] },
  { emoji: "🎧", names: ["headphones", "music"] },
  { emoji: "🎬", names: ["movie", "film", "clapper"] },
  { emoji: "🎁", names: ["gift", "present"] },
  { emoji: "🎂", names: ["cake", "birthday"] },
  { emoji: "🍔", names: ["burger", "hamburger"] },
  { emoji: "🍟", names: ["fries"] },
  { emoji: "🍣", names: ["sushi"] },
  { emoji: "🥨", names: ["pretzel"] },
  { emoji: "🍺", names: ["beer"] },
  { emoji: "🍷", names: ["wine"] },
  { emoji: "☕", names: ["coffee"] },
  { emoji: "🍼", names: ["milk", "bottle"] },
  { emoji: "🚗", names: ["car"] },
  { emoji: "✈️", names: ["plane", "airplane"] },
  { emoji: "🚁", names: ["helicopter"] },
  { emoji: "🚢", names: ["ship", "boat"] },
  { emoji: "⏰", names: ["alarm", "clock"] },
  { emoji: "📱", names: ["phone", "mobile"] },
  { emoji: "💡", names: ["light", "bulb"] },
  { emoji: "🔒", names: ["lock"] },
  { emoji: "🔓", names: ["unlock"] },
  { emoji: "🔨", names: ["hammer", "tool"] },
  { emoji: "🛠️", names: ["tools", "wrench", "hammer"] },
  { emoji: "🧲", names: ["magnet"] },
  { emoji: "📦", names: ["box", "package"] },
  { emoji: "📚", names: ["books", "library"] },
  { emoji: "✏️", names: ["pencil", "edit"] },
  { emoji: "📖", names: ["book", "read"] },
  { emoji: "📝", names: ["note", "writing"] },
  { emoji: "📅", names: ["calendar", "date"] },
  { emoji: "📊", names: ["chart", "graph"] },
  { emoji: "📈", names: ["growth", "increase"] },
  { emoji: "🏠", names: ["house", "home"] },
  { emoji: "🏢", names: ["office", "building"] },
  { emoji: "🏫", names: ["school"] },
  { emoji: "🏥", names: ["hospital"] },
  { emoji: "🏦", names: ["bank"] },
  { emoji: "🏪", names: ["store", "shop"] },
  { emoji: "🏛️", names: ["museum", "government"] },
  { emoji: "⛪", names: ["church"] },
  { emoji: "🕌", names: ["mosque"] },
  { emoji: "🕍", names: ["synagogue"] },
  { emoji: "🗽", names: ["statue", "liberty"] },
  { emoji: "🏝️", names: ["island"] },
  { emoji: "🏖️", names: ["beach"] },
  { emoji: "🏔️", names: ["mountain"] },
  { emoji: "🌋", names: ["volcano"] },
  { emoji: "🛤️", names: ["railway", "track"] },
  { emoji: "🚦", names: ["traffic light"] },
  { emoji: "🚧", names: ["construction"] },
  { emoji: "⚓", names: ["anchor"] },
  { emoji: "🪁", names: ["kite"] },
  { emoji: "🎈", names: ["balloon"] },
  { emoji: "🎉", names: ["party", "tada"] },
  { emoji: "🎊", names: ["confetti"] },
  { emoji: "🎃", names: ["pumpkin", "halloween"] },
  { emoji: "🎑", names: ["moon", "viewing"] },
];

export default function EmojiTypingGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "ended">(
    "idle"
  );
  const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [stats, setStats] = useState<GameStats>({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalTime: 0,
    averageSpeed: 0,
    maxCombo: 0,
    missedEmojis: [],
  });
  const [feedback, setFeedback] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [shake, setShake] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const emojiStartTimeRef = useRef<number>(0);

  // UseRef to track unused emojis for the round (does not trigger rerender)
  const unusedEmojisRef = useRef<Emoji[]>([]);

  const getRandomEmoji = useCallback(() => {
    let pool = unusedEmojisRef.current;
    if (!pool || pool.length === 0) {
      pool = [...EMOJI_DATA].sort(() => Math.random() - 0.5);
    }
    const [next, ...rest] = pool;
    unusedEmojisRef.current = rest;
    setCurrentEmoji(next);
  }, []);

  const showFeedback = (text: string, type: "success" | "error") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 1000);
  };

  const handleCorrectAnswer = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    const answerTime = Date.now() - emojiStartTimeRef.current;
    const newCombo = combo + 1;
    const comboBonus = Math.floor(newCombo / 5) * 50;
    const speedBonus = Math.max(0, Math.floor((3000 - answerTime) / 100) * 10);
    const points = 100 + comboBonus + speedBonus;

    setScore((prev) => prev + points);
    setCombo(newCombo);
    setStats((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
      maxCombo: Math.max(prev.maxCombo, newCombo),
    }));

    showFeedback(`+${points} (Combo x${newCombo})`, "success");
    getRandomEmoji();
    emojiStartTimeRef.current = Date.now();
  };

  const handleWrongAnswer = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);

    setCombo(0);
    setStats((prev) => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers + 1,
      missedEmojis: [
        ...prev.missedEmojis,
        {
          emoji: currentEmoji!.emoji,
          correctName: currentEmoji!.names[0],
        },
      ],
    }));

    showFeedback("Wrong! Combo lost", "error");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setInput(value);

    if (value && currentEmoji) {
      if (currentEmoji.names.some((name) => name.toLowerCase() === value)) {
        handleCorrectAnswer();
        setInput("");
      }
    }
  };

  const skipEmoji = () => {
    if (gameState !== "playing" || !currentEmoji) return;
    handleWrongAnswer();
    setInput("");
    getRandomEmoji();
    emojiStartTimeRef.current = Date.now();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Always skip on Enter
      skipEmoji();
    }
  };

  // On game start, shuffle and set unusedEmojisRef
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setStats({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalTime: 0,
      averageSpeed: 0,
      maxCombo: 0,
      missedEmojis: [],
    });
    setInput(""); // Reset input when starting a new game
    // Shuffle and set unusedEmojisRef, set first emoji
    const shuffled = [...EMOJI_DATA].sort(() => Math.random() - 0.5);
    unusedEmojisRef.current = shuffled.slice(1);
    setCurrentEmoji(shuffled[0]);
    startTimeRef.current = Date.now();
    emojiStartTimeRef.current = Date.now();
    inputRef.current?.focus();
  };

  const endGame = () => {
    const totalTime = (Date.now() - startTimeRef.current) / 1000;
    const averageSpeed =
      stats.correctAnswers > 0 ? totalTime / stats.correctAnswers : 0;

    setStats((prev) => ({
      ...prev,
      totalTime,
      averageSpeed,
    }));
    setGameState("ended");
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  // Helper to get the reference answer (first name)
  const getReferenceAnswer = () => {
    if (!currentEmoji) return "";
    return currentEmoji.names[0];
  };

  // Helper to render highlighted answer
  const renderHighlightedAnswer = () => {
    const answer = getReferenceAnswer();
    if (!answer) return null;
    const chars = answer.split("");
    const inputChars = input.split("");
    let wrongIndex = -1;
    for (let i = 0; i < inputChars.length; i++) {
      if (inputChars[i] !== chars[i]) {
        wrongIndex = i;
        break;
      }
    }
    return (
      <div className="flex justify-center mb-2 select-none text-xl font-mono font-bold tracking-wide">
        {chars.map((char, idx) => {
          let color = "";
          if (idx < inputChars.length) {
            if (wrongIndex === -1 && inputChars[idx] === char) {
              color = "text-green-400";
            } else if (wrongIndex === idx) {
              color = "text-red-400";
            } else if (wrongIndex !== -1 && idx > wrongIndex) {
              color = "text-gray-400";
            } else if (
              wrongIndex !== -1 &&
              idx < wrongIndex &&
              inputChars[idx] === char
            ) {
              color = "text-green-400";
            } else {
              color = "text-gray-400";
            }
          } else {
            color = "text-gray-400";
          }
          return (
            <span key={idx} className={color}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const getTips = () => {
    const tips = [];

    if (stats.averageSpeed > 5) {
      tips.push("Try to type faster! Aim for under 3 seconds per emoji.");
    }

    if (stats.wrongAnswers > stats.correctAnswers * 0.3) {
      tips.push("Practice common emoji names to reduce mistakes.");
    }

    if (stats.maxCombo < 10) {
      tips.push("Build longer combos by avoiding mistakes for bonus points!");
    }

    if (stats.missedEmojis.length > 0) {
      tips.push(
        `Learn these: ${stats.missedEmojis
          .slice(0, 3)
          .map((m) => `${m.emoji} = ${m.correctName}`)
          .join(", ")}`
      );
    }

    // Add a new tip instead of the emoji name tip
    tips.push("Keep your hands on the keyboard for faster reactions!");

    if (tips.length === 0) {
      tips.push("Great job! Try to beat your high score!");
    }

    return tips;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center px-4 py-8">
      {/* Feedback */}
      {feedback && (
        <div
          className={`absolute left-1/2 top-6 -translate-x-1/2 z-20 py-2 max-w-lg w-auto text-center
            ${
              feedback.type === "success"
                ? "bg-green-400/20 text-green-300 border border-green-400/40"
                : "bg-red-400/20 text-red-300 border border-red-400/40"
            }
            rounded-md font-semibold text-base px-3 py-1.5 shadow-sm transition-all duration-200`}
          style={{
            pointerEvents: "none",
            wordBreak: "break-word",
            backdropFilter: "blur(12px)",
          }}
        >
          {feedback.text}
        </div>
      )}
      {/* Header */}
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div
          className="text-3xl md:text-6xl font-extrabold text-center mb-1 drop-shadow-lg"
          style={{
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            textShadow: "0 2px 12px rgba(0,0,0,0.18)",
            color: "#38bdf8",
          }}
        >
          Emoji Typer
        </div>
        <p
          className="text-center text-gray-300 text-lg font-medium tracking-wide"
          style={{
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            marginTop: "-0.2em",
          }}
        >
          Type fast, build combos!
        </p>
      </div>

      {/* Game Container */}
      <div
        className="w-full max-w-md flex-1 flex flex-col animate-fadein"
        style={{
          borderRadius: "2rem",
          background: "rgba(30, 41, 59, 0.60)",
          boxShadow: "0 8px 40px 0 rgba(0,0,0,0.22)",
          border: "2px solid rgba(139,92,246,0.18)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: gameState === "ended" ? "0" : "2rem",
          paddingBlock: gameState === "ended" ? "1rem" : "2rem",
          transition: "background 0.3s, box-shadow 0.3s, border 0.3s",
        }}
      >
        {gameState === "idle" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-4 px-8">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold">Ready to Type?</h2>
              <p className="text-gray-300">
                Type the name of each emoji as fast as you can! Build combos for
                bonus points.
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>⏱️ 60 seconds</p>
                <p>⚡ Speed bonuses</p>
                <p>🔥 Combo multipliers</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-12 py-6 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="flex-1 flex flex-col space-y-6 animate-gamein">
            {/* Stats Bar */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 grid grid-cols-3 gap-4 animate-fadein-delayed">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {timeLeft}s
                </div>
                <div className="text-xs text-gray-300">Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{score}</div>
                <div className="text-xs text-gray-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  x{combo}
                </div>
                <div className="text-xs text-gray-300">Combo</div>
              </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative animate-fadein-delayed2">
              {/* Emoji Display */}
              <div
                className={`flex items-center justify-center`}
                style={{ minHeight: "6.5rem", minWidth: "6.5rem" }}
              >
                <span
                  className={`text-8xl  ${shake ? "animate-shake" : ""}`}
                  style={{
                    display: "inline-block",
                    width: "6.5rem",
                    height: "6.5rem",
                    lineHeight: "6.5rem",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {currentEmoji?.emoji}
                </span>
              </div>

              {/* Highlighted Answer */}
              {gameState === "playing" &&
                currentEmoji &&
                renderHighlightedAnswer()}

              {/* Input Area */}
              <div className="w-full flex flex-col items-center space-y-2 animate-fadein-delayed3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type emoji name"
                  className="w-full px-6 py-4 text-xl bg-white/20 backdrop-blur rounded-2xl text-center placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>

            {/* Hints */}
            <div className="text-center text-sm text-gray-400 px-8 animate-fadein-delayed4">
              <p>Press Enter to skip</p>
            </div>
          </div>
        )}

        {gameState === "ended" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-2 md:px-8">
            <div className="text-5xl md:text-6xl mb-2">🏆</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-sky-400 drop-shadow mb-2 tracking-tight">
              Game Over!
            </h2>

            {/* Final Score */}
            <div className="flex flex-col items-center mb-2">
              <div className="text-5xl md:text-7xl font-extrabold text-yellow-400 drop-shadow-lg mb-1">
                {score}
              </div>
              <div className="text-sm md:text-base text-gray-300 font-semibold uppercase tracking-widest">
                Final Score
              </div>
            </div>

            {/* Stats Grid */}
            <div className="w-full max-w-xs grid grid-cols-2 gap-3 md:gap-4 bg-white/10 rounded-2xl p-4 md:p-6 shadow backdrop-blur">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Correct
                </span>
                <span className="font-bold text-green-400 text-xl md:text-2xl">
                  {stats.correctAnswers}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Wrong
                </span>
                <span className="font-bold text-red-400 text-xl md:text-2xl">
                  {stats.wrongAnswers}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Max Combo
                </span>
                <span className="font-bold text-orange-400 text-xl md:text-2xl">
                  x{stats.maxCombo}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Avg Speed
                </span>
                <span className="font-bold text-sky-300 text-xl md:text-2xl">
                  {stats.averageSpeed.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="w-full max-w-xs bg-slate-800/80 rounded-2xl p-3 md:p-4 mt-2 shadow border border-slate-700">
              <h3 className="font-bold mb-2 text-sky-400 text-sm md:text-base flex items-center gap-1">
                <span>💡</span> Tips for Improvement
              </h3>
              <ul className="space-y-1 text-xs md:text-sm">
                {getTips().map((tip, index) => (
                  <li key={index} className="text-gray-300 leading-snug">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={startGame}
              className="mt-2 md:mt-4 px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap");
      `}</style>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes gamein {
          from {
            opacity: 0;
            transform: translateY(32px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadein-delayed {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadein {
          animation: fadein 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-gamein {
          animation: gamein 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fadein-delayed {
          animation: fadein-delayed 0.6s 0.12s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fadein-delayed2 {
          animation: fadein-delayed 0.6s 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fadein-delayed3 {
          animation: fadein-delayed 0.6s 0.32s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fadein-delayed4 {
          animation: fadein-delayed 0.6s 0.42s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
