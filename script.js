function deploy() {
    const status = document.getElementById("status");

    status.innerText = "⏳ Deployment in progress...";
    status.className = "status pending";

    setTimeout(() => {
        status.innerText = "✅ Deployment Successful!";
        status.className = "status success";
    }, 2000);
}
