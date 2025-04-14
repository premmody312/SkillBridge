"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const updateChatHistory = (entry: { type: "user" | "bot"; text: string }) => {
    setChat((prev) => [...prev, entry].slice(-10));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user" as const, text: input };
    updateChatHistory(userMessage);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          chat_history: [...chat, userMessage],
        }),
      });

      const data = await res.json();
      let botReply = data.reply;

      updateChatHistory({ type: "bot" as const, text: botReply });
    } catch (err) {
      updateChatHistory({
        type: "bot",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return pathname === "/sign-in" ? null : (
    <div className="fixed bottom-16 right-6 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full p-3 shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Button>
      ) : (
        <div className="w-80 h-96 bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-3 flex justify-between items-center">
            <span className="font-semibold text-white text-sm">SkillBridge AI Assistant</span>
            <button
              className="hover:bg-indigo-500 p-1 rounded transition"
              onClick={() => setOpen(false)}
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Chat Log */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm bg-gray-50">
            {chat.map((msg, idx) => (
              <div
                key={`${msg.type}-${idx}-${msg.text.slice(0, 10)}`}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
                    msg.type === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex items-center space-x-2 bg-white">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ask about interview questions, technical roles, or companies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
