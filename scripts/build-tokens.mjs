import { readFile, writeFile } from 'node:fs/promises';

const source = new URL('../production/design-tokens.json', import.meta.url);
const target = new URL('../production/css/tokens.generated.css', import.meta.url);
const tokens = JSON.parse(await readFile(source, 'utf8'));
const declarations = (group) => Object.entries(group).map(([key, value]) => `  --ovgo-${key}: ${value};`).join('\n');
const css = `/* Generated from production/design-tokens.json. Do not edit. */\n#optivue-growth-os {\n${declarations({...tokens.dark, ...tokens.shared})}\n}\n#optivue-growth-os[data-theme="light"] {\n${declarations(tokens.light)}\n}\n`;
await writeFile(target, css);
