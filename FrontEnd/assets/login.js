document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('loginForm');

	loginForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const email = loginForm.email.value;
		const password = loginForm.password.value;

		fetch('http://localhost:5678/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})
		.then(response => response.json())
		.then(data => {
			if (data.token) {
				// Stocker le token dans le localStorage
				localStorage.setItem('token', data.token);
				// Rediriger vers la page d'accueil
				window.location.href = 'index.html';
			} else {
				alert('Erreur dans l’identifiant ou le mot de passe.');
			}
		})
		.catch(error => {
			console.error('Erreur:', error);
			alert('Une erreur est survenue. Veuillez réessayer plus tard.');
		});
	});
});