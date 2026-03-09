/**
 * Translation Validation Script
 *
 * Checks:
 * --check-missing      Compare each lang file against en.json for missing keys
 * --check-placeholders Ensure placeholder variables match between source and target
 * --check-lengths      Warn if translations are >200% of source length
 */

const fs = require("fs");
const path = require("path");

const DIRS = ["web", "bot"];
const PLACEHOLDER_REGEX = /\{[^}]+\}|%[sd]|%\d+\$[sd]/g;

// ── Helpers ──────────────────────────────────────────────────────────

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

function getLanguageFiles(dir) {
    const dirPath = path.join(__dirname, "..", dir);
    if (!fs.existsSync(dirPath)) return [];
    return fs
        .readdirSync(dirPath)
        .filter((f) => f.endsWith(".json") && f !== "en.json")
        .map((f) => ({
            lang: f.replace(".json", ""),
            path: path.join(dirPath, f),
        }));
}

// ── Checks ───────────────────────────────────────────────────────────

function checkMissing() {
    let hasErrors = false;
    console.log("\n🔑 Checking missing keys...\n");

    for (const dir of DIRS) {
        const sourcePath = path.join(__dirname, "..", dir, "en.json");
        if (!fs.existsSync(sourcePath)) continue;

        const source = flattenJSON(loadJSON(sourcePath));
        const sourceKeys = Object.keys(source);

        for (const { lang, path: langPath } of getLanguageFiles(dir)) {
            const target = flattenJSON(loadJSON(langPath) || {});
            const missing = sourceKeys.filter((k) => !(k in target));

            if (missing.length > 0) {
                const coverage = (
                    ((sourceKeys.length - missing.length) / sourceKeys.length) *
                    100
                ).toFixed(1);
                console.log(
                    `⚠️  ${dir}/${lang}.json: ${missing.length} missing keys (${coverage}% complete)`
                );
                if (missing.length <= 10) {
                    missing.forEach((k) => console.log(`   → ${k}`));
                } else {
                    missing.slice(0, 5).forEach((k) => console.log(`   → ${k}`));
                    console.log(`   → ... and ${missing.length - 5} more`);
                }
                // Missing keys are warnings, not errors
            } else {
                console.log(`✅ ${dir}/${lang}.json: 100% complete`);
            }
        }
    }

    return hasErrors;
}

function checkPlaceholders() {
    let hasErrors = false;
    console.log("\n🔗 Checking placeholder consistency...\n");

    for (const dir of DIRS) {
        const sourcePath = path.join(__dirname, "..", dir, "en.json");
        if (!fs.existsSync(sourcePath)) continue;

        const source = flattenJSON(loadJSON(sourcePath));

        for (const { lang, path: langPath } of getLanguageFiles(dir)) {
            const target = flattenJSON(loadJSON(langPath) || {});

            for (const [key, sourceVal] of Object.entries(source)) {
                if (!(key in target)) continue;

                const sourcePlaceholders = (sourceVal.match(PLACEHOLDER_REGEX) || []).sort();
                const targetPlaceholders = (target[key].match(PLACEHOLDER_REGEX) || []).sort();

                if (JSON.stringify(sourcePlaceholders) !== JSON.stringify(targetPlaceholders)) {
                    console.log(
                        `❌ ${dir}/${lang}.json → "${key}": placeholders mismatch`
                    );
                    console.log(`   Source: ${sourcePlaceholders.join(", ") || "(none)"}`);
                    console.log(`   Target: ${targetPlaceholders.join(", ") || "(none)"}`);
                    hasErrors = true;
                }
            }
        }
    }

    if (!hasErrors) {
        console.log("✅ All placeholders match");
    }

    return hasErrors;
}

function checkLengths() {
    let hasWarnings = false;
    console.log("\n📏 Checking string lengths...\n");

    for (const dir of DIRS) {
        const sourcePath = path.join(__dirname, "..", dir, "en.json");
        if (!fs.existsSync(sourcePath)) continue;

        const source = flattenJSON(loadJSON(sourcePath));

        for (const { lang, path: langPath } of getLanguageFiles(dir)) {
            const target = flattenJSON(loadJSON(langPath) || {});

            for (const [key, sourceVal] of Object.entries(source)) {
                if (!(key in target)) continue;

                const ratio = target[key].length / Math.max(sourceVal.length, 1);
                if (ratio > 2.0) {
                    console.log(
                        `⚠️  ${dir}/${lang}.json → "${key}": ${(ratio * 100).toFixed(0)}% of source length`
                    );
                    hasWarnings = true;
                }
            }
        }
    }

    if (!hasWarnings) {
        console.log("✅ All string lengths are within limits");
    }

    // Length warnings don't fail the build
    return false;
}

// ── Main ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let exitCode = 0;

if (args.includes("--check-missing")) {
    if (checkMissing()) exitCode = 1;
}

if (args.includes("--check-placeholders")) {
    if (checkPlaceholders()) exitCode = 1;
}

if (args.includes("--check-lengths")) {
    if (checkLengths()) exitCode = 1;
}

if (args.length === 0) {
    // Run all checks
    checkMissing();
    if (checkPlaceholders()) exitCode = 1;
    checkLengths();
}

process.exit(exitCode);
