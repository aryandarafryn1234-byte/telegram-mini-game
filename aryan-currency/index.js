require("dotenv").config();

const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const NETARZ_FX_KEY = process.env.NETARZ_FX_KEY;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN پیدا نشد");
  process.exit(1);
}

if (!NETARZ_FX_KEY) {
  console.error("❌ NETARZ_FX_KEY پیدا نشد");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const NETARZ_API = "https://netarz.ir/api/fx/v1";
const COINGECKO_API =
  "https://api.coingecko.com/api/v3/simple/price";

// ===============================
// ارزهای معمولی
// ===============================

const FIAT = {
  دلار: {
    code: "USD",
    name: "دلار آمریکا",
    icon: "💵"
  },
  یورو: {
    code: "EUR",
    name: "یورو",
    icon: "💶"
  },
  پوند: {
    code: "GBP",
    name: "پوند انگلیس",
    icon: "💷"
  },
  درهم: {
    code: "AED",
    name: "درهم امارات",
    icon: "🇦🇪"
  },
  لیر: {
    code: "TRY",
    name: "لیر ترکیه",
    icon: "🇹🇷"
  },
  فرانک: {
    code: "CHF",
    name: "فرانک سوئیس",
    icon: "🇨🇭"
  },
  دلارکانادا: {
    code: "CAD",
    name: "دلار کانادا",
    icon: "🇨🇦"
  },
  دلاراسترالیا: {
    code: "AUD",
    name: "دلار استرالیا",
    icon: "🇦🇺"
  }
};

// ===============================
// رمزارزها
// ===============================

const CRYPTO = {
  بیتکوین: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "BTC",
    icon: "₿"
  },

  بیتکوین: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "BTC",
    icon: "₿"
  },

  btc: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "BTC",
    icon: "₿"
  },

  اتریوم: {
    id: "ethereum",
    name: "اتریوم",
    symbol: "ETH",
    icon: "Ξ"
  },

  eth: {
    id: "ethereum",
    name: "اتریوم",
    symbol: "ETH",
    icon: "Ξ"
  },

  تتر: {
    id: "tether",
    name: "تتر",
    symbol: "USDT",
    icon: "₮"
  },

  usdt: {
    id: "tether",
    name: "تتر",
    symbol: "USDT",
    icon: "₮"
  },

  سولانا: {
    id: "solana",
    name: "سولانا",
    symbol: "SOL",
    icon: "◎"
  },

  sol: {
    id: "solana",
    name: "سولانا",
    symbol: "SOL",
    icon: "◎"
  },

  ریپل: {
    id: "ripple",
    name: "ریپل",
    symbol: "XRP",
    icon: "XRP"
  },

  xrp: {
    id: "ripple",
    name: "ریپل",
    symbol: "XRP",
    icon: "XRP"
  },

  دوجکوین: {
    id: "dogecoin",
    name: "دوج‌کوین",
    symbol: "DOGE",
    icon: "Ð"
  },

  doge: {
    id: "dogecoin",
    name: "دوج‌کوین",
    symbol: "DOGE",
    icon: "Ð"
  },

  کاردانو: {
    id: "cardano",
    name: "کاردانو",
    symbol: "ADA",
    icon: "ADA"
  },

  ada: {
    id: "cardano",
    name: "کاردانو",
    symbol: "ADA",
    icon: "ADA"
  },

  ترون: {
    id: "tron",
    name: "ترون",
    symbol: "TRX",
    icon: "TRX"
  },

  trx: {
    id: "tron",
    name: "ترون",
    symbol: "TRX",
    icon: "TRX"
  }
};

// ===============================
// تبدیل اعداد فارسی به انگلیسی
// ===============================

function englishNumbers(text) {
  return String(text)
    .replace(/[۰-۹]/g, (x) =>
      "۰۱۲۳۴۵۶۷۸۹".indexOf(x)
    )
    .replace(/[٠-٩]/g, (x) =>
      "٠١٢٣٤٥٦٧٨٩".indexOf(x)
    );
}

// ===============================
// فرمت عدد
// ===============================

function numberFormat(value, decimals = 0) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// ===============================
// تشخیص پیام
// ===============================

function parseMessage(text) {
  if (!text) return null;

  let message = englishNumbers(text)
    .replace(/‌/g, "")
    .trim()
    .toLowerCase();

  // جدا کردن عدد
  const match = message.match(
    /^\s*(\d+(?:[.,]\d+)?)\s*(.*)$/i
  );

  if (!match) {
    return null;
  }

  const amount = Number(
    match[1].replace(/,/g, "")
  );

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  let currency = match[2]
    .trim()
    .replace(/\s+/g, "");

  // -------------------------
  // ارز معمولی
  // -------------------------

  for (const key of Object.keys(FIAT)) {
    if (currency === key) {
      return {
        type: "fiat",
        amount,
        currency: FIAT[key]
      };
    }
  }

  // -------------------------
  // رمزارز
  // -------------------------

  for (const key of Object.keys(CRYPTO)) {
    if (currency === key) {
      return {
        type: "crypto",
        amount,
        crypto: CRYPTO[key]
      };
    }
  }

  return null;
}

// ===============================
// دریافت قیمت ارز معمولی
// ===============================

async function getFiat(code) {
  const response = await fetch(
    `${NETARZ_API}/rates/${code}`,
    {
      headers: {
        Authorization: `Bearer ${NETARZ_FX_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `NetArz HTTP ${response.status}`
    );
  }

  const json = await response.json();

  if (!json.data) {
    throw new Error("اطلاعات نرخ پیدا نشد");
  }

  return json.data;
}

// ===============================
// دریافت قیمت کریپتو
// ===============================

async function getCrypto(id) {
  const url =
    `${COINGECKO_API}` +
    `?ids=${encodeURIComponent(id)}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `CoinGecko HTTP ${response.status}`
    );
  }

  const json = await response.json();

  if (
    !json[id] ||
    json[id].usd === undefined
  ) {
    throw new Error(
      "قیمت رمزارز پیدا نشد"
    );
  }

  return json[id];
}

// ===============================
// پاسخ ارز معمولی
// ===============================

async function fiatResponse(data) {
  const rate = await getFiat(
    data.currency.code
  );

  const mid = Number(rate.mid);
  const buy = Number(rate.buy);
  const sell = Number(rate.sell);

  if (!Number.isFinite(mid)) {
    throw new Error(
      "نرخ میانگین نامعتبر است"
    );
  }

  const total =
    data.amount * mid;

  let text = "";

  text += "💱 <b>ARYAN CURRENCY</b>\n\n";

  text += `${data.currency.icon} `;
  text += `<b>${numberFormat(data.amount)} `;
  text += `${data.currency.name}</b>\n\n`;

  text += "💰 ارزش تقریبی:\n";
  text += `<code>${numberFormat(total)} تومان</code>\n\n`;

  text += "📊 قیمت هر واحد:\n";

  if (Number.isFinite(buy)) {
    text += `🟢 خرید: <code>${numberFormat(
      buy
    )} تومان</code>\n`;
  }

  if (Number.isFinite(sell)) {
    text += `🔴 فروش: <code>${numberFormat(
      sell
    )} تومان</code>\n`;
  }

  text += `⚪ میانگین: <code>${numberFormat(
    mid
  )} تومان</code>\n\n`;

  text += "🕐 قیمت لحظه‌ای\n";
  text += "⚡ منبع: NetArz";

  return text;
}

// ===============================
// پاسخ کریپتو
// ===============================

async function cryptoResponse(data) {
  const price = await getCrypto(
    data.crypto.id
  );

  const usd = Number(price.usd);

  const total =
    data.amount * usd;

  const change =
    price.usd_24h_change !== undefined
      ? Number(price.usd_24h_change)
      : null;

  const decimals =
    usd < 1 ? 6 : 2;

  let text = "";

  text += "💱 <b>ARYAN CURRENCY</b>\n\n";

  text += `${data.crypto.icon} `;
  text += `<b>${numberFormat(
    data.amount,
    8
  )} ${data.crypto.name}</b>\n\n`;

  text += "💵 قیمت هر واحد:\n";
  text += `<code>$${numberFormat(
    usd,
    decimals
  )}</code>\n\n`;

  text += "💰 ارزش کل:\n";
  text += `<code>$${numberFormat(
    total,
    decimals
  )} USD</code>\n`;

  if (change !== null) {
    const icon =
      change > 0
        ? "📈"
        : change < 0
        ? "📉"
        : "➖";

    text += `\n${icon} تغییر ۲۴ ساعت: `;
    text += `<b>${change.toFixed(2)}%</b>\n`;
  }

  text += "\n🕐 قیمت لحظه‌ای بازار\n";
  text += "⚡ منبع: CoinGecko";

  return text;
}

// ===============================
// /start
// ===============================

bot.start(async (ctx) => {
  await ctx.reply(
    `
💱 <b>ARYAN CURRENCY</b>

سلام 👋

من قیمت لحظه‌ای ارزها و رمزارزها را محاسبه می‌کنم.

<b>مثال:</b>

<code>100 دلار</code>
<code>50 یورو</code>
<code>1 بیتکوین</code>
<code>0.5 اتریوم</code>
<code>100 تتر</code>

💵 ارزهای معمولی → تومان
₿ رمزارزها → USD
`,
    {
      parse_mode: "HTML"
    }
  );
});

// ===============================
// /help
// ===============================

bot.help(async (ctx) => {
  await ctx.reply(
    `
💱 <b>راهنمای ARYAN CURRENCY</b>

فقط مقدار و نام ارز را بنویس:

<code>100 دلار</code>
<code>250 یورو</code>
<code>1 بیتکوین</code>
<code>2 اتریوم</code>
<code>100 تتر</code>

💵 ارزهای معمولی → تومان
₿ رمزارزها → دلار آمریکا
`,
    {
      parse_mode: "HTML"
    }
  );
});

// ===============================
// پیام‌های متنی
// ===============================

bot.on("text", async (ctx) => {
  try {
    const text = ctx.message.text;

    if (!text) return;

    // دستورات را نادیده بگیر
    if (text.startsWith("/")) {
      return;
    }

    // پیام خیلی طولانی را بررسی نکن
    if (text.length > 100) {
      return;
    }

    const data = parseMessage(text);

    if (!data) {
      return;
    }

    let answer;

    if (data.type === "fiat") {
      answer = await fiatResponse(data);
    } else {
      answer = await cryptoResponse(data);
    }

    await ctx.reply(answer, {
      parse_mode: "HTML",
      reply_parameters: {
        message_id: ctx.message.message_id
      }
    });

  } catch (error) {
    console.error(
      "❌ ERROR:",
      error.message
    );

    await ctx.reply(
      "❌ دریافت قیمت با مشکل مواجه شد. لطفاً چند لحظه بعد دوباره امتحان کنید."
    );
  }
});

// ===============================
// اجرای ربات
// ===============================

async function start() {
  try {
    const botInfo =
      await bot.telegram.getMe();

    console.log(
      `✅ ربات @${botInfo.username} آماده است`
    );

    await bot.launch();

    console.log(
      "🚀 ARYAN CURRENCY RUNNING"
    );

  } catch (error) {
    console.error(
      "❌ اجرای ربات ناموفق بود:"
    );

    console.error(error.message);

    process.exit(1);
  }
}

start();

// ===============================
// خاموش شدن امن
// ===============================

process.once(
  "SIGINT",
  () => bot.stop("SIGINT")
);

process.once(
  "SIGTERM",
  () => bot.stop("SIGTERM")
);
