const movieForm = document.getElementById("movieForm");
const movieModal = document.getElementById("movieModal");
const modalTitle = document.getElementById("modalTitle");
const movieTableBody = document.getElementById("movieTableBody");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const addMovieBtn = document.getElementById("addMovieBtn");

let movies = JSON.parse(localStorage.getItem("movies") || "[]");

function openModal(edit = false, movie = {}) {
  movieModal.classList.remove("hidden");
  modalTitle.textContent = edit ? "Редагувати фільм" : "Додати фільм";
  movieForm.reset();
  movieForm.movieId.value = edit ? movie.id : "";
  movieForm.title.value = movie.title || "";
  movieForm.image.value = movie.image || "";
  movieForm.genre.value = movie.genre || "";
  movieForm.duration.value = movie.duration || "";
  movieForm.rating.value = movie.rating || "";
  movieForm.description.value = movie.description || "";
}

function closeModal() {
  movieModal.classList.add("hidden");
}

function renderMovies() {
  const search = searchInput.value.toLowerCase();
  const sort = sortSelect.value;

  let filtered = movies.filter(m => m.title.toLowerCase().includes(search));
  if (sort) {
    filtered.sort((a, b) => a[sort] > b[sort] ? 1 : -1);
  }

  movieTableBody.innerHTML = filtered.map(movie => `
    <tr>
      <td><img src="${movie.image}" alt="${movie.title}"/></td>
      <td>${movie.title}</td>
      <td>${movie.genre}</td>
      <td>${movie.duration} хв</td>
      <td>${movie.rating}</td>
      <td>${movie.description}</td>
      <td class="session-list">${(movie.sessions || []).join(", ")} <button onclick="addSession('${movie.id}')">+</button></td>
      <td>
        <button onclick="editMovie('${movie.id}')">✏</button>
        <button onclick="deleteMovie('${movie.id}')">🗑</button>
      </td>
    </tr>
  `).join("");
}

function addSession(id) {
  const session = prompt("Введіть час сеансу (напр. 18:00)");
  if (session) {
    const movie = movies.find(m => m.id === id);
    movie.sessions = movie.sessions || [];
    movie.sessions.push(session);
    saveMovies();
  }
}

function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies();
}

movieForm.onsubmit = e => {
  e.preventDefault();

  const title = movieForm.title.value.trim();
  const genre = movieForm.genre.value.trim();
  const duration = parseInt(movieForm.duration.value);
  const rating = parseFloat(movieForm.rating.value);

  // Валідація
  if (!title) {
    alert("Назва фільму не може бути порожньою.");
    return;
  }

  if (!genre) {
    alert("Жанр фільму не може бути порожнім.");
    return;
  }

  if (isNaN(duration) || duration <= 0) {
    alert("Тривалість має бути додатнім числом.");
    return;
  }

  if (isNaN(rating) || rating < 0 || rating > 10) {
    alert("Рейтинг має бути числом від 0 до 10.");
    return;
  }

  const movie = {
    id: movieForm.movieId.value || Date.now().toString(),
    title,
    image: movieForm.image.value,
    genre,
    duration,
    rating,
    description: movieForm.description.value,
    sessions: []
  };

  const index = movies.findIndex(m => m.id === movie.id);
  if (index >= 0) {
    movies[index] = { ...movies[index], ...movie };
  } else {
    movies.push(movie);
  }

  closeModal();
  saveMovies();
};

function editMovie(id) {
  const movie = movies.find(m => m.id === id);
  openModal(true, movie);
}

function deleteMovie(id) {
  if (confirm("Ви впевнені, що хочете видалити фільм?")) {
    movies = movies.filter(m => m.id !== id);
    saveMovies();
  }
}

addMovieBtn.onclick = () => openModal();
searchInput.oninput = renderMovies;
sortSelect.onchange = renderMovies;

renderMovies();
