document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const items = gallery.querySelectorAll('figure');
            items.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const filterContainer = document.querySelector('.filter-container');

    // Fonction pour créer un bouton de filtre
    const createFilterButton = (id, name) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('filter-button');
        button.setAttribute('data-filter', id);
        button.textContent = name;
        return button;
    };

    // Ajouter le bouton "Tous"
    filterContainer.appendChild(createFilterButton('all', 'Tous'));

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const categories = {};

                data.forEach(image => {
                    const categoryId = image.category.id;
                    const categoryName = image.category.name;

                    // Ajouter la catégorie au dictionnaire si elle n'existe pas encore
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

                // Ajouter les écouteurs d'événements pour les boutons de filtre
                const filterButtons = document.querySelectorAll('.filter-button');
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const filter = button.getAttribute('data-filter');

                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');

                        const items = gallery.querySelectorAll('figure');
                        items.forEach(item => {
                            if (filter === 'all' || item.classList.contains(`category-${filter}`)) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                });
            }
        })
        .catch(error => console.error('Erreur:', error));
});