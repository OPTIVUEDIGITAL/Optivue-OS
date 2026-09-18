import fs from "node:fs";

const files = fs.readdirSync(".")
  .filter(name => /^lighthouse-\d+\.json$/.test(name))
  .sort();

if (files.length !== 3) {
  console.error(`Expected 3 Lighthouse reports, found ${files.length}`);
  process.exit(1);
}

const runs = files.map(file => {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return {
    file,
    performance: Math.round((data.categories.performance.score ?? 0) * 100),
    accessibility: Math.round((data.categories.accessibility.score ?? 0) * 100),
    cls: data.audits["cumulative-layout-shift"]?.numericValue ?? Number.POSITIVE_INFINITY,
    fcp: data.audits["first-contentful-paint"]?.numericValue ?? null,
    lcp: data.audits["largest-contentful-paint"]?.numericValue ?? null,
  };
});

const performanceScores = runs.map(r => r.performance).sort((a,b) => a-b);
const medianPerformance = performanceScores[1];

console.log(JSON.stringify({ runs, medianPerformance }, null, 2));

let failed = false;

if (medianPerformance < 90) {
  console.error(`Median performance ${medianPerformance} is below 90`);
  failed = true;
}

for (const run of runs) {
  if (run.accessibility < 95) {
    console.error(`${run.file}: accessibility ${run.accessibility} is below 95`);
    failed = true;
  }
  if (run.cls >= 0.05) {
    console.error(`${run.file}: CLS ${run.cls} is not below 0.05`);
    failed = true;
  }
}

if (failed) process.exit(1);
