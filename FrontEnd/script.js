// récupération des travaux + affichage dynamique de la galerie //
let worksData = [];

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

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");

        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;

        gallery.appendChild(figure);
    });
}

// Filtres //
function initFilters() {
    const buttons = document.querySelectorAll("#filtres button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // retire classe active boutons
            buttons.forEach(btn => btn.classList.remove("active"));
            // ajoute classe active bouton cliqué
            button.classList.add("active");

            const categoryId = button.dataset.categoryId;

            if (categoryId === "tous") {
                displayWorks(worksData);
                return;
            }

            const filteredWorks = worksData.filter(work =>
                work.categoryId == categoryId
            );

            displayWorks(filteredWorks);
        });
    });
}

// Page de connexion //