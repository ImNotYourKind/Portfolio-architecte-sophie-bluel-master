document.addEventListener('DOMContentLoaded', () => {
	const editBtn = document.getElementById('editBtn');
	const photoModal = document.getElementById('photoModal');
	const closeModal = document.querySelector('.close-modal');
	const backBtn = document.querySelector('.back-btn');
	const photoGallery = document.getElementById('photoGallery');
	const addPhotoBtn = document.getElementById('addPhotoBtn');
	const addPhotoSection = document.getElementById('addPhotoSection');
	const addPhotoForm = document.getElementById('addPhotoForm');

	// Afficher le bouton "Modifier" si l'utilisateur est connecté
	if (localStorage.getItem('token')) {
		editBtn.style.display = 'block';
	}

	// Afficher la modale lorsque le bouton "Modifier" est cliqué
	editBtn.addEventListener('click', () => {
		photoModal.style.display = 'block';
		loadPhotos();
	});

	// Masquer la modale lorsque le bouton de fermeture est cliqué
	closeModal.addEventListener('click', () => {
		photoModal.style.display = 'none';
	});

	// Masquer la modale lorsque l'utilisateur clique en dehors de la modale
	window.addEventListener('click', (event) => {
		if (event.target === photoModal) {
			photoModal.style.display = 'none';
		}
	});

	// Charger les photos depuis le backend
	function loadPhotos() {
		fetch('http://localhost:5678/api/works')
			.then(response => response.json())
			.then(data => {
				photoGallery.innerHTML = '';
				data.forEach(image => {
					const photoItem = document.createElement('div');
					photoItem.classList.add('photo-item');

					const img = document.createElement('img');
					img.src = image.imageUrl;
					img.alt = image.title;

					const deleteBtn = document.createElement('button');
					deleteBtn.textContent = 'Supprimer';
					deleteBtn.addEventListener('click', () => {
						deletePhoto(image.id);
					});

					photoItem.appendChild(img);
					photoItem.appendChild(deleteBtn);
					photoGallery.appendChild(photoItem);
				});
			})
			.catch(error => console.error('Erreur:', error));
	}

	// Supprimer une photo
	function deletePhoto(photoId) {
		fetch(`http://localhost:5678/api/works/${photoId}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(response => {
			if (response.ok) {
				loadPhotos();
			} else {
				alert('Erreur lors de la suppression de la photo.');
			}
		})
		.catch(error => console.error('Erreur:', error));
	}

	// Afficher le formulaire d'ajout de photo lorsque le bouton "Ajouter une photo" est cliqué
	addPhotoBtn.addEventListener('click', () => {
		document.querySelector('.modal-content').style.display = 'none';
		addPhotoSection.style.display = 'block';
	});

	// Retourner à la galerie de photos lorsque le bouton "Retour" est cliqué
	backBtn.addEventListener('click', () => {
		addPhotoSection.style.display = 'none';
		document.querySelector('.modal-content').style.display = 'block';
	});

	// Gérer la soumission du formulaire d'ajout de photo
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
				loadPhotos();
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