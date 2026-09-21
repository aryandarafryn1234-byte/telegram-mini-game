require("dotenv").config();

const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const NETARZ_FX_KEY = process.env.NETARZ_FX_KEY;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN در فایل .env وجود ندارد");
  process.exit(1);
}

if (!NETARZ_FX_KEY) {
  console.error("❌ NETARZ_FX_KEY در فایل .env وجود ندارد");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --------------------------------------------------
// تنظیمات
// --------------------------------------------------

const NETARZ_API =
  "https://netarz.ir/api/fx/v1";

const COINGECKO_API =
  "https://api.coingecko.com/api/v3/simple/price";

// ارزهای معمولی
const FIAT_CURRENCIES = {
  دلار: {
    code: "USD",
    name: "دلار آمریکا",
    symbol: "💵"
  },

  یورو: {
    code: "EUR",
    name: "یورو",
    symbol: "💶"
  },

  پوند: {
    code: "GBP",
    name: "پوند انگلیس",
    symbol: "💷"
  },

  درهم: {
    code: "AED",
    name: "درهم امارات",
    symbol: "🇦🇪"
  },

  لیر: {
    code: "TRY",
    name: "لیر ترکیه",
    symbol: "🇹🇷"
  },

  دلار_کانادا: {
    code: "CAD",
    name: "دلار کانادا",
    symbol: "🇨🇦"
  },

  دلار_استرالیا: {
    code: "AUD",
    name: "دلار استرالیا",
    symbol: "🇦🇺"
  },

  فرانک: {
    code: "CHF",
    name: "فرانک سوئیس",
    symbol: "🇨🇭"
  }
};

// رمزارزها
const CRYPTO_CURRENCIES = {
  بیتکوین: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "₿"
  },

  بیت_کوین: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "₿"
  },

  btc: {
    id: "bitcoin",
    name: "بیت‌کوین",
    symbol: "₿"
  },

  اتریوم: {
    id: "ethereum",
    name: "اتریوم",
    symbol: "Ξ"
  },

  اتریوم: {
    id: "ethereum",
    name: "اتریوم",
    symbol: "Ξ"
  },

  eth: {
    id: "ethereum",
    name: "اتریوم",
    symbol: "Ξ"
  },

  تتر: {
    id: "tether",
    name: "تتر",
    symbol: "₮"
  },

  usdt: {
    id: "tether",
    name: "تتر",
    symbol: "₮"
  },

  سولانا: {
    id: "solana",
    name: "سولانا",
    symbol: "◎"
  },

  sol: {
    id: "solana",
    name: "سولانا",
    symbol: "◎"
  },

  ریپل: {
    id: "ripple",
    name: "ریپل",
    symbol: "XRP"
  },

  xrp: {
    id: "ripple",
    name: "ریپل",
    symbol: "XRP"
  },

  دوج: {
    id: "dogecoin",
    name: "دوج‌کوین",
    symbol: "Ð"
  },

  دوجکوین: {
    id: "dogecoin",
    name: "دوج‌کوین",
    symbol: "Ð"
  },

  doge: {
    id: "dogecoin",
    name: "دوج‌کوین",
    symbol: "Ð"
  },

  کاردانو: {
    id: "cardano",
    name: "کاردانو",
    symbol: "ADA"
  },

  ada: {
    id: "cardano",
    name: "کاردانو",
    symbol: "ADA"
  },

  ترون: {
    id: "tron",
    name: "ترون",
    symbol: "TRX"
  },

  trx: {
    id: "tron",
    name: "ترون",
    symbol: "TRX"
  }
};

// --------------------------------------------------
// اعداد فارسی
// --------------------------------------------------

function toEnglishNumbers(text) {
  return String(text)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

function toPersianNumbers(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

// --------------------------------------------------
// جداکننده اعداد
// --------------------------------------------------

function formatNumber(value, decimals = 0) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// --------------------------------------------------
// دریافت نرخ ارز معمولی
// --------------------------------------------------

async function getFiatRate(code) {
  const url = `${NETARZ_API}/rates/${code}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${NETARZ_FX_KEY}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `NetArz error ${response.status}: ${errorText}`
    );
  }

  const result = await response.json();

  if (!result.data) {
    throw new Error("نرخ ارز دریافت نشد");
  }

  return result.data;
}

// --------------------------------------------------
// دریافت قیمت رمزارز
// --------------------------------------------------

async function getCryptoPrice(id) {
  const url =
    `${COINGECKO_API}?ids=${encodeURIComponent(id)}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `CoinGecko error ${response.status}`
    );
  }

  const result = await response.json();

  if (!result[id] || result[id].usd === undefined) {
    throw new Error("قیمت رمزارز پیدا نشد");
  }

  return result[id];
}

// --------------------------------------------------
// تشخیص پیام
// --------------------------------------------------

function parsePriceMessage(text) {
  if (!text) {
    return null;
  }

  let value = toEnglishNumbers(text.trim());

  // اعداد فارسی/انگلیسی و اعشار
  const numberMatch = value.match(
    /(\d+(?:[.,]\d+)?)/
  );

  if (!numberMatch) {
    return null;
  }

  let amountString = numberMatch[1]
    .replace(/,/g, "");

  const amount = Number(amountString);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  let lower = value
    .toLowerCase()
    .replace(/‌/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // -------------------------------
  // ارزهای معمولی
  // -------------------------------

  for (const [keyword, currency] of Object.entries(
    FIAT_CURRENCIES
  )) {
    const cleanKeyword = keyword
      .replace(/_/g, " ")
      .toLowerCase();

    if (lower.includes(cleanKeyword)) {
      return {
        type: "fiat",
        amount,
        currency
      };
    }
  }

  // -------------------------------
  // رمزارز
  // -------------------------------

  for (const [keyword, crypto] of Object.entries(
    CRYPTO_CURRENCIES
  )) {
    const cleanKeyword = keyword
      .replace(/_/g, "")
      .toLowerCase();

    const cleanMessage = lower.replace(/ /g, "");

    if (cleanMessage.includes(cleanKeyword)) {
      return {
        type: "crypto",
        amount,
        crypto
      };
    }
  }

  return null;
}

// --------------------------------------------------
// ساخت پاسخ ارز معمولی
// --------------------------------------------------

async function createFiatResponse(data) {
  const {
    amount,
    currency
  } = data;

  const rate = await getFiatRate(currency.code);

  const unit = Number(rate.unit || 1);

  const mid = Number(rate.mid);
  const buy = Number(rate.buy);
  const sell = Number(rate.sell);

  const finalMid =
    (amount / unit) * mid;

  const finalBuy =
    (amount / unit) * buy;

  const finalSell =
    (amount / unit) * sell;

  let text = "";

  text += `💱 <b>ARYAN CURRENCY</b>\n\n`;

  text += `${currency.symbol} <b>${formatNumber(
    amount
  )} ${currency.name}</b>\n\n`;

  text += `💰 <b>قیمت تقریبی:</b>\n`;
  text += `<code>${formatNumber(
    finalMid
  )} تومان</code>\n\n`;

  text += `📊 نرخ هر واحد:\n`;
  text += `خرید: <code>${formatNumber(
    buy
  )} تومان</code>\n`;
  text += `فروش: <code>${formatNumber(
    sell
  )} تومان</code>\n`;
  text += `میانگین: <code>${formatNumber(
    mid
  )} تومان</code>\n\n`;

  if (rate.change_24h_percent !== undefined) {
    const change = Number(
      rate.change_24h_percent
    );

    const icon =
      change > 0
        ? "📈"
        : change < 0
        ? "📉"
        : "➖";

    text += `${icon} تغییر ۲۴ ساعت: <b>${change}%</b>\n`;
  }

  text += `\n🕐 آخرین بروزرسانی: `;

  if (rate.as_of) {
    text += `<code>${rate.as_of}</code>`;
  } else {
    text += `نامشخص`;
  }

  text += `\n\n`;
  text += `⚡ منبع نرخ: NetArz`;

  return text;
}

// --------------------------------------------------
// ساخت پاسخ رمزارز
// --------------------------------------------------

async function createCryptoResponse(data) {
  const {
    amount,
    crypto
  } = data;

  const price = await getCryptoPrice(
    crypto.id
  );

  const usdPrice = Number(price.usd);

  const total =
    amount * usdPrice;

  const change =
    price.usd_24h_change !== undefined
      ? Number(price.usd_24h_change)
      : null;

  let text = "";

  text += `💱 <b>ARYAN CURRENCY</b>\n\n`;

  text += `${crypto.symbol} <b>${formatNumber(
    amount,
    8
  )} ${crypto.name}</b>\n\n`;

  text += `💵 قیمت هر واحد:\n`;
  text += `<code>$${formatNumber(
    usdPrice,
    usdPrice < 1 ? 6 : 2
  )} USD</code>\n\n`;

  text += `💰 ارزش ${formatNumber(
    amount,
    8
  )} واحد:\n`;

  text += `<code>$${formatNumber(
    total,
    total < 1 ? 6 : 2
  )} USD</code>\n`;

  if (change !== null) {
    const icon =
      change > 0
        ? "📈"
        : change < 0
        ? "📉"
        : "➖";

    text += `\n${icon} تغییر ۲۴ ساعت: <b>${change.toFixed(
      2
    )}%</b>\n`;
  }

  text += `\n🕐 قیمت لحظه‌ای بازار\n`;
  text += `⚡ منبع: CoinGecko`;

  return text;
}

// --------------------------------------------------
// /start
// --------------------------------------------------

bot.start(async (ctx) => {
  const name =
    ctx.from?.first_name || "دوست عزیز";

  const text = `
👋 سلام <b>${name}</b>

به <b>ARYAN CURRENCY</b> خوش آمدی 💱

من قیمت ارزها و رمزارزها را برایت محاسبه می‌کنم.

<b>نمونه:</b>

<code>100 دلار</code>

<code>250 یورو</code>

<code>1 بیتکوین</code>

<code>0.5 اتریوم</code>

<code>100 تتر</code>

💵 ارزهای معمولی → تومان
₿ رمزارزها → دلار آمریکا

ربات را به گروه اضافه کن و پیام قیمت را ارسال کن.
`;

  await ctx.reply(text, {
    parse_mode: "HTML"
  });
});

// --------------------------------------------------
// /help
// --------------------------------------------------

bot.help(async (ctx) => {
  await ctx.reply(
    `
<b>💱 راهنمای ARYAN CURRENCY</b>

برای دریافت قیمت فقط بنویس:

<code>100 دلار</code>
<code>50 یورو</code>
<code>1 بیتکوین</code>
<code>2 اتریوم</code>
<code>100 تتر</code>

<b>ارزهای معمولی:</b>
دلار، یورو، پوند، درهم، لیر و ...

<b>رمزارزها:</b>
BTC، ETH، USDT، SOL، XRP، DOGE، ADA، TRX و ...

💵 ارزهای معمولی → تومان
₿ رمزارزها → USD
`,
    {
      parse_mode: "HTML"
    }
  );
});

// --------------------------------------------------
// پیام‌های گروه و خصوصی
// --------------------------------------------------

bot.on("text", async (ctx) => {
  try {
    const message = ctx.message;

    if (!message || !message.text) {
      return;
    }

    // دستورات را دوباره پردازش نکن
    if (message.text.startsWith("/")) {
      return;
    }

    const parsed =
      parsePriceMessage(message.text);

    if (!parsed) {
      return;
    }

    // جلوگیری از پردازش متن‌های خیلی طولانی
    if (message.text.length > 100) {
      return;
    }

    let response;

    if (parsed.type === "fiat") {
      response =
        await createFiatResponse(parsed);
    } else {
      response =
        await createCryptoResponse(parsed);
    }

    await ctx.reply(response, {
      parse_mode: "HTML",
      reply_parameters: {
        message_id: message.message_id
      }
    });

  } catch (error) {
    console.error(
      "❌ Error:",
      error.message
    );

    try {
      await ctx.reply(
        "❌ متأسفانه دریافت قیمت با مشکل مواجه شد. چند لحظه بعد دوباره امتحان کنید."
      );
    } catch {}
  }
});

// --------------------------------------------------
// خطاهای ربات
// --------------------------------------------------

bot.catch((error) => {
  console.error(
    "❌ Telegram bot error:",
    error
  );
});

// --------------------------------------------------
// اجرا
// --------------------------------------------------

async function startBot() {
  try {
    const me = await bot.telegram.getMe();

    console.log(
      `✅ ARYAN CURRENCY started: @${me.username}`
    );

    await bot.launch();

    console.log(
      "🚀 Bot is running..."
    );

  } catch (error) {
    console.error(
      "❌ Failed to start bot:",
      error.message
    );

    process.exit(1);
  }
}

startBot();

// --------------------------------------------------
// خاموش شدن امن
// --------------------------------------------------

process.once(
  "SIGINT",
  () => bot.stop("SIGINT")
);

process.once(
  "SIGTERM",
  () => bot.stop("SIGTERM")
);
