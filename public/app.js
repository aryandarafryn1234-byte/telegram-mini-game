const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

let coins = Number(localStorage.getItem("coins") || 1000);

function updateCoins() {
  const el = document.getElementById("coins");
  if (el) {
    el.textContent = coins.toLocaleString("en-US");
  }
  localStorage.setItem("coins", coins);
}

updateCoins();

function startGame() {
  playRocket();
}

function playRocket() {
  if (tg) {
    tg.HapticFeedback?.impactOccurred("medium");
  }

  window.location.href = "rocket.html";
}

function playGiftCrash() {
  if (tg) {
    tg.HapticFeedback?.impactOccurred("medium");
  }

  alert("🎁 Gift Crash به‌زودی فعال می‌شود!");
}

function inviteFriends() {
  const botUsername = "ARY_IR";

  let userId = "";

  if (tg?.initDataUnsafe?.user) {
    userId = tg.initDataUnsafe.user.id || "";
  }

  const inviteLink = userId
    ? `https://t.me/${botUsername}?start=ref_${userId}`
    : `https://t.me/${botUsername}?start=invite`;

  const text = "🎁 بیا با هم Gift Game بازی کنیم و جایزه بگیر! 🚀";

  const shareUrl =
    `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;

  window.location.href = shareUrl;
}

function showGifts() {
  alert("🎁 هنوز هدیه‌ای دریافت نکردی.");
}

function showRanking() {
  alert(
    "🏆 رتبه‌بندی\n\n" +
    "🥇 Player 1 — 12,500 💎\n" +
    "🥈 Player 2 — 9,800 💎\n" +
    "🥉 Player 3 — 7,600 💎"
  );
}

function showEarnings() {
  alert(
    "💎 کسب امتیاز\n\n" +
    "🎮 بازی کن\n" +
    "👥 دوستانت را دعوت کن\n" +
    "🎁 هدیه دریافت کن"
  );
}

function showHome() {
  window.scrollTo({
    top: 1000,
    behavior: "smooth"
  });
}
