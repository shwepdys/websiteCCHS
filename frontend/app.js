// --- existing code for API, login, logout, addGame, playGame ---
const API = "https://websitecchs.onrender.com/api";
// Show sections
function showAddGame() {
  document.getElementById("addGameSection").style.display = "block";
  document.getElementById("gameListSection").style.display = "none";
}

function showGameList() {
  document.getElementById("addGameSection").style.display = "none";
  document.getElementById("gameListSection").style.display = "block";
  loadGameList();
}

// Load all games in admin panel
async function loadGameList() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/games`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const games = await res.json();
  const listContainer = document.getElementById("gameList");
  listContainer.innerHTML = "";

  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "1rem";

    div.innerHTML = `
      <span>${game.title}</span>
      <div>
        <button onclick="editGame('${game._id}')">Edit</button>
        <button onclick="deleteGame('${game._id}')">Delete</button>
      </div>
    `;
    listContainer.appendChild(div);
  });
}

// Delete game
async function deleteGame(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Are you sure you want to delete this game?")) return;

  const res = await fetch(`${API}/games/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (res.ok) {
    alert("Game deleted!");
    loadGameList();
  } else {
    alert("Error deleting game!");
  }
}

// Edit game (basic example)
async function editGame(id) {
  const token = localStorage.getItem("token");
  const title = prompt("Enter new title:");
  const html = prompt("Enter new HTML:");

  if (!title || !html) return;

  const res = await fetch(`${API}/games/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, html })
  });

  if (res.ok) {
    alert("Game updated!");
    loadGameList();
  } else {
    alert("Error updating game!");
  }
}
