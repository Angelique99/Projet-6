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

// Si connecté
function connected() {
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
    }
});
}
}
connected();


// Modale admin //
const adminModal = document.getElementById("admin-modal");
const adminClose = document.querySelector(".admin-close");
const adminGallery = document.querySelector(".admin-gallery");
const editBtn = document.querySelector(".btn-modifier");

const galleryView = document.getElementById("gallery-view");
const addPhotoView = document.getElementById("add-photo-view");

const openAddPhotoBtn = document.getElementById("open-add-photo");
const backArrow = document.querySelector(".back-arrow");

// Ouverture
if (editBtn) {
    editBtn.addEventListener("click", () => {

        adminModal.style.display = "flex";
        showGalleryView();
        // Affiche les travaux dans la modale
        adminGallery.innerHTML = "";

        worksData.forEach(work => {
          const adminItem = document.createElement("div");
          adminItem.classList.add("admin-item");

        adminItem.innerHTML = `
          <img src="${work.imageUrl}" alt="${work.title}">
          <span class="delete-icon">
              <i class="fa-solid fa-trash-can"></i>
          </span>
           `;

         adminGallery.appendChild(adminItem);
   });
    });
}

// Fermeture
adminClose.addEventListener("click", () => {
    adminModal.style.display = "none";
});

adminModal.addEventListener("click", (event) => {
    if (event.target === adminModal) {
        adminModal.style.display = "none";
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        adminModal.style.display = "none";
    }
});

//Changement de vue
function showGalleryView() {
    galleryView.classList.remove("hidden");
    addPhotoView.classList.add("hidden");
}

function showAddPhotoView() {
    galleryView.classList.add("hidden");
    addPhotoView.classList.remove("hidden");
}

openAddPhotoBtn.addEventListener("click", showAddPhotoView);
backArrow.addEventListener("click", showGalleryView);

//Ajout et suppression
const dummyDeleteButtons = document.querySelectorAll(".delete-icon");
dummyDeleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
    });
});

const dummyAddForm = document.getElementById("add-photo-form");
dummyAddForm?.addEventListener("submit", (e) => {
    e.preventDefault();
});
