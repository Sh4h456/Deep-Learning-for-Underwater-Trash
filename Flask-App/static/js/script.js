const detectionForm = document.getElementById('detection-form');
const loader = document.getElementById('loader');

detectionForm.addEventListener('submit', function() {
    // Check if a file is selected before showing the loader
    const fileInput = document.getElementById('file');
    if (fileInput.files.length > 0) {
        loader.style.display = 'flex';
    }
});

// --- 2. Chatbot Logic ---
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');

chatForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page reload
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Display user's message
    appendMessage(userMessage, 'user-message');
    chatInput.value = ''; // Clear input

    // Show a "typing" indicator
    const typingIndicator = appendMessage('AquaBot is thinking...', 'bot-message');

    try {
        // Send message to Flask backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Remove the typing indicator and show the real reply
        typingIndicator.remove();
        appendMessage(data.reply, 'bot-message');

    } catch (error) {
        console.error("Chatbot error:", error);
        typingIndicator.remove();
        appendMessage('Sorry, an error occurred. Please try again.', 'bot-message');
    }
});

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${className}`;
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
    // Scroll to the latest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageDiv; // Return the element so we can remove it later (for the typing indicator)
}