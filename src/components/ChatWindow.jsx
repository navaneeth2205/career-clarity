import { useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage } from "../services/chatbotService";

function ChatWindow({ isOpen, onClose }) {
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: "bot",
			text: "Hi! I’m your CareerClarity assistant. Ask me about streams, degrees, skills, colleges, or career roadmaps.",
		},
	]);
	const [inputValue, setInputValue] = useState("");
	const [isBotTyping, setIsBotTyping] = useState(false);
	const endRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		inputRef.current?.focus();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isBotTyping, isOpen]);

	const canSend = useMemo(() => inputValue.trim().length > 0 && !isBotTyping, [inputValue, isBotTyping]);

	const onSend = async () => {
		const userMessage = inputValue.trim();
		if (!userMessage || isBotTyping) {
			return;
		}

		setInputValue("");
		setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: userMessage }]);
		setIsBotTyping(true);

		const result = await sendChatMessage(userMessage);
		const botReply = result?.reply || result?.message || "Thanks for your query. I’ll help you with the next steps.";

		setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: botReply }]);
		setIsBotTyping(false);
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/30 p-4 sm:p-6" onClick={onClose}>
			<div
				className="flex h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-indigo-100"
				onClick={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label="Career chatbot"
			>
				<div className="flex items-center justify-between border-b border-indigo-100 px-4 py-3">
					<h2 className="text-sm font-semibold text-slate-900">CareerClarity AI Chatbot</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
						aria-label="Close chatbot"
					>
						✕
					</button>
				</div>

				<div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
					{messages.map((message) => (
						<div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
							<p
								className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
									message.role === "user"
										? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
										: "bg-white text-slate-700 ring-1 ring-indigo-100"
								}`}
							>
								{message.text}
							</p>
						</div>
					))}

					{isBotTyping && (
						<div className="flex justify-start">
							<div className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-indigo-100">
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-600" />
							</div>
						</div>
					)}
					<div ref={endRef} />
				</div>

				<div className="border-t border-indigo-100 bg-white p-3">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							onSend();
						}}
						className="flex items-center gap-2"
					>
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(event) => setInputValue(event.target.value)}
							placeholder="Ask your career question..."
							className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
						/>
						<button
							type="submit"
							disabled={!canSend}
							className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
						>
							Send
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ChatWindow;
