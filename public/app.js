let balance = 10000;
let playing = false;
let cashedOut = false;
let multiplier = 1.00;
let crashPoint = 0;
let timer = null;

const balanceEl = document.getElementById("balance");
const multiplierEl = document.getElementById("multiplier");
const statusEl = document.getElementById("status");
const rocketEl = document.getElementById("rocket");
const actionEl = document.getElementById("action");

function updateBalance() {
  balanceEl.textContent = balance.toLocaleString("en-US");
}

function randomCrash() {
  // امتیازها کاملاً مجازی هستند
  return Number((1.05 + Math.random() * 5).toFixed(2));
}

function startGame() {
  if (playing) return;

  const amount = Number(document.getElementById("amount").value);

  if (!amount || amount < 10) {
    alert("حداقل شرط ۱۰ امتیاز است.");
    return;
  }

  if (amount > balance) {
    alert("امتیاز کافی نداری.");
    return;
  }

  balance -= amount;
  updateBalance();

  playing = true;
  cashedOut = false;
  multiplier = 1.00;
  crashPoint = randomCrash();

  statusEl.textContent = "🚀 موشک در حال صعود...";
  actionEl.textContent = "💰 برداشت";
  actionEl.style.background =
    "linear-gradient(#09bd5e,#078f45)";

  rocketEl.style.display = "block";

  clearInterval(timer);

  timer = setInterval(() => {

    multiplier += 0.02 + Math.random() * 0.035;
    multiplier = Number(multiplier.toFixed(2));

    multiplierEl.textContent =
      multiplier.toFixed(2) + "x";

    const move =
      Math.min(220, (multiplier - 1) * 70);

    rocketEl.style.transform =
      `translateY(-${move}px) rotate(-18deg)`;

    if (multiplier >= crashPoint) {
      crash();
    }

  }, 100);
}

function crash() {
  clearInterval(timer);

  playing = false;

  statusEl.textContent = "💥 انفجار!";
  multiplierEl.textContent =
    multiplier.toFixed(2) + "x";

  rocketEl.style.display = "none";

  actionEl.textContent = "🚀 بازی دوباره";

  setTimeout(() => {
    rocketEl.style.display = "block";
    rocketEl.style.transform =
      "translateY(0) rotate(-18deg)";
  }, 1200);
}

function cashOut() {

  if (!playing || cashedOut) return;

  const amount =
    Number(document.getElementById("amount").value);

  const win =
    Math.floor(amount * multiplier);

  balance += win;
  updateBalance();

  cashedOut = true;

  statusEl.textContent =
    `🎉 برداشت موفق: ${win.toLocaleString()} امتیاز`;

  actionEl.textContent = "🚀 بازی دوباره";

  clearInterval(timer);

  playing = false;
}

actionEl.addEventListener("click", () => {

  if (playing && !cashedOut) {
    cashOut();
  } else {
    startGame();
  }

});

updateBalance();
