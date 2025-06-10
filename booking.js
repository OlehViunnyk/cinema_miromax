const movieSelect = document.getElementById("movieSelect");
const sessionSelect = document.getElementById("sessionSelect");
const seatsContainer = document.getElementById("seats");
const countDisplay = document.getElementById("count");
const priceDisplay = document.getElementById("price");

let selectedSeats = new Set();
let bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
let movies = JSON.parse(localStorage.getItem("movies") || "[]");
const seatPrice = 100;

function populateMovies() {
  movieSelect.innerHTML = "";
  movies.forEach(m => {
    let opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.title;
    movieSelect.appendChild(opt);
  });
  populateSessions();
}

function populateSessions() {
  sessionSelect.innerHTML = "";
  const movieId = movieSelect.value;
  const movie = movies.find(m => m.id === movieId);
  (movie?.sessions || []).forEach(s => {
    let opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sessionSelect.appendChild(opt);
  });
  renderSeats();
}

function renderSeats() {
  seatsContainer.innerHTML = "";
  selectedSeats.clear();
  countDisplay.textContent = "0";
  priceDisplay.textContent = "0";

  const movieId = movieSelect.value;
  const session = sessionSelect.value;
  const key = movieId + "|" + session;
  const occupied = new Set(bookings[key] || []);

  for (let i = 0; i < 50; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.dataset.index = i;
    seat.textContent = i + 1;
    if (occupied.has(i)) seat.classList.add("occupied");
    seat.onclick = () => {
      if (seat.classList.contains("occupied")) return;
      seat.classList.toggle("selected");
      if (selectedSeats.has(i)) selectedSeats.delete(i);
      else selectedSeats.add(i);
      updateSummary();
    };
    seatsContainer.appendChild(seat);
  }
}

function updateSummary() {
  countDisplay.textContent = selectedSeats.size;
  priceDisplay.textContent = selectedSeats.size * seatPrice;
}

function confirmBooking() {
  const movieId = movieSelect.value;
  const session = sessionSelect.value;
  const key = movieId + "|" + session;
  if (!bookings[key]) bookings[key] = [];
  bookings[key].push(...selectedSeats);
  bookings[key] = Array.from(new Set(bookings[key]));
  localStorage.setItem("bookings", JSON.stringify(bookings));
  alert("Квитки заброньовано!");
  renderSeats();
}

movieSelect.onchange = populateSessions;
sessionSelect.onchange = renderSeats;

populateMovies();
