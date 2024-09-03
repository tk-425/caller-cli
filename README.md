# Caller CLI

Caller-CLI is a handy command-line tool that makes your life easier by simplifying your workflow. It's inspired by [fig.io](https://fig.io/), which has shut down, and it offers shortcuts for those tricky commands you can never remember. Plus, it has some Git features and uses AI to help you find and run commands quickly. If you want to create your own shortcuts or just need a bit of help with command-line tasks, Caller-CLI is here to make things smoother and more straightforward.

## Installation

1. To install Caller CLI, follow these steps:
   ```bash
   git clone https://github.com/tk-425/caller-cli.git
   ```
2. Move the repository to the `/usr/local/share` directory
   ```bash
   sudo mv /path/to/repository/ /usr/local/share
   ```
3. Navigate to the `/usr/local/share/caller-cli/src/bin` directory
   ```bash
   cd /usr/local/share/caller-cli/bin
   ```
4. Make the `caller.js` script executable
   ```bash
   chmod +x caller.js
   ```
5. Create a Symlink to your script
   ```bash
   sudo ln -s /usr/local/share/caller-cli/bin/caller.js /usr/local/bin/caller
   ```
6. Install NPM packages
   ```bash
   cd .. && npm install
   ```
7. Restart your terminal
8. Use `caller <command>` to run the Caller-CLI command

## Commands

### List Commands

```bash
caller list
```

Display a list of all commands currently registered with Caller CLI.

Example

```bash
$ caller list

- List -

? Select command (use arrow keys)
> npm-global-list
  ...
  ...
  ---------------
  EXIT
```

### Add a Command

```bash
caller add <name> <command>
```

Add a new command to Caller CLI.

Example

```bash
$ caller add npm-global-list 'npm list -g'
```

This will add a new command named `npm-global-list` that runs the command `npm list -g` when invoked.

### Rename a Command

```bash
caller rename <old_name> <new_name>
```

Rename an existing command.

Example

```bash
$ caller rename npm-global-list npm-list-global
```

### Remove a Command

```bash
caller remove <name>
```

Remove a command from Caller CLI.

Example

```bash
$ caller remove npm-list-global
```

### Git

```bash
caller git
```

Access various Git commands. We will add more Git commands later.

Example

```bash
$ caller git

- GIT COMMANDS -

? Select a git command (Use arrow keys)
> Add All
  Commit
  List Branches
  Create Branch
  -------------
  EXIT
```

### AI Command

```bash
caller ai
```

Use AI to find a command. Please create a Gemini API key by following these [instructions](https://ai.google.dev/gemini-api/docs/api-key).

Example

```bash
$ caller ai

- AI -

? Enter your Gemini API key: *********************
? Ask AI: Command for listing all the global npm packages.

npm list -g

? Would you like to run the command? (y/N)
```

Please only ask questions about command-line commands. Otherwise, the AI will respond with `Please provide a question related to command-line commands`.

> Note: Your API key is securely stored using the [keytar](https://www.npmjs.com/package/keytar) npm package and saved in your system's keychain.

### Delete API Key

```bash
caller del key
```

Delete the stored Gemini API key.

### Update

```bash
caller update
```

Update Caller CLI to the latest available version.

### Version

```bash
caller -V
caller --version
```

Display the current version number of Caller CLI.
