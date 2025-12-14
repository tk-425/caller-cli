# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Caller-CLI is a command-line productivity tool inspired by fig.io that provides:
- User-defined command shortcuts stored in JSON
- Git workflow helpers via interactive prompts
- AI-powered command discovery using Google's Gemini API
- Secure API key storage using the system keychain (keytar)

## Development Commands

### Testing
```bash
npm test              # Run tests with vitest
```

### Installation (Local Development)
The CLI is designed to be installed globally at `/usr/local/share/caller-cli`. For development:
```bash
npm install           # Install dependencies (use --omit=dev for production)
```

### Running Locally
```bash
node src/bin/caller.js <command>    # Run the CLI directly
```

## Architecture

### Entry Point
- `src/bin/caller.js` - Main CLI entry using Commander.js for command routing

### Command Structure
Commands are organized in `src/lib/commands/`:
- `list.js` - User-defined command CRUD operations (add, list, rename, remove, run)
- `git.js` - Interactive Git workflows using simple-git library
- `ai.js` - AI command discovery using Google Generative AI SDK
- `update.js` - Self-update functionality (git pull from `/usr/local/share/caller-cli`)

### Data Storage
- User commands: Stored in JSON at `/usr/local/share/caller-cli/caller-cli-commands.json`
- API keys: Stored securely in system keychain via keytar (service: 'caller-cli', account: 'gemini')

### Configuration
All constants, messages, and configuration live in `src/lib/config.js`:
- Current version: v1.5.2
- AI model: gemini-2.0-flash
- Hard-coded paths reference `/usr/local/share/caller-cli`

### Error Handling
Custom error classes in `src/lib/errors/`:
- Each error type has a dedicated class (e.g., `EmptyInputError`, `GitCurrentBranchError`)
- `errorChecking.js` contains validation functions that throw these errors
- `handleError.js` provides centralized error handling with user-friendly messages

### Utilities
- `executeCommand.js` - Spawns child processes with spawn() and stdio: 'inherit'
- `prompts.js` - Inquirer.js wrappers for consistent input/confirmation patterns
- `print.js` - Chalk-based output formatting helpers
- `messages.js` - Dynamic message generation functions
- `keyManagement.js` - Keytar wrapper for secure credential storage

## Key Implementation Details

### Command Execution Flow
1. Commander parses CLI arguments in `caller.js`
2. Routes to appropriate command handler in `src/lib/commands/`
3. Handlers use utility functions for prompts and validation
4. `executeCommand()` spawns child processes for actual command execution
5. Errors are caught and passed to `handleErrors()` for user-friendly output

### AI Integration
- Uses Google Generative AI SDK with gemini-2.0-flash model
- Prompts AI with context that enforces command-line command responses only
- API key is requested once and stored in system keychain
- Invalid responses trigger `AiInvalidQuestionError`

### Git Operations
- Uses simple-git library for programmatic Git operations
- Interactive prompts guide users through add, commit, branch, and push workflows
- Current branch detection is critical for push operations

### Update Mechanism
The update command runs:
1. `git reset --hard origin/main` in `/usr/local/share/caller-cli`
2. `git pull --rebase origin main`
3. `npm update --omit=dev` or `npm install --omit=dev`

## Development Guidelines

### Adding New Commands
1. Create command handler in `src/lib/commands/`
2. Add constants to `src/lib/config.js`
3. Register command in `src/bin/caller.js` using Commander
4. Use existing utility functions for prompts and execution
5. Implement proper error handling with custom error classes

### Modifying Paths
All installation paths are hard-coded to `/usr/local/share/caller-cli`. To change:
- Update `COMMAND_FILE_LOCATION` in `config.js`
- Update all git and npm command paths in update-related constants
- Update README.md installation instructions

### Testing
Tests are in `src/tests/` using Vitest. Current test coverage includes:
- `utils/keyManagement.test.js`
- `utils/executeCommand.test.js`

### Dependencies
Key production dependencies:
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `simple-git` - Git operations
- `@google/generative-ai` - AI command generation
- `keytar` - Secure credential storage
- `chalk` - Terminal styling
- `jsonfile` - JSON file operations
