// One-time local setup: creates backend/.env and frontend/.env.local from their
// .env.example files if they don't already exist. Never overwrites an existing
// file, so it's always safe to re-run. Plain Node (no deps) so it behaves the
// same under cmd.exe, PowerShell, and bash.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const targets = [
  { example: path.join(ROOT, "backend", ".env.example"), dest: path.join(ROOT, "backend", ".env") },
  { example: path.join(ROOT, "frontend", ".env.example"), dest: path.join(ROOT, "frontend", ".env.local") },
];

for (const { example, dest } of targets) {
  const relDest = path.relative(ROOT, dest);
  if (fs.existsSync(dest)) {
    console.log(`[setup] ${relDest} already exists, leaving it untouched`);
    continue;
  }
  fs.copyFileSync(example, dest);
  console.log(`[setup] created ${relDest} from ${path.relative(ROOT, example)}`);
}

console.log("[setup] done. Edit backend/.env to set JWT_SECRET before running `npm run dev`.");
