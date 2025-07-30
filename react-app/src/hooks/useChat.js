// src/hooks/useChat.js
import { useState, useCallback } from 'react';
import { fetchChatReply } from '../api/chat';

export const useChat = () => {
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hello! I'm AquaBot." }]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const sendMessage = useCallback(
    async (userInput) => {
      if (!userInput || isChatLoading) return;
      setMessages((prev) => [...prev, { from: 'user', text: userInput }]);
      setIsChatLoading(true);
      try {
        const data = await fetchChatReply(userInput);
        setMessages((prev) => [...prev, { from: 'bot', text: data.reply }]);
      } catch (error) {
        setMessages((prev) => [...prev, { from: 'bot', text: "Sorry, I'm having trouble." }]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [isChatLoading]
  );

  return { messages, sendMessage, isChatLoading };
};
