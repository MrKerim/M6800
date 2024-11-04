import React, { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import instructionSheetScript from "./InstructionSheet";
import "./App.css";

function App() {
	const [programMemory, setProgramMemory] = useState(new Array(0xffff).fill(0));

	const [rawCode, setRawCode] = useState(
		"; Start typing your assembly code here..."
	);

	const [errorOnLine, setErrorOnLine] = useState(null);

	useEffect(() => {
		handleScriptTranscription(rawCode);
	}, [rawCode]);

	function handleScriptTranscription(rawCode) {
		let pC = 0;
		const tempMemory = new Array(0xffff).fill(0);
		const labels = new Map();

		const lines = rawCode.split("\n");

		for (let index = 0; index < lines.length; index++) {
			const line = lines[index];

			// Skip empty lines and comments
			if (line.trim() === "") continue;
			if (line.trim().startsWith(";")) continue;

			const instruction = parseInstruction(line);
			if (!instruction) {
				setErrorOnLine(index + 1);
				return;
			}

			const { label, keyword, value, modifier } = instruction;

			// Label check
			if (label) {
				// if the label is a opcode then throw an error
				if (instructionSheetScript.has(label.toLowerCase())) {
					setErrorOnLine(index + 1);
					return;
				}
				// otherwise add the label to the labels map
				labels.set(label, pC);
			}

			// Keyword check
			if (!instructionSheetScript.has(keyword.toLowerCase())) {
				setErrorOnLine(index + 1);
				return;
			}
			const opCodes = instructionSheetScript.get(keyword.toLowerCase())(
				keyword.toLowerCase(),
				value,
				modifier
			);
			if (opCodes) {
				// opCodes can be 1 or 2 length array
				tempMemory[pC] = opCodes[0];
				pC++;
				if (opCodes.length > 1) {
					tempMemory[pC] = opCodes[1];
					pC++;
				}
			} else {
				setErrorOnLine(index + 1);
				return;
			}
		}
		console.log(tempMemory);
	}

	function parseInstruction(line) {
		const regex =
			/^(?:(\w+))?\s+(\w+)(?:\s+(#?[0-9A-Fa-f]+))?\s*(?:,\s*([xy]))?\s*\s*(?=\s*(;|$))?/;
		const match = line.match(regex);

		if (!match) {
			return null;
		}

		// Extract parts from the matched results
		const label = match[1] || null; // If no label, default to "None"
		const keyword = match[2] || null; // The main keyword
		const value = match[3] || null; // Optional value
		const modifier = match[4] || null; // Optional modifier

		if (!keyword) return null;

		return { label, keyword, value, modifier };
	}

	return (
		<div>
			<CodeEditor
				setRawCode={setRawCode}
				errorOnLine={errorOnLine}
				setErrorOnLine={setErrorOnLine}
			/>
		</div>
	);
}

export default App;
