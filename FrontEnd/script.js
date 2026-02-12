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
    figure.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
    `;
    gallery.appendChild(figure);
}