import { useState } from "react";
import ChatWindow from "./ChatWindow";

function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="fixed bottom-5 right-5 z-40 rounded-full border border-white/30 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
				aria-label="Open career chatbot"
			>
				Chat with AI
			</button>

			<ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}

export default Chatbot;
