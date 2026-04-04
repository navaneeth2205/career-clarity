import { useEffect } from "react";

function AlertDetailsModal({ isOpen, alert, onClose }) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen || !alert) return null;

	const badgeStyles = {
		scholarship: "bg-emerald-100 text-emerald-700",
		internship: "bg-blue-100 text-blue-700",
		job: "bg-indigo-100 text-indigo-700",
		exam: "bg-orange-100 text-orange-700",
		default: "bg-slate-100 text-slate-700",
	};

	const badgeStyle = badgeStyles[alert.type?.toLowerCase()] || badgeStyles.default;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="cc-fade-in w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${badgeStyle}`}>
							{alert.type || "Alert"}
						</p>
						<h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">{alert.title || "Opportunity details"}</h2>
						<p className="mt-2 text-sm text-slate-500">Source: {alert.source || "Official website"}</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
					>
						Close
					</button>
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="rounded-2xl bg-slate-50 p-4">
						<p className="text-xs font-bold uppercase tracking-widest text-slate-500">Eligibility</p>
						<p className="mt-2 text-sm font-semibold text-slate-900">{alert.eligibility || alert.level || "To be announced"}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-4">
						<p className="text-xs font-bold uppercase tracking-widest text-slate-500">Deadline</p>
						<p className="mt-2 text-sm font-semibold text-slate-900">{alert.deadline_display || alert.deadline || "To be announced"}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-4">
						<p className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</p>
						<p className="mt-2 text-sm font-semibold text-slate-900 capitalize">{alert.type || "Notification"}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-4">
						<p className="text-xs font-bold uppercase tracking-widest text-slate-500">Level</p>
						<p className="mt-2 text-sm font-semibold text-slate-900">{alert.level || "To be announced"}</p>
					</div>
				</div>

				{alert.description ? (
					<div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
						<p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Details</p>
						<p className="mt-2 text-sm leading-7 text-slate-700">{alert.description}</p>
					</div>
				) : null}

				{Array.isArray(alert.tags) && alert.tags.length > 0 ? (
					<div className="mt-6 flex flex-wrap gap-2">
						{alert.tags.map((tag) => (
							<span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
								{tag}
							</span>
						))}
					</div>
				) : null}

				<div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-slate-500">Open the official website to check full eligibility and apply.</p>
					<div className="flex flex-wrap gap-3">
						<a
							href={alert.link || "#"}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700"
						>
							Apply Now 🚀
						</a>
						<button
							type="button"
							onClick={onClose}
							className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
						>
							Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AlertDetailsModal;
