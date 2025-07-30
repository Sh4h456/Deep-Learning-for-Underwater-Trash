// src/api/chat.js

export const fetchChatReply = async (userInput) => {
  const response = await fetch('http://127.0.0.1:5001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput }),
  });

  if (!response.ok) throw new Error('Chat failed');
  return response.json();
};
