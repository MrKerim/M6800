<p align="center">
  <img src="app/public/blue_chip.svg" alt="M6800" width="200">
</p>

<h1 align="center">M6800 Assembly Simulator</h1>

This is a React Vite project that is designed for the Yeditepe University students, which are taking the course **CSE232** .

The project is based on the original [paper](./6800_Instruction_sheet.pdf) and a third party [software](http://www.hvrsoftware.com/6800emu.htm#specs) that simulates the M6800.

Problem is that, the software was the only resource that is provided by the course and there is (currently) no other sowftware/site that simulates the desired assembler. Therefore this project is published to resolve that issue.

Currently live on [here](http://m6800.vercel.app).
Site is also responsive to the device so can be accessed through mobile.

---

# Table of Contents

- [Installing Locally](#installing-locally)
- [Source Files](#source-files)
- [Instruction Logic](#instruction-logic)

---

## Installing Locally

To get started developing the project locally,

### Prerequisites

Before , make sure you have the following installed:

- **Node.js**
- **Yarn**

Clone the Repository

```bash
git clone https://github.com/MrKerim/M6800.git
```

And install the packages

```bash
cd m6800/app
yarn install
```

the you can preview the local with

```bash
yarn dev
```

## Source Files

Project is one file client project that does not have any backend or db. All the work is done in the client side `App.jsx` file.

- **src/**: This folder contains the main source code for the application.

  - **App.jsx** : Main entry point of the application both the design and the heavy load of operations take place in here.
  - **CodeEditor.jsx** : I use [monaco editor](https://www.npmjs.com/package/@monaco-editor/react) for the code editor. This page also contains the execute buttons for the transcript and the opcode
  - **ConsoleComp** : Simple console-like output for providing feedback on errors adn assembler execution to the user.
  - **MemoryDisplay.jsx** : Output for the memory and the other tools for the assembler like accumaltors and registers.
  - **instructionSheet.js** : This file is the main section of the project. It has three map exports these maps are setted for the specific instruction and their functions:

    - **instructionSheetScript** map : Provides the necesery functions for the transkription (from high level code to memory executable opCode)

    - **assemblerDirectiveScript** map : Provides additional scripting directives.
    - **assemblyCompiler** map : Functions for executing memory opCodes

## Instruction Logic

First content of the editor are transcripted to a memory address by `instructionSheetScript.js` then we have bunch of opCodes in a memory.
Secondly the opCodes are executes based on the `assemblyCompiler.js`.

One can add also an additona function or extension simply adding a new non-existing function the the map, general form for the functions are :

```js
/*
-- -----------------------
-- -----------------------
*/

/*
instruction - what it does
    Adressing Types
    opCodes

    Condition Code:
    H | I | N | Z | V | C 
*/
function tfunc(keyword, value, modifier) {
	// ...

	return [opCode];
}
instructionSheetScript.set("tfunc", tfunc);

// Assembler

// Assembler function based on the type

function tfuncE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	//....
	return {
		pC,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(opCode, tfuncE);

/*
-- -----------------------
-- -----------------------
*/
```
