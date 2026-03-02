import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoFull from "../assets/logo-full.svg";

const navLinks = [
	{ label: "Home", to: "/" },
	{ label: "Dashboard", to: "/dashboard" },
	{ label: "Login", to: "/login" },
	{ label: "Register", to: "/register" },
];

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-indigo-100 bg-white/90 backdrop-blur">
			<nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<img src={logoFull} alt="CareerClarity" className="h-11 w-auto" />
				</div>

				<ul className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => (
						<li key={link.label}>
							<NavLink
								to={link.to}
								className={({ isActive }) =>
									`rounded-full px-3 py-1.5 text-sm font-medium transition ${
										isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
									}`
								}
							>
								{link.label}
							</NavLink>
						</li>
					))}
				</ul>

				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					className="rounded-lg border border-indigo-100 p-2 text-slate-600 md:hidden"
					aria-label="Toggle menu"
				>
					<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</nav>

			{isOpen && (
				<div className="border-t border-indigo-100 bg-white px-4 py-3 md:hidden">
					<ul className="space-y-2">
						{navLinks.map((link) => (
							<li key={link.label}>
								<NavLink
									to={link.to}
									onClick={() => setIsOpen(false)}
									className={({ isActive }) =>
										`block rounded-lg px-2 py-2 text-sm hover:bg-indigo-50 ${isActive ? "text-indigo-600" : "text-slate-700"}`
									}
								>
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>
				</div>
			)}
		</header>
	);
}

export default Navbar;
