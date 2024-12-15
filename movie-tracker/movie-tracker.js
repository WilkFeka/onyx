const API_KEY = 'c217ec073845b31cb30e065f6ad76086';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchPopularMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

async function fetchMovieDetails(movieId) {
    try {
        const [creditsResponse, detailsResponse] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=es-ES`)
        ]);

        const creditsData = await creditsResponse.json();
        const detailsData = await detailsResponse.json();

        const director = creditsData.crew.find(member => member.job === 'Director');
        
        return {
            director: director ? director.name : 'Director no disponible',
            genres: detailsData.genres.map(genre => genre.name).slice(0, 2).join(', ')
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return {
            director: 'Director no disponible',
            genres: 'Géneros no disponibles'
        };
    }
}

async function renderMovies() {
    const movieGrid = document.getElementById('movie-grid');
    const movies = await fetchPopularMovies();

    for (const movie of movies) {
        const { director, genres } = await fetchMovieDetails(movie.id);
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="${BASE_IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-cover">
            <div class="movie-info">
                <h2 class="movie-title" title="${movie.title}">${movie.title}</h2>
                <p class="movie-director" title="${director}">${director}</p>
                <p class="movie-year">${new Date(movie.release_date).getFullYear()} • ${genres}</p>
                <div class="movie-rating">★ ${movie.vote_average.toFixed(1)}</div>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    }
}

renderMovies();