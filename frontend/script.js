// ------------------------------
// SEND MESSAGE
// ------------------------------
async function sendMessage() {
    const input = document.getElementById("msg");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    showTyping();

    try {
        const res = await fetch("https://ai-website-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();
        hideTyping();
        streamMessage(data.reply, "bot");

    } catch (err) {
        hideTyping();
        addMessage("Error: Could not reach server.", "bot");
    }
}

// ------------------------------
// ADD MESSAGE (instant for user)
// ------------------------------
function addMessage(text, sender) {
    const messages = document.getElementById("messages");

    const bubble = document.createElement("div");
    bubble.classList.add("chat-message", sender);
    bubble.innerText = text;

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}

// ------------------------------
// STREAM MESSAGE (bot typing effect)
// ------------------------------
function streamMessage(text, sender) {
    const messages = document.getElementById("messages");

    const bubble = document.createElement("div");
    bubble.classList.add("chat-message", sender);
    messages.appendChild(bubble);

    let i = 0;
    function type() {
        if (i < text.length) {
            bubble.innerHTML += text.charAt(i);
            i++;
            messages.scrollTop = messages.scrollHeight;
            setTimeout(type, 15); // typing speed
        }
    }
    type();
}

// ------------------------------
// TYPING INDICATOR
// ------------------------------
function showTyping() {
    const messages = document.getElementById("messages");

    const typing = document.createElement("div");
    typing.id = "typing";
    typing.classList.add("chat-message", "bot");
    typing.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;

    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
}

// ------------------------------
// ENTER TO SEND
// ------------------------------
document.getElementById("msg").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// ------------------------------
// FLOATING WIDGET TOGGLE
// ------------------------------
const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");

if (chatToggle && chatWindow) {
    chatToggle.addEventListener("click", () => {
        chatWindow.style.display =
            chatWindow.style.display === "flex" ? "none" : "flex";
    });
}