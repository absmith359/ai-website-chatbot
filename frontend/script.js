let isSending = false;

window.onload = () => {

    // DOM elements (mapped to your new HTML)
    const input = document.getElementById("msg");
    const sendBtn = document.getElementById("send-btn");
    const chatWindow = document.getElementById("messages");
    const bubble = document.getElementById("chat-bubble");
    const container = document.querySelector(".chat-container");
    const scrollShadow = document.getElementById("scroll-shadow");
    const scrollDownBtn = document.getElementById("scroll-down-btn");
    const logo = document.querySelector('.header-logo');


    logo.addEventListener('click', () => {
    container.classList.remove("active");   // close chat
    bubble.classList.remove("hidden");      // show bubble again
});

chatWindow.addEventListener("scroll", () => {
    const atTop = chatWindow.scrollTop === 0;
    const atBottom =
        chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight < 40;

    scrollShadow.style.opacity = atTop ? "0" : "1";
    scrollDownBtn.style.opacity = atBottom ? "0" : "1";
});

    // Disable input until bubble is clicked
    input.disabled = true;
    sendBtn.disabled = true;

    // -------------------------------
    // OPEN CHAT (bubble behavior)
    // -------------------------------
    bubble.onclick = () => {
        container.classList.add("active");   // <-- FIXED
        bubble.classList.add("hidden");

        // Add ESC hint if missing
        if (!document.getElementById("esc-hint")) {
            const hint = document.createElement("div");
            hint.id = "esc-hint";
            hint.textContent = "Press ESC to close";
            container.appendChild(hint);
        }

        // Enable input
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
   };

   document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        container.classList.remove("active");
        bubble.classList.remove("hidden");
    }
});



    // -------------------------------
    // SEND MESSAGE
    // -------------------------------
    sendBtn.onclick = sendMessage;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        if (isSending) return;
        isSending = true;

        const msg = input.value.trim();
        if (!msg) {
            isSending = false;
            return;
        }

        playSend();
        addMessage(msg, "user");
        input.value = "";

        showTyping();

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);

            const res = await fetch("https://ai-website-chatbot.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            hideTyping();

            if (!res.ok) {
                addMessage("Server error (" + res.status + "). Try again.", "bot");
                isSending = false;
                return;
            }

            const data = await res.json();

            if (!data || !data.reply) {
                addMessage("No reply received from server.", "bot");
            } else {
                streamMessage(data.reply, "bot");
            }

        } catch (err) {
            hideTyping();

            if (err.name === "AbortError") {
                addMessage("Request timed out. Try again.", "bot");
            } else {
                addMessage("Error: Could not reach server.", "bot");
            }
        }

        isSending = false;
    }

    // -------------------------------
    // ADD MESSAGE (old UI style)
    // -------------------------------
    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = "message " + sender;

        const nearBottom =
            chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight < 80;

        msg.innerText = text;
        chatWindow.appendChild(msg);

        if (nearBottom) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    // -------------------------------
    // TYPING INDICATOR (old style)
    // -------------------------------
    let typingInterval = null;

    function showTyping() {
        if (document.getElementById("typing-indicator")) return;

        const indicator = document.createElement("div");
        indicator.id = "typing-indicator";
        indicator.className = "message bot";
        indicator.style.display = "flex";
        indicator.style.alignItems = "center";
        indicator.style.gap = "6px";

        const label = document.createElement("span");
        label.innerText = "typing";

        const dotsContainer = document.createElement("span");
        dotsContainer.style.display = "flex";
        dotsContainer.style.gap = "4px";

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("span");
            dot.className = "typing-dot";
            dot.style.opacity = "0";
            dotsContainer.appendChild(dot);
        }

        indicator.appendChild(label);
        indicator.appendChild(dotsContainer);
        chatWindow.appendChild(indicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        const dots = dotsContainer.children;
        let t = 0;

        typingInterval = setInterval(() => {
            for (let i = 0; i < dots.length; i++) {
                const phase = (t - i * 0.5);
                const raw = Math.sin(phase);
                const opacity = raw > 0 ? raw * 0.9 : 0;
                dots[i].style.opacity = opacity.toFixed(2);
            }
            t += 0.25;
        }, 100);
    }

    function hideTyping() {
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        const indicator = document.getElementById("typing-indicator");
        if (indicator) indicator.remove();
    }

    // -------------------------------
    // SCROLL DOWN BUTTON
    // -------------------------------
    scrollDownBtn.onclick = () => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };


    // -------------------------------
    // CLEAR CHAT (visual only)
    // -------------------------------
    document.getElementById("clear-chat-btn").onclick = () => {
        chatWindow.innerHTML = "";
    };
};

