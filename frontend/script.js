async function sendMessage() {
    const msg = document.getElementById("msg").value;
    if (!msg.trim()) return;

    addMessage(msg, "user");
    document.getElementById("msg").value = "";

    const res = await fetch("https://ai-website-chatbot.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    addMessage(data.reply, "bot");
}

function addMessage(text, sender) {
    const messages = document.getElementById("messages");
    const bubble = document.createElement("div");

    bubble.classList.add("bubble", sender);
    bubble.innerText = text;

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}