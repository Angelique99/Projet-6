// récupération des travaux + affichage dynamique de la galerie //
window.addEventListener("DOMContentLoaded", getworks);

async function getworks() {
    const url = "http://localhost:5678/api/works";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Status: " + response.status);

        const data = await response.json();
        data.forEach(work => dossierFigures(work));

    } catch (error) {
        console.error("Erreur lors du chargement des figures :", error);
    }
}

function dossierFigures(data) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return console.error(".gallery introuvable");

    const figure = document.createElement("figure");

    figure.dataset.category = data.category.name.toLowerCase();

    figure.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
    `;
    gallery.appendChild(figure);
}

// Filtres //
const buttons = document.querySelectorAll("#filtres button");

buttons.forEach(button => {

    button.addEventListener("click", function () {

        const category = button.dataset.category;
        const figures = document.querySelectorAll(".gallery figure");

        figures.forEach(figure => {

            if (category === "tous") {
                figure.style.display = "block";
            } 
            else if (figure.dataset.category === category) {
                figure.style.display = "block";
            } 
            else {
                figure.style.display = "none";
            }

        });

    });

});

// Page de connexion //