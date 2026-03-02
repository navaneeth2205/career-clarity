import { useState } from "react";
import ChatWindow from "./ChatWindow";

function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="fixed bottom-5 right-5 z-40 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
				aria-label="Open career chatbot"
			>
				Chat with AI
			</button>

			<ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}

export default Chatbot;
