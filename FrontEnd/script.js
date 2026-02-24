let worksData = []; // Stockage global des travaux pour les filtres

window.addEventListener("DOMContentLoaded", async () => { 
    await getworks(); 
    initFilters();
});

async function getworks() {
    const url = "http://localhost:5678/api/works";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Status: " + response.status);

        worksData = await response.json();
        displayWorks(worksData);

    } catch (error) {
        console.error("Erreur lors du chargement des figures :", error);
    }
}

function displayWorks(works) {  // Affiche dynamiquement les photos
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    gallery.innerHTML = "";  // Vide la galerie avant de l'actualiser

    works.forEach(work => {  // boucle sur chaque oeuvres
        const figure = document.createElement("figure");

        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;

        gallery.appendChild(figure);  // Ajoute la figure à la galerie
    });
}

function initFilters() {
    const buttons = document.querySelectorAll("#filtres button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // retire classe active boutons
            buttons.forEach(btn => btn.classList.remove("active"));
            // ajoute classe active bouton cliqué
            button.classList.add("active");

            const categoryId = button.dataset.categoryId;  // Récupère l'id de categorie du bouton

            if (categoryId === "tous") {
                displayWorks(worksData);
                return;
            }

            const filteredWorks = worksData.filter(work =>
                work.categoryId == categoryId  // Filtres les travaux selon la catégorie séléctionnée
            );

            displayWorks(filteredWorks);  // Affiche les travaux filtrés
        });
    });
}
// Mode Edition //
const token = localStorage.getItem("token");

// éléments HTML
const banner = document.querySelector(".edition");
const loginBtn = document.querySelector('a[href="login.html"]');
const filters = document.getElementById("filtres");
const portfolioTitle = document.querySelector("#portfolio h2");

// SI UTILISATEUR CONNECTÉ
if (token) {

    // Affiche la bannière
    if (banner) {
        banner.style.display = "flex";
    }

    // Changement login en logout
    if (loginBtn) {
        loginBtn.textContent = "logout";

        // logout
        loginBtn.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.removeItem("token");

            window.location.reload();
        });
    }

    // Masque les filtres
    if (filters) {
        filters.style.display = "none";
    }

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const editBtn = document.querySelector(".btn-modifier");

    if (token) {
        editBtn.style.display = "inline-block";
        editBtn.addEventListener("click", () => {
            alert("Modale");
        });
    }
});

}
