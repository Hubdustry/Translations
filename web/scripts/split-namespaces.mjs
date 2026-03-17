#!/usr/bin/env node
/**
 * split-namespaces.mjs
 *
 * Splits each monolithic `{locale}.json` into per-namespace files:
 *   messages/web/{locale}.json → messages/web/{locale}/{namespace}.json
 *
 * Usage:  node scripts/split-namespaces.mjs [--dry-run] [--verify-only]
 *
 * Flags:
 *   --dry-run      Print what would happen without writing files
 *   --verify-only  Verify existing split files match the original
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = join(__dirname, "..");

// ── Config ──
const LOCALES = readdirSync(WEB_DIR)
    .filter(f => f.endsWith(".json") && !f.startsWith("."))
    .map(f => f.replace(".json", ""));

const DRY_RUN = process.argv.includes("--dry-run");
const VERIFY_ONLY = process.argv.includes("--verify-only");

console.log(`\n📦 Namespace Splitter`);
console.log(`   Locales found: ${LOCALES.length} (${LOCALES.join(", ")})`);
console.log(`   Mode: ${DRY_RUN ? "DRY RUN" : VERIFY_ONLY ? "VERIFY ONLY" : "SPLIT"}\n`);

let errors = 0;

for (const locale of LOCALES) {
    const srcPath = join(WEB_DIR, `${locale}.json`);
    const src = JSON.parse(readFileSync(srcPath, "utf-8"));
    const namespaces = Object.keys(src);

    if (VERIFY_ONLY) {
        // ── Verify: merge split files and compare to original ──
        const localeDir = join(WEB_DIR, locale);
        if (!existsSync(localeDir)) {
            console.error(`  ❌ ${locale}/ directory does not exist`);
            errors++;
            continue;
        }

        const merged = {};
        for (const ns of namespaces) {
            const nsPath = join(localeDir, `${ns}.json`);
            if (!existsSync(nsPath)) {
                console.error(`  ❌ ${locale}/${ns}.json missing`);
                errors++;
                continue;
            }
            merged[ns] = JSON.parse(readFileSync(nsPath, "utf-8"));
        }

        const originalStr = JSON.stringify(src, null, 2);
        const mergedStr = JSON.stringify(merged, null, 2);

        if (originalStr === mergedStr) {
            console.log(`  ✅ ${locale}: verified (${namespaces.length} namespaces)`);
        } else {
            console.error(`  ❌ ${locale}: MISMATCH — merged output differs from original`);
            errors++;
        }
        continue;
    }

    // ── Split ──
    const localeDir = join(WEB_DIR, locale);

    if (DRY_RUN) {
        console.log(`  📁 Would create: ${locale}/`);
        for (const ns of namespaces) {
            const size = JSON.stringify(src[ns], null, 2).length;
            console.log(`     └─ ${ns}.json (${size} bytes)`);
        }
        continue;
    }

    mkdirSync(localeDir, { recursive: true });

    for (const ns of namespaces) {
        const nsPath = join(localeDir, `${ns}.json`);
        const content = JSON.stringify(src[ns], null, 2) + "\n";
        writeFileSync(nsPath, content, "utf-8");
    }

    // ── Verify immediately after write ──
    const merged = {};
    for (const ns of namespaces) {
        merged[ns] = JSON.parse(readFileSync(join(localeDir, `${ns}.json`), "utf-8"));
    }

    const originalStr = JSON.stringify(src, null, 2);
    const mergedStr = JSON.stringify(merged, null, 2);

    if (originalStr === mergedStr) {
        console.log(`  ✅ ${locale}: split into ${namespaces.length} namespaces (verified)`);
    } else {
        console.error(`  ❌ ${locale}: VERIFICATION FAILED — aborting`);
        errors++;
    }
}

console.log(`\n${errors === 0 ? "✅ All done!" : `❌ ${errors} error(s) found.`}\n`);
process.exit(errors > 0 ? 1 : 0);
