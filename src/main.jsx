import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const ADMIN_ID = "7681716638";

function App() {
  const tg = window.Telegram?.WebApp;

  const [balance, setBalance] = useState(1250);
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1);
  const [running, setRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [history, setHistory] = useState([]);

  const timer = useRef(null);
  const crashPoint = useRef(0);

  useEffect(() => {
    tg?.ready();
    tg?.expand();

    return () => clearInterval(timer.current);
  }, []);

  function startGame() {
    if (running) return;

    if (bet <= 0) {
      alert("مبلغ شرط را وارد کنید");
      return;
    }

    if (bet > balance) {
      alert("موجودی کافی نیست");
      return;
    }

    setBalance((old) => old - bet);
    setMultiplier(1);
    setCrashed(false);
    setRunning(true);

    crashPoint.current = +(1.05 + Math.random() * 4).toFixed(2);

    let value = 1;

    timer.current = setInterval(() => {
      value = +(value + 0.025 + value * 0.008).toFixed(2);

      if (value >= crashPoint.current) {
        clearInterval(timer.current);

        setMultiplier(crashPoint.current);
        setRunning(false);
        setCrashed(true);

        setHistory((old) => [
          {
            multiplier: crashPoint.current,
            result: "باخت",
            amount: -bet
          },
          ...old
        ]);
      } else {
        setMultiplier(value);
      }
    }, 80);
  }

  function cashOut() {
    if (!running) return;

    clearInterval(timer.current);

    const reward = Math.floor(bet * multiplier);

    setBalance((old) => old + reward);
    setRunning(false);

    setHistory((old) => [
      {
        multiplier,
        result: "برد",
        amount: reward - bet
      },
      ...old
    ]);
  }

  function setHalf() {
    setBet(Math.max(1, Math.floor(balance / 2)));
  }

  function setMax() {
    setBet(balance);
  }

  const isAdmin =
    tg?.initDataUnsafe?.user?.id?.toString() === ADMIN_ID;

  return (
    <div className="app">

      <header className="header">

        <div>
          <h1>🚀 ARYAN Rocket</h1>
          <span>Telegram Mini App</span>
        </div>

        <div className="balance">
          🪙 {balance.toLocaleString()}
        </div>

      </header>

      <main>

        <section className="game">

          <div className="stars"></div>

          <div className={
            running
              ? "rocket rocketFlying"
              : "rocket"
          }>
            🚀
          </div>

          <div className={
            crashed
              ? "multiplier crashed"
              : "multiplier"
          }>
            {multiplier.toFixed(2)}x
          </div>

          <div className="status">

            {running
              ? "راکت در حال پرواز است..."
              : crashed
              ? "💥 راکت منفجر شد"
              : "برای شروع آماده است"}

          </div>

        </section>

        <section className="panel">

          <label>مقدار توکن</label>

          <div className="betBox">

            <input
              type="number"
              min="1"
              value={bet}
              onChange={(e) =>
                setBet(Number(e.target.value))
              }
            />

            <button onClick={setHalf}>
              ½
            </button>

            <button onClick={() =>
              setBet(Math.min(balance, bet * 2))
            }>
              2×
            </button>

            <button onClick={setMax}>
              MAX
            </button>

          </div>

          {!running ? (

            <button
              className="startButton"
              onClick={startGame}
            >
              🚀 شروع بازی
            </button>

          ) : (

            <button
              className="cashButton"
              onClick={cashOut}
            >
              💰 برداشت در {multiplier.toFixed(2)}x
            </button>

          )}

        </section>

        <section className="panel">

          <h2>📜 تاریخچه بازی</h2>

          {history.length === 0 ? (

            <div className="empty">
              هنوز بازی انجام نداده‌اید
            </div>

          ) : (

            history.slice(0, 10).map((item, index) => (

              <div className="historyRow" key={index}>

                <span>
                  {item.result}
                </span>

                <b>
                  {item.multiplier.toFixed(2)}x
                </b>

                <strong className={
                  item.amount >= 0
                    ? "win"
                    : "lose"
                }>
                  {item.amount >= 0 ? "+" : ""}
                  {item.amount}
                </strong>

              </div>

            ))

          )}

        </section>

        {isAdmin && (

          <section className="admin">

            <h2>👑 پنل مدیریت</h2>

            <p>
              شما مدیر سیستم هستید.
            </p>

            <div className="adminButtons">
              <button>➕ افزودن توکن</button>
              <button>➖ کسر توکن</button>
              <button>👥 کاربران</button>
            </div>

          </section>

        )}

      </main>

      <footer>
        ARYAN Rocket • Virtual Token Game
      </footer>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
