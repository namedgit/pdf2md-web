import fs from "fs";
import path from "path";
import pdf2md from "@opendocsg/pdf2md";

const [,, inDir = "./pdfs", outDir = "./md"] = process.argv;

if (!fs.existsSync(inDir)) {
  console.error("Input folder not found:", inDir);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.pdf$/i.test(entry.name)) yieldFile(full);
  }
};

const yieldFile = async (file) => {
  const rel = path.relative(inDir, file);
  const outPath = path.join(outDir, rel.replace(/\.pdf$/i, ".md"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const buf = fs.readFileSync(file);
  const md = await pdf2md(buf);
  fs.writeFileSync(outPath, md);
  console.log("✔ Converted:", rel);
};

walk(inDir);
