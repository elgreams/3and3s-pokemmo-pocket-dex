#!/usr/bin/env node
const { mkdir, writeFile } = require("fs/promises");
const path = require("path");
const process = require("process");
const readline = require("readline/promises");

const ITEMS_URL = "https://pokemmohub.com/page-data/items/page-data.json";
const ITEM_PAGE_BASE = "https://pokemmohub.com/items";
const ITEM_IMAGE_REGEX = /\/item\/(\d+)\.(png|webp|jpg|jpeg)\b/i;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const normalizeOutputPath = (outputDir, fileName) => {
  const resolvedDir = outputDir.trim() || process.cwd();
  const resolvedFile = fileName.trim() || "itemdata.json";
  return path.resolve(resolvedDir, resolvedFile);
};

const promptForOutput = async () => {
  const outputDir = await rl.question(
    "Output directory (default: current directory): ",
  );
  const fileName = await rl.question(
    "Output JSON filename (default: itemdata.json): ",
  );
  return normalizeOutputPath(outputDir, fileName);
};

const fetchItems = async () => {
  const response = await fetch(ITEMS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch items list (${response.status}).`);
  }
  const payload = await response.json();
  const nodes = payload?.result?.data?.allPokemmo?.nodes;
  if (!Array.isArray(nodes)) {
    throw new Error("Unexpected response shape from items list.");
  }
  return nodes;
};

const fetchItemImageId = async (slug) => {
  const response = await fetch(`${ITEM_PAGE_BASE}/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch item page for ${slug} (${response.status}).`);
  }
  const html = await response.text();
  const match = html.match(ITEM_IMAGE_REGEX);
  return match ? Number(match[1]) : null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildItemData = async (items) => {
  const results = [];

  for (const [index, item] of items.entries()) {
    const imageId = await fetchItemImageId(item.slug).catch(() => null);

    results.push({
      id: item.item_id,
      type: item.category,
      name: item.n?.en ?? item.slug,
      description: item.d?.en ?? "",
      imageId,
    });

    if ((index + 1) % 50 === 0 || index + 1 === items.length) {
      console.log(`Processed ${index + 1}/${items.length} items...`);
    }

    await sleep(150);
  }

  return results;
};

const main = async () => {
  try {
    const outputPath = await promptForOutput();
    const outputDir = path.dirname(outputPath);
    await mkdir(outputDir, { recursive: true });

    console.log("Fetching item list...");
    const items = await fetchItems();

    const itemData = await buildItemData(items);

    await writeFile(outputPath, JSON.stringify(itemData, null, 2), "utf-8");
    console.log(`Item data written to ${outputPath}`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
};

main();
