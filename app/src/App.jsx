import React, { useEffect, useState } from "react";
import {
	instructionSheetScript,
	assemblerDirectiveScript,
	assemblyCompiler,
} from "./InstructionSheet";
import CodeEditor from "./CodeEditor";
import MemoryDisplay from "./MemoryDisplay";
import ConsoleComp from "./ConsoleComp";
import "./App.css";

function App() {
	const [programCounter, setProgramCounter] = useState(0);
	const [programMemory, setProgramMemory] = useState(
		new Array(0x10000).fill(0)
	);
	const [accumulatorA, setAccumulatorA] = useState(0);
	const [accumulatorB, setAccumulatorB] = useState(0);
	const [xRegister, setXRegister] = useState(0);
	const [stackPointer, setStackPointer] = useState(0);
	const [statusFlags, setStatusFlags] = useState({
		H: 0,
		I: 0,
		N: 0,
		Z: 0,
		V: 0,
		C: 0,
	});
	const [scrollPosition, setScrollPosition] = useState(0);
	const [buildSuccess, setBuildSuccess] = useState(false);

	const [rawCode, setRawCode] = useState(null);
	const [build, setBuild] = useState(false);

	const [errorOnLine, setErrorOnLine] = useState(null);

	const [stepClicked, setStepClicked] = useState(false);

	useEffect(() => {
		handleCompileMemoryStep();
	}, [stepClicked]);

	//scroll handler
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

	//For compiling the memory
	//Step
	function handleCompileMemoryStep() {
		const opCode = programMemory[programCounter % 0x10000];

		let pC = programCounter;
		let accA = accumulatorA;
		let accB = accumulatorB;
		let memory = programMemory;
		let stackP = stackPointer;
		let xReg = xRegister;
		let statFlags = statusFlags;

		if (assemblyCompiler.has(opCode)) {
			const result = assemblyCompiler.get(opCode)(
				pC,
				accA,
				accB,
				memory,
				stackP,
				xReg,
				statFlags
			);
			if (!result) {
				console.log("error");
				return;
			}
			({ pC, accA, accB, memory, stackP, xReg, statFlags } = result);

			setProgramCounter(pC);
			setAccumulatorA(accA);
			setAccumulatorB(accB);
			setProgramMemory(memory);
			setStackPointer(stackP);
			setXRegister(xReg);
			setStatusFlags(statFlags);

			console.log("step success");
		} else {
			console.log("error");
			return;
		}
	}

	//For script transcription
	function handleScriptTranscription(rawCode) {
		let pC = 0;
		let tempMemory = new Array(0x10000).fill(0);
		let labels = new Map();

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
			console.log(
				"label: ",
				label,
				"keyword: ",
				keyword.toLowerCase(),
				" value : ",
				value,
				" modifier : ",
				modifier
			);
			//is it a assembler directive
			if (keyword?.toLowerCase()[0] === ".") {
				//special case .end
				if (keyword.toLowerCase() === ".end") {
					if (value || modifier) {
						setErrorOnLine(index + 1);
						return;
					}
					if (label) {
						labels.set(label, pC);
					}

					break;
				}

				console.log("assembler directive");
				if (!assemblerDirectiveScript.has(keyword.toLowerCase())) {
					console.log("error");
					setErrorOnLine(index + 1);
					return;
				}

				const result = assemblerDirectiveScript.get(keyword.toLowerCase())(
					label,
					keyword,
					value,
					modifier,
					pC,
					tempMemory,
					labels
				);
				if (!result) {
					setErrorOnLine(index + 1);
					return;
				}

				pC = result.pc;
				tempMemory = result.tempMemory;
				labels = result.labels;
				continue;
			}

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
				if (opCodes.length > 2) {
					tempMemory[pC] = opCodes[2];
					pC++;
				}
			} else {
				setErrorOnLine(index + 1);
				return;
			}
		}

		console.log("labels checking");

		//we will iterate over the memory and check for branch labels if we find
		// then we will get the map memory address and subtract the value and load it into the memory
		// if the label is not on the map we throw an error on errorLine property of the object

		for (let PCindex = 0; PCindex < tempMemory.length; PCindex++) {
			const instruction = tempMemory[PCindex];
			if (typeof instruction === "object" && instruction !== null) {
				const insLabel = instruction.label;

				if (labels.has(insLabel)) {
					console.log(instruction?.type);
					if (instruction?.type !== undefined) {
						if (instruction.type === "immediate") {
							tempMemory[PCindex] = labels.get(insLabel);
						} else if (instruction.type === "immediate2") {
							tempMemory[PCindex] = labels.get(insLabel) >> 8;
							tempMemory[PCindex + 1] = labels.get(insLabel) & 0xff;
						} else if (instruction.type === "extended_or_direct_label") {
							const labelVal = labels.get(insLabel);
							if (labelVal < 0x100) {
								console.log("labelVal : ", labelVal);
								tempMemory[PCindex] = labelVal;
							} else {
								for (let i = tempMemory.length - 1; i > PCindex; i--) {
									tempMemory[i] = tempMemory[i - 1]; // Shift each element to the right
								}

								tempMemory[PCindex - 1] = instruction.extendedOpCode;
								tempMemory[PCindex] = labelVal
									.toString(16)
									.padStart(4, "0")
									.slice(0, 2);
								tempMemory[PCindex + 1] = labelVal
									.toString(16)
									.padStart(4, "0")
									.slice(2, 4);
							}
						} else if (instruction.type === "extended") {
							const labelVal = labels.get(insLabel);
							tempMemory[PCindex] = labelVal
								.toString(16)
								.padStart(4, "0")
								.slice(0, 2);
							tempMemory[PCindex + 1] = labelVal
								.toString(16)
								.padStart(4, "0")
								.slice(2, 4);
						} else {
							const errorLine = instruction.errorLine;
							console.log("can't found the label : ", insLabel);
							setErrorOnLine(errorLine);
							return;
						}
					} else {
						//if relative
						const labelAddress = labels.get(insLabel);
						const relativeAddress = labelAddress - PCindex;

						if (relativeAddress > 0x80 || relativeAddress < -0x7f) {
							console.log("branch label out of range");
							setErrorOnLine(instruction.errorLine);
							return;
						}
						if (relativeAddress < 0)
							tempMemory[PCindex] = 0xff + relativeAddress;
						else if (relativeAddress > 0)
							tempMemory[PCindex] = relativeAddress - 1;
						else tempMemory[PCindex] = relativeAddress;
					}
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

		//Since we are building wee need to reset the remainings
		setAccumulatorA(0x10);
		setAccumulatorB(0x20);
		setXRegister(0);
		setStackPointer(0);
		setStatusFlags({
			H: 0,
			I: 0,
			N: 0,
			Z: 0,
			V: 0,
			C: 0,
		});
		setProgramCounter(0);
	}

	function parseInstruction(line) {
		const regex =
			/^(?:(\w+))?\s+(\.?[\w]+)(?:\s+(#?[\$%]?\w+|"[^"]*"))?\s*(?:,\s*([^;]*))?\s*(?=\s*(;|$))?/;

		///^(?:(\w+))?\s+(\w+)(?:\s+(#?[\$%]?\w+))?\s*(?:,\s*([xy]))?\s*\s*(?=\s*(;|$))?/;
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
							stepClicked={stepClicked}
							setStepClicked={setStepClicked}
						/>
						<ConsoleComp
							buildSuccess={buildSuccess}
							errorOnLine={errorOnLine}
						/>
					</div>

					<div>
						<MemoryDisplay
							memory={programMemory}
							accumulatorA={accumulatorA}
							accumulatorB={accumulatorB}
							stackPointer={stackPointer}
							xRegister={xRegister}
							statusFlags={statusFlags}
							programCounter={programCounter}
							buildSuccess={buildSuccess}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
