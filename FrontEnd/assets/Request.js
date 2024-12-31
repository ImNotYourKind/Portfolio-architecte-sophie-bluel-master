document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const filterContainer = document.querySelector('.filter-container');

    const createFilterButton = (id, name) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('filter-button');
        button.setAttribute('data-filter', id);
        button.textContent = name;
        return button;
    };

    filterContainer.appendChild(createFilterButton('all', 'Tous'));

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const categories = {};

                data.forEach(image => {
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
            }
        })

















        .catch(error => console.error('Erreur:', error));
        
    const loginBtn = document.getElementById('');
    const loginForm = document.getElementById('');

    loginBtn.addEventListener('click', () => {
        loginPopup.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        loginPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginPopup) {
            loginPopup.style.display = 'none';
        }
    });
});


