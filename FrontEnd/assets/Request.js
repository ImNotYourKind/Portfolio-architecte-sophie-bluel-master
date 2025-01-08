document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const filterContainer = document.querySelector('.filter-container');
    let photos = [];

    const createFilterButton = (id, name) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('filter-button');
        button.setAttribute('data-filter', id);
        button.textContent = name;
        return button;
    };

    const allButton = createFilterButton('all', 'Tous');
    allButton.classList.add('active'); // Ajouter la classe active au bouton "Tous"
    filterContainer.appendChild(allButton);

    const loadPhotos = () => {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    photos = data;
                    updateGalleryAndFilters();
                }
            })
            .catch(error => console.error('Erreur:', error));
    };

    const updateGalleryAndFilters = () => {
        gallery.innerHTML = '';
        filterContainer.innerHTML = '';
        filterContainer.appendChild(allButton);

        const categories = {};

        photos.forEach(image => {
            const categoryId = image.category.id;
            const categoryName = image.category.name;

            if (!categories[categoryId]) {
                categories[categoryId] = categoryName;
                filterContainer.appendChild(createFilterButton(categoryId, categoryName));
            }

            const figure = document.createElement('figure');
            figure.classList.add(`category-${categoryId}`);

            const img = document.createElement('img');
            img.src = image.imageUrl;
            img.alt = image.title;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = image.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });

        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                gallery.querySelectorAll('figure').forEach(item => {
                    item.style.display = (filter === 'all' || item.classList.contains(`category-${filter}`)) ? 'block' : 'none';
                });
            });
        });
    };

    loadPhotos();

    const authBtn = document.getElementById('authBtn');
    const token = localStorage.getItem('token');
    const editModeBar = document.getElementById('editModeBar');
    const editBtn = document.getElementById('editBtn');

    if (token) {
        authBtn.innerHTML = '<a href="#">Logout</a>';
        authBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
        editModeBar.style.display = 'flex';
        filterContainer.style.display = 'none'; // Cacher les filtres si connecté
        editBtn.style.display = 'flex'; // Afficher l'icône de modification et le texte si connecté
    } else {
        authBtn.innerHTML = '<a href="Login.html">Login</a>';
        filterContainer.style.display = 'block'; // Afficher les filtres si non connecté
        editBtn.style.display = 'none'; // Cacher l'icône de modification et le texte si non connecté
    }
});