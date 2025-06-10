const gallery = document.getElementById("movieGallery");
const themeToggle = document.getElementById("themeToggle");

const movies = JSON.parse(localStorage.getItem("movies") || "[]");

movies.forEach(movie => {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.innerHTML = `
    <img src="${movie.image}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p><strong>Жанр:</strong> ${movie.genre}</p>
    <p><strong>Рейтинг:</strong> ${movie.rating}</p>
    <a href="booking.html"><button>Забронювати</button></a>
  `;
  gallery.appendChild(card);
});
