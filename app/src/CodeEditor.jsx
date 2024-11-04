import React, { useState, useEffect, useRef } from "react";
import instructionSheetScript from "./InstructionSheet";
import MonacoEditor from "@monaco-editor/react";

const CodeEditor = ({ setRawCode, errorOnLine, setErrorOnLine }) => {
	const keywords = Array.from(instructionSheetScript.keys());
	const editorRef = useRef(null); // Create a ref to store the editor instance
	const [decorations, setDecorations] = useState([]); // State to manage decorations
	const [editorContent, setEditorContent] = useState(
		"; Start typing your assembly code here..."
	);

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
					[/#[a-zA-Z0-9]+/, { token: "number" }],
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
		<div>
			<MonacoEditor
				height="500px"
				defaultLanguage="customAssembly"
				value={editorContent}
				onChange={handleEditorChange}
				theme="customTheme"
				beforeMount={registerCustomLanguage}
				onMount={(editor) => {
					console.log("Editor mounted");
					editorRef.current = editor; // Set the editor instance to the ref
				}} // Capture editor instance
				options={{
					fontSize: 16,
					lineHeight: 24,
					minimap: { enabled: false },
					lineNumbers: "on",
				}}
			/>
			{/* You can use editorContent for debugging or running the code */}
			<button
				onClick={() => {
					console.log("build");
					setRawCode(editorContent);
				}}
			>
				BUILD
			</button>
		</div>
	);
};

export default CodeEditor;
