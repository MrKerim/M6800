const instructionSheetScript = new Map();
const assemblerDirectiveScript = new Map();
const assemblyCompiler = new Map();

/*
-- -----------------------
-- -----------------------

Status Flags (CC) Notes


2. Sets CC.V = N ⊕ C after shift has occurred.
3. CC.C = 1 if BCD result > 9910 ; otherwise, CC.C = 0.
4. CC.N = Sign bit from subtraction of MS bytes.
5. CC.V = Two’s-complement overflow from subtraction of MS bytes.
6. Sets CC.I when interrupt occurs. If previously set, a NonMaskable
Interrupt is required to exit from the wait state.


Interrupt vectors

FFF8 - IRQ MS
FFF9 - IRQ LS
FFFA - SWI MS
FFFB - SWI LS
FFFC - NMI MS
FFFD - NMI LS
FFFE - Reset MS
FFFF - Reset LS

-- -----------------------
-- -----------------------
*/

assemblerDirectiveScript.set(".end", 1);
// special case handled in the main function

/*
-- -----------------------
-- label directive operand modifier
-- -----------------------
*/

/*
-- -----------------------
-- (no label) .org operand
-- operand -> PC
-- -----------------------
*/

function org(label, directive, operand, modifier, pC, tempMemory, labels) {
	console.log("org");
	// there should be no label
	if (label) return null;
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address
	if (operand[0] === "#") return null;

	if (operand[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(operand.slice(1), 16))) return null;
		else if (parseInt(operand.slice(1), 16) > 0xffff) return null;
		else
			return {
				pc: parseInt(operand.slice(1), 16),
				tempMemory: tempMemory,
				labels: labels,
			};
	}
	if (operand[0] === "%") {
		//binary
		if (isNaN(parseInt(operand.slice(1), 2))) return null;
		else if (parseInt(operand.slice(1), 2) > 0xffff) return null;
		else
			return {
				pc: parseInt(operand.slice(1), 2),
				tempMemory: tempMemory,
				labels: labels,
			};
	}
	//decimal
	if (isNaN(parseInt(operand))) return null;
	else if (parseInt(operand) > 0xffff) return null;
	else return { pc: parseInt(operand), tempMemory: tempMemory, labels: labels };
}
assemblerDirectiveScript.set(".org", org);

/*
-- -----------------------
-- label .equ operand
-- operand -> label
-- -----------------------
*/

function equ(label, directive, operand, modifier, pC, tempMemory, labels) {
	// there should be a label
	if (!label) return null;
	if (!isLabel(label)) return null;
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address
	if (operand[0] === "#") return null;

	if (operand[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(operand.slice(1), 16))) return null;
		else if (parseInt(operand.slice(1), 16) > 0xff) return null;
		else {
			labels.set(label, parseInt(operand.slice(1), 16));
			return { pc: pC + 1, tempMemory: tempMemory, labels: labels };
		}
	}
	if (operand[0] === "%") {
		//binary
		if (isNaN(parseInt(operand.slice(1), 2))) return null;
		else if (parseInt(operand.slice(1), 2) > 0xff) return null;
		else {
			labels.set(label, parseInt(operand.slice(1), 2));
			return {
				pc: parseInt(operand.slice(1), 2),
				tempMemory: tempMemory,
				labels: labels,
			};
		}
	}
	//decimal
	if (isNaN(parseInt(operand))) return null;
	else if (parseInt(operand) > 0xff) return null;
	else {
		labels.set(label, parseInt(operand));
		return { pc: parseInt(operand), tempMemory: tempMemory, labels: labels };
	}
}
assemblerDirectiveScript.set(".equ", equ);

/*
-- -----------------------
-- label .rmb operand
-- PC -> label , PC + operand -> PC
-- -----------------------
*/

function rmb(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address
	if (operand[0] === "#") return null;

	if (operand[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(operand.slice(1), 16))) return null;
		else if (parseInt(operand.slice(1), 16) > 0xff) return null;
		else {
			return {
				pc: pC + parseInt(operand.slice(1), 16),
				tempMemory: tempMemory,
				labels: labels,
			};
		}
	}
	if (operand[0] === "%") {
		//binary
		if (isNaN(parseInt(operand.slice(1), 2))) return null;
		else if (parseInt(operand.slice(1), 2) > 0xff) return null;
		else {
			return {
				pc: pC + parseInt(operand.slice(1), 2),
				tempMemory: tempMemory,
				labels: labels,
			};
		}
	}
	//decimal
	if (isNaN(parseInt(operand))) return null;
	else if (parseInt(operand) > 0xff) return null;
	else {
		return {
			pc: pC + parseInt(operand),
			tempMemory: tempMemory,
			labels: labels,
		};
	}
}
assemblerDirectiveScript.set(".rmb", rmb);

/*
-- -----------------------
-- label .setb operand
-- PC -> label ,  operand -> Memory[PC]
-- -----------------------
*/
function setb(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address
	if (operand[0] === "#") return null;

	if (operand[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(operand.slice(1), 16))) return null;
		else if (parseInt(operand.slice(1), 16) > 0xff) return null;
		else {
			if (parseInt(operand.slice(1), 16) > 0xff) return null;
			tempMemory[pC] = parseInt(operand.slice(1), 16);
			return { pc: pC + 1, tempMemory: tempMemory, labels: labels };
		}
	}
	if (operand[0] === "%") {
		//binary
		if (isNaN(parseInt(operand.slice(1), 2))) return null;
		else if (parseInt(operand.slice(1), 2) > 0xff) return null;
		else {
			if (parseInt(operand.slice(1), 2) > 0xff) return null;
			tempMemory[pC] = parseInt(operand.slice(1), 2);
			return { pc: pC + 1, tempMemory: tempMemory, labels: labels };
		}
	}
	//decimal
	if (isNaN(parseInt(operand))) return null;
	else if (parseInt(operand) > 0xff) return null;
	else {
		if (parseInt(operand) > 0xff) return null;
		tempMemory[pC] = parseInt(operand);
		return { pc: pC + 1, tempMemory: tempMemory, labels: labels };
	}
}
assemblerDirectiveScript.set(".setb", setb);

/*
-- -----------------------
-- label .setw operand
-- PC -> label ,  operand -> Memory[PC] , Memory[PC + 1]
-- -----------------------
*/

function setw(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address
	if (operand[0] === "#") return null;

	if (operand[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(operand.slice(1), 16))) return null;
		else if (parseInt(operand.slice(1), 16) > 0xffff) return null;
		else {
			if (parseInt(operand.slice(1), 16) > 0xffff) return null;
			tempMemory[pC + 1] = parseInt(operand.slice(1), 16) & 0xff;
			tempMemory[pC] = (parseInt(operand.slice(1), 16) & 0xff00) >> 8;
			return { pc: pC + 2, tempMemory: tempMemory, labels: labels };
		}
	}
	if (operand[0] === "%") {
		//binary
		if (isNaN(parseInt(operand.slice(1), 2))) return null;
		else if (parseInt(operand.slice(1), 2) > 0xffff) return null;
		else {
			if (parseInt(operand.slice(1), 2) > 0xffff) return null;
			tempMemory[pC + 1] = parseInt(operand.slice(1), 2) & 0xff;
			tempMemory[pC] = (parseInt(operand.slice(1), 2) & 0xff00) >> 8;
			return { pc: pC + 2, tempMemory: tempMemory, labels: labels };
		}
	}
	//decimal
	if (isNaN(parseInt(operand))) return null;
	else if (parseInt(operand) > 0xffff) return null;
	else {
		if (parseInt(operand) > 0xffff) return null;
		tempMemory[pC + 1] = parseInt(operand) & 0xff;
		tempMemory[pC] = (parseInt(operand) & 0xff00) >> 8;
		return { pc: pC + 2, tempMemory: tempMemory, labels: labels };
	}
}
assemblerDirectiveScript.set(".setw", setw);

/*
-- -----------------------
-- label .byte operand,modfier
-- PC -> label ,  operand,modfier -> Memory[PC] , Memory[PC ..]..
-- -----------------------
*/

function byte(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there cane be a modifier
	let values = [];
	if (modifier) {
		values = modifier.split(",");
	}
	// there should be an operand
	if (!operand) return null;
	values = [operand, ...values];
	// operand should be a memory address
	if (operand[0] === "#") return null;

	let index = 0;
	for (let i = 0; i < values.length; i++) {
		if (values[i][0] === "$") {
			//hexadecimal
			if (isNaN(parseInt(values[i].slice(1), 16))) return null;
			else if (parseInt(values[i].slice(1), 16) > 0xff) return null;
			else {
				if (parseInt(values[i].slice(1), 16) > 0xff) return null;
				tempMemory[pC + index] = parseInt(values[i].slice(1), 16);
				index++;
			}
		} else if (values[i][0] === "%") {
			//binary
			if (isNaN(parseInt(values[i].slice(1), 2))) return null;
			else if (parseInt(values[i].slice(1), 2) > 0xff) return null;
			else {
				if (parseInt(values[i].slice(1), 2) > 0xff) return null;
				tempMemory[pC + index] = parseInt(values[i].slice(1), 2);
				index++;
			}
		} else {
			//decimal
			if (isNaN(parseInt(values[i]))) return null;
			else if (parseInt(values[i]) > 0xff) return null;
			else {
				if (parseInt(values[i]) > 0xff) return null;
				tempMemory[pC + index] = parseInt(values[i]);
				index++;
			}
		}
	}
	return { pc: pC + index, tempMemory: tempMemory, labels: labels };
}
assemblerDirectiveScript.set(".byte", byte);

/*
-- -----------------------
-- label .word operand,modfier
-- PC -> label ,  operand,modfier -> Memory[PC] , Memory[PC ..]..
-- -----------------------
*/

function word(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there cane be a modifier
	let values = [];
	if (modifier) {
		values = modifier.split(",");
	}
	// there should be an operand
	if (!operand) return null;
	values = [operand, ...values];
	// operand should be a memory address
	if (operand[0] === "#") return null;

	let index = 0;
	for (let i = 0; i < values.length; i++) {
		if (values[i][0] === "$") {
			//hexadecimal
			if (isNaN(parseInt(values[i].slice(1), 16))) return null;
			else if (parseInt(values[i].slice(1), 16) > 0xffff) return null;
			else {
				tempMemory[pC + index + 1] = parseInt(values[i].slice(1), 16) & 0xff;
				tempMemory[pC + index] =
					(parseInt(values[i].slice(1), 16) & 0xff00) >> 8;
				index = index + 2;
			}
		} else if (values[i][0] === "%") {
			//binary
			if (isNaN(parseInt(values[i].slice(1), 2))) return null;
			else if (parseInt(values[i].slice(1), 2) > 0xff) return null;
			else {
				if (parseInt(values[i].slice(1), 2) > 0xff) return null;
				tempMemory[pC + index + 1] = parseInt(values[i].slice(1), 2) & 0xff;
				tempMemory[pC + index] =
					(parseInt(values[i].slice(1), 2) & 0xff00) >> 8;
				index = index + 2;
			}
		} else {
			//decimal
			if (isNaN(parseInt(values[i]))) return null;
			else if (parseInt(values[i]) > 0xff) return null;
			else {
				if (parseInt(values[i]) > 0xff) return null;
				tempMemory[pC + index + 1] = parseInt(values[i]) & 0xff;
				tempMemory[pC + index] = (parseInt(values[i]) & 0xff00) >> 8;
				index = index + 2;
			}
		}
	}
	return { pc: pC + index, tempMemory: tempMemory, labels: labels };
}
assemblerDirectiveScript.set(".word", word);

/*
-- -----------------------
-- label .str operand
-- PC -> label ,  operand[0] -> Memory[PC] , Memory[PC ..].. , 0 -> Memory[PC + operand.length]
-- -----------------------
*/

function str(label, directive, operand, modifier, pC, tempMemory, labels) {
	if (label) {
		if (!isLabel(label)) return null;
		labels.set(label, pC);
	}
	// there should be no modifier
	if (modifier) return null;
	// there should be an operand
	if (!operand) return null;
	// operand should be a memory address

	if (operand[0] !== '"') return null;
	if (operand[operand.length - 1] !== '"') return null;

	let index = 0;
	for (let i = 1; i < operand.length - 1; i++) {
		tempMemory[pC + index] = operand.charCodeAt(i);
		index++;
	}
	tempMemory[pC + index] = 0;
	return { pc: pC + index + 1, tempMemory: tempMemory, labels: labels };
}
assemblerDirectiveScript.set(".str", str);

/*
-- -----------------------
-- -----------------------
*/

/*
ABA - AccA + AccB -> AccA
    Inherent
    1B

    Condition Code:
    H | I | N | Z | V | C
    ~ | * | ~ | ~ | ~ | ~   
*/
function aba(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x1b];
}
instructionSheetScript.set("aba", aba);

// Assembler
function abaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + accB;
	const accA_result = result & 0xff;
	const carry_out = result > 0xff ? 1 : 0;

	// Set flags
	const flags = {
		H: (accA & 0x0f) + (accB & 0x0f) > 0x0f, // Half Carry from bit 3 to 4
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: ((accA ^ accB) & 0x80) === 0 && ((accA ^ accA_result) & 0x80) !== 0, // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x1b, abaE);

/*
-- -----------------------
-- -----------------------
*/

/*
ASLA - AccA << 1 -> AccA
    Inherent
    48

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~   
*/
function asla(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x48];
}
instructionSheetScript.set("asla", asla);

// Assembler
function aslaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	result = accA << 1;
	const accA_result = result & 0xff;
	const carry_out = result > 0xff ? 1 : 0;

	// Set flags
	// Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accA_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x48, aslaE);

/*
-- -----------------------
-- -----------------------
*/

/*
ASLB - AccB << 1 -> AccB
    Inherent
    58

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function aslb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x58];
}
instructionSheetScript.set("aslb", aslb);

// Assembler

function aslbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB << 1;
	const accB_result = result & 0xff;
	const carry_out = result > 0xff ? 1 : 0;

	// Set flags
	// Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accB_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x58, aslbE);

/*
-- -----------------------
-- -----------------------
*/

/*
ASRA - AccA >> 1 -> AccA
    Inherent
    47  

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function asra(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x47];
}
instructionSheetScript.set("asra", asra);

// Assembler

function asraE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA >> 1;
	const accA_result = (result & 0xff) | (accA & 0x80);
	const carry_out = accA & 0x01;

	// Set flags
	// Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accA_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x47, asraE);

/*
-- -----------------------
-- -----------------------
*/

/*
ASRB - AccB >> 1 -> AccB
    Inherent
    57

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function asrb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x57];
}
instructionSheetScript.set("asrb", asrb);

// Assembler

function asrbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB >> 1;
	const accB_result = (result & 0xff) | (accB & 0x80);
	const carry_out = accB & 0x01;

	// Set flags
	// Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accB_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x57, asrbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check subtraction logic
-- -----------------------
*/

/*
CBA - A - B
    Inherent
    11

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~  
*/
function cba(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x11];
}
instructionSheetScript.set("cba", cba);

// Assembler

function cbaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - accB;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: result === 0, // Zero flag, result is zero
		V: ((accA ^ accB) & 0x80) !== 0 && ((accA ^ result) & 0x80) !== 0, // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x11, cbaE);

/*
-- -----------------------
-- -----------------------
*/

/*
CLRA - 0 -> AccA
    Inherent
    4F

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | S | R | R  
*/
function clra(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x4f];
}
instructionSheetScript.set("clra", clra);

// Assembler

function clraE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false, // Negative flag, MSB is 0
		Z: true, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: false, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: 0,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x4f, clraE);

/*
-- -----------------------
-- -----------------------
*/

/*
CLRB - 0 -> AccB
    Inherent
    5F

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | S | R | R  
*/
function clrb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x5f];
}
instructionSheetScript.set("clrb", clrb);

// Assembler

function clrbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false, // Negative flag, MSB is 0
		Z: true, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: false, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: 0,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x5f, clrbE);

/*
-- -----------------------
-- -----------------------
*/

/*
COMA - ~AccA -> AccA
    Inherent
    43

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | S  
*/
function coma(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x43];
}
instructionSheetScript.set("coma", coma);

// Assembler
function comaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const accA_result = ~accA & 0xff;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: true, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x43, comaE);

/*
-- -----------------------
-- -----------------------
*/

/*
COMB - ~AccB -> AccB
    Inherent
    53

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | S  
*/
function comb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x53];
}
instructionSheetScript.set("comb", comb);

// Assembler

function combE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const accB_result = ~accB & 0xff;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: true, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x53, combE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check DAA logic
-- -----------------------
*/

/*
DAA - convert binary addition of BCD
    Inherent
    19

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | 3  
*/
function daa(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x19];
}
instructionSheetScript.set("daa", daa);

// Assembler

function daaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	let result = accA;
	if ((result & 0x0f) > 9 || statFlags.H) {
		result += 6;
	}
	if ((result & 0xf0) > 0x90 || statFlags.C) {
		result += 0x60;
	}

	const carry_out = result > 99 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: result === 0, // Zero flag, result is zero
		V: (accA ^ result) & (0x80 !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x19, daaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
DECA - AccA - 1 -> AccA
    Inherent
    4A

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | *  
*/
function deca(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x4a];
}
instructionSheetScript.set("deca", deca);

// Assembler

function decaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - 1;
	const accA_result = result & 0xff;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: ((accA ^ 0xff) & 0x80) !== 0 && ((accA ^ accA_result) & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Carry flag unchanged
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x4a, decaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
DECB - AccB - 1 -> AccB
    Inherent
    5A

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | *  
*/
function decb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x5a];
}
instructionSheetScript.set("decb", decb);

// Assembler

function decbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - 1;
	const accB_result = result & 0xff;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: ((accB ^ 0xff) & 0x80) !== 0 && ((accB ^ accB_result) & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Carry flag unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x5a, decbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
INCA - AccA + 1 -> AccA
    Inherent
    4C

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | *  
*/
function inca(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x4c];
}
instructionSheetScript.set("inca", inca);

// Assembler
function incaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + 1;
	const accA_result = result & 0xff;
	const carry_out = result > 0xff ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: ((accA ^ 0xff) & 0x80) !== 0 && ((accA ^ accA_result) & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Carry flag unchanged
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x4c, incaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
INCB - AccB + 1 -> AccB
    Inherent
    5C

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | *  
*/
function incb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x5c];
}
instructionSheetScript.set("incb", incb);

// Assembler

function incbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + 1;
	const accB_result = result & 0xff;
	const carry_out = result > 0xff ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: ((accB ^ 0xff) & 0x80) !== 0 && ((accB ^ accB_result) & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Carry flag unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x5c, incbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
LSRA - AccA >> 1 -> AccA
    Inherent
    44

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | ~ | 2 | ~  
*/
function lsra(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x44];
}
instructionSheetScript.set("lsra", lsra);

// Assembler
function lsraE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA >> 1;
	const accA_result = result & 0xff;
	const carry_out = accA & 0x01;

	// Set flags
	//2. Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: 0, // Negative flag, MSB is 0
		Z: accA_result === 0, // Zero flag, result is zero
		V: 0 ^ carry_out, // Overflow for signed since N is reseted
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x44, lsraE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
LSRB - AccB >> 1 -> AccB
    Inherent
    54

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | ~ | 2 | ~  
*/
function lsrb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x54];
}
instructionSheetScript.set("lsrb", lsrb);

// Assembler
function lsrbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB >> 1;
	const accB_result = result & 0xff;
	const carry_out = accB & 0x01;

	// Set flags
	//2. Sets CC.V = N ⊕ C after shift has occurred.
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: 0, // Negative flag, MSB is 0
		Z: accB_result === 0, // Zero flag, result is zero
		V: 0 ^ carry_out, // Overflow for signed since N is reseted
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x54, lsrbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check carry logic
-- -----------------------
*/

/*
NEGA - -AccA -> AccA
    Inherent
    40

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~  
*/
function nega(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x40];
}
instructionSheetScript.set("nega", nega);

// Assembler
function negaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = -accA;
	const accA_result = result & 0xff;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: accA_result === 0x80, // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x40, negaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check carry logic
-- -----------------------
*/

/*
NEGB - -AccB -> AccB
    Inherent
    50

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~  
*/
function negb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x50];
}
instructionSheetScript.set("negb", negb);

// Assembler
function negbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = -accB;
	const accB_result = result & 0xff;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: accB_result === 0x80, // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x50, negbE);

/*
-- -----------------------
-- -----------------------
*/

/*
PSHA - AccA -> Stack , SP - 1 -> SP
    Inherent
    36

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *  
*/
function psha(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x36];
}
instructionSheetScript.set("psha", psha);

// Assembler
function pshaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const memory_result = memory;
	memory_result[stackP] = accA;

	return {
		pC: pC + 1,
		accA,
		accB,
		memory: memory_result,
		stackP: stackP - 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x36, pshaE);

/*
-- -----------------------
-- -----------------------
*/

/*
PSHB - AccB -> Stack , SP - 1 -> SP
    Inherent
    37

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *  
*/
function pshb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x37];
}
instructionSheetScript.set("pshb", pshb);

// Assembler
function pshbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const memory_result = memory;
	memory_result[stackP] = accB;

	return {
		pC: pC + 1,
		accA,
		accB,
		memory: memory_result,
		stackP: stackP - 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x37, pshbE);

/*
-- -----------------------
-- -----------------------
*/

/*
PULA - Stack -> AccA , SP + 1 -> SP
    Inherent
    32

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *  
*/
function pula(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x32];
}
instructionSheetScript.set("pula", pula);

// Assembler
function pulaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const memory_result = memory;
	const accA_result = memory_result[stackP + 1];

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory: memory_result,
		stackP: stackP + 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x32, pulaE);

/*
-- -----------------------
-- -----------------------
*/

/*
PULB - Stack -> AccB , SP + 1 -> SP
    Inherent
    33

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *  
*/
function pulb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x33];
}
instructionSheetScript.set("pulb", pulb);

// Assembler
function pulbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const memory_result = memory;
	const accB_result = memory_result[stackP + 1];

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory: memory_result,
		stackP: stackP + 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x33, pulbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
ROLA - AccA << 1 -> AccA
    Inherent
    49

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function rola(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x49];
}
instructionSheetScript.set("rola", rola);

// Assembler
function rolaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (accA << 1) | statFlags.C;
	const accA_result = result & 0xff;
	const carry_out = accA & 0x80;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accA_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x49, rolaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
ROLB - AccB << 1 -> AccB
    Inherent
    59

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function rolb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x59];
}
instructionSheetScript.set("rolb", rolb);

// Assembler
function rolbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (accB << 1) | statFlags.C;
	const accB_result = result & 0xff;
	const carry_out = accB & 0x80;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accB_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x59, rolbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
RORA - AccA >> 1 -> AccA
    Inherent
    46

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function rora(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x46];
}
instructionSheetScript.set("rora", rora);

// Assembler
function roraE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (accA >> 1) | (statFlags.C << 7);
	const accA_result = result & 0xff;
	const carry_out = accA & 0x01;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accA_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x46, roraE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
RORB - AccB >> 1 -> AccB
    Inherent
    56

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~  
*/
function rorb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x56];
}
instructionSheetScript.set("rorb", rorb);

// Assembler
function rorbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (accB >> 1) | (statFlags.C << 7);
	const accB_result = result & 0xff;
	const carry_out = accB & 0x01;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB_result === 0, // Zero flag, result is zero
		V: carry_out ^ ((accB_result & 0x80) !== 0), // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA,
		accB: accB_result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x56, rorbE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check overflow logic
-- -----------------------
*/

/*
SBA - AccA - AccB -> AccA
    Inherent
    10

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~  
*/
function sba(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x10];
}
instructionSheetScript.set("sba", sba);

// Assembler
function sbaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - accB;
	const accA_result = result & 0xff;
	const carry_out = result < 0 ? 1 : 0;

	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA_result & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA_result === 0, // Zero flag, result is zero
		V: ((accA ^ accB) & 0x80) !== 0 && ((accA ^ accA_result) & 0x80) !== 0, // Overflow for signed
		C: carry_out, // Carry flag for unsigned
	};

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x10, sbaE);

/*
-- -----------------------
-- -----------------------
*/

/*
TAB - AccA -> AccB
    Inherent
    16

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function tab(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x16];
}
instructionSheetScript.set("tab", tab);

// Assembler
function tabE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA === 0, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: statFlags.C, // Carry flag
	};

	return {
		pC: pC + 1,
		accA,
		accB: accA,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x16, tabE);

/*
-- -----------------------
-- -----------------------
*/

/*
TBA - AccB -> AccA
    Inherent
    17

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function tba(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x17];
}
instructionSheetScript.set("tba", tba);

// Assembler

function tbaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB === 0, // Zero flag, result is zero
		V: false, // Overflow for signed
		C: statFlags.C, // Carry flag
	};

	return {
		pC: pC + 1,
		accA: accB,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x17, tbaE);

/*
-- -----------------------
-- -----------------------
*/

/*
TSTA - AccA - 0 
    Inherent
    4D

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | R 
*/
function tsta(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x4d];
}
instructionSheetScript.set("tsta", tsta);

// Assembler

function tstaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accA === 0, // Zero flag, result is zero
		V: false, // Reset
		C: false, // Reset
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x4d, tstaE);

/*
-- -----------------------
-- -----------------------
*/

/*
TSTB - AccB - 0
    Inherent
    5D

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | R 
*/
function tstb(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x5d];
}
instructionSheetScript.set("tstb", tstb);

// Assembler
function tstbE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	// Set flags
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB & 0x80) !== 0, // Negative flag, MSB is 1
		Z: accB === 0, // Zero flag, result is zero
		V: false, // Reset
		C: false, // Reset
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x5d, tstbE);

/*
-- -----------------------
-- -----------------------
*/

/*
DES - SP - 1 -> SP
    Inherent
    34

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function des(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x34];
}
instructionSheetScript.set("des", des);

// Assembler
function desE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP: stackP - 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x34, desE);

/*
-- -----------------------
-- -----------------------
*/

/*
DEX - X - 1 -> X
    Inherent
    09

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | ~ | * | * 
*/
function dex(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x09];
}
instructionSheetScript.set("dex", dex);

// Assembler
function dexE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg: xReg - 1,
		statFlags,
	};
}
assemblyCompiler.set(0x09, dexE);

/*
-- -----------------------
-- -----------------------
*/

/*
INS - SP + 1 -> SP
    Inherent
    31

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function ins(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x31];
}
instructionSheetScript.set("ins", ins);

// Assembler
function insE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP: stackP + 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x31, insE);

/*
-- -----------------------
-- -----------------------
*/

/*
INX - X + 1 -> X
    Inherent
    08

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | ~ | * | * 
*/
function inx(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x08];
}
instructionSheetScript.set("inx", inx);

// Assembler
function inxE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg: xReg + 1,
		statFlags,
	};
}
assemblyCompiler.set(0x08, inxE);

/*
-- -----------------------
-- -----------------------
*/

/*
TSX - SP + 1 -> X
    Inherent
    30

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function tsx(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x30];
}
instructionSheetScript.set("tsx", tsx);

// Assembler
function tsxE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg: stackP + 1,
		statFlags,
	};
}
assemblyCompiler.set(0x30, tsxE);

/*
-- -----------------------
-- -----------------------
*/

/*
TXS - X -1 -> SP
    Inherent
    35

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function txs(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x35];
}
instructionSheetScript.set("txs", txs);

// Assembler
function txsE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP: xReg - 1,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x35, txsE);

/*
-- -----------------------
-- -----------------------
*/

/*
NOP - No operation
    Inherent
    01

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function nop(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x01];
}
instructionSheetScript.set("nop", nop);

// Assembler
function nopE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x01, nopE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check pulling interrupt stack frame logic
-- -----------------------
*/

/*
RTI - Return from interrupt
    Inherent
    3B

    Condition Code:
    H | I | N | Z | V | C
    ~ | ~ | ~ | ~ | ~ | ~ 
*/
function rti(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x3b];
}
instructionSheetScript.set("rti", rti);

// Assembler
function rtiE(pC, accA, accB, memory, stackPointer, xRegister, statusFlags) {
	// Restore flags and registers from the stack in the order they were pushed.
	const newStatusFlags = stack[++stackPointer];

	const newAccB = stack[++stackPointer];
	const newAccA = stack[++stackPointer];

	const newXRegisterMs = stack[++stackPointer];
	const newXRegisterLs = stack[++stackPointer];
	const newXRegister = (newXRegisterMs << 8) | newXRegisterLs;

	const newPCMs = stack[++stackPointer];
	const newPCLs = stack[++stackPointer];
	const newPC = (newPCMs << 8) | newPCLs;

	// Update status flags (H, I, N, Z, V, C) as retrieved from the stack
	const flags = {
		H: (newStatusFlags & 0x20) !== 0,
		I: (newStatusFlags & 0x10) !== 0,
		N: (newStatusFlags & 0x08) !== 0,
		Z: (newStatusFlags & 0x04) !== 0,
		V: (newStatusFlags & 0x02) !== 0,
		C: (newStatusFlags & 0x01) !== 0,
	};

	// Return the restored state
	return {
		pC: newPC,
		accA: newAccA,
		accB: newAccB,
		memory,
		stackPointer,
		xRegister: newXRegister,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x3b, rtiE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check returning subroutine logic
-- -----------------------
*/

/*
RTS - Return from subroutine
    Inherent
    39

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function rts(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x39];
}
instructionSheetScript.set("rts", rts);

// Assembler
function rtsE(pC, accA, accB, memory, stackPointer, xRegister, statusFlags) {
	// Restore the PC from the stack
	const newPCMs = memory[++stackPointer];
	const newPCLs = memory[++stackPointer];
	const newPC = (newPCMs << 8) | newPCLs;

	// Return the restored state
	return {
		pC: newPC,
		accA,
		accB,
		memory,
		stackPointer,
		xRegister,
		statusFlags,
	};
}
assemblyCompiler.set(0x39, rtsE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check saving interrupt stack frame logic
-- -----------------------
*/

/*
SWI - Software interrupt
    Inherent
    3F

    Condition Code:
    H | I | N | Z | V | C
    * | S | * | * | * | * 
*/
function swi(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x3f];
}
instructionSheetScript.set("swi", swi);

// Assembler
function swiE(pC, accA, accB, memory, stackPointer, xRegister, statusFlags) {
	memory[stackPointer--] = pC & 0xff; // Low byte of PC
	memory[stackPointer--] = (pC >> 8) & 0xff; // High byte of PC
	memory[stackPointer--] = xRegister & 0xff; // Low byte of X register
	memory[stackPointer--] = (xRegister >> 8) & 0xff; // High byte of X register
	memory[stackPointer--] = accA & 0xff; // Accumulator A
	memory[stackPointer--] = accB & 0xff; // Accumulator B
	memory[stackPointer--] = statusFlagsToByte(statusFlags); // Save condition code

	// Set the Interrupt Mask (I) flag to disable further interrupts
	statusFlags.I = 1;

	// Update the Program Counter to the interrupt vector address
	pC = memory[0xfffb] | (memory[0xfffa] << 8);

	// Return updated state
	return {
		pC: newPC,
		accA,
		accB,
		memory,
		stackPointer,
		xRegister,
		statusFlags,
	};
}
assemblyCompiler.set(0x3f, swiE);

// status flag hekper function
function statusFlagsToByte(statusFlags) {
	let byte = 0;
	byte |= statusFlags.H ? 0x20 : 0;
	byte |= statusFlags.I ? 0x10 : 0;
	byte |= statusFlags.N ? 0x08 : 0;
	byte |= statusFlags.Z ? 0x04 : 0;
	byte |= statusFlags.V ? 0x02 : 0;
	byte |= statusFlags.C ? 0x01 : 0;
	return byte;
}

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!WARNING: Not ready.
-- -----------------------
*/

/*
-- -----------------------
!TODO: Impelement the logic for wait for interrupt 
-- -----------------------
*/

/*
WAI - Wait for interrupt
    Inherent
    3E

    Condition Code:
    H | I | N | Z | V | C
    * | 6 | * | * | * | * 
*/
function wai(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x3e];
}
instructionSheetScript.set("wai", wai);

// Assembler
function waiE(pC, accA, accB, memory, stackPointer, xRegister, statusFlags) {
	statusFlags.I = 1;

	// Return the updated state
	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackPointer,
		xRegister,
		statusFlags,
	};
}
assemblyCompiler.set(0x3e, waiE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
Conditon Code OP Codes
-- -----------------------
*/

/*
-- -----------------------
-- -----------------------
*/

/*
CLC - Clear carry
    Inherent
    0C

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | R 
*/
function clc(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0c];
}
instructionSheetScript.set("clc", clc);

// Assembler
function clcE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: statFlags.V, // Unchanged
		C: false, // Reset
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0c, clcE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check CLI logic
-- -----------------------
*/

/*
CLI - Clear interrupt mask
    Inherent
    0E

    Condition Code:
    H | I | N | Z | V | C
    * | R | * | * | * | * 
*/
function cli(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0e];
}
instructionSheetScript.set("cli", cli);

// Assembler
function cliE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: false, // Reset
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: statFlags.V, // Unchanged
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0e, cliE);

/*
-- -----------------------
-- -----------------------
*/

/*
CLV - Clear overflow
    Inherent
    0A

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | R | * 
*/
function clv(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0a];
}
instructionSheetScript.set("clv", clv);

// Assembler
function clvE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: false, // Reset
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0a, clvE);

/*
-- -----------------------
-- -----------------------
*/

/*
SEC - Set carry
    Inherent
    0D

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | S 
*/
function sec(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0d];
}
instructionSheetScript.set("sec", sec);

// Assembler
function secE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: statFlags.V, // Unchanged
		C: true, // Set
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0d, secE);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check SEI logic
-- -----------------------
*/

/*
SEI - Set interrupt mask
    Inherent
    0F

    Condition Code:
    H | I | N | Z | V | C
    * | S | * | * | * | * 
*/
function sei(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0f];
}
instructionSheetScript.set("sei", sei);

// Assembler
function seiE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: true, // Set
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: statFlags.V, // Unchanged
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0f, seiE);

/*
-- -----------------------
-- -----------------------
*/

/*
SEV - Set overflow
    Inherent
    0B

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | S | * 
*/
function sev(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x0b];
}
instructionSheetScript.set("sev", sev);

// Assembler
function sevE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: statFlags.N, // Unchanged
		Z: statFlags.Z, // Unchanged
		V: true, // Set
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x0b, sevE);

/*
-- -----------------------
-- -----------------------
*/

/*
TAP - AccA -> CC
    Inherent
    06

    Condition Code:
    H | I | N | Z | V | C
    ~ | ~ | ~ | ~ | ~ | ~ 
*/
function tap(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x06];
}
instructionSheetScript.set("tap", tap);

// Assembler
function tapE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: (accA & 0x20) !== 0, // Half carry flag
		I: (accA & 0x10) !== 0, // Interrupt mask flag
		N: (accA & 0x08) !== 0, // Negative flag
		Z: (accA & 0x04) !== 0, // Zero flag
		V: (accA & 0x02) !== 0, // Overflow flag
		C: (accA & 0x01) !== 0, // Carry flag
	};

	return {
		pC: pC + 1,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x06, tapE);

/*
-- -----------------------
-- -----------------------
*/

/*
TPA - CC -> AccA
    Inherent
    07

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | * 
*/
function tpa(keyword, value, modifier) {
	if (modifier || value) return null;
	else return [0x07];
}
instructionSheetScript.set("tpa", tpa);

// Assembler
function tpaE(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const accA_result = statusFlagsToByte(statFlags);

	return {
		pC: pC + 1,
		accA: accA_result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x07, tpaE);

/*
-- -----------------------
-- -----------------------
*/

/*
-------------------------
Addressing Mode checking
-------------------------
if value starts with # then it is immediate
|-> if second character is a number then it is a decimal
|-> if second character is a $ then it is a hexadecimal
L-> if second character is a % then it is a binary

if value doesn't start with # then it is direct
L-> Or it can be extended adressing if it is in between 0xFF and 0xFFFF
    |-> if second character is a number then it is a decimal
    |-> if second character is a $ then it is a hexadecimal
    L-> if second character is a % then it is a binary



if there is a modifier then it is indexed
however
|-> if value is a number then it is a decimal
|-> if value is a $ then it is a hexadecimal
L-> if value is a % then it is a binary

Wee need to keep in mind that the value can be a label
so if we can't find anythign we assume the value is a label

There is also relative adressing which uses labels
we deal with them in the app later , we will directly pass them as labels to the memory
when dealin with thoose functions
*/
function checkAddressingMode(value, modifier) {
	if (!value) return null;
	//if there is no value it's an error
	if (modifier) {
		console.log("modifier", modifier);
		if (modifier.trim() !== "x") return null;
		//if there is a modifier it's indexed addressing
		// we need to find which value type it is
		if (value[0] === "$") {
			//hexadecimal
			if (isNaN(parseInt(value.slice(1), 16))) return null;
			else if (parseInt(value.slice(1), 16) > 0xff) return null;
			else
				return {
					addressingMode: "indexed",
					value: parseInt(value.slice(1), 16),
				};
		}
		if (value[0] === "%") {
			//binary
			if (isNaN(parseInt(value.slice(1), 2))) return null;
			else if (parseInt(value.slice(1), 2) > 0xff) return null;
			else
				return {
					addressingMode: "indexed",
					value: parseInt(value.slice(1), 2),
				};
		}
		//decimal
		if (isNaN(parseInt(value))) return null;
		else if (parseInt(value) > 0xff) return null;
		else return { addressingMode: "indexed", value: parseInt(value) };
	}

	//if there is no modifier it's direct or immediate addressing
	if (value[0] === "#") {
		//immediate addressing
		if (value[1] === "$") {
			//hexadecimal
			if (isNaN(parseInt(value.slice(2), 16))) return null;
			else if (parseInt(value.slice(2), 16) > 0xffff) return null;
			else
				return {
					addressingMode: "immediate",
					value: parseInt(value.slice(2), 16),
				};
		}
		if (value[1] === "%") {
			//binary
			if (isNaN(parseInt(value.slice(2), 2))) return null;
			else if (parseInt(value.slice(2), 2) > 0xffff) return null;
			else
				return {
					addressingMode: "immediate",
					value: parseInt(value.slice(2), 2),
				};
		}
		//decimal or label
		if (isNaN(parseInt(value.slice(1)))) {
			// is it a label
			if (!isLabel(value.slice(1))) return null;
			return {
				addressingMode: "immediate",
				value: value.slice(1),
			};
		} else if (parseInt(value.slice(1)) > 0xffff) return null;
		else
			return { addressingMode: "immediate", value: parseInt(value.slice(1)) };
	}

	//direct addressing
	if (value[0] === "$") {
		//hexadecimal
		if (isNaN(parseInt(value.slice(1), 16))) return null;
		else if (parseInt(value.slice(1), 16) > 0xff) {
			if (parseInt(value.slice(1), 16) > 0xffff) return null;
			return {
				addressingMode: "extended",
				value: parseInt(value.slice(1), 16),
			};
		} else
			return { addressingMode: "direct", value: parseInt(value.slice(1), 16) };
	}
	if (value[0] === "%") {
		//binary
		if (isNaN(parseInt(value.slice(1), 2))) return null;
		else if (parseInt(value.slice(1), 2) > 0xff) {
			if (parseInt(value.slice(1), 2) > 0xffff) return null;
			return {
				addressingMode: "extended",
				value: parseInt(value.slice(1), 2),
			};
		} else
			return { addressingMode: "direct", value: parseInt(value.slice(1), 2) };
	}
	//decimal or label
	if (isNaN(parseInt(value))) {
		return {
			addressingMode: "extended_or_direct_label",
			value: value,
		};
	} else if (parseInt(value) > 0xff) {
		if (parseInt(value) > 0xffff) return null;
		return {
			addressingMode: "extended",
			value: parseInt(value),
		};
	} else return { addressingMode: "direct", value: parseInt(value) };
}

/*
-------------------------
We check the value and modifier and pass them to the adress mode checker
if the result is a valid object we pass the opcodes
if not we return null
-------------------------
*/

/*
-- -----------------------
-- -----------------------
*/

/*
ADCA VARIABLE - AccA + VARIABLE + C -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    89        | 99     | A9      | B9

    Condition Code:
    H | I | N | Z | V | C
    ~ | * | ~ | ~ | ~ | ~
*/
function adca(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x89,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x89, addressingMode.value];
			case "direct":
				return [0x99, addressingMode.value];
			case "indexed":
				return [0xa9, addressingMode.value];
			case "extended":
				return [
					0xb9,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x99,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb9,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adca", adca);

// Assembler

//Immediate - 0x89

function adcaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[pC + 1] + (statFlags.C ? 1 : 0);

	const flags = {
		H: (accA & 0x0f) + (memory[pC + 1] & 0x0f) + (statFlags.C ? 1 : 0) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[pC + 1] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x89, adcaEim);

//Direct - 0x99

function adcaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[memory[pC + 1]] + (statFlags.C ? 1 : 0);

	const flags = {
		H:
			(accA & 0x0f) + (memory[memory[pC + 1]] & 0x0f) + (statFlags.C ? 1 : 0) >
			0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x99, adcaEd);

//Indexed - 0xa9

function adcaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[xReg + memory[pC + 1]] + (statFlags.C ? 1 : 0);

	const flags = {
		H:
			(accA & 0x0f) +
				(memory[xReg + memory[pC + 1]] & 0x0f) +
				(statFlags.C ? 1 : 0) >
			0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa9, adcaEin);

//Extended - 0xb9

function adcaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA + memory[address] + (statFlags.C ? 1 : 0);

	const flags = {
		H: (accA & 0x0f) + (memory[address] & 0x0f) + (statFlags.C ? 1 : 0) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[address] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb9, adcaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ADCB VARIABLE - AccB + VARIABLE + C -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C9        | D9     | E9      | F9

    Condition Code:
    H | I | N | Z | V | C
    ~ | * | ~ | ~ | ~ | ~
*/
function adcb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc9,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc9, addressingMode.value];
			case "direct":
				return [0xd9, addressingMode.value];
			case "indexed":
				return [0xe9, addressingMode.value];
			case "extended":
				return [
					0xf9,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd9,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf9,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adcb", adcb);

// Assembler

//Immediate - 0xc9

function adcbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[pC + 1] + (statFlags.C ? 1 : 0);

	const flags = {
		H: (accB & 0x0f) + (memory[pC + 1] & 0x0f) + (statFlags.C ? 1 : 0) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[pC + 1] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc9, adcbEim);

//Direct - 0xd9

function adcbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[memory[pC + 1]] + (statFlags.C ? 1 : 0);

	const flags = {
		H:
			(accB & 0x0f) + (memory[memory[pC + 1]] & 0x0f) + (statFlags.C ? 1 : 0) >
			0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd9, adcbEd);

//Indexed - 0xe9

function adcbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[xReg + memory[pC + 1]] + (statFlags.C ? 1 : 0);

	const flags = {
		H:
			(accB & 0x0f) +
				(memory[xReg + memory[pC + 1]] & 0x0f) +
				(statFlags.C ? 1 : 0) >
			0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe9, adcbEin);

//Extended - 0xf9

function adcbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB + memory[address] + (statFlags.C ? 1 : 0);

	const flags = {
		H: (accB & 0x0f) + (memory[address] & 0x0f) + (statFlags.C ? 1 : 0) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[address] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf9, adcbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ADDA VARIABLE - AccA + VARIABLE -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    8B        | 9B     | AB      | BB

    Condition Code:
    H | I | N | Z | V | C
    ~ | * | ~ | ~ | ~ | ~
*/
function adda(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x8b,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x8b, addressingMode.value];
			case "direct":
				return [0x9b, addressingMode.value];
			case "indexed":
				return [0xab, addressingMode.value];
			case "extended":
				return [
					0xbb,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x9b,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xbb,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adda", adda);

// Assembler

//Immediate - 0x8b

function addaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[pC + 1];

	const flags = {
		H: (accA & 0x0f) + (memory[pC + 1] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[pC + 1] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x8b, addaEim);

//Direct - 0x9b

function addaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[memory[pC + 1]];

	const flags = {
		H: (accA & 0x0f) + (memory[memory[pC + 1]] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x9b, addaEd);

//Indexed - 0xab

function addaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA + memory[xReg + memory[pC + 1]];

	const flags = {
		H: (accA & 0x0f) + (memory[xReg + memory[pC + 1]] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xab, addaEin);

//Extended - 0xbb

function addaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA + memory[address];

	const flags = {
		H: (accA & 0x0f) + (memory[address] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) === (memory[address] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xbb, addaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ADDB VARIABLE - AccB + VARIABLE -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    CB        | DB     | EB      | FB

    Condition Code:
    H | I | N | Z | V | C
    ~ | * | ~ | ~ | ~ | ~
*/
function addb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xcb,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xcb, addressingMode.value];
			case "direct":
				return [0xdb, addressingMode.value];
			case "indexed":
				return [0xeb, addressingMode.value];
			case "extended":
				return [
					0xfb,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xdb,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xfb,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("addb", addb);

// Assembler

//Immediate - 0xcb

function addbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[pC + 1];

	const flags = {
		H: (accB & 0x0f) + (memory[pC + 1] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[pC + 1] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xcb, addbEim);

//Direct - 0xdb

function addbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[memory[pC + 1]];

	const flags = {
		H: (accB & 0x0f) + (memory[memory[pC + 1]] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xdb, addbEd);

//Indexed - 0xeb

function addbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB + memory[xReg + memory[pC + 1]];

	const flags = {
		H: (accB & 0x0f) + (memory[xReg + memory[pC + 1]] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xeb, addbEin);

//Extended - 0xfb

function addbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB + memory[address];

	const flags = {
		H: (accB & 0x0f) + (memory[address] & 0x0f) > 0x0f,
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) === (memory[address] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result > 0xff,
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xfb, addbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ANDA VARIABLE - AccA & VARIABLE -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    84        | 94     | A4      | B4

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function anda(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x84,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x84, addressingMode.value];
			case "direct":
				return [0x94, addressingMode.value];
			case "indexed":
				return [0xa4, addressingMode.value];
			case "extended":
				return [
					0xb4,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x94,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb4,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("anda", anda);

// Assembler

//Immediate - 0x84

function andaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x84, andaEim);

//Direct - 0x94

function andaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x94, andaEd);

//Indexed - 0xa4

function andaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa4, andaEin);

//Extended - 0xb4

function andaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA & memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb4, andaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ANDB VARIABLE - AccB & VARIABLE -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C4        | D4     | E4      | F4

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function andb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc4,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc4, addressingMode.value];
			case "direct":
				return [0xd4, addressingMode.value];
			case "indexed":
				return [0xe4, addressingMode.value];
			case "extended":
				return [
					0xf4,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd4,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf4,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("andb", andb);

// Assembler

//Immediate - 0xc4

function andbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc4, andbEim);

//Direct - 0xd4

function andbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd4, andbEd);

//Indexed - 0xe4

function andbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe4, andbEin);

//Extended - 0xf4

function andbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB & memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf4, andbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
BITA VARIABLE - AccA & VARIABLE
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    85        | 95     | A5      | B5

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function bita(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x85,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x85, addressingMode.value];
			case "direct":
				return [0x95, addressingMode.value];
			case "indexed":
				return [0xa5, addressingMode.value];
			case "extended":
				return [
					0xb5,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x95,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb5,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("bita", bita);

// Assembler

//Immediate - 0x85

function bitaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x85, bitaEim);

//Direct - 0x95

function bitaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x95, bitaEd);

//Indexed - 0xa5

function bitaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA & memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa5, bitaEin);

//Extended - 0xb5

function bitaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA & memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb5, bitaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
BITB VARIABLE - AccB & VARIABLE
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C5        | D5     | E5      | F5

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function bitb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc5,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc5, addressingMode.value];
			case "direct":
				return [0xd5, addressingMode.value];
			case "indexed":
				return [0xe5, addressingMode.value];
			case "extended":
				return [
					0xf5,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd5,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf5,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("bitb", bitb);

// Assembler

//Immediate - 0xc5

function bitbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc5, bitbEim);

//Direct - 0xd5

function bitbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd5, bitbEd);

//Indexed - 0xe5

function bitbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB & memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe5, bitbEin);

//Extended - 0xf5

function bitbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB & memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf5, bitbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
CMPA VARIABLE - AccA - VARIABLE
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    81        | 91     | A1      | B1

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function cmpa(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x81,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x81, addressingMode.value];
			case "direct":
				return [0x91, addressingMode.value];
			case "indexed":
				return [0xa1, addressingMode.value];
			case "extended":
				return [
					0xb1,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x91,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb1,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cmpa", cmpa);

// Assembler

//Immediate - 0x81

function cmpaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x81, cmpaEim);

//Direct - 0x91

function cmpaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x91, cmpaEd);

//Indexed - 0xa1

function cmpaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa1, cmpaEin);

//Extended - 0xb1

function cmpaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA - memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[address] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb1, cmpaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
CMPB VARIABLE - AccB - VARIABLE
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C1        | D1     | E1      | F1

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function cmpb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc1,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc1, addressingMode.value];
			case "direct":
				return [0xd1, addressingMode.value];
			case "indexed":
				return [0xe1, addressingMode.value];
			case "extended":
				return [
					0xf1,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd1,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf1,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cmpb", cmpb);

// Assembler

//Immediate - 0xc1

function cmpbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc1, cmpbEim);

//Direct - 0xd1

function cmpbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd1, cmpbEd);

//Indexed - 0xe1

function cmpbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe1, cmpbEin);

//Extended - 0xf1

function cmpbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB - memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[address] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf1, cmpbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
EORA VARIABLE - AccA ^ VARIABLE -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    88        | 98     | A8      | B8

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function eora(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x88,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x88, addressingMode.value];
			case "direct":
				return [0x98, addressingMode.value];
			case "indexed":
				return [0xa8, addressingMode.value];
			case "extended":
				return [
					0xb8,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x98,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb8,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("eora", eora);

// Assembler

//Immediate - 0x88

function eoraEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA ^ memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x88, eoraEim);

//Direct - 0x98

function eoraEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA ^ memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x98, eoraEd);

//Indexed - 0xa8

function eoraEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA ^ memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa8, eoraEin);

//Extended - 0xb8

function eoraEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA ^ memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb8, eoraEex);

/*
-- -----------------------
-- -----------------------
*/

/*
EORB VARIABLE - AccB ^ VARIABLE -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C8        | D8     | E8      | F8

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | * 
*/
function eorb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc8,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc8, addressingMode.value];
			case "direct":
				return [0xd8, addressingMode.value];
			case "indexed":
				return [0xe8, addressingMode.value];
			case "extended":
				return [
					0xf8,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd8,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf8,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("eorb", eorb);

// Assembler

//Immediate - 0xc8

function eorbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB ^ memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc8, eorbEim);

//Direct - 0xd8

function eorbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB ^ memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd8, eorbEd);

//Indexed - 0xe8

function eorbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB ^ memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe8, eorbEin);

//Extended - 0xf8

function eorbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB ^ memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf8, eorbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
LDAA VARIABLE - Load the value of the variable into the A register
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    86        | 96     | A6      | B6

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function ldaa(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x86,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x86, addressingMode.value];
			case "direct":
				return [0x96, addressingMode.value];
			case "indexed":
				return [0xa6, addressingMode.value];
			case "extended":
				return [
					0xb6,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x96,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb6,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldaa", ldaa);

// Assembler

//Immediate - 0x86

function ldaaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x86, ldaaEim);

//Direct - 0x96

function ldaaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x96, ldaaEd);

//Indexed - 0xa6

function ldaaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa6, ldaaEin);

//Extended - 0xb6

function ldaaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA: result,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb6, ldaaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
LDAB VARIABLE - Load the value of the variable into the B register
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C6        | D6     | E6      | F6

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function ldab(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc6,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc6, addressingMode.value];
			case "direct":
				return [0xd6, addressingMode.value];
			case "indexed":
				return [0xe6, addressingMode.value];
			case "extended":
				return [
					0xf6,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd6,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf6,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldab", ldab);

// Assembler

//Immediate - 0xc6

function ldabEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc6, ldabEim);

//Direct - 0xd6

function ldabEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd6, ldabEd);

//Indexed - 0xe6

function ldabEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe6, ldabEin);

//Extended - 0xf6

function ldabEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB: result,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf6, ldabEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ORAA VARIABLE - AccA | VARIABLE -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    8A        | 9A     | AA      | BA

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function oraa(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x8a,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x8a, addressingMode.value];
			case "direct":
				return [0x9a, addressingMode.value];
			case "indexed":
				return [0xaa, addressingMode.value];
			case "extended":
				return [
					0xba,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x9a,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xba,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("oraa", oraa);

// Assembler

//Immediate - 0x8a

function oraaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA | memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x8a, oraaEim);

//Direct - 0x9a

function oraaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA | memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x9a, oraaEd);

//Indexed - 0xaa

function oraaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA | memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xaa, oraaEin);

//Extended - 0xba

function oraaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA | memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xba, oraaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
ORAB VARIABLE - AccB | VARIABLE -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    CA        | DA     | EA      | FA

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function orab(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xca,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xca, addressingMode.value];
			case "direct":
				return [0xda, addressingMode.value];
			case "indexed":
				return [0xea, addressingMode.value];
			case "extended":
				return [
					0xfa,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xda,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xfa,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("orab", orab);

// Assembler

//Immediate - 0xca

function orabEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB | memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xca, orabEim);

//Direct - 0xda

function orabEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB | memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xda, orabEd);

//Indexed - 0xea

function orabEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB | memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xea, orabEin);

//Extended - 0xfa

function orabEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB | memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xfa, orabEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the cary logic
-- -----------------------
*/

/*
SBCA VARIABLE - AccA - VARIABLE - C -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    82        | 92     | A2      | B2

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function sbca(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x82,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x82, addressingMode.value];
			case "direct":
				return [0x92, addressingMode.value];
			case "indexed":
				return [0xa2, addressingMode.value];
			case "extended":
				return [
					0xb2,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x92,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb2,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sbca", sbca);

// Assembler

//Immediate - 0x82

function sbcaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[pC + 1] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x82, sbcaEim);

//Direct - 0x92

function sbcaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[memory[pC + 1]] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x92, sbcaEd);

//Indexed - 0xa2

function sbcaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[xReg + memory[pC + 1]] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa2, sbcaEin);

//Extended - 0xb2

function sbcaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA - memory[address] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[address] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb2, sbcaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the cary logic
-- -----------------------
*/

/*
SBCB VARIABLE - AccB - VARIABLE - C -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C2        | D2     | E2      | F2

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function sbcb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc2,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc2, addressingMode.value];
			case "direct":
				return [0xd2, addressingMode.value];
			case "indexed":
				return [0xe2, addressingMode.value];
			case "extended":
				return [
					0xf2,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd2,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf2,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sbcb", sbcb);

// Assembler

//Immediate - 0xc2

function sbcbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[pC + 1] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc2, sbcbEim);

//Direct - 0xd2

function sbcbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[memory[pC + 1]] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd2, sbcbEd);

//Indexed - 0xe2

function sbcbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[xReg + memory[pC + 1]] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe2, sbcbEin);

//Extended - 0xf2

function sbcbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB - memory[address] - (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[address] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf2, sbcbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
SUBA VARIABLE - AccA - VARIABLE -> AccA
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    80        | 90     | A0      | B0

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function suba(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x80,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0x80, addressingMode.value];
			case "direct":
				return [0x90, addressingMode.value];
			case "indexed":
				return [0xa0, addressingMode.value];
			case "extended":
				return [
					0xb0,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x90,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb0,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("suba", suba);

// Assembler

//Immediate - 0x80

function subaEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x80, subaEim);

//Direct - 0x90

function subaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x90, subaEd);

//Indexed - 0xa0

function subaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accA - memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa0, subaEin);

//Extended - 0xb0

function subaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accA - memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accA & 0x80) !== (memory[address] & 0x80) &&
			(accA & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA: result & 0xff,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb0, subaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
SUBB VARIABLE - AccB - VARIABLE -> AccB
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    C0        | D0     | E0      | F0

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~
*/
function subb(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xc0,
						{ errorLine: null, label: addressingMode.value, type: "immediate" },
					];
				}
				if (addressingMode.value > 0xff) return null;
				return [0xc0, addressingMode.value];
			case "direct":
				return [0xd0, addressingMode.value];
			case "indexed":
				return [0xe0, addressingMode.value];
			case "extended":
				return [
					0xf0,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd0,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf0,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("subb", subb);

// Assembler

//Immediate - 0xc0

function subbEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[pC + 1];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[pC + 1] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xc0, subbEim);

//Direct - 0xd0

function subbEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd0, subbEd);

//Indexed - 0xe0

function subbEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = accB - memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[xReg + memory[pC + 1]] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 2,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe0, subbEin);

//Extended - 0xf0

function subbEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = accB - memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V:
			(accB & 0x80) !== (memory[address] & 0x80) &&
			(accB & 0x80) !== (result & 0x80),
		C: result < 0,
	};

	return {
		pC: pC + 3,
		accA,
		accB: result & 0xff,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf0, subbEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic for the CPX and also flags
-- -----------------------
*/

/*
-- -----------------------
!WARNING: Check the logic for the CPX and also flags
-- -----------------------
*/

/*
CPX VARIABLE - Xms - VARIABLE, Xls - (variable + 1)
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    8C        | 9C     | AC      | BC

    Condition Code:
    H | I | N | Z | V | C
    * | * | 4 | ~ | 5 | *
*/
function cpx(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x8c,
						{
							errorLine: null,
							label: addressingMode.value,
							type: "immediate2",
						},
						0x00,
					];
				}
				return [0x8c, addressingMode.value >> 8, addressingMode.value & 0xff];
			case "direct":
				return [0x9c, addressingMode.value];
			case "indexed":
				return [0xac, addressingMode.value];
			case "extended":
				return [
					0xbc,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x9c,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xbc,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cpx", cpx);

// Assembler

//Immediate - 0x8c

// C is unchanged
// V isset for MS bit of X and MS bit of memory two's complement subtraction overflow
// N is set if result is negative

function cpxEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = ((xReg - memory[pC + 1]) << 8) | memory[pC + 2];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((xReg >> 8) & 0x80) !== (memory[pC + 1] & 0x80) &&
			((xReg >> 8) & 0x80) !== (result & 0x80),
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x8c, cpxEim);

//Direct - 0x9c

function cpxEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const m1 = memory[memory[pC + 1]];
	const m2 = memory[memory[pC + 2]];
	const m12 = (m1 << 8) | m2;
	const result = xReg - m12;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((xReg >> 8) & 0x80) !== (m1 & 0x80) &&
			((xReg >> 8) & 0x80) !== (result & 0x80),
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x9c, cpxEd);

//Indexed - 0xac

function cpxEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const m1 = memory[xReg + memory[pC + 1]];
	const m2 = memory[xReg + memory[pC + 1] + 1];
	const m12 = (m1 << 8) | m2;
	const result = xReg - m12;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((xReg >> 8) & 0x80) !== (m1 & 0x80) &&
			((xReg >> 8) & 0x80) !== (result & 0x80),
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xac, cpxEin);

//Extended - 0xbc

function cpxEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const m1 = memory[address];
	const m2 = memory[address + 1];
	const m12 = (m1 << 8) | m2;
	const result = xReg - m12;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((xReg >> 8) & 0x80) !== (m1 & 0x80) &&
			((xReg >> 8) & 0x80) !== (result & 0x80),
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xbc, cpxEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic for the LDS and also flags
-- -----------------------
*/

/*
-- -----------------------
!WARNING: Check the logic for the LDS and also flags
-- -----------------------
*/

/*
LDS VARIABLE - variable -> Spms, (variable + 1) -> SPls
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    8E        | 9E     | AE      | BE

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | ~
*/
function lds(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0x8e,
						{
							errorLine: null,
							label: addressingMode.value,
							type: "immediate2",
						},
						0x00,
					];
				}
				return [0x8e, addressingMode.value >> 8, addressingMode.value & 0xff];
			case "direct":
				return [0x9e, addressingMode.value];
			case "indexed":
				return [0xae, addressingMode.value];
			case "extended":
				return [
					0xbe,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x9e,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xbe,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("lds", lds);

// Assembler

//Immediate - 0x8e

function ldsEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (memory[pC + 1] << 8) | memory[pC + 2];

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP: result,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x8e, ldsEim);

//Direct - 0x9e

function ldsEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (memory[memory[pC + 1]] << 8) | memory[memory[pC + 1] + 1];

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP: result,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x9e, ldsEd);

//Indexed - 0xae

function ldsEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result =
		(memory[xReg + memory[pC + 1]] << 8) | memory[xReg + memory[pC + 1] + 1];

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP: result,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0xae, ldsEin);

//Extended - 0xbe

function ldsEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = (memory[address] << 8) | memory[address + 1];

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP: result,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0xbe, ldsEex);

/*
-- -----------------------
-- -----------------------
*/

/*
LDX VARIABLE - variable -> Xms, (variable + 1) -> Xls
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    CE        | DE     | EE      | FE

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | ~
*/
function ldx(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "immediate":
				if (isNaN(addressingMode.value)) {
					return [
						0xce,
						{
							errorLine: null,
							label: addressingMode.value,
							type: "immediate2",
						},
						0x00,
					];
				}
				return [0xce, addressingMode.value >> 8, addressingMode.value & 0xff];
			case "direct":
				return [0xde, addressingMode.value];
			case "indexed":
				return [0xee, addressingMode.value];
			case "extended":
				return [
					0xfe,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xde,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xfe,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldx", ldx);

// Assembler

//Immediate - 0xce

function ldxEim(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (memory[pC + 1] << 8) | memory[pC + 2];

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg: result,
		statFlags,
	};
}
assemblyCompiler.set(0xce, ldxEim);

//Direct - 0xde

function ldxEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (memory[memory[pC + 1]] << 8) | memory[memory[pC + 1] + 1];

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg: result,
		statFlags,
	};
}
assemblyCompiler.set(0xde, ldxEd);

//Indexed - 0xee

function ldxEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result =
		(memory[xReg + memory[pC + 1]] << 8) | memory[xReg + memory[pC + 1] + 1];

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg: result,
		statFlags,
	};
}
assemblyCompiler.set(0xee, ldxEin);

//Extended - 0xfe

function ldxEx(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = (memory[address] << 8) | memory[address + 1];

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg: result,
		statFlags,
	};
}
assemblyCompiler.set(0xfe, ldxEx);

/*
-- -----------------------
-- -----------------------
*/

/*
-------------------------
Below functions may not accept all addressing modes
-------------------------
*/

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic
-- -----------------------
*/

/*
ASL MEMORY - Memory<<1 -> Memory
    INDEXED | EXTENDED 
    68      | 78

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~ 
*/
function asl(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x68, addressingMode.value];
			case "extended":
				return [
					0x78,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x78,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("asl", asl);

// Assembler

//Indexed - 0x68

function aslEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]] << 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[xReg + memory[pC + 1]] & 0x80) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[xReg + memory[pC + 1]] & 0x80) !== 0,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x68, aslEin);

//Extended - 0x78

function aslEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address] << 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[address] & 0x80) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[address] & 0x80) !== 0,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x78, aslEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic
-- -----------------------
*/

/*
ASR MEMORY - Memory>>1 -> Memory
    INDEXED | EXTENDED 
    67      | 77

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~ 
*/
function asr(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x67, addressingMode.value];
			case "extended":
				return [
					0x77,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x77,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("asr", asr);

// Assembler

//Indexed - 0x67

function asrEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]] >> 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: (memory[xReg + memory[pC + 1]] & 0x01) !== 0,
		C: (memory[xReg + memory[pC + 1]] & 0x01) !== 0,
	};

	memory[xReg + memory[pC + 1]] =
		(result & 0xff) | (memory[xReg + memory[pC + 1]] & 0x80);

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x67, asrEin);

//Extended - 0x77

function asrEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address] >> 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: (memory[address] & 0x01) !== 0,
		C: (memory[address] & 0x01) !== 0,
	};

	memory[address] = (result & 0xff) | (memory[address] & 0x80);

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x77, asrEex);

/*
-- -----------------------
-- -----------------------
*/

/*
CLR MEMORY - 0 -> Memory
    INDEXED | EXTENDED 
    6F      | 7F

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | S | R | R 
*/
function clr(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x6f, addressingMode.value];
			case "extended":
				return [
					0x7f,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x7f,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("clr", clr);

// Assembler

//Indexed - 0x6f

function clrEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false,
		Z: true,
		V: false,
		C: false,
	};

	memory[xReg + memory[pC + 1]] = 0;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x6f, clrEin);

//Extended - 0x7f

function clrEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false,
		Z: true,
		V: false,
		C: false,
	};

	memory[address] = 0;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x7f, clrEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic
-- -----------------------
*/

/*
COM MEMORY - ~Memory -> Memory
    INDEXED | EXTENDED 
    63      | 73

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | S 
*/
function com(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x63, addressingMode.value];
			case "extended":
				return [
					0x73,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x73,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("com", com);

// Assembler

//Indexed - 0x63

function comEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = ~memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: false,
		C: true,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x63, comEin);

//Extended - 0x73

function comEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = ~memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: false,
		C: true,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x73, comEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic overflow
-- -----------------------
*/

/*
DEC MEMORY - Memory - 1 -> Memory
    INDEXED | EXTENDED 
    6A      | 7A

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | * 
*/
function dec(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x6a, addressingMode.value];
			case "extended":
				return [
					0x7a,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x7a,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("dec", dec);

// Assembler

//Indexed - 0x6a

function decEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]] - 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((memory[xReg + memory[pC + 1]] ^ 0xff) & 0x80) !== 0 &&
			((memory[xReg + memory[pC + 1]] ^ result) & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Unchanged
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x6a, decEin);

//Extended - 0x7a

function decEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address] - 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V:
			((memory[address] ^ 0xff) & 0x80) !== 0 &&
			((memory[address] ^ result) & 0x80) !== 0,
		C: statFlags.C, // Unchanged
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x7a, decEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic overflow
-- -----------------------
*/

/*
INC MEMORY - Memory + 1 -> Memory
    INDEXED | EXTENDED 
    6C      | 7C

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | * 
*/
function inc(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x6c, addressingMode.value];
			case "extended":
				return [
					0x7c,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x7c,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("inc", inc);

// Assembler

//Indexed - 0x6c

function incEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]] + 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: (memory[xReg + memory[pC + 1]] & 0x80) !== 0 && (result & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Unchanged
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x6c, incEin);

//Extended - 0x7c

function incEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address] + 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: (memory[address] & 0x80) !== 0 && (result & 0x80) !== 0, // Overflow for signed
		C: statFlags.C, // Unchanged
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x7c, incEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic overflow
-- -----------------------
*/

/*
LSR MEMORY - Memory>>1 -> Memory
    INDEXED | EXTENDED 
    64      | 74

    Condition Code:
    H | I | N | Z | V | C
    * | * | R | ~ | 2 | ~ 
*/
function lsr(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x64, addressingMode.value];
			case "extended":
				return [
					0x74,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x74,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("lsr", lsr);

// Assembler

//Indexed - 0x64

function lsrEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]] >> 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false,
		Z: result === 0,
		V: ((memory[xReg + memory[pC + 1]] & 0x01) !== 0) ^ 0,
		C: (memory[xReg + memory[pC + 1]] & 0x01) !== 0,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x64, lsrEin);

//Extended - 0x74

function lsrEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address] >> 1;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: false,
		Z: result === 0,
		V: ((memory[address] & 0x01) !== 0) ^ 0,
		C: (memory[address] & 0x01) !== 0,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x74, lsrEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic overflow
-- -----------------------
*/

/*
NEG MEMORY - -Memory -> Memory
    INDEXED | EXTENDED 
    60      | 70

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | ~ | ~ 
*/
function neg(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x60, addressingMode.value];
			case "extended":
				return [
					0x70,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x70,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("neg", neg);

// Assembler

//Indexed - 0x60

function negEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = -memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: result === 0x80,
		C: result !== 0,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x60, negEin);

//Extended - 0x70

function negEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = -memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result < 0,
		Z: result === 0,
		V: result === 0x80,
		C: result !== 0,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x70, negEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic
-- -----------------------
*/

/*
ROL MEMORY - Memory<<1 -> Memory
    INDEXED | EXTENDED 
    69      | 79

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~ 
*/
function rol(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x69, addressingMode.value];
			case "extended":
				return [
					0x79,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x79,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("rol", rol);

// Assembler

//Indexed - 0x69

function rolEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = (memory[xReg + memory[pC + 1]] << 1) | (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[xReg + memory[pC + 1]] & 0x80) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[xReg + memory[pC + 1]] & 0x80) !== 0,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x69, rolEin);

// Extended - 0x79

function rolEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = (memory[address] << 1) | (statFlags.C ? 1 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[address] & 0x80) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[address] & 0x80) !== 0,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x79, rolEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-- -----------------------
!TODO: Check the logic
-- -----------------------
*/

/*
ROR MEMORY - Memory>>1 -> Memory
    INDEXED | EXTENDED 
    66      | 76

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | 2 | ~ 
*/
function ror(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x66, addressingMode.value];
			case "extended":
				return [
					0x76,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x76,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ror", ror);

// Assembler

//Indexed - 0x66

function rorEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result =
		(memory[xReg + memory[pC + 1]] >> 1) | (statFlags.C ? 0x80 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[xReg + memory[pC + 1]] & 0x01) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[xReg + memory[pC + 1]] & 0x01) !== 0,
	};

	memory[xReg + memory[pC + 1]] = result & 0xff;

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x66, rorEin);

// Extended - 0x76

function rorEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = (memory[address] >> 1) | (statFlags.C ? 0x80 : 0);

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (result & 0x80) !== 0,
		Z: result === 0,
		V: ((memory[address] & 0x01) !== 0) ^ ((result & 0x80) !== 0),
		C: (memory[address] & 0x01) !== 0,
	};

	memory[address] = result & 0xff;

	return {
		pC: pC + 3,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x76, rorEex);

/*
-- -----------------------
-- -----------------------
*/

/*
STAA VARIABLE - AccA -> variable
    DIRECT | INDEXED | EXTENDED 
    97     | A7      | B7

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function staa(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "direct":
				return [0x97, addressingMode.value];
			case "indexed":
				return [0xa7, addressingMode.value];
			case "extended":
				return [
					0xb7,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x97,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xb7,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("staa", staa);

// Assembler

//Direct - 0x97

function staaEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[memory[pC + 1]] = accA;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA & 0x80) !== 0,
		Z: accA === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x97, staaEd);

//Indexed - 0xa7

function staaEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[xReg + memory[pC + 1]] = accA;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA & 0x80) !== 0,
		Z: accA === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xa7, staaEin);

//Extended - 0xb7

function staaEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	memory[address] = accA;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accA & 0x80) !== 0,
		Z: accA === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xb7, staaEex);

/*
-- -----------------------
-- -----------------------
*/

/*
STAB VARIABLE - AccB -> variable
    DIRECT | INDEXED | EXTENDED 
    D7     | E7      | F7

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function stab(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "direct":
				return [0xd7, addressingMode.value];
			case "indexed":
				return [0xe7, addressingMode.value];
			case "extended":
				return [
					0xf7,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xd7,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xf7,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("stab", stab);

// Assembler

//Direct - 0xd7

function stabEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[memory[pC + 1]] = accB;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB & 0x80) !== 0,
		Z: accB === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xd7, stabEd);

//Indexed - 0xe7

function stabEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[xReg + memory[pC + 1]] = accB;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB & 0x80) !== 0,
		Z: accB === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xe7, stabEin);

//Extended - 0xf7

function stabEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	memory[address] = accB;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (accB & 0x80) !== 0,
		Z: accB === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xf7, stabEex);

/*
-- -----------------------
-- -----------------------
*/

/*
TST MEMORY - M - 0
    INDEXED | EXTENDED 
    6D      | 7D

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | R
*/
function tst(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x6d, addressingMode.value];
			case "extended":
				return [
					0x7d,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x7d,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("tst", tst);

// Assembler

//Indexed - 0x6d

function tstEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const result = memory[xReg + memory[pC + 1]];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result & (0x80 !== 0),
		Z: result === 0,
		V: false,
		C: false,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x6d, tstEin);

//Extended - 0x7d

function tstEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const result = memory[address];

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: result & (0x80 !== 0),
		Z: result === 0,
		V: false,
		C: false,
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x7d, tstEex);

/*
-- -----------------------
-- -----------------------
*/

/*
STS VARIABLE - SPms -> variable, SPls -> (variable + 1)
    DIRECT | INDEXED | EXTENDED 
    9F     | AF      | BF

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function sts(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "direct":
				return [0x9f, addressingMode.value];
			case "indexed":
				return [0xaf, addressingMode.value];
			case "extended":
				return [
					0xbf,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0x9f,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xbf,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sts", sts);

// Assembler

//Direct - 0x9f

function stsEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[memory[pC + 1]] = stackP >> 8;
	memory[memory[pC + 1] + 1] = stackP & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (stackP >> 8) & (0x80 !== 0),
		Z: stackP === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0x9f, stsEd);

//Indexed - 0xaf

function stsEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = xReg + memory[pC + 1];
	memory[address] = stackP >> 8;
	memory[address + 1] = stackP & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (stackP >> 8) & (0x80 !== 0),
		Z: stackP === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xaf, stsEin);

//Extended - 0xbf

function stsEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	memory[address] = stackP >> 8;
	memory[address + 1] = stackP & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (stackP >> 8) & (0x80 !== 0),
		Z: stackP === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xbf, stsEex);

/*
-- -----------------------
-- -----------------------
*/

/*
STX VARIABLE - Xms -> variable, Xls -> (variable + 1)
    DIRECT | INDEXED | EXTENDED 
    DF     | EF      | FF

    Condition Code:
    H | I | N | Z | V | C
    * | * | ~ | ~ | R | *
*/
function stx(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "direct":
				return [0xdf, addressingMode.value];
			case "indexed":
				return [0xef, addressingMode.value];
			case "extended":
				return [
					0xff,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//we assume it is direct adn if so prove otherwise
				return [
					0xdf,
					{
						errorLine: null,
						label: addressingMode.value,
						extendedOpCode: 0xff,
						type: "extended_or_direct_label",
					},
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("stx", stx);

// Assembler

//Direct - 0xdf

function stxEd(pC, accA, accB, memory, stackP, xReg, statFlags) {
	memory[memory[pC + 1]] = xReg >> 8;
	memory[memory[pC + 1] + 1] = xReg & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (xReg >> 8) & (0x80 !== 0),
		Z: xReg === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xdf, stxEd);

//Indexed - 0xef

function stxEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = xReg + memory[pC + 1];
	memory[address] = xReg >> 8;
	memory[address + 1] = xReg & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (xReg >> 8) & (0x80 !== 0),
		Z: xReg === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xef, stxEin);

//Extended - 0xff

function stxEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	memory[address] = xReg >> 8;
	memory[address + 1] = xReg & 0xff;

	const flags = {
		H: statFlags.H, // Unchanged
		I: statFlags.I, // Unchanged
		N: (xReg >> 8) & (0x80 !== 0),
		Z: xReg === 0,
		V: false,
		C: statFlags.C, // Unchanged
	};

	return {
		pC: pC + 2,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags: flags,
	};
}
assemblyCompiler.set(0xff, stxEex);

/*
-- -----------------------
-- -----------------------
*/

/*
JMP VARIABLE - PC -> variable
    INDEXED | EXTENDED 
    6E      | 7E

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function jmp(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0x6e, addressingMode.value];
			case "extended":
				return [
					0x7e,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0x7e,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("jmp", jmp);

// Assembler

//Indexed - 0x6e

function jmpEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = xReg + memory[pC + 1];

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x6e, jmpEin);

//Extended - 0x7e

function jmpEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x7e, jmpEex);

/*
-- -----------------------
-- -----------------------
*/

/*
JSR VARIABLE - jumpt to subroutine
    INDEXED | EXTENDED 
    AD      | BD

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function jsr(keyword, value, modifier) {
	const addressingMode = checkAddressingMode(value, modifier);
	if (addressingMode) {
		switch (addressingMode.addressingMode) {
			case "indexed":
				return [0xad, addressingMode.value];
			case "extended":
				return [
					0xbd,
					addressingMode.value.toString(16).padStart(4, "0").slice(0, 2),
					addressingMode.value.toString(16).padStart(4, "0").slice(2),
				];
			case "extended_or_direct_label":
				//it is a extended label
				return [
					0xbd,
					{ errorLine: null, label: addressingMode.value, type: "extended" },
					"00",
				];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("jsr", jsr);

// Assembler

//Indexed - 0xad

function jsrEin(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = xReg + memory[pC + 1];
	const returnAddress = pC + 2;

	memory[stackP] = returnAddress >> 8;
	memory[stackP - 1] = returnAddress & 0xff;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP: stackP - 2,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0xad, jsrEin);

//Extended - 0xbd

function jsrEex(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const address = (memory[pC + 1] << 8) | memory[pC + 2];
	const returnAddress = pC + 3;

	memory[stackP] = returnAddress >> 8;
	memory[stackP - 1] = returnAddress & 0xff;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP: stackP - 2,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0xbd, jsrEex);

/*
-- -----------------------
-- -----------------------
*/

/*
-------------------------
# Below functions are take use of relative addresing mode
-------------------------

those functions expect a label as value we don't know the address of the label yet
so we return the opcode and the label later on the program
before running the opcodes we need to replace the label with the address
and if the label is not found we throw an error to the user
however when this happens we also need to pass the error line to the user
we will deal with this in here meaning the error line will be passed to return object
so the return type will be [opcode, {label: label, errorLine: errorLine}]

so the function will not check the variable it will just pass tje label to the memory
however if there is a modifier it will return null
-------------------------
*/

function isLabel(label) {
	const regex = /^[A-Za-z][A-Za-z0-9_]*$/;
	return regex.test(label);
}

function twosComplementToInt(value) {
	if (value & 0x80) {
		return value - 0x100;
	} else {
		return value;
	}
}

/*
-- -----------------------
-- -----------------------
*/

/*
BCS LABEL - Branch if carry set
    RELATIVE 
    25

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/

function bcs(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x25, { label: value, errorLine: null }];
}
instructionSheetScript.set("bcs", bcs);

// Assembler

//Relative - 0x25

function bcsRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = statFlags.C ? twosComplementToInt(memory[pC + 1]) : 0;
	const address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x25, bcsRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BCC LABEL - Branch if carry clear
    RELATIVE 
    24

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bcc(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x24, { label: value, errorLine: null }];
}
instructionSheetScript.set("bcc", bcc);

// Assembler

//Relative - 0x24

function bccRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !statFlags.C ? twosComplementToInt(memory[pC + 1]) : 0;
	const address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x24, bccRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BMI LABEL - Branch if minus
    RELATIVE 
    2B

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bmi(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2b, { label: value, errorLine: null }];
}
instructionSheetScript.set("bmi", bmi);

// Assembler

//Relative - 0x2B

function bmiRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = statFlags.N ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2b, bmiRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BPL LABEL - Branch if plus
    RELATIVE 
    2A

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bpl(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2a, { label: value, errorLine: null }];
}
instructionSheetScript.set("bpl", bpl);

// Assembler

//Relative - 0x2A

function bplRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !statFlags.N ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2a, bplRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BVS LABEL - Branch if overflow set
    RELATIVE 
    29

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bvs(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x29, { label: value, errorLine: null }];
}
instructionSheetScript.set("bvs", bvs);

// Assembler

//Relative - 0x29

function bvsRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = statFlags.V ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x29, bvsRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BVC LABEL - Branch if overflow clear
    RELATIVE 
    28

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bvc(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x28, { label: value, errorLine: null }];
}
instructionSheetScript.set("bvc", bvc);

// Assembler

//Relative - 0x28

function bvcRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !statFlags.V ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x28, bvcRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BEQ LABEL - Branch if equal
    RELATIVE 
    27

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function beq(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x27, { label: value, errorLine: null }];
}
instructionSheetScript.set("beq", beq);

// Assembler

//Relative - 0x27

function beqRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = statFlags.Z ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x27, beqRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BNE LABEL - Branch if not equal
    RELATIVE 
    26

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bne(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x26, { label: value, errorLine: null }];
}
instructionSheetScript.set("bne", bne);

// Assembler

//Relative - 0x26

function bneRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !statFlags.Z ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x26, bneRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BLT LABEL - N ^ V = 1
    RELATIVE 
    2D

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function blt(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2d, { label: value, errorLine: null }];
}
instructionSheetScript.set("blt", blt);

// Assembler

//Relative - 0x2d

function bltRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset =
		statFlags.N ^ statFlags.V ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2d, bltRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BLE LABEL - Z + (N ^ V) = 1
    RELATIVE 
    2F

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function ble(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2f, { label: value, errorLine: null }];
}
instructionSheetScript.set("ble", ble);

// Assembler

//Relative - 0x2f

function bleRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset =
		Z | (statFlags.N ^ statFlags.V) ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2f, bleRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BGE LABEL - N ^ V = 0
    RELATIVE 
    2C

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bge(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2c, { label: value, errorLine: null }];
}
instructionSheetScript.set("bge", bge);

// Assembler

//Relative - 0x2c

function bgeRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !(statFlags.N ^ statFlags.V)
		? twosComplementToInt(memory[pC + 1])
		: 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2c, bgeRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BGT LABEL - Z + (N ^ V) = 0
    RELATIVE 
    2E

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bgt(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x2e, { label: value, errorLine: null }];
}
instructionSheetScript.set("bgt", bgt);

// Assembler

//Relative - 0x2e

function bgtRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !(Z | (statFlags.N ^ statFlags.V))
		? twosComplementToInt(memory[pC + 1])
		: 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x2e, bgtRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BLS LABEL - C + Z = 1
    RELATIVE 
    23

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bls(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x23, { label: value, errorLine: null }];
}
instructionSheetScript.set("bls", bls);

// Assembler

//Relative - 0x23

function blsRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset =
		statFlags.C | statFlags.Z ? twosComplementToInt(memory[pC + 1]) : 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x23, blsRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BHI LABEL - C + Z = 0
    RELATIVE 
    22

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bhi(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x22, { label: value, errorLine: null }];
}
instructionSheetScript.set("bhi", bhi);

// Assembler

//Relative - 0x22

function bhiRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = !(statFlags.C | statFlags.Z)
		? twosComplementToInt(memory[pC + 1])
		: 0;
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x22, bhiRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BRA LABEL - Branch always
    RELATIVE 
    20

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bra(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x20, { label: value, errorLine: null }];
}
instructionSheetScript.set("bra", bra);

// Assembler

//Relative - 0x20

function braRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = twosComplementToInt(memory[pC + 1]);
	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x20, braRel);

/*
-- -----------------------
-- -----------------------
*/

/*
BSR LABEL - Branch to subroutine
    RELATIVE 
    8D

    Condition Code:
    H | I | N | Z | V | C
    * | * | * | * | * | *
*/
function bsr(keyword, value, modifier) {
	if (modifier) return null;
	if (!isLabel(value)) return null;
	return [0x8d, { label: value, errorLine: null }];
}
instructionSheetScript.set("bsr", bsr);

// Assembler

//Relative - 0x8d

function bsrRel(pC, accA, accB, memory, stackP, xReg, statFlags) {
	const offset = twosComplementToInt(memory[pC + 1]);
	const returnAddress = pC + 2;

	memory[stackP] = returnAddress >> 8;
	memory[stackP - 1] = returnAddress & 0xff;

	let address = pC + offset + 2;

	return {
		pC: address,
		accA,
		accB,
		memory,
		stackP: stackP - 2,
		xReg,
		statFlags,
	};
}
assemblyCompiler.set(0x8d, bsrRel);

/*
-- -----------------------
-- -----------------------
*/

// export the map
export { instructionSheetScript, assemblerDirectiveScript, assemblyCompiler };
