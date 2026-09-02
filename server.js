const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// فایل‌های public
app.use(express.static(path.join(__dirname, "public")));

// صفحه اصلی
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// تست سالم بودن سرور
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
