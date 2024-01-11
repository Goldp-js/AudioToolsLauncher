# 🎵 Audio Tools Launcher

This script serves as a launcher for various audio-related tasks and operations. It provides a menu-driven interface with the following options:

1. **Diagnose System**: Displays diagnostic information about the system, including platform, Node.js version, and installed packages.

2. **Run Custom Script**: Allows the user to execute a custom npm script by entering the script name.

3. **Start Bot**: Initiates a bot process by running the `node index.js` command. The bot's standard output and standard error are piped to the console.

4. **Exit**: Exits the launcher.

## Prerequisites

Ensure that Node.js is installed on your system and that the necessary npm packages are available.

## Usage

1. Run the script using the command: `node Launcher.js`.
2. Follow the on-screen menu prompts to perform the desired action.

## Diagnose System

This option provides information about the system, including platform, Node.js version, working directory, and installed packages. It also checks for outdated packages and prompts the user to update them if necessary.

## Run Custom Script

Enter the name of an npm script to execute it. The script will be run using the `npm run <script_name>` command.

## Start Bot

Initiates the bot by running the `node index.js` command. The bot's output is displayed in the console, and the process can be stopped manually.

## Exit

Terminates the launcher script.

## Colors

The script uses ANSI escape codes to display colored text for better readability.

- **fgCyan, fgYellow, fgGreen, fgMagenta, fgRed**: Foreground text colors.
- **bright, dim, underscore, blink, reverse, hidden**: Text style modifiers.
- **reset**: Resets text styles and colors.

## Note

This script assumes that the necessary dependencies are defined in the `package.json` file. Ensure that the file exists and is properly configured.

Feel free to customize the script according to your specific needs and modify the menu options or add new functionalities as required.
