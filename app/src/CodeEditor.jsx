import React, { useState, useEffect, useRef } from "react";
import instructionSheetScript from "./InstructionSheet";
import MonacoEditor from "@monaco-editor/react";

const CodeEditor = ({
	setRawCode,
	errorOnLine,
	setErrorOnLine,
	buildSuccess,
	setBuildSuccess,
	build,
	setBuild,
}) => {
	const keywords = Array.from(instructionSheetScript.keys());
	const editorRef = useRef(null); // Create a ref to store the editor instance
	const [editorContent, setEditorContent] = useState(
		"; Start typing your assembly code here..."
	);
	const [editorOptions, setEditorOptions] = useState({
		fontSize: 16,
		lineHeight: 24,
		minimap: { enabled: false },
		lineNumbers: "on",
	});

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setEditorOptions({
					fontSize: 16,
					lineHeight: 24,
					minimap: { enabled: false },
					lineNumbers: "on",
				});
			} else {
				// Below "lg" breakpoint
				setEditorOptions({
					fontSize: 24,
					lineHeight: 30,
					minimap: { enabled: false },
					lineNumbers: "on",
				});
			}
		};

		// Initial check
		handleResize();

		// Add event listener for resize
		window.addEventListener("resize", handleResize);

		// Cleanup on unmount
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Use effect to apply decorations when errorOnLine changes
	useEffect(() => {
		if (editorRef.current) {
			const editor = editorRef.current;

			const model = editor.getModel();

			const lineCount = model.getLineCount();
			const lastLineLength = model.getLineLength(lineCount);

			const fullRange = new monaco.Range(1, 1, lineCount, lastLineLength);

			const decIds = [];
			editor.getDecorationsInRange(fullRange).map((decoration) => {
				decIds.push(decoration.id);
			});

			// Clear all decorations if errorOnLine is null
			if (errorOnLine === null) {
				editor.deltaDecorations(decIds, []);

				return;
			}

			// Remove previous decorations
			const lineContent = editor.getModel().getLineContent(errorOnLine);
			const endColumn = lineContent.length + 1; // End column should be at the end of the line

			const newDecorations = [
				{
					range: new monaco.Range(errorOnLine, 1, errorOnLine, endColumn),
					options: {
						isWholeLine: true,
						className: "error-line", // Custom CSS class
						inlineClassName: "error-inline", // Inline styling
					},
				},
			];

			// Apply new decorations
			editor.deltaDecorations([], newDecorations);
		}
	}, [errorOnLine]);

	// Build a case-insensitive regex for keywords
	function buildCaseInsensitiveRegex(keyword) {
		return keyword
			.split("")
			.map((char) => `[${char.toLowerCase()}${char.toUpperCase()}]`)
			.join("");
	}
	const keywordPattern = new RegExp(
		`\\b(${keywords.map(buildCaseInsensitiveRegex).join("|")})\\b`
	);

	const registerCustomLanguage = (monaco) => {
		monaco.languages.register({ id: "customAssembly" });

		monaco.languages.setMonarchTokensProvider("customAssembly", {
			tokenizer: {
				root: [
					[/#[\$%]?[a-zA-Z0-9]+/, { token: "number" }],
					[/^([a-zA-Z_][a-zA-Z0-9_]*)/, { token: "label" }],
					[keywordPattern, "keyword"],
					[/(;.*$)/, "comment"],
					[/\s+/, ""],
					[/./, "text"],
				],
			},
		});

		// Define the custom theme
		monaco.editor.defineTheme("customTheme", {
			base: "vs-dark",
			inherit: true,
			rules: [
				{ token: "label", foreground: "#569cd6" },
				{ token: "keyword", foreground: "#a573a2" },
				{ token: "comment", foreground: "#6a9955" },
				{ token: "number", foreground: "#b5cea8" },
			],
			colors: {
				"editorLineNumber.activeForeground": "#FFFFFF",
				"editorGutter.background": "#212630",
				"editor.background": "#212630",
			},
		});
	};

	// Handle editor content change
	const handleEditorChange = (value) => {
		if (errorOnLine) setErrorOnLine(null);
		setEditorContent(value);
	};

	return (
		<>
			<div className="">
				<MonacoEditor
					className="lg:rounded-md py-2 lg:ml-4 bg-[#212630] "
					height="560px"
					defaultLanguage="customAssembly"
					value={editorContent}
					onChange={handleEditorChange}
					theme="customTheme"
					beforeMount={registerCustomLanguage}
					onMount={(editor) => {
						console.log("Editor mounted");
						editorRef.current = editor; // Set the editor instance to the ref
					}} // Capture editor instance
					options={editorOptions}
					loading={
						<div className="h-[560px] bg-gray-600 w-full lg:ml-4 rounded-md animate-pulse">
							<div className="h-8 bg-gray-300 mt-4 w-9/12 ml-16 rounded-full animate-pulse"></div>
							<div className="flex">
								<div className="h-8 bg-gray-300 mt-4 w-1/4 ml-16 rounded-full animate-pulse"></div>
								<div className="h-8 bg-gray-300 mt-4 w-1/2 ml-6 rounded-full animate-pulse"></div>
							</div>
							<div className="h-8 bg-gray-300 mt-4 w-10/12 ml-16 rounded-full animate-pulse"></div>
							<div className="h-8 bg-gray-300 mt-4 w-7/12 ml-16 rounded-full animate-pulse"></div>
							<div className="flex">
								<div className="h-8 bg-gray-300 mt-4 w-1/2 ml-16 rounded-full animate-pulse"></div>
								<div className="h-8 bg-gray-300 mt-4 w-1/4 ml-6 rounded-full animate-pulse"></div>
							</div>
							<div className="h-8 bg-gray-300 mt-4 w-7/12 ml-16 rounded-full animate-pulse"></div>
							<div className="h-8 bg-gray-300 mt-4 w-9/12 ml-16 rounded-full animate-pulse"></div>
							<div className="h-8 bg-gray-300 mt-4 w-10/12 ml-16 rounded-full animate-pulse"></div>
							<div className="h-8 bg-gray-300 mt-4 w-2/3 ml-16 rounded-full animate-pulse"></div>
						</div>
					}
				/>
				<div className="flex ml-4 mt-4 gap-4">
					{!buildSuccess ? (
						<button
							className="bg-[#f0a55a]  lg:font-light items-center text-lg p-2   text-black  rounded-md flex gap-2   "
							onClick={() => {
								console.log("build");
								setBuild(!build);
								setRawCode(editorContent);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.2}
								stroke="currentColor"
								className="size-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.867 19.125h.008v.008h-.008v-.008Z"
								/>
							</svg>
							BUILD
						</button>
					) : (
						<>
							<button
								onClick={() => {
									console.log("stop");
									setBuildSuccess(false);
								}}
								className="bg-red-500  lg:font-light items-center  text-lg p-2  text-white  rounded-md flex gap-2 "
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
									/>
								</svg>
								STOP
							</button>
							<button className="bg-green-500  lg:font-light items-center  text-lg p-2  text-white  rounded-md flex gap-2  ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
									/>
								</svg>
								RUN
							</button>
							<button className="bg-blue-500  lg:font-light items-center  text-lg p-2  text-white  rounded-md flex gap-2  ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 15 15"
								>
									<path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z" />
								</svg>
								STEP
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default CodeEditor;
