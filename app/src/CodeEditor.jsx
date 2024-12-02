import MonacoEditor from "@monaco-editor/react";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { getDb } from "./firebase.js";


import {
  assemblerDirectiveScript,
  instructionSheetScript,
} from "./InstructionSheet";

// read docId from url as last part of the path
let docId = window.location.pathname.split("/").pop();

if (docId === "") {
  docId = "default";
}


const keywords = Array.from(instructionSheetScript.keys());
const directives = Array.from(assemblerDirectiveScript.keys());

function buildCaseInsensitiveRegex(keyword) {
  if (keyword[0] === ".") {
    return (
      "\\." +
      keyword
        .slice(1)
        .split("")
        .map((char) => `[${char.toLowerCase()}${char.toUpperCase()}]`)
        .join("")
    );
  }
  return keyword
    .split("")
    .map((char) => `[${char.toLowerCase()}${char.toUpperCase()}]`)
    .join("");
}
const keywordPattern = new RegExp(
  `\\b(${keywords.map(buildCaseInsensitiveRegex).join("|")})\\b`
);

const directivePattern = new RegExp(
  `\\s+(${directives.map(buildCaseInsensitiveRegex).join("|")})\\b`
);
//const directivePattern = /\s+(\.[oO][rR][gG]|\.equ)\b/;

const registerCustomLanguage = (monaco) => {
  monaco.languages.register({ id: "customAssembly" });

  monaco.languages.setMonarchTokensProvider("customAssembly", {
    tokenizer: {
      root: [
        [/\s+(\.[eE][nN][dD])\b/, { token: "endMarker", next: "afterEnd" }],
        [/#[\$%]?[a-zA-Z0-9]+/, { token: "number" }],
        [/^([a-zA-Z_][a-zA-Z0-9_]*)/, { token: "label" }],
        [keywordPattern, "keyword"],
        [directivePattern, { token: "directive" }],
        [/".*?"/, { token: "string" }],
        [/(;.*$)/, "comment"],
        [/\s+/, ""],
        [/./, "text"],
      ],
      afterEnd: [[/./, { token: "grayText" }]],
    },
  });

  // Define the custom theme
  monaco.editor.defineTheme("customTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "endMarker", foreground: "#9b715e" },
      { token: "grayText", foreground: "#808080" },
      { token: "label", foreground: "#569cd6" },
      { token: "keyword", foreground: "#a573a2" },
      { token: "directive", foreground: "#9b715e" },
      { token: "string", foreground: "#dcdcaa" },
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

const CodeEditor = ({
  setRawCode,
  errorOnLine,
  setErrorOnLine,
  buildSuccess,
  setBuildSuccess,
  build,
  setBuild,
  stepClicked,
  setStepClicked,
  setErrorOpCode,
  runClicked,
  setRunClicked,
  togglePassZeros,
  setTogglePassZeros,
}) => {
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

  // Fetch the document content from Firestore and load it into the editor
  const fetchSavedCode = async () => {
    try {
      const db = getDb();
      const docRef = doc(db, "editorContents", docId);
      const docSnap = await getDoc(docRef);

      console.log("Fetching document with ID: ", docId, docSnap.exists());

      if (docSnap.exists()) {
        const savedData = docSnap.data();
        setEditorContent(savedData.code || "; Start typing your assembly code here...");
        console.log("Document savedData.code:", savedData.code);
      } else {
        console.log("No such document found!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchSavedCode();
  }, [docId]); // Re-fetch if the document ID changes

  const [buildingTimeout, setBuildingTimeout] = useState(false);

  const [togglePassZerosAlertVisible, setTogglePassZerosAlertVisible] =
    useState(false);

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setTogglePassZerosAlertVisible(true);
    setTimeout(() => {
      setTogglePassZerosAlertVisible(false);
    }, 3000);
  }, [togglePassZeros]);

  useEffect(() => {
    if (buildingTimeout) {
      setBuildingTimeout(false);
    }
  }, [errorOnLine, buildSuccess]);

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
            fetchSavedCode();
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
            <>
              {!buildingTimeout ? (
                <button
                  className="bg-[#f0a55a]  lg:font-light items-center text-lg p-2   text-black  rounded-md flex gap-2   "
                  onClick={() => {
                    console.log("build");

                    setBuild(!build);
                    setBuildingTimeout(true);
                    //independent of the result either errorOnLine or buildSuccess will be changed
                    setRawCode(editorContent);
                    setErrorOpCode(null);
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
                <button className="bg-[#d1bba5] w-24 h-10  lg:font-light items-center justify-center text-xl p-2   text-black  rounded-md flex gap-2   animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 14.5a.5.5 0 0 0 .5.5h11a.5.5 0 1 0 0-1h-1v-1a4.5 4.5 0 0 0-2.557-4.06c-.29-.139-.443-.377-.443-.59v-.7c0-.213.154-.451.443-.59A4.5 4.5 0 0 0 12.5 3V2h1a.5.5 0 0 0 0-1h-11a.5.5 0 0 0 0 1h1v1a4.5 4.5 0 0 0 2.557 4.06c.29.139.443.377.443.59v.7c0 .213-.154.451-.443.59A4.5 4.5 0 0 0 3.5 13v1h-1a.5.5 0 0 0-.5.5m2.5-.5v-1a3.5 3.5 0 0 1 1.989-3.158c.533-.256 1.011-.79 1.011-1.491v-.702s.18.101.5.101.5-.1.5-.1v.7c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13v1z" />
                  </svg>
                </button>
              )}
            </>
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
              {!runClicked ? (
                <button
                  onClick={() => {
                    console.log("button run press");
                    if (buildSuccess) setRunClicked(true);
                  }}
                  className="bg-green-500  lg:font-light items-center  text-lg p-2  text-white  rounded-md flex gap-2  "
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
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                  </svg>
                  RUN
                </button>
              ) : (
                <button className="bg-green-700 w-24 h-10  lg:font-light items-center justify-center text-xl p-2   text-black  rounded-md flex gap-2   animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 14.5a.5.5 0 0 0 .5.5h11a.5.5 0 1 0 0-1h-1v-1a4.5 4.5 0 0 0-2.557-4.06c-.29-.139-.443-.377-.443-.59v-.7c0-.213.154-.451.443-.59A4.5 4.5 0 0 0 12.5 3V2h1a.5.5 0 0 0 0-1h-11a.5.5 0 0 0 0 1h1v1a4.5 4.5 0 0 0 2.557 4.06c.29.139.443.377.443.59v.7c0 .213-.154.451-.443.59A4.5 4.5 0 0 0 3.5 13v1h-1a.5.5 0 0 0-.5.5m2.5-.5v-1a3.5 3.5 0 0 1 1.989-3.158c.533-.256 1.011-.79 1.011-1.491v-.702s.18.101.5.101.5-.1.5-.1v.7c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13v1z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => {
                  if (buildSuccess) setStepClicked(!stepClicked);
                }}
                className="bg-blue-500  lg:font-light items-center  text-lg p-2  text-white  rounded-md flex gap-2  "
              >
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="passZeros"
                  name="passZeros"
                  checked={togglePassZeros}
                  onChange={() => setTogglePassZeros(!togglePassZeros)}
                />
                <div className="relative group">
                  <h1 className="text-white text-lg mb-4 cursor-pointer">?</h1>
                  <span className="absolute left-6 bottom-0 hidden group-hover:block bg-gray-700 text-white text-sm rounded-md px-2 py-1 whitespace-no-wrap">
                    Pass all zero opCodes on STEP
                  </span>
                </div>
                {togglePassZerosAlertVisible && (
                  <div className=" p-20 absolute sm:hidden left-12 bottom-64 bg-gray-700 text-white text-lg rounded-md px-2 py-1 whitespace-no-wrap">
                    {togglePassZeros
                      ? "Pass all zero opCodes on STEP"
                      : "Do not pass zero opCodes on STEP"}
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  try {
                    const db = getDb();

                    if (docId === "default") {
                      docId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    }

                    await setDoc(doc(db, "editorContents", docId), {
                      code: editorContent,
                      createdAt: new Date(),
                      oldVersions: arrayUnion({ code: editorContent, createdAt: new Date() }),
                    }, { merge: true });

                    console.log("Document written with ID: ", docId);
                    setShareUrl(window.location.origin + "/" + docId);
                    // and update the URL
                    window.history.pushState({}, "", docId);
                  } catch (error) {
                    console.error("Error writing document: ", error);
                  }
                }}
                className="bg-orange-500 lg:font-light items-center text-lg p-2 text-white rounded-md flex gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h10l6 6v10c0 1.1-.9 2-2 2zm-7-3c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm4-10V4H5v14h14v-7h-5V8z" />
                </svg>
                SAVE
              </button>
              {/* show share url if exists */}
              {shareUrl && (
                <div className="flex flex-col items-start gap-2 mt-4">

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                    }}
                    className="bg-gray-700 text-white text-lg p-2 rounded-md"
                  >
                    Copy URL
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default CodeEditor;
