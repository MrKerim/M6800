import React, { useEffect, useState } from "react";
import instructionSheetScript from "./InstructionSheet";
import CodeEditor from "./CodeEditor";
import MemoryDisplay from "./MemoryDisplay";
import ConsoleComp from "./ConsoleComp";
import "./App.css";

function App() {
	const [programCounter, setProgramCounter] = useState(0);
	const [programMemory, setProgramMemory] = useState(new Array(0xffff).fill(0));
	const [AccumulatorA, setAccumulatorA] = useState(0);
	const [AccumulatorB, setAccumulatorB] = useState(0);
	const [XRegister, setXRegister] = useState(0);
	const [stackPointer, setStackPointer] = useState(0);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [buildSuccess, setBuildSuccess] = useState(false);

	const [rawCode, setRawCode] = useState(null);
	const [build, setBuild] = useState(false);

	const [errorOnLine, setErrorOnLine] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY >= 500) setScrollPosition(1);
			else setScrollPosition(0);
		};

		// Initial check
		handleScroll();

		// Add event listener for resize
		window.addEventListener("scroll", handleScroll);

		// Cleanup on unmount
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		console.log("trying to build");
		if (!rawCode) return;
		handleScriptTranscription(rawCode);
	}, [build]);

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
			console.log(
				"keyword: ",
				keyword.toLowerCase(),
				" value : ",
				value,
				" modifier : ",
				modifier
			);
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
					if (
						typeof opCodes[1] === "object" &&
						opCodes[1] !== null &&
						"errorLine" in opCodes[1]
					) {
						opCodes[1].errorLine = index + 1;
					}
					tempMemory[pC] = opCodes[1];
					pC++;
				}
			} else {
				setErrorOnLine(index + 1);
				return;
			}
		}

		console.log("branch labels checking");

		//we will iterate over the memory and check for branch labels if we find
		// then we will get the map memory address and subtract the value and load it into the memory
		// if the label is not on the map we throw an error on errorLine property of the object

		for (let PCindex = 0; PCindex < tempMemory.length; PCindex++) {
			const instruction = tempMemory[PCindex];
			if (typeof instruction === "object" && instruction !== null) {
				const insLabel = instruction.label;

				if (labels.has(insLabel)) {
					const labelAddress = labels.get(insLabel);
					const relativeAddress = labelAddress - PCindex;

					if (relativeAddress > 0x80 || relativeAddress < -0x7f) {
						console.log("branch label out of range");
						setErrorOnLine(instruction.errorLine);
						return;
					}
					if (relativeAddress < 0) tempMemory[PCindex] = 0xff + relativeAddress;
					else if (relativeAddress > 0)
						tempMemory[PCindex] = relativeAddress - 1;
					else tempMemory[PCindex] = relativeAddress;
				} else {
					const errorLine = instruction.errorLine;
					console.log("can't found the label : ", insLabel);
					setErrorOnLine(errorLine);
					return;
				}
			}
		}

		console.log("build success");
		setProgramMemory(tempMemory);
		setBuildSuccess(true);
	}

	function parseInstruction(line) {
		const regex =
			/^(?:(\w+))?\s+(\w+)(?:\s+(#?[\$%]?\w+))?\s*(?:,\s*([xy]))?\s*\s*(?=\s*(;|$))?/;
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
		<>
			<>
				{scrollPosition === 0 ? (
					<div
						onClick={() => {
							window.scrollTo({
								top: 620, // Current scroll position + 600px
								behavior: "smooth", // Optional: adds smooth scrolling
							});
						}}
						className=" lg:hidden z-10 fixed bottom-14 right-8 text-black  p-4 rounded-full  bg-white bg-opacity-30"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="size-10"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
							/>
						</svg>
					</div>
				) : (
					<div
						onClick={() => {
							window.scrollTo({
								top: 0, // Current scroll position + 600px
								behavior: "smooth", // Optional: adds smooth scrolling
							});
						}}
						className=" lg:hidden z-10 fixed bottom-14 right-8 text-black  p-4 rounded-full  bg-white bg-opacity-30"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="size-10"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m4.5 18.75 7.5-7.5 7.5 7.5"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m4.5 12.75 7.5-7.5 7.5 7.5"
							/>
						</svg>
					</div>
				)}
			</>
			<div className="fixed top-0 left-0 w-full -z-10 bg-[#171920] h-full"></div>
			<div className="bg-[#171920]  h-full">
				<div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-2">
					<div>
						<CodeEditor
							setRawCode={setRawCode}
							errorOnLine={errorOnLine}
							setErrorOnLine={setErrorOnLine}
							buildSuccess={buildSuccess}
							setBuildSuccess={setBuildSuccess}
							build={build}
							setBuild={setBuild}
						/>
						<ConsoleComp
							buildSuccess={buildSuccess}
							errorOnLine={errorOnLine}
						/>
					</div>

					<div>
						<MemoryDisplay memory={programMemory} />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
