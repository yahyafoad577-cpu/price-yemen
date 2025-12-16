import fs from "fs";
import fetch from "node-fetch";

const CHANNEL_URL = "https://t.me/s/alkuraimii";
const OUTPUT = "./prices.json";

function extractNumber(text) {
  const m = text.replace(/,/g, "").match(/\d+/g);
  return m ? Number(m[0]) : null;
}

function parseMessage(text) {
  const data = {
    sanaa: { usd: {}, sar: {}, gold: {} },
    aden: { usd: {}, sar: {}, gold: {} }
  };

  const lines = text.split("\n");

  lines.forEach(line => {
    if (line.includes("صنعاء") && line.includes("دولار")) {
      if (line.includes("شراء")) data.sanaa.usd.buy = extractNumber(line);
      if (line.includes("بيع")) data.sanaa.usd.sell = extractNumber(line);
    }

    if (line.includes("عدن") && line.includes("دولار")) {
      if (line.includes("شراء")) data.aden.usd.buy = extractNumber(line);
      if (line.includes("بيع")) data.aden.usd.sell = extractNumber(line);
    }

    if (line.includes("صنعاء") && line.includes("سعودي")) {
      if (line.includes("شراء")) data.sanaa.sar.buy = extractNumber(line);
      if (line.includes("بيع")) data.sanaa.sar.sell = extractNumber(line);
    }

    if (line.includes("عدن") && line.includes("سعودي")) {
      if (line.includes("شراء")) data.aden.sar.buy = extractNumber(line);
      if (line.includes("بيع")) data.aden.sar.sell = extractNumber(line);
    }

    if (line.includes("جرام") && line.includes("21")) {
      if (line.includes("صنعاء")) data.sanaa.gold.gram = extractNumber(line);
      if (line.includes("عدن")) data.aden.gold.gram = extractNumber(line);
    }

    if (line.includes("جنيه")) {
      if (line.includes("صنعاء")) data.sanaa.gold.pound = extractNumber(line);
      if (line.includes("عدن")) data.aden.gold.pound = extractNumber(line);
    }
  });

  if (!data.sanaa.usd.buy || !data.aden.usd.buy) return null;
  return data;
}

async function run() {
  const res = await fetch(CHANNEL_URL);
  const html = await res.text();

  const match = html.match(/<div class="tgme_widget_message_text[^"]*">([\s\S]*?)<\/div>/);
  if (!match) return;

  const text = match[1].replace(/<[^>]+>/g, "").trim();
  const parsed = parseMessage(text);
  if (!parsed) return;

  const output = {
    ...parsed,
    source: "Telegram - بنك الكريمي",
    updated_at: new Date().toISOString()
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
}

run();
