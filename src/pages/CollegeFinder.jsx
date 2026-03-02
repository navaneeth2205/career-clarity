import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import CollegeCard from "../components/CollegeCard";
import { searchColleges } from "../services/collegeService";

function CollegeFinder() {
	const [filters, setFilters] = useState({ search: "", location: "", course: "", fees: "" });
	const [colleges, setColleges] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const loadColleges = async (activeFilters) => {
		setIsLoading(true);
		setErrorMessage("");

		try {
			const data = await searchColleges(activeFilters);
			const result = (data.colleges || []).filter((college) =>
				activeFilters.fees ? college.fees.toLowerCase().includes(activeFilters.fees.toLowerCase()) : true
			);
			setColleges(result);
		} catch {
			setErrorMessage("Unable to fetch colleges currently.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadColleges(filters);
	}, []);

	const onChange = (event) => {
		const { name, value } = event.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = (event) => {
		event.preventDefault();
		loadColleges(filters);
	};

	return (
		<section className="space-y-4">
			<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
				<h1 className="text-2xl font-bold text-slate-900">College Finder</h1>
				<p className="mt-2 text-sm text-slate-600">Search and filter colleges by location, course, and fees.</p>

				<form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<input
						name="search"
						value={filters.search}
						onChange={onChange}
						placeholder="Search college"
						className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
					/>
					<input
						name="location"
						value={filters.location}
						onChange={onChange}
						placeholder="Location"
						className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
					/>
					<input
						name="course"
						value={filters.course}
						onChange={onChange}
						placeholder="Course"
						className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
					/>
					<div className="flex gap-2">
						<input
							name="fees"
							value={filters.fees}
							onChange={onChange}
							placeholder="Fees"
							className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
						/>
						<button
							type="submit"
							className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
						>
							Search
						</button>
					</div>
				</form>
			</div>

			{errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

			{isLoading ? (
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
					<Loader label="Loading colleges..." />
				</section>
			) : (
				<div className="grid gap-4 lg:grid-cols-3">
					{colleges.map((college) => (
						<CollegeCard key={college.id} college={college} />
					))}
				</div>
			)}
		</section>
	);
}

export default CollegeFinder;
