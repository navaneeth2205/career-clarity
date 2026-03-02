import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const actionCards = [
	{
		title: "Take Aptitude Test",
		description: "Discover strengths with a structured career aptitude assessment.",
		path: "/aptitude-test",
	},
	{
		title: "View Recommendations",
		description: "See personalized top career options based on your profile.",
		path: "/recommendations",
	},
	{
		title: "College Finder",
		description: "Explore colleges by location, course, and fees.",
		path: "/college-finder",
	},
	{
		title: "Alerts",
		description: "Track deadlines, scholarships, and upcoming entrance exams.",
		path: "/alerts",
	},
	{
		title: "CV Analysis",
		description: "Upload your CV and get skill-gap insights and career suggestions.",
		path: "/cv-upload",
		onlyGraduate: true,
	},
];

function Dashboard() {
	const user = getCurrentUser();
	const userName = user?.name || "Student";
	const educationLevel = user?.educationLevel || "Class 12";
	const isGraduate = educationLevel === "Graduate";

	const visibleCards = actionCards.filter((card) => !card.onlyGraduate || isGraduate);

	return (
		<div className="space-y-6">
			<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
				<p className="text-sm font-medium text-indigo-600">Profile Summary</p>
				<h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome, {userName}</h1>
				<p className="mt-2 text-sm text-slate-600">
					Education Level: <span className="font-semibold text-slate-800">{educationLevel}</span>
				</p>
				<p className="mt-3 text-sm text-slate-600">
					Use the quick actions below to continue your personalized career journey.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{visibleCards.map((card) => (
						<Link
							key={card.title}
							to={card.path}
							className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:shadow-md"
						>
							<h3 className="text-base font-semibold text-slate-900 transition group-hover:text-indigo-600">{card.title}</h3>
							<p className="mt-2 text-sm text-slate-600">{card.description}</p>
							<p className="mt-4 text-sm font-medium text-indigo-600">Open module →</p>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}

export default Dashboard;
