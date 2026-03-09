/**
 * Missing Key Generator
 *
 * Compares each language file against en.json and generates
 * __missing/{lang}.json with keys that need translation.
 *
 * Output format: { "key.path": "English source text" }
 */

const fs = require("fs");
const path = require("path");

const DIRS = ["web", "bot"];
const MISSING_DIR = path.join(__dirname, "..", "__missing");

function flattenJSON(obj, prefix = "") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            Object.assign(result, flattenJSON(value, fullKey));
        } else {
            result[fullKey] = String(value);
        }
    }
    return result;
}

function loadJSON(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        return null;
    }
}

// Ensure __missing directory exists
if (!fs.existsSync(MISSING_DIR)) {
    fs.mkdirSync(MISSING_DIR, { recursive: true });
}

// Collect all missing keys across directories
const allMissing = {}; // lang -> { key -> source text }

for (const dir of DIRS) {
    const sourcePath = path.join(__dirname, "..", dir, "en.json");
    if (!fs.existsSync(sourcePath)) continue;

    const source = flattenJSON(loadJSON(sourcePath));
    const sourceKeys = Object.keys(source);

    const dirPath = path.join(__dirname, "..", dir);
    const langFiles = fs
        .readdirSync(dirPath)
        .filter((f) => f.endsWith(".json") && f !== "en.json");

    for (const file of langFiles) {
        const lang = file.replace(".json", "");
        const target = flattenJSON(loadJSON(path.join(dirPath, file)) || {});

        const missing = sourceKeys.filter((k) => !(k in target));

        if (missing.length > 0) {
            if (!allMissing[lang]) allMissing[lang] = {};

            for (const key of missing) {
                // Prefix with directory to avoid key collisions
                const prefixedKey = `[${dir}] ${key}`;
                allMissing[lang][prefixedKey] = source[key];
            }
        }
    }
}

// Write missing files
let totalMissing = 0;

for (const [lang, keys] of Object.entries(allMissing)) {
    const count = Object.keys(keys).length;
    totalMissing += count;

    const outPath = path.join(MISSING_DIR, `${lang}.json`);
    fs.writeFileSync(outPath, JSON.stringify(keys, null, 2) + "\n", "utf8");
    console.log(`📝 ${lang}: ${count} missing keys → __missing/${lang}.json`);
}

// Remove files for languages with no missing keys
const existingFiles = fs.existsSync(MISSING_DIR)
    ? fs.readdirSync(MISSING_DIR).filter((f) => f.endsWith(".json"))
    : [];

for (const file of existingFiles) {
    const lang = file.replace(".json", "");
    if (!(lang in allMissing)) {
        fs.unlinkSync(path.join(MISSING_DIR, file));
        console.log(`🎉 ${lang}: 100% complete — removed __missing/${lang}.json`);
    }
}

if (totalMissing === 0) {
    console.log("\n🎉 All translations are complete! No missing keys.");
} else {
    console.log(`\n📊 Total: ${totalMissing} keys need translation across ${Object.keys(allMissing).length} languages`);
}
