let worksData = []; // Stockage global des travaux
const token = localStorage.getItem("token");

// Initialisation
window.addEventListener("DOMContentLoaded", async () => { 
    await getworks(); 
    await getCategories();
    initFilters();
    connected();
});

// API 
async function getworks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Status: " + response.status);

        worksData = await response.json();
        displayWorks(worksData);

    } catch (error) {
        console.error("Erreur lors du chargement des figures :", error);
    }
}
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) throw new Error("Erreur catégories");

        const categories = await response.json();
        const select = document.getElementById("category-input");

        select.innerHTML = '<option value="">Catégorie</option>';

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur chargement catégories :", error);
    }
}

// Affichage 
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

// Filtres
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

// éléments HTML
const banner = document.querySelector(".edition");
const loginBtn = document.querySelector('a[href="login.html"]');
const filters = document.getElementById("filtres");
const editBtn = document.querySelector(".btn-modifier");

// Si connecté
function connected() {
if (token) {

    // Affiche la bannière
    if (banner) {
        banner.style.display = "flex";
    }

    if (editBtn) {
        editBtn.style.display = "inline-block";
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

};
}

// Modale admin //
const adminModal = document.getElementById("admin-modal");
const adminClose = document.querySelector(".admin-close");
const adminGallery = document.querySelector(".admin-gallery");

const galleryView = document.getElementById("gallery-view");
const addPhotoView = document.getElementById("add-photo-view");

const openAddPhotoBtn = document.getElementById("open-add-photo");
const backArrow = document.querySelector(".back-arrow");

const form = document.getElementById("add-photo-form");
const photoInput = document.getElementById("photo-input");
const previewImg = document.getElementById("preview-img");

// Ouverture
if (editBtn) {
    editBtn.addEventListener("click", () => {
        adminModal.style.display = "flex";
        showGalleryView();
        renderAdminGallery();
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

    previewImg.src = "";
    previewImg.classList.add("hidden");
    photoInput.value = "";
}

openAddPhotoBtn.addEventListener("click", showAddPhotoView);
backArrow.addEventListener("click", showGalleryView);

// Galerie admin
function renderAdminGallery() {
    adminGallery.innerHTML = "";

    worksData.forEach(work => {
        const item = document.createElement("div");

        item.classList.add("admin-item");
        item.innerHTML = `
            <img src="${work.imageUrl}">
            <span class="delete-icon" data-id="${work.id}">
                <i class="fa-solid fa-trash-can"></i>
            </span>
        `;
        adminGallery.appendChild(item);
    });
}

// Suppression
adminGallery.addEventListener("click", async (event) => {

    const deleteBtn = event.target.closest(".delete-icon");
    if (!deleteBtn) return;

    const workId = deleteBtn.dataset.id;

    try {
       const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

    if (!response.ok) {
    throw new Error("Erreur API lors de la suppression de la photo");
}
        worksData = worksData.filter(work => work.id != workId);

        renderAdminGallery();
        displayWorks(worksData);

    } catch (error) {
        console.error("Erreur suppression :", error);
    }
});

// Ajout
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const image = photoInput.files[0];
    const title = document.getElementById("title-input").value;
    const category = parseInt(document.getElementById("category-input").value);

    if (!image || !title || !category) {
        alert("Formulaire incomplet");
        return;
    }

    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

    if (!response.ok) {
    throw new Error("Erreur API lors de l'ajout de la photo");
}
        await getworks();
        renderAdminGallery();
        showGalleryView();
        form.reset();

    } catch (error) {
        console.error("Erreur upload :", error);
    }
});

// Prévisualisation image

photoInput.addEventListener("change", () => {

  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
  previewImg.src = e.target.result;
  previewImg.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
});
