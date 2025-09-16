# Stats Panel: Fitbit Versa 4 and Sense 2 Setup

Developer environment and build guide. Although not required, this guide assumes the use of Visual Studio Code. 

Note: The Fitbit OS Simulator does not support the Versa 4 or Sense 2. As a consequence of this, and different SDK version required, a seperate code base is required for the Versa 4 and Sense 2 from the Versa 3 and Sense. The Versa 3 and Sense is considered the main version, and code changes from that version should be applied to the Versa 4 and Sense 2 code base. The only differences between theses two code bases should be in the package.json file and the app.fba build file. 

1. Clone repository. 
2. Open Visual Studio Code. Recommend install **Fitbit SDK Extension**. 
3. Open the project folder in VS Code. 
4. Open a new Terminal.
5. If needed, navigate to the main project directory. 
6. Run `ls` command. The output should contain the following: app/ build/ resources/ and package.json
7. Run `node --version` If the output is something other than `v14.21.3` then install node version v14.21.3 before proceeding. 
8. Run `npm add --include-dev @fitbit/sdk@6.2.0-pre.1` This will install node modules for the Fitbit OS5 SDK that will allow creating builds for the Versa 4 and Sense 2. 
9. Run `npx fitbit-build` to generate an app.fba build file. 
