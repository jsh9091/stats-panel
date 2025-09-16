# Stats Panel: Fitbit Versa 3 and Sense Setup

Developer environment and build guide. Although not required, this guide assumes the use of Visual Studio Code. 

1. Clone repository. 
2. If not installed, install Fitbit OS Simulator.
3. Open Visual Studio Code. Recommend install **Fitbit SDK Extension**. 
4. Open the project folder in VS Code. 
5. Open a new Terminal.
6. If needed, navigate to the main project directory. 
7. Run `ls` command. The output should contain the following: app/ build/ resources/ and package.json
8. Run `node --version` If the output is something other than `v14.21.3` then install node version v14.21.3 before proceeding. 
9. Run `npm add --include-dev @fitbit/sdk@6.1.0` This will install node modules for the Fitbit OS5 SDK. 
10. Run `npx fitbit` to enter the fitbit shell. If the console starts printing things like "fetchMetadata" and or a "Connect to GitHub" popup is displayed, close the popup and stop the operation in the terminal. In the terminal try the following command, `npm i` then retry the `npx fitbit` command to enter the fitbit shell. If the prompt displayed is `fitbit$` then the fitbit shell has been entered. 
11. Open the Fitbit OS Simulator application. 
12. In the Fitbit OS Simulator under the **Settings** tab, under **General** open the **Device Type** menu, and select either Versa 3 or Sense. 
13. Return to the terminal and run the command `bi`. This will create a new build and install it into the simulator and run the clock-face. 
