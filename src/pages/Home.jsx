import { Link } from "react-router-dom";
import logoMark from "../assets/logo-mark.svg";

const features = [
	"Class 10 stream guidance",
	"Class 12 degree recommendations",
	"UG career path suggestions",
	"Graduate CV skill-gap analysis",
	"AI career chatbot support",
	"College and alert tracking",
];

function Home() {
	return (
		<div className="space-y-8">
			<section className="cc-surface rounded-3xl p-8 sm:p-10">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-1.5">
					<img src={logoMark} alt="CareerClarity" className="h-5 w-5" />
					<p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">SIH Project ID: 25094</p>
				</div>
				<h1 className="cc-heading mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
					One-Stop Personalized Career & Education Advisor
				</h1>
				<p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
					A modern EdTech platform to guide students and graduates with personalized recommendations, aptitude insights,
					roadmaps, and real-time career support.
				</p>

				<div className="mt-6 flex flex-wrap gap-3">
					<Link to="/register" className="cc-cta">
						Get Started
					</Link>
					<Link
						to="/login"
						className="rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
					>
						Login
					</Link>
				</div>

				<div className="mt-6 flex flex-wrap gap-2">
					<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">AI-Powered</span>
					<span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">API-Ready</span>
					<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Student-first UX</span>
				</div>
			</section>

			<section className="cc-surface rounded-3xl p-8 sm:p-10">
				<h2 className="cc-heading text-2xl font-bold text-slate-900">Platform Features</h2>
				<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => (
						<div key={feature} className="cc-subtle-card text-sm font-semibold text-indigo-900">
							{feature}
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default Home;
