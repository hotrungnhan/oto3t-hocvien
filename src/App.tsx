import { useState, useEffect, useRef, useMemo } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { updated_at } from "@/assets/metadata.json";
import data from "@/assets/output.csv";

export default function App() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState(data);

	// The scrollable element for your list
	const parentRef = useRef(null);

	const dataCount = useMemo(() => results.length, [results]);
	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: dataCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
	});

	const fuse = useMemo(
		() =>
			new Fuse(data, {
				keys: [
					"name",
					"gender",
					"nationality",
					"class",
					"license_number",
					"class_code",
					"start_date",
					"end_date",
				],
				threshold: 0.3,
			}),
		[]
	);

	useEffect(() => {
		if (search.trim() === "") {
			setResults(data);
		} else {
			const res = fuse.search(search).map((result) => result.item);
			setResults(res);
		}
	}, [search, fuse]);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold w-full text-center">
				Học Viên OTO 3T - Cập nhật:{" "}
				{new Date(updated_at).toLocaleDateString("vi-VN")}
			</h1>
			<Input
				placeholder="Search bởi tên, mã khoá học"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<Card>
				<CardContent className="overflow-auto p-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Nationality</TableHead>
								<TableHead>Class</TableHead>
								<TableHead>License Number</TableHead>
								<TableHead>Class Code</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
							</TableRow>
						</TableHeader>
						<div ref={parentRef} className="overflow-auto w-full h-[500px]">
							<TableBody
								style={{
									height: rowVirtualizer.getTotalSize(),
									position: "relative",
								}}
							>
								{rowVirtualizer.getVirtualItems().map((virtualRow) => {
									const row = results[virtualRow.index];
									return (
										<TableRow
											key={virtualRow.key}
											className="w-full absolute left-0 top-0"
											style={{
												transform: `translateY(${virtualRow.start}px)`,
												height: `${virtualRow.size}px`,
											}}
											ref={(node) => rowVirtualizer.measureElement(node)}
										>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.gender}</TableCell>
											<TableCell>{row.nationality}</TableCell>
											<TableCell>{row.class}</TableCell>
											<TableCell>{row.license_number}</TableCell>
											<TableCell>{row.class_code}</TableCell>
											<TableCell>{row.start_date}</TableCell>
											<TableCell>{row.end_date}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</div>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
