document.addEventListener('DOMContentLoaded', () => {
    const state = {
        photos: [],
        token: localStorage.getItem('token')
    };
    
    const elements = {
        gallery: document.querySelector('.gallery'),
        filterContainer: document.querySelector('.filter-container'),
        modal: document.getElementById('photoModal'),
        editBtn: document.getElementById('editBtn'),
        authBtn: document.getElementById('authBtn'),
        editModeBar: document.getElementById('editModeBar'),
        addPhotoBtn: document.getElementById('addPhotoBtn'),
        addPhotoSection: document.getElementById('addPhotoSection'),
        photoGallery: document.getElementById('photoGallery'),
        photoFileInput: document.getElementById('photoFile'),
        submitBtn: document.querySelector('.submitBtn'),
        uploadPhotoBtn: document.getElementById('uploadPhotoBtn'),
        photoUploadContainer: document.getElementById('photoUploadContainer'),
        closeModalButtons: document.querySelectorAll('.close-modal'),
        backBtn: document.querySelector('.back-btn')
    };

    // 1. Récupération des photos depuis l'API et affichage sur la page HTML
    const fetchPhotos = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            state.photos = await response.json();
            updateGallery();
            updateModalGallery();
            updateFilters();
            updateAuthUI();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateGallery = () => {
        elements.gallery.innerHTML = state.photos
            .map(photo => `
                <figure class="category-${photo.category.id}">
                    <img src="${photo.imageUrl}" alt="${photo.title}">
                    <figcaption>${photo.title}</figcaption>
                </figure>
            `).join('');
    };

    // 2. Création et gestion des filtres
    const updateFilters = () => {
        if (!state.token) {
            elements.filterContainer.innerHTML = '';
            
            const categories = Array.from(new Set(state.photos.map(p => JSON.stringify(p.category))))
                .map(cat => JSON.parse(cat));
            
            const allButton = document.createElement('button');
            allButton.className = 'filter-button active';
            allButton.setAttribute('data-filter', 'all');
            allButton.textContent = 'Tous';
            elements.filterContainer.appendChild(allButton);
            
            categories.forEach(cat => {
                const button = document.createElement('button');
                button.className = 'filter-button';
                button.setAttribute('data-filter', cat.id);
                button.textContent = cat.name;
                elements.filterContainer.appendChild(button);
            });
        }
    };

    elements.filterContainer.addEventListener('click', (e) => {
        if (e.target.matches('.filter-button')) {
            const filter = e.target.dataset.filter;
            document.querySelectorAll('.filter-button')
                .forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelector('.gallery').querySelectorAll('figure').forEach(fig => 
                fig.style.display = (filter === 'all' || fig.classList.contains(`category-${filter}`)) 
                    ? 'block' 
                    : 'none'
            );
        }
    });

    // 3. Gestion de la page de connexion et des tokens
    const updateAuthUI = () => {
        if (state.token) {
            elements.authBtn.innerHTML = '<a href="#">Logout</a>';
            elements.editModeBar.style.display = 'flex';
            elements.filterContainer.style.display = 'none';
            elements.editBtn.style.display = 'flex';
        } else {
            elements.authBtn.innerHTML = '<a href="Login.html">Login</a>';
            elements.filterContainer.style.display = 'block';
            elements.editBtn.style.display = 'none';
        }
    };

    elements.authBtn.addEventListener('click', (e) => {
        if (state.token) {
            e.preventDefault();
            localStorage.removeItem('token');
            state.token = null;
            window.location.reload();
        }
    });

    // 4. Gestion de la modale pour afficher les photos en miniature et les supprimer
    const updateModalGallery = () => {
        if (elements.photoGallery) {
            elements.photoGallery.innerHTML = state.photos
                .map(photo => `
                    <div class="photo-item">
                        <img src="${photo.imageUrl}" alt="${photo.title}">
                        <i class="fas fa-trash-alt delete-icon" data-id="${photo.id}"></i>
                    </div>
                `).join('');
        }
    };

    const deletePhoto = async (id) => {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${state.token}` }
            });
            if (response.ok) {
                state.photos = state.photos.filter(photo => photo.id !== id);
                updateGallery();
                updateModalGallery();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    elements.photoGallery.addEventListener('click', (e) => {
        if (e.target.matches('.delete-icon')) {
            const photoId = parseInt(e.target.dataset.id);
            deletePhoto(photoId);
        }
    });

    // 5. Gestion de la modale pour ajouter une photo, un titre et une catégorie, et fermeture des modales
    const openModal = () => {
        elements.modal.style.display = 'block';
        document.querySelector('.modal-content').style.display = 'block';
        elements.addPhotoSection.style.display = 'none';
    };

    const closeModal = () => {
        elements.modal.style.display = 'none';
        resetAddPhotoSection();
    };

    const resetAddPhotoSection = () => {
        elements.photoUploadContainer.innerHTML = `
            <i class="fas fa-image"></i>
            <button id="uploadPhotoBtn" class="upload-photo-btn">+ Ajouter photo</button>
            <p>jpg, png : 4mo max</p>
            <input type="file" id="photoFile" name="image" accept="image/*" style="display: none;" required>
        `;
        
        elements.photoFileInput.value = '';
        document.getElementById('photoCategory').value = '';
        document.getElementById('photoTitle').value = '';
        elements.submitBtn.disabled = true;
        
        const newUploadBtn = document.getElementById('uploadPhotoBtn');
        const newFileInput = document.getElementById('photoFile');
        
        if (newUploadBtn && newFileInput) {
            newUploadBtn.addEventListener('click', () => newFileInput.click());
            newFileInput.addEventListener('change', handleFileSelection);
        }
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.photoUploadContainer.innerHTML = `<img src="${e.target.result}" alt="Aperçu de la photo">`;
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        } else {
            elements.submitBtn.disabled = true;
        }
    };

    const checkFormValidity = () => {
        const photoSelected = elements.photoFileInput.files[0];
        const titleFilled = document.getElementById('photoTitle').value.trim() !== '';
        const categorySelected = document.getElementById('photoCategory').value !== '';

        elements.submitBtn.disabled = !(photoSelected && titleFilled && categorySelected);
    };

    elements.editBtn.addEventListener('click', openModal);

    elements.closeModalButtons.forEach(btn => 
        btn.addEventListener('click', closeModal));

    elements.backBtn.addEventListener('click', () => {
        elements.addPhotoSection.style.display = 'none';
        document.querySelector('.modal-content').style.display = 'block';
    });

    elements.addPhotoBtn.addEventListener('click', () => {
        document.querySelector('.modal-content').style.display = 'none';
        elements.addPhotoSection.style.display = 'block';
    });

    elements.uploadPhotoBtn.addEventListener('click', () => 
        elements.photoFileInput.click());

    elements.photoFileInput.addEventListener('change', handleFileSelection);

    document.getElementById('photoTitle').addEventListener('input', checkFormValidity);
    document.getElementById('photoCategory').addEventListener('change', checkFormValidity);

    elements.submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!elements.photoFileInput.files[0]) {
            alert('Veuillez sélectionner une photo');
            return;
        }

        const formData = new FormData();
        formData.append('image', elements.photoFileInput.files[0]);
        formData.append('title', document.getElementById('photoTitle').value);
        formData.append('category', document.getElementById('photoCategory').value);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                },
                body: formData
            });

            if (response.ok) {
                await fetchPhotos();
                closeModal();
            } else {
                alert('Une erreur est survenue lors de l\'envoi de la photo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de l\'envoi de la photo');
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });

    fetchPhotos();
});