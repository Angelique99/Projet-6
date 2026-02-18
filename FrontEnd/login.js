const form = document.getElementById("loginform");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.status === 401) {
            throw new Error("Identifiants ou Mot de passe incorrects");
        }

        if (!response.ok) {
            throw new Error("Erreur serveur");
        }

        const data = await response.json();
        console.log("Réponse serveur :", data);

        // Stockage du token
        localStorage.setItem("token", data.token);
        console.log("Token :", localStorage.getItem("token"));

        // Redirection
        window.location.href = "index.html";

    } catch (error) {
        displayError(error.message);
    }
});

function displayError(message) {
    let errorMsg = document.querySelector(".error-message");

    if (!errorMsg) {
        errorMsg = document.createElement("p");
        errorMsg.classList.add("error-message");
        document.querySelector(".login").appendChild(errorMsg);
    }

    errorMsg.innerText = message;
}