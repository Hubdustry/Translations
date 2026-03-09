# Hubdustry Translations

Community-driven translations for the [Hubdustry](https://hubdustry.com) Discord bot platform — covering both the web dashboard and Discord bot responses.

## 📊 Translation Progress

| Language | Code | Web | Bot | Status |
|----------|------|-----|-----|--------|
| 🇺🇸 English | `en` | ✅ Source | ✅ Source | Base language |
| 🇻🇳 Vietnamese | `vi` | 🟡 Partial | 🟡 Partial | **Help wanted** |
| 🇰🇷 Korean | `ko` | 🟡 Partial | 🟡 Partial | **Help wanted** |
| 🇯🇵 Japanese | `ja` | 🟡 Partial | 🟡 Partial | **Help wanted** |
| 🇨🇳 Chinese (Simplified) | `zh` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇹🇼 Chinese (Traditional) | `zh-tw` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇫🇷 French | `fr` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇩🇪 German | `de` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇪🇸 Spanish | `es` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇧🇷 Portuguese | `pt` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇷🇺 Russian | `ru` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇵🇱 Polish | `pl` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇹🇷 Turkish | `tr` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇹🇭 Thai | `th` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇺🇦 Ukrainian | `uk` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇮🇩 Indonesian | `id` | 🔴 Needs review | ❌ Missing | **Help wanted** |
| 🇸🇦 Arabic | `ar` | 🔴 Needs review | ❌ Missing | **Help wanted** |

## 📂 Structure

```
├── web/          ← Web dashboard translations (next-intl JSON)
│   ├── en.json   ← Source language (English)
│   ├── vi.json
│   └── ...
├── bot/          ← Discord bot translations
│   ├── en.json   ← Source language (English)
│   └── ...
├── __missing/    ← Auto-generated: keys that need translation
│   ├── vi.json   ← Missing keys for Vietnamese
│   └── ...
└── scripts/      ← Validation & utility scripts
```

## 🤝 How to Contribute

There are **two ways** to contribute translations:

### Option 1: Web Editor (Recommended)
1. Visit [hubdustry.com/translate](https://hubdustry.com/translate)
2. Select your language
3. Start translating — your contributions are tracked with XP and leaderboard!

### Option 2: GitHub Pull Request
1. Fork this repository
2. Edit the JSON file for your language in `web/` or `bot/`
3. Check `__missing/` to see which keys need translation
4. Submit a Pull Request — CI will automatically validate your changes

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

## 🏆 Contributors

See [TRANSLATORS.md](TRANSLATORS.md) for the full list of amazing translators.

## 📜 License

Translation content is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
