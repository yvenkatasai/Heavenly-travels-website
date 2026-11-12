from pathlib import Path
import argparse
import hashlib
import json
import os
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/site"
SITE_VERSION = json.loads((ROOT / "version.json").read_text(encoding="utf-8"))["version"]

parser = argparse.ArgumentParser()
parser.add_argument("--output", default="dist")
args = parser.parse_args()
out = (ROOT / args.output).resolve()
if not out.is_relative_to(ROOT) or out == ROOT:
    raise SystemExit("Build output must stay in this project.")
protected = [
    ROOT / "src",
    ROOT / "scripts",
    ROOT / "docs",
    ROOT / "tests",
    ROOT / "artifacts",
    ROOT / "node_modules",
    ROOT / ".git",
]
if any(out == path or out.is_relative_to(path) for path in protected):
    raise SystemExit("Build output cannot replace source, tooling, docs, tests, or dependencies.")

if out.exists():
    shutil.rmtree(out)
out.mkdir(parents=True)

build_env = {**os.environ, "SITE_BUILD_OUTPUT": str(out)}
subprocess.run(
    ["node", str(ROOT / "scripts/build-booking.mjs")],
    cwd=ROOT,
    env=build_env,
    check=True,
)

page = (SRC / "page.html").read_text(encoding="utf-8")
vehicle_page = (SRC / "vehicles.html").read_text(encoding="utf-8")
source_files = [
    ("CSS", "style.css"),
    ("THEME", "travel-theme.css"),
    ("HERITAGE", "heritage.css"),
    ("PILGRIMAGE_CSS", "pilgrimage.css"),
    ("BOOKING_CSS", "booking.css"),
    ("FINAL_FLOW_CSS", "final-flow.css"),
    ("COMPACT_CSS", "compact-layout.css"),
    ("HIERARCHY_CSS", "package-hierarchy.css"),
    ("DIRECT_FLOW_CSS", "direct-package-flow.css"),
    ("SIMPLE_CLOSING_CSS", "simple-closing.css"),
    ("MOBILE_NAV_CSS", "mobile-nav.css"),
    ("COMPLETE_PACKAGE_CSS", "complete-package.css"),
    ("MOBILE_NAV_JS", "mobile-nav.js"),
    ("PILGRIMAGE_JS", "pilgrimage.js"),
    ("APP", "app.js"),
    ("EFFECTS", "heritage-effects.js"),
    ("DATA", "data.js"),
    ("INTRO", "intro.js"),
    ("DOT_FIELD", "dot-field.js"),
]

for token, name in source_files:
    content = (SRC / name).read_text(encoding="utf-8")
    page = page.replace(f"/*__{token}__*/", content)
    vehicle_page = vehicle_page.replace(f"/*__{token}__*/", content)

tours = (SRC / "tours.js").read_text(encoding="utf-8")
credits = (SRC / "credits.html").read_text(encoding="utf-8")
page = page.replace("/*__TOURS__*/", tours).replace("{{CREDITS}}", credits)
for asset in ["booking-flow.js", "booking-tailwind.css"]:
    digest = hashlib.sha256((out / "assets" / asset).read_bytes()).hexdigest()[:12]
    page = page.replace(f'assets/{asset}"', f'assets/{asset}?v={digest}"')
    vehicle_page = vehicle_page.replace(
        f'assets/{asset}"', f'assets/{asset}?v={digest}"'
    )

assert "/*__" not in page and "{{" not in page and "/*__" not in vehicle_page
(out / "index.html").write_text(page, encoding="utf-8")
(out / "vehicles.html").write_text(vehicle_page, encoding="utf-8")
shutil.copytree(SRC / "assets", out / "assets", dirs_exist_ok=True)
print(f"Heavenly {SITE_VERSION} built: {out} ({len(page.encode()):,} HTML bytes)")
