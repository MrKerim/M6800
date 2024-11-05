const instructionSheetScript = new Map();

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

/*
-------------------------
Conditon Code OP Codes
-------------------------
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

There is also relative adressing which uses labels
we deal with them in the app later , we will directly pass them as labels to the memory
when dealin with thoose functions
*/
function checkAddressingMode(value, modifier) {
	if (!value) return null;
	//if there is no value it's an error
	if (modifier) {
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
			else if (parseInt(value.slice(2), 16) > 0xff) return null;
			else
				return {
					addressingMode: "immediate",
					value: parseInt(value.slice(2), 16),
				};
		}
		if (value[1] === "%") {
			//binary
			if (isNaN(parseInt(value.slice(2), 2))) return null;
			else if (parseInt(value.slice(2), 2) > 0xff) return null;
			else
				return {
					addressingMode: "immediate",
					value: parseInt(value.slice(2), 2),
				};
		}
		//decimal
		if (isNaN(parseInt(value.slice(1)))) return null;
		else if (parseInt(value.slice(1)) > 0xff) return null;
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
	//decimal
	if (isNaN(parseInt(value))) return null;
	else if (parseInt(value) > 0xff) {
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
				return [0x89, addressingMode.value];
			case "direct":
				return [0x99, addressingMode.value];
			case "indexed":
				return [0xa9, addressingMode.value];
			case "extended":
				return [0xb9, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adca", adca);

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
				return [0xc9, addressingMode.value];
			case "direct":
				return [0xd9, addressingMode.value];
			case "indexed":
				return [0xe9, addressingMode.value];
			case "extended":
				return [0xf9, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adcb", adcb);

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
				return [0x8b, addressingMode.value];
			case "direct":
				return [0x9b, addressingMode.value];
			case "indexed":
				return [0xab, addressingMode.value];
			case "extended":
				return [0xbb, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("adda", adda);

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
				return [0xcb, addressingMode.value];
			case "direct":
				return [0xdb, addressingMode.value];
			case "indexed":
				return [0xeb, addressingMode.value];
			case "extended":
				return [0xfb, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("addb", addb);

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
				return [0x84, addressingMode.value];
			case "direct":
				return [0x94, addressingMode.value];
			case "indexed":
				return [0xa4, addressingMode.value];
			case "extended":
				return [0xb4, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("anda", anda);

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
				return [0xc4, addressingMode.value];
			case "direct":
				return [0xd4, addressingMode.value];
			case "indexed":
				return [0xe4, addressingMode.value];
			case "extended":
				return [0xf4, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("andb", andb);

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
				return [0x85, addressingMode.value];
			case "direct":
				return [0x95, addressingMode.value];
			case "indexed":
				return [0xa5, addressingMode.value];
			case "extended":
				return [0xb5, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("bita", bita);

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
				return [0xc5, addressingMode.value];
			case "direct":
				return [0xd5, addressingMode.value];
			case "indexed":
				return [0xe5, addressingMode.value];
			case "extended":
				return [0xf5, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("bitb", bitb);

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
				return [0x81, addressingMode.value];
			case "direct":
				return [0x91, addressingMode.value];
			case "indexed":
				return [0xa1, addressingMode.value];
			case "extended":
				return [0xb1, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cmpa", cmpa);

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
				return [0xc1, addressingMode.value];
			case "direct":
				return [0xd1, addressingMode.value];
			case "indexed":
				return [0xe1, addressingMode.value];
			case "extended":
				return [0xf1, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cmpb", cmpb);

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
				return [0x88, addressingMode.value];
			case "direct":
				return [0x98, addressingMode.value];
			case "indexed":
				return [0xa8, addressingMode.value];
			case "extended":
				return [0xb8, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("eora", eora);

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
				return [0xc8, addressingMode.value];
			case "direct":
				return [0xd8, addressingMode.value];
			case "indexed":
				return [0xe8, addressingMode.value];
			case "extended":
				return [0xf8, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("eorb", eorb);

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
				return [0x86, addressingMode.value];
			case "direct":
				return [0x96, addressingMode.value];
			case "indexed":
				return [0xa6, addressingMode.value];
			case "extended":
				return [0xb6, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldaa", ldaa);

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
				return [0xc6, addressingMode.value];
			case "direct":
				return [0xd6, addressingMode.value];
			case "indexed":
				return [0xe6, addressingMode.value];
			case "extended":
				return [0xf6, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldab", ldab);

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
				return [0x8a, addressingMode.value];
			case "direct":
				return [0x9a, addressingMode.value];
			case "indexed":
				return [0xaa, addressingMode.value];
			case "extended":
				return [0xba, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("oraa", oraa);

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
				return [0xca, addressingMode.value];
			case "direct":
				return [0xda, addressingMode.value];
			case "indexed":
				return [0xea, addressingMode.value];
			case "extended":
				return [0xfa, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("orab", orab);

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
				return [0x82, addressingMode.value];
			case "direct":
				return [0x92, addressingMode.value];
			case "indexed":
				return [0xa2, addressingMode.value];
			case "extended":
				return [0xb2, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sbca", sbca);

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
				return [0xc2, addressingMode.value];
			case "direct":
				return [0xd2, addressingMode.value];
			case "indexed":
				return [0xe2, addressingMode.value];
			case "extended":
				return [0xf2, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sbcb", sbcb);

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
				return [0x80, addressingMode.value];
			case "direct":
				return [0x90, addressingMode.value];
			case "indexed":
				return [0xa0, addressingMode.value];
			case "extended":
				return [0xb0, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("suba", suba);

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
				return [0xc0, addressingMode.value];
			case "direct":
				return [0xd0, addressingMode.value];
			case "indexed":
				return [0xe0, addressingMode.value];
			case "extended":
				return [0xf0, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("subb", subb);

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
				return [0x8c, addressingMode.value];
			case "direct":
				return [0x9c, addressingMode.value];
			case "indexed":
				return [0xac, addressingMode.value];
			case "extended":
				return [0xbc, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("cpx", cpx);

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
				return [0x8e, addressingMode.value];
			case "direct":
				return [0x9e, addressingMode.value];
			case "indexed":
				return [0xae, addressingMode.value];
			case "extended":
				return [0xbe, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("lds", lds);

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
				return [0xce, addressingMode.value];
			case "direct":
				return [0xde, addressingMode.value];
			case "indexed":
				return [0xee, addressingMode.value];
			case "extended":
				return [0xfe, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ldx", ldx);

/*
-------------------------
Below functions may not accept all addressing modes
-------------------------
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
				return [0x78, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("asl", asl);

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
				return [0x77, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("asr", asr);

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
				return [0x7f, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("clr", clr);

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
				return [0x73, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("com", com);

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
				return [0x7a, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("dec", dec);

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
				return [0x7c, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("inc", inc);

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
				return [0x74, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("lsr", lsr);

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
				return [0x70, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("neg", neg);

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
				return [0x79, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("rol", rol);

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
				return [0x76, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("ror", ror);

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
				return [0xb7, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("staa", staa);

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
				return [0xf7, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("stab", stab);

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
				return [0x7d, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("tst", tst);

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
				return [0xbf, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("sts", sts);

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
				return [0xff, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("stx", stx);

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
				return [0x7e, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("jmp", jmp);

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
				return [0xbd, addressingMode.value];
			default:
				return null;
		}
	} else return null;
}
instructionSheetScript.set("jsr", jsr);

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
	return [0x25, { label: value, errorLine: null }];
}
instructionSheetScript.set("bcs", bcs);

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
	return [0x24, { label: value, errorLine: null }];
}
instructionSheetScript.set("bcc", bcc);

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
	return [0x2b, { label: value, errorLine: null }];
}
instructionSheetScript.set("bmi", bmi);

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
	return [0x2a, { label: value, errorLine: null }];
}
instructionSheetScript.set("bpl", bpl);

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
	return [0x29, { label: value, errorLine: null }];
}
instructionSheetScript.set("bvs", bvs);

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
	return [0x28, { label: value, errorLine: null }];
}
instructionSheetScript.set("bvc", bvc);

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
	return [0x27, { label: value, errorLine: null }];
}
instructionSheetScript.set("beq", beq);

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
	return [0x26, { label: value, errorLine: null }];
}
instructionSheetScript.set("bne", bne);

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
	return [0x2d, { label: value, errorLine: null }];
}
instructionSheetScript.set("blt", blt);

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
	return [0x2f, { label: value, errorLine: null }];
}
instructionSheetScript.set("ble", ble);

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
	return [0x2c, { label: value, errorLine: null }];
}
instructionSheetScript.set("bge", bge);

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
	return [0x2e, { label: value, errorLine: null }];
}
instructionSheetScript.set("bgt", bgt);

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
	return [0x23, { label: value, errorLine: null }];
}
instructionSheetScript.set("bls", bls);

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
	return [0x22, { label: value, errorLine: null }];
}
instructionSheetScript.set("bhi", bhi);

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
	return [0x20, { label: value, errorLine: null }];
}
instructionSheetScript.set("bra", bra);

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
	return [0x8d, { label: value, errorLine: null }];
}
instructionSheetScript.set("bsr", bsr);

// export the map
export default instructionSheetScript;
