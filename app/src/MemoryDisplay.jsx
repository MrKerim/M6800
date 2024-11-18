import { FixedSizeList as List } from "react-window";

export default function MemoryDisplay({
	memory,
	accumulatorA,
	accumulatorB,
	stackPointer,
	xRegister,
	statusFlags,
	programCounter,
	buildSuccess,
}) {
	const Row = ({ index, style }) => (
		<div className="flex" style={style} key={index}>
			<h1 className="pt-[4px] pr-2">
				{index.toString(16).padStart(3, "0").toUpperCase() + "0"}
			</h1>

			<div
				className={
					"bg-[#212630] px-2 flex  gap-2 sm:gap-[10px] " +
					(index === 0 ? "rounded-t-md" : index === 0xfff ? "rounded-b-md" : "")
				}
			>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 0
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 0].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 1
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 1].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 2
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 2].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 3
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 3].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 4
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 4].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 5
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 5].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 6
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 6].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 7
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 7].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 8
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 8].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 9
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 9].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 10
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 10].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 11
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 11].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 12
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 12].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 13
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 13].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 14
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 14].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
				<h1
					className={
						" pt-[4px] " +
						(buildSuccess && programCounter === index * 16 + 15
							? " bg-yellow-700"
							: "")
					}
				>
					{memory[index * 16 + 15].toString(16).padStart(2, "0").toUpperCase()}
				</h1>
			</div>
		</div>
	);
	const Row2 = ({ index, style }) => (
		<div className="text-white" style={style} key={index}>
			{index + "0"}
		</div>
	);

	return (
		<>
			<div className="text-[10px] sm:text-lg xl:ml-8 font-mono max-w-[600px]  sm:rounded-md h-[335px] sm:h-[560px] bg-[#2c3950] sm:mx-4 text-white ">
				<div className="flex pt-2 justify-center  rounded-t-md ">
					<h1 className="mr-2 sm:mr-4 ml-6 sm:ml-3">Tt</h1>
					<div className="  flex pb-[5px] px-2 gap-2 sm:gap-[10px] ">
						<h1>00</h1>
						<h1>01</h1>
						<h1>02</h1>
						<h1>03</h1>
						<h1>04</h1>
						<h1>05</h1>
						<h1>06</h1>
						<h1>07</h1>
						<h1>08</h1>
						<h1>09</h1>
						<h1>0A</h1>
						<h1>0B</h1>
						<h1>0C</h1>
						<h1>0D</h1>
						<h1>0E</h1>
						<h1>0F</h1>
					</div>
				</div>

				<div className="w-full flex justify-center">
					<div className="ml-3 h-[300px] sm:h-[510px] overflow-y-auto w-full ">
						<List
							height={510} // Let the parent container control the height
							itemCount={0xfff} // Total number of rows
							itemSize={35} // Height of each row
							width="100%" // Width of the list container
						>
							{Row}
						</List>
					</div>
				</div>
			</div>
			<div className="text-xs mt-4 py-4 sm:text-lg xl:ml-8 font-mono max-w-[600px]  sm:rounded-md   bg-[#2c3950] sm:mx-4 text-white w-full flex justify-around">
				<div className="flex gap-2 items-center">
					<h1>PC</h1>
					<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
						{programCounter.toString(16).padStart(4, "0")}
					</h1>
				</div>
				<div>
					<div className="flex gap-2 items-center">
						<h1>A</h1>
						<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
							{accumulatorA.toString(16).padStart(2, "0")}
						</h1>
					</div>
					<div className="flex gap-2 mt-2 items-center">
						<h1>B</h1>
						<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
							{accumulatorB.toString(16).padStart(2, "0")}
						</h1>
					</div>
				</div>
				<div>
					<div className="flex gap-[14px] sm:gap-[19px]  items-center">
						<h1>X</h1>
						<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
							{xRegister.toString(16).padStart(4, "0")}
						</h1>
					</div>
					<div className="flex gap-2 mt-2 items-center">
						<h1>SP</h1>
						<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
							{stackPointer.toString(16).padStart(4, "0")}
						</h1>
					</div>
				</div>
				<div className="flex items-center">
					<div>
						<div className="ml-2">H | I | N | Z | V | C</div>
						<h1 className="bg-[#212630] h-min px-2 py-1 rounded-md">
							{`${Number(statusFlags.H)} | ${Number(statusFlags.I)} | ${Number(
								statusFlags.N
							)} | ${Number(statusFlags.Z)} | ${Number(
								statusFlags.V
							)} | ${Number(statusFlags.C)}`}
						</h1>
					</div>
				</div>
			</div>
		</>
	);
}

/*
	const Row2 = ({ index, style }) => (
		<div className="flex" style={style} key={index}>
			{index + "0"}
		</div>
	);

*/
