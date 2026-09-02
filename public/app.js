let balance = 0;

const balanceElement = document.getElementById("balance");
const usernameElement = document.getElementById("username");

// گرفتن اطلاعات کاربر از Telegram Mini App
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  const user = Telegram.WebApp.initDataUnsafe?.user;

  if (user) {
    usernameElement.textContent =
      user.first_name || user.username || "بازیکن";
  }
}

// شروع بازی
function startGame() {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.HapticFeedback?.impactOccurred("medium");
  }

  alert("🎮 بازی به‌زودی شروع می‌شود!");
}

// نمایش بخش‌ها
function showSection(section) {

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.HapticFeedback?.selectionChanged();
  }

  if (section === "home") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    return;
  }

  if (section === "gifts") {
    alert("🎒 کوله‌پشتی شما هنوز خالی است.");
    return;
  }

  if (section === "invite") {
    const link = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }

    alert(
      "👥 لینک دعوت شما آماده شد!\n\n" +
      "لینک برنامه:\n" +
      link
    );

    return;
  }

  if (section === "leaderboard") {
    alert(
      "🏆 جدول برترین‌ها\n\n" +
      "🥇 بازیکن اول — 1250 💎\n" +
      "🥈 بازیکن دوم — 980 💎\n" +
      "🥉 بازیکن سوم — 760 💎"
    );

    return;
  }

  if (section === "earn") {
    alert(
      "💎 راه‌های کسب امتیاز\n\n" +
      "🎮 بازی کردن\n" +
      "👥 دعوت دوستان\n" +
      "🎁 دریافت هدیه"
    );

    return;
  }
}

// اضافه کردن سکه
function addBalance(amount) {
  balance += amount;

  balanceElement.textContent = balance.toLocaleString("en-US");
}

// مقدار اولیه
addBalance(0);
