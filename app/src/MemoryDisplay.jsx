export default function MemoryDisplay({ memory }) {
	return (
		<div className="text-[10px] sm:text-lg xl:ml-8 font-mono max-w-[600px]  sm:rounded-md h-[335px] sm:h-[560px] bg-[#2c3950] sm:mx-4 text-white ">
			<div className="flex pt-2 justify-center  rounded-t-md ">
				<h1 className="mr-2 sm:mr-4 ml-3">Tt</h1>
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
			<div className="flex justify-center">
				<div className="h-[300px] sm:h-[510px] overflow-y-auto flex  ">
					<div>
						{Array.from({ length: 0xfff + 1 }).map((_, i) => {
							return (
								<h1 key={i} className="pt-[4px] pr-2">
									{i.toString(16).padStart(3, "0").toUpperCase() + "0"}
								</h1>
							);
						})}
					</div>
					<div className=" h-full  rounded-md">
						{Array.from({ length: 0xfff + 1 }).map((_, i) => {
							return (
								<div
									key={i}
									className={
										"bg-[#212630] px-2 flex  gap-2 sm:gap-[10px] " +
										(i === 0
											? "rounded-t-md"
											: i === 0xfff
											? "rounded-b-md"
											: "")
									}
								>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 0]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 1]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 2]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 3]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 4]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 5]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 6]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 7]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 8]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 9]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 10]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 11]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 12]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 13]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 14]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
									<h1 className=" pt-[4px]">
										{memory[i * 16 + 15]
											.toString(16)
											.padStart(2, "0")
											.toUpperCase()}
									</h1>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
