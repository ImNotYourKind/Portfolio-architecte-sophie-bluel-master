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

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {

            if (Array.isArray(data)) {
                data.forEach(image => {
                    const figure = document.createElement('figure');
                    const categoryClass = image.category.name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
                    figure.classList.add(categoryClass);

                    const img = document.createElement('img');
                    img.src = image.imageUrl;
                    img.alt = image.title;

                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = image.title;

                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                });
            } 
        })
});