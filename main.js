let prices = null;
let currentCity = "sanaa";

const ratesContainer = document.getElementById("ratesContainer");
const goldContainer = document.getElementById("goldContainer");
const lastUpdate = document.getElementById("lastUpdate");
const themeToggle = document.getElementById("themeToggle");

const calcCity = document.getElementById("calcCity");
const calcType = document.getElementById("calcType");
const calcAmount = document.getElementById("calcAmount");
const calcResult = document.getElementById("calcResult");

/* ===== Dark Mode ===== */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.textContent = dark ? "☀️" : "🌙";
};

/* ===== Tabs ===== */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCity = tab.dataset.city;
    renderRates();
    renderGold();
  };
});

/* ===== Load Prices ===== */
fetch("prices.json")
  .then(res => res.json())
  .then(data => {
    prices = data;
    lastUpdate.textContent =
      "آخر تحديث: " + new Date(data.updated_at).toLocaleString("ar-YE");
    renderRates();
    renderGold();
  })
  .catch(() => {
    lastUpdate.textContent = "تعذر جلب الأسعار";
  });

/* ===== Render ===== */
function renderRates() {
  if (!prices) return;
  const c = prices[currentCity];

  ratesContainer.innerHTML = `
    <div class="card">
      <strong>دولار أمريكي</strong>
      <div class="rate buy">شراء: ${c.usd.buy}</div>
      <div class="rate sell">بيع: ${c.usd.sell}</div>
    </div>
    <div class="card">
      <strong>ريال سعودي</strong>
      <div class="rate buy">شراء: ${c.sar.buy}</div>
      <div class="rate sell">بيع: ${c.sar.sell}</div>
    </div>
  `;
}

function renderGold() {
  if (!prices) return;
  const c = prices[currentCity];

  goldContainer.innerHTML = `
    <div class="card">
      <strong>جرام ذهب 21</strong>
      <div class="rate">${c.gold.gram} ريال</div>
    </div>
    <div class="card">
      <strong>جنيه ذهب</strong>
      <div class="rate">${c.gold.pound} ريال</div>
    </div>
  `;
}

/* ===== Calculator ===== */
function calculate() {
  if (!prices) return;

  const city = prices[calcCity.value];
  const amount = parseFloat(calcAmount.value);
  if (!amount) {
    calcResult.textContent = "—";
    return;
  }

  let result = 0;
  switch (calcType.value) {
    case "usd_to_yer": result = amount * city.usd.sell; break;
    case "yer_to_usd": result = amount / city.usd.buy; break;
    case "sar_to_yer": result = amount * city.sar.sell; break;
    case "yer_to_sar": result = amount / city.sar.buy; break;
    case "gold_gram": result = amount * city.gold.gram; break;
    case "gold_pound": result = amount * city.gold.pound; break;
  }

  calcResult.textContent = result.toLocaleString() + " ريال";
}

calcCity.onchange = calculate;
calcType.onchange = calculate;
calcAmount.oninput = calculate;