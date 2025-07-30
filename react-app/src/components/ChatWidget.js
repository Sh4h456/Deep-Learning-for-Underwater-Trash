import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../hooks/useChat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isChatLoading } = useChat();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = e.target.elements.userInput.value.trim();
    if (!userInput) return;
    sendMessage(userInput);
    e.target.reset();
  };

  return (
    <div>
      <div
        className={`fixed bottom-24 right-4 md:right-8 w-80 md:w-96 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Ask AquaBot</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow h-80 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`max-w-xs md:max-w-sm p-3 rounded-lg ${
                  msg.from === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700'
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <p className="bg-gray-700 p-3 rounded-lg animate-pulse">...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex items-center">
          <input
            name="userInput"
            type="text"
            placeholder="Type your question..."
            disabled={isChatLoading}
            aria-label="Chat input"
            ref={inputRef}
            className="flex-grow bg-gray-700 text-gray-200 rounded-l-md p-2 border-0 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isChatLoading}
            aria-label="Send message"
            className="bg-cyan-500 text-gray-900 font-bold p-2 rounded-r-md hover:bg-cyan-400 disabled:bg-gray-500"
          >
            Send
          </button>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat widget"
        className="fixed bottom-8 right-8 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg text-gray-900 hover:bg-cyan-400 transition-transform hover:scale-110"
      >
        <MessageCircle size={32} />
      </button>
    </div>
  );
}
