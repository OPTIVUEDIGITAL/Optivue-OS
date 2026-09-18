import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("lighthouse.json", "utf8"));
const performance = Math.round((data.categories.performance.score ?? 0) * 100);
const accessibility = Math.round((data.categories.accessibility.score ?? 0) * 100);
const cls = data.audits["cumulative-layout-shift"]?.numericValue ?? Number.POSITIVE_INFINITY;

console.log(JSON.stringify({ performance, accessibility, cls }, null, 2));

if (performance < 90) {
  console.error(`Performance ${performance} is below 90`);
  process.exitCode = 1;
}
if (accessibility < 95) {
  console.error(`Accessibility ${accessibility} is below 95`);
  process.exitCode = 1;
}
if (cls >= 0.05) {
  console.error(`CLS ${cls} is not below 0.05`);
  process.exitCode = 1;
}
