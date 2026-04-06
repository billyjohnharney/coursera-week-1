# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

**Name:** Photo Colour Picker  
**Repository:** billyjohnharney/coursera-week-1  
**Status:** Early-stage — no source code exists yet. The repository contains only a README.

The project is intended to be a photo colour picker application, likely a Coursera week-1 assignment. The exact language, framework, and architecture have not yet been established.

## Repository Structure

```
coursera-week-1/
├── CLAUDE.md       # This file
└── README.md       # Project title only: "# photo colour picker"
```

No source code, tests, configuration files, or build tooling exist yet.

## Git Workflow

- **Development branch:** `claude/add-claude-documentation-0gn4D` (current)
- **Main branch:** `master`
- Always develop on the designated feature branch; never push directly to `master` without explicit instruction.
- Use `git push -u origin <branch-name>` when pushing.
- Write clear, descriptive commit messages.

## Development Conventions (to establish when implementation begins)

Since no code exists yet, the following are recommended defaults to adopt when building out the project. Update this file once the stack is chosen.

### Language / Framework
- To be determined. Common choices for a colour-picker web app: vanilla HTML/CSS/JS, React, or a Python backend with a simple frontend.
- When the stack is chosen, document it here along with setup instructions.

### File Organization
- Place source code under `src/`
- Place tests under `tests/` or alongside source as `*.test.js` / `*_test.py`
- Keep configuration files at the repo root

### Coding Style
- Follow language-standard formatting tools (e.g. Prettier for JS/TS, Black for Python)
- Add a linter config (`.eslintrc`, `pyproject.toml`, etc.) to the repo root so style is enforced automatically

### Testing
- Write tests before or alongside implementation
- Document how to run tests in README.md once they exist

## Working in This Repository

- Read `README.md` first for the current project description.
- When implementing features, update `README.md` with setup and run instructions.
- Keep this `CLAUDE.md` up to date as the project evolves — update the structure diagram, stack details, and conventions as they are established.
- Do not add speculative abstractions or features beyond what is explicitly required.
