# Contributing to Hubdustry Translations

Thank you for helping translate Hubdustry! Every contribution makes the platform accessible to more communities around the world. 🌍

## Getting Started

### Prerequisites
- A GitHub account
- Basic knowledge of JSON format
- Familiarity with Hubdustry (helpful but not required)

### Finding What to Translate

1. Check the `__missing/` directory — it lists keys that haven't been translated yet for each language
2. Each `__missing/{lang}.json` file contains keys with their English source text
3. Pick a language you speak natively and start translating!

## Contribution via Pull Request

### Step 1: Fork & Clone
```bash
git fork https://github.com/Hubdustry/Translations
git clone https://github.com/YOUR_USERNAME/Translations.git
cd Translations
```

### Step 2: Edit Translation Files

Translation files are organized into two directories:

| Directory | Purpose | Format |
|-----------|---------|--------|
| `web/` | Web dashboard UI strings | Nested JSON |
| `bot/` | Discord bot response strings | Nested JSON |

Edit the JSON file for your language (e.g., `web/vi.json` for Vietnamese web translations).

### Step 3: JSON Format

Translations use nested JSON with dot-notation keys:

```json
{
  "common": {
    "save": "Lưu",
    "cancel": "Hủy",
    "loading": "Đang tải..."
  },
  "dashboard": {
    "title": "Bảng điều khiển",
    "welcome": "Chào mừng, {name}!"
  }
}
```

### Step 4: Submit Pull Request

```bash
git checkout -b translate/vi-dashboard
git add web/vi.json
git commit -m "translate(vi): add dashboard translations"
git push origin translate/vi-dashboard
```

Then open a Pull Request on GitHub.

## Translation Guidelines

### ✅ Do

- **Keep placeholders intact**: `{name}`, `{count}`, `{amount}` must remain exactly as they are
- **Match placeholder count**: If the English has `{name}` and `{count}`, your translation must have both
- **Use natural language**: Translate meaning, not word-for-word
- **Test length**: Translations should not be excessively longer than the English source
- **Be consistent**: Use the same terms throughout (check glossary on [hubdustry.com/translate](https://hubdustry.com/translate))

### ❌ Don't

- **Don't translate placeholders**: `{name}` → `{name}` (NOT `{tên}`)
- **Don't translate HTML tags**: `<strong>text</strong>` → keep tags
- **Don't use machine translation without review**: AI suggestions are available in the web editor, but always review them
- **Don't copy English text**: If you're unsure, leave the key untranslated rather than copying the English

### Commit Message Format

```
translate({lang}): {description}
```

Examples:
- `translate(vi): add dashboard page translations`
- `translate(ko): fix placeholder in welcome message`
- `translate(ja): complete settings section`

## Automated Checks

When you submit a PR, the following checks run automatically:

| Check | What it does |
|-------|-------------|
| **JSON Lint** | Validates JSON syntax |
| **Missing Keys** | Warns if your file is missing keys from `en.json` |
| **Placeholder Validation** | Ensures `{variables}` match the English source |

Fix any failing checks before requesting review.

## Web Editor

Prefer a GUI? Use the web-based translation editor at [hubdustry.com/translate](https://hubdustry.com/translate):

- 🎯 See all translation keys with context
- 🤖 AI translation suggestions
- 📊 Track your contribution stats
- 🏆 Leaderboard and XP rewards

## Questions?

- Join our [Discord server](https://discord.gg/hubdustry)
- Open an [issue](https://github.com/Hubdustry/Translations/issues) on GitHub
