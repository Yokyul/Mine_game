# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-dependency, vanilla JavaScript Minesweeper (扫雷) browser game. There is no package manager, no build step, no backend, and no database.

### Running the application

The app uses ES Modules (`type="module"`), so it **must** be served over HTTP (not `file://`).

```bash
python3 -m http.server 8080 --directory /workspace
```

Then open `http://localhost:8080` in a browser.

### Project structure

- `index.html` — Entry point
- `index.js` — App bootstrap (imports game module)
- `config/index.js` — Difficulty level configurations
- `css/` — Stylesheets (reset + game styles)
- `images/` — Game assets (flag.png, mine.png)
- `module/game.js` — Game initialization and event binding
- `module/play.js` — Core game logic (cell reveal, flagging, win/loss)
- `module/ui.js` — DOM generation (grid rendering)
- `utils/tool.js` — DOM query helpers

### Testing notes

- There are no automated tests in this project.
- Manual testing: open the game in a browser, click cells to reveal, right-click to flag, switch difficulty levels, and verify win/loss detection.
- Since there is no linter or type checker configured, code correctness is verified through manual browser testing.
