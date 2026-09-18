#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_CSS = (ROOT / "production/css/optivue.css").read_text(encoding="utf-8")
V2_CSS = (ROOT / "production/css/optivue-v2.css").read_text(encoding="utf-8")

VAR_PATTERN = re.compile(r"(--ovgo-[\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;")

def extract_block(text, selector):
    pattern = re.compile(re.escape(selector) + r"\s*\{([^}]*)\}", re.S)
    match = pattern.search(text)
    if not match:
        return {}
    return {k: v.upper() for k, v in VAR_PATTERN.findall(match.group(1))}

def hex_to_rgb(value):
    value = value.lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    return tuple(int(value[i:i+2], 16) / 255 for i in (0, 2, 4))

def luminance(rgb):
    def channel(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = luminance(hex_to_rgb(a)), luminance(hex_to_rgb(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

base_root = extract_block(BASE_CSS, "#optivue-growth-os")
v2_root = extract_block(V2_CSS, "#optivue-growth-os")
light_override = extract_block(BASE_CSS, '#optivue-growth-os[data-theme="light"]')

dark = dict(base_root)
dark.update(v2_root)

# The light selector is more specific than the v2 root selector, so its
# explicit values win even though v2 loads later.
light = dict(dark)
light.update(light_override)

themes = {
    "dark": dark,
    "light": light,
}

checks = [
    ("--ovgo-text", "--ovgo-bg"),
    ("--ovgo-muted", "--ovgo-bg"),
    ("--ovgo-subtle", "--ovgo-bg"),
    ("--ovgo-text", "--ovgo-surface"),
    ("--ovgo-muted", "--ovgo-surface"),
    ("--ovgo-subtle", "--ovgo-surface"),
    ("--ovgo-text", "--ovgo-surface-2"),
    ("--ovgo-muted", "--ovgo-surface-2"),
    ("--ovgo-subtle", "--ovgo-surface-2"),
]

failed = []
print("Optivue contrast audit")
for theme_name, tokens in themes.items():
    print(f"\n[{theme_name}]")
    for fg_key, bg_key in checks:
        if fg_key not in tokens or bg_key not in tokens:
            failed.append((theme_name, fg_key, bg_key, "missing token"))
            print(f"FAIL {fg_key} / {bg_key}: missing token")
            continue
        value = ratio(tokens[fg_key], tokens[bg_key])
        result = "PASS" if value >= 4.5 else "FAIL"
        print(
            f"{result} {fg_key} {tokens[fg_key]} on "
            f"{bg_key} {tokens[bg_key]} = {value:.2f}:1"
        )
        if value < 4.5:
            failed.append((theme_name, fg_key, bg_key, value))

print("\n[paper sections]")
for fg_key, bg_key in [
    ("--ovgo-paper-text", "--ovgo-paper"),
    ("--ovgo-paper-muted", "--ovgo-paper"),
]:
    if fg_key not in dark or bg_key not in dark:
        failed.append(("paper", fg_key, bg_key, "missing token"))
        print(f"FAIL {fg_key} / {bg_key}: missing token")
        continue
    value = ratio(dark[fg_key], dark[bg_key])
    result = "PASS" if value >= 4.5 else "FAIL"
    print(f"{result} {fg_key} {dark[fg_key]} on {bg_key} {dark[bg_key]} = {value:.2f}:1")
    if value < 4.5:
        failed.append(("paper", fg_key, bg_key, value))

if failed:
    sys.exit(1)
