import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { updated_at } from "@/assets/metadata.json";
import { DataTable } from "./components/ui/virtualize_table";
import { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import data_index from "@/assets/output.index.json";
import data from "@/assets/output.csv";

const columns: ColumnDef<(typeof data)[0]>[] = [
	{
		header: "Name",
		accessorKey: "name",
		minSize: 300,
	},
	{
		header: "Gender",
		accessorKey: "gender",
		maxSize: 80,
	},
	{
		header: "Nationality",
		accessorKey: "nationality",
	},
	{
		header: "Class",
		accessorKey: "class",
	},
	{
		header: "License Number",
		accessorKey: "license_number",
	},
	{
		header: "Class Code",
		accessorKey: "class_code",
	},
	{
		header: "Start Date",
		accessorKey: "start_date",
	},
	{
		header: "End Date",
		accessorKey: "end_date",
	},
];
export default function App() {
	const [search, setSearch] = useState("");
	const [searchDebounceValue] = useDebounce(search, 200);

	const [results, setResults] = useState(data);

	const fuse = useMemo(
		() =>
			new Fuse(
				data,
				{
					keys: ["name", "license_number", "class_code"],
					threshold: 0.3,
				},
				Fuse.parseIndex(data_index as never)
			),
		[]
	);

	useEffect(() => {
		if (searchDebounceValue.trim() === "") {
			setResults(data);
		} else {
			const res = fuse.search(searchDebounceValue).map((result) => result.item);
			setResults(res);
		}
	}, [searchDebounceValue, fuse]);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold w-full text-center">
				Học Viên OTO 3T - Cập nhật:
				{new Date(updated_at).toLocaleDateString("vi-VN")}
			</h1>
			<h1 className="text-lg font-bold w-full text-center">
				Author:{" "}
				<a
					className="text-blue-500"
					href="https://www.facebook.com/Kudou.D.Sterain/"
				>
					@hotrungnhan
				</a>
			</h1>
			<Input
				placeholder="Search bởi tên, mã khoá học"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<Card>
				<CardContent className="overflow-auto p-4">
					<DataTable columns={columns} data={results} height="500px" />
				</CardContent>
			</Card>
		</div>
	);
}
