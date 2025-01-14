document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');
    const photoModal = document.getElementById('photoModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const backBtn = document.querySelector('.back-btn');
    const photoGallery = document.getElementById('photoGallery');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const addPhotoSection = document.getElementById('addPhotoSection');
    const addPhotoForm = document.getElementById('addPhotoForm');
    const mainGallery = document.querySelector('.gallery');
    let uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    let photoFileInput = document.getElementById('photoFile');
    const photoUploadContainer = document.getElementById('photoUploadContainer');
    const submitBtn = document.querySelector('.submitBtn');
    const photoCategory = document.getElementById('photoCategory');
    const photoTitleInput = document.getElementById('photoTitle');
    let photos = [];

    editBtn.addEventListener('click', () => {
        photoModal.style.display = 'block';
        document.querySelector('.modal-content').style.display = 'block';
        addPhotoSection.style.display = 'none';
        loadPhotos();
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            photoModal.style.display = 'none';
            resetAddPhotoSection();
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === photoModal) {
            photoModal.style.display = 'none';
            resetAddPhotoSection();
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
        submitBtn.disabled = true; // Désactiver le bouton "Valider" par défaut
    });

    backBtn.addEventListener('click', () => {
        addPhotoSection.style.display = 'none';
        document.querySelector('.modal-content').style.display = 'block';
        resetAddPhotoSection();
    });

    uploadPhotoBtn.addEventListener('click', () => {
        photoFileInput.click();
    });

    photoFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoUploadContainer.innerHTML = `<img src="${e.target.result}" alt="Aperçu de la photo">`;
                submitBtn.disabled = false; // Activer le bouton "Valider"
            };
            reader.readAsDataURL(file);
        } else {
            submitBtn.disabled = true; // Désactiver le bouton "Valider" si aucun fichier n'est sélectionné
        }
    });

    submitBtn.addEventListener('click', () => {
        const formData = new FormData(addPhotoForm);
        formData.append('image', photoFileInput.files[0]);

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
                resetAddPhotoSection();
                addPhotoSection.style.display = 'none';
                document.querySelector('.modal-content').style.display = 'block';
            } else {
                alert('Erreur lors de l\'ajout de la photo.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });

    function resetAddPhotoSection() {
        photoUploadContainer.innerHTML = `
            <i class="fas fa-image"></i>
            <button id="uploadPhotoBtn" class="upload-photo-btn">+ Ajouter photo</button>
            <p>jpg, png : 4mo max</p>
            <input type="file" id="photoFile" name="image" accept="image/*" style="display: none;" required>
        `;
        photoFileInput.value = '';
        photoCategory.value = '1';
        photoTitleInput.value = '';
        submitBtn.disabled = true; // Désactiver le bouton "Valider" lors de la réinitialisation

        // Réinitialiser les gestionnaires d'événements
        uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
        photoFileInput = document.getElementById('photoFile');

        uploadPhotoBtn.addEventListener('click', () => {
            photoFileInput.click();
        });

        photoFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoUploadContainer.innerHTML = `<img src="${e.target.result}" alt="Aperçu de la photo">`;
                    submitBtn.disabled = false; // Activer le bouton "Valider"
                };
                reader.readAsDataURL(file);
            } else {
                submitBtn.disabled = true; // Désactiver le bouton "Valider" si aucun fichier n'est sélectionné
            }
        });
    }
});