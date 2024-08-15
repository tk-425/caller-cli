# Caller CLI

## Installation:

1. Download the repository
   ```bash
   git clone https://github.com/tk-425/caller-cli.git
   ```
2. Move the repository to the `/usr/local/share` directory
   ```bash
   sudo mv /path/to/repository/ /usr/local/share
   ```
3. Go to the `/usr/local/share/caller-cli` directory
4. Make the `caller.js` script executable:
   ```bash
   chmod +x caller.js
   ```
5. Create a Symlink to your script
   ```bash
   sudo ln -s /usr/local/share/caller-cli/caller.js /usr/local/bin/caller
   ```
6. Install NPM packages
   ```bash
   npm Install
   ``` 
7. Close your terminal and restart
8. Use `caller <command>` to run the Caller-CLI command
