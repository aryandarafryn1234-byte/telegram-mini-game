import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const ADMIN_ID = "7681716638";
const STARTING_TOKENS = 1000;

function getTelegramUser() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (user?.id) {
    return {
      id: String(user.id),
      name:
        user.first_name ||
        user.username ||
        "کاربر"
    };
  }

  // برای تست در مرورگر معمولی
  return {
    id: "demo-user",
    name: "کاربر آزمایشی"
  };
}

function getStorageKey(userId) {
  return `rocket_balance_${userId}`;
}

function getInitialBalance(userId) {
  const key = getStorageKey(userId);
  const saved = localStorage.getItem(key);

  if (saved !== null) {
    return Number(saved);
  }

  // کاربر جدید = 1000 توکن
  localStorage.setItem(
    key,
    String(STARTING_TOKENS)
  );

  return STARTING_TOKENS;
}

function App() {
  const tg = window.Telegram?.WebApp;

  const user = getTelegramUser();

  const [balance, setBalance] = useState(
    () => getInitialBalance(user.id)
  );

  const [bet, setBet] = useState(100);

  const [multiplier, setMultiplier] = useState(1);

  const [running, setRunning] = useState(false);

  const [crashed, setCrashed] = useState(false);

  const [history, setHistory] = useState([]);

  const timer = useRef(null);

  const crashPoint = useRef(0);

  /*
   * Telegram Mini App
   */
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();

      try {
        tg.setHeaderColor("#07172b");
        tg.setBackgroundColor("#020914");
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [tg]);

  /*
   * ذخیره موجودی کاربر
   */
  useEffect(() => {
    localStorage.setItem(
      getStorageKey(user.id),
      String(balance)
    );
  }, [balance, user.id]);

  /*
   * شروع بازی
   */
  function startGame() {
    if (running) {
      return;
    }

    if (!Number.isFinite(bet) || bet <= 0) {
      alert("لطفاً مقدار توکن را وارد کنید.");
      return;
    }

    if (bet > balance) {
      alert("موجودی توکن شما کافی نیست.");
      return;
    }

    setBalance((old) => old - bet);

    setMultiplier(1);

    setCrashed(false);

    setRunning(true);

    /*
     * نقطه انفجار نسخه نمایشی
     */
    crashPoint.current = +(
      1.05 +
      Math.random() * 4
    ).toFixed(2);

    let value = 1;

    timer.current = setInterval(() => {

      value = +(
        value +
        0.025 +
        value * 0.008
      ).toFixed(2);

      if (value >= crashPoint.current) {

        clearInterval(timer.current);

        setMultiplier(
          crashPoint.current
        );

        setRunning(false);

        setCrashed(true);

        setHistory((old) => [
          {
            multiplier:
              crashPoint.current,

            result: "باخت",

            amount: -bet
          },

          ...old
        ].slice(0, 10));

      } else {

        setMultiplier(value);

      }

    }, 80);
  }

  /*
   * برداشت
   */
  function cashOut() {
    if (!running) {
      return;
    }

    clearInterval(timer.current);

    const reward = Math.floor(
      bet * multiplier
    );

    setBalance(
      (old) => old + reward
    );

    setRunning(false);

    setHistory((old) => [
      {
        multiplier,

        result: "برد",

        amount: reward - bet
      },

      ...old
    ].slice(0, 10));
  }

  /*
   * نصف موجودی
   */
  function setHalf() {
    setBet(
      Math.max(
        1,
        Math.floor(balance / 2)
      )
    );
  }

  /*
   * دو برابر
   */
  function setDouble() {
    setBet(
      Math.min(
        balance,
        Math.max(1, bet * 2)
      )
    );
  }

  /*
   * کل موجودی
   */
  function setMax() {
    setBet(balance);
  }

  /*
   * تشخیص ادمین
   */
  const isAdmin =
    user.id === ADMIN_ID;

  return (
    <div className="app">

      {/* Header */}

      <header className="header">

        <div>

          <h1>
            🚀 ARYAN Rocket
          </h1>

          <span>
            سلام {user.name}
          </span>

        </div>

        <div className="balance">

          🪙{" "}

          {balance.toLocaleString(
            "en-US"
          )}

        </div>

      </header>


      <main>

        {/* Game */}

        <section className="game">

          <div className="stars"></div>

          <div
            className={
              running
                ? "rocket rocketFlying"
                : "rocket"
            }
          >
            🚀
          </div>

          <div
            className={
              crashed
                ? "multiplier crashed"
                : "multiplier"
            }
          >
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


        {/* Bet */}

        <section className="panel">

          <label>
            مقدار توکن
          </label>

          <div className="betBox">

            <input
              type="number"
              min="1"
              value={bet}
              onChange={(e) =>
                setBet(
                  Number(e.target.value)
                )
              }
            />

            <button
              onClick={setHalf}
            >
              ½
            </button>

            <button
              onClick={setDouble}
            >
              2×
            </button>

            <button
              onClick={setMax}
            >
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
              💰 برداشت در{" "}
              {multiplier.toFixed(2)}x
            </button>

          )}

          <div className="startingBonus">

            🎁 موجودی اولیه کاربران:
            <b> 1000 توکن</b>

          </div>

        </section>


        {/* History */}

        <section className="panel">

          <h2>
            📜 تاریخچه بازی
          </h2>

          {history.length === 0 ? (

            <div className="empty">

              هنوز بازی انجام نداده‌اید

            </div>

          ) : (

            history.map(
              (item, index) => (

                <div
                  className="historyRow"
                  key={index}
                >

                  <span
                    className={
                      item.amount >= 0
                        ? "win"
                        : "lose"
                    }
                  >
                    {item.result}
                  </span>

                  <b>
                    {item.multiplier.toFixed(2)}
                    x
                  </b>

                  <strong
                    className={
                      item.amount >= 0
                        ? "win"
                        : "lose"
                    }
                  >
                    {item.amount >= 0
                      ? "+"
                      : ""}

                    {item.amount}

                  </strong>

                </div>

              )
            )

          )}

        </section>


        {/* Admin */}

        {isAdmin && (

          <section className="admin">

            <h2>
              👑 پنل مدیریت
            </h2>

            <p>
              شما مدیر سیستم هستید.
            </p>

            <div className="adminButtons">

              <button>
                ➕ افزودن توکن
              </button>

              <button>
                ➖ کسر توکن
              </button>

              <button>
                👥 کاربران
              </button>

            </div>

          </section>

        )}

      </main>


      <footer>

        ARYAN Rocket

        <br />

        🎁 هر کاربر جدید 1000 توکن مجازی دریافت می‌کند.

      </footer>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);
