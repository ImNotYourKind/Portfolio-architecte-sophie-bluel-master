document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');
    const photoModal = document.getElementById('photoModal');
    const closeModal = document.querySelector('.close-modal');
    const backBtn = document.querySelector('.back-btn');
    const photoGallery = document.getElementById('photoGallery');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const addPhotoSection = document.getElementById('addPhotoSection');
    const addPhotoForm = document.getElementById('addPhotoForm');
    const mainGallery = document.querySelector('.gallery');
    let photos = [];




    editBtn.addEventListener('click', () => {
        photoModal.style.display = 'block';
        loadPhotos();
    });


    closeModal.addEventListener('click', () => {
        photoModal.style.display = 'none';
    });


    window.addEventListener('click', (event) => {
        if (event.target === photoModal) {
            photoModal.style.display = 'none';
        }
    });


    function loadPhotos() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                photos = data;
                updateGalleries();
            })
            .catch(error => console.error('Erreur:', error));
    }


    function updateGalleries() {
        photoGallery.innerHTML = '';
        mainGallery.innerHTML = '';

        photos.forEach(image => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');

            const img = document.createElement('img');
            img.src = image.imageUrl;
            img.alt = image.title;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.addEventListener('click', () => {
                deletePhoto(image.id);
            });

            photoItem.appendChild(img);
            photoItem.appendChild(deleteIcon);
            photoGallery.appendChild(photoItem);


            const mainFigure = document.createElement('figure');
            mainFigure.classList.add(`category-${image.category.id}`);

            const mainImg = document.createElement('img');
            mainImg.src = image.imageUrl;
            mainImg.alt = image.title;

            const mainFigcaption = document.createElement('figcaption');
            mainFigcaption.textContent = image.title;

            mainFigure.appendChild(mainImg);
            mainFigure.appendChild(mainFigcaption);
            mainGallery.appendChild(mainFigure);
        });
    }


    function deletePhoto(photoId) {
        fetch(`http://localhost:5678/api/works/${photoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {

                photos = photos.filter(photo => photo.id !== photoId);
                updateGalleries();
            } else {
                alert('Erreur lors de la suppression de la photo.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    }


    addPhotoBtn.addEventListener('click', () => {
        document.querySelector('.modal-content').style.display = 'none';
        addPhotoSection.style.display = 'block';
    });


    backBtn.addEventListener('click', () => {
        addPhotoSection.style.display = 'none';
        document.querySelector('.modal-content').style.display = 'block';
    });


    addPhotoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(addPhotoForm);
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                photos.push(data);
                updateGalleries();
                addPhotoForm.reset();
                addPhotoSection.style.display = 'none';
                document.querySelector('.modal-content').style.display = 'block';
            } else {
                alert('Erreur lors de l\'ajout de la photo.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
});