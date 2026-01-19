async function sendMessage() {
    const msg = document.getElementById("msg").value;

    const res = await fetch("YOUR_BACKEND_URL/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    document.getElementById("response").innerText = data.reply;
}