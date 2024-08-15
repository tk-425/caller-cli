# Caller CLI

## Installation:

1. Download the repository
2. Move the repository to the `/usr/local/share` directory
   ```bash
   sudo mv /path/to/repository/ /usr/local/share
   ```
3. Go to the `/usr/local/share` directory
4. Make the `caller.js` script executable:
   ```bash
   chmod +x caller.js
   ```
5. Create a Symlink to your script
   ```bash
   sudo ln -x /usr/local/share/caller-cli-main/caller.js /usr/local/bin/caller
   ```
6. Close your terminal and restart
7. Use `caller <command>` to run the Caller-CLI command
