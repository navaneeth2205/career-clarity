function CollegeCard({ college }) {
	return (
		<article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:shadow-md">
			<h3 className="text-lg font-semibold text-slate-900">{college.name}</h3>
			<p className="mt-1 text-sm text-slate-600">{college.location}</p>

			<div className="mt-4 space-y-2 text-sm text-slate-700">
				<p>
					<span className="font-semibold">Course: </span>
					{college.course}
				</p>
				<p>
					<span className="font-semibold">Fees: </span>
					{college.fees}
				</p>
			</div>

			<button
				type="button"
				className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
			>
				Apply (UI Only)
			</button>
		</article>
	);
}

export default CollegeCard;
