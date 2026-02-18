let worksData = []; // Stockage global des travaux pour les filtres

window.addEventListener("DOMContentLoaded", async () => {  // Attend que le DOM soit chargé
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
