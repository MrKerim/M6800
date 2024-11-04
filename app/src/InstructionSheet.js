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
LDAA VARIABLE - Load the value of the variable into the A register
    IMMEDIATE | DIRECT | INDEXED | EXTENDED 
    86        | 96     | A6      | B6
*/

// export the map
export default instructionSheetScript;
