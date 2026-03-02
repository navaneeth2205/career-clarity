import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AptitudeTest from "./pages/AptitudeTest";
import Recommendations from "./pages/Recommendations";
import Roadmap from "./pages/Roadmap";
import CollegeFinder from "./pages/CollegeFinder";
import Alerts from "./pages/Alerts";
import CVUpload from "./pages/CVUpload";
import CVAnalysis from "./pages/CVAnalysis";
import Chatbot from "./components/Chatbot";

function AppLayout({ children }) {
  return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-purple-50 text-slate-800">
			<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
      <Navbar />
			<main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      <Footer />
			<Chatbot />
    </div>
  );
}

function App() {
	return (
		<AppLayout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/aptitude-test" element={<AptitudeTest />} />
				<Route path="/recommendations" element={<Recommendations />} />
				<Route path="/roadmap" element={<Roadmap />} />
				<Route path="/college-finder" element={<CollegeFinder />} />
				<Route path="/alerts" element={<Alerts />} />
				<Route path="/cv-upload" element={<CVUpload />} />
				<Route path="/cv-analysis" element={<CVAnalysis />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</AppLayout>
	);
}

export default App;
