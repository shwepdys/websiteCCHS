// API Configuration
const API = "https://websitecchs.onrender.com/api";

// Utility Functions
const getToken = () => localStorage.getItem("token");

const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Add animations to head if not already present
if (!document.querySelector('#notification-animations')) {
  const style = document.createElement('style');
  style.id = 'notification-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Section Management
function showAddGame() {
  const addSection = document.getElementById("addGameSection");
  const listSection = document.getElementById("gameListSection");
  
  if (addSection && listSection) {
    addSection.style.display = "block";
    listSection.style.display = "none";
    
    // Update active button state if you have navigation buttons
    updateActiveButton('addGame');
  }
}

function showGameList() {
  const addSection = document.getElementById("addGameSection");
  const listSection = document.getElementById("gameListSection");
  
  if (addSection && listSection) {
    addSection.style.display = "none";
    listSection.style.display = "block";
    loadGameList();
    
    // Update active button state if you have navigation buttons
    updateActiveButton('gameList');
  }
}

function updateActiveButton(activeSection) {
  // Optional: Add visual feedback to navigation buttons
  const buttons = document.querySelectorAll('.sidebar button');
  buttons.forEach(btn => {
    btn.style.backgroundColor = '';
    btn.style.color = '';
  });
}

// Load Game List with Enhanced UI
async function loadGameList() {
  const listContainer = document.getElementById("gameList");
  
  if (!listContainer) {
    console.error("Game list container not found");
    return;
  }
  
  // Show loading state
  listContainer.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: #666;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
      <div>Loading games...</div>
    </div>
  `;
  
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const res = await fetch(`${API}/games`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }
      throw new Error(`Failed to load games: ${res.status}`);
    }
    
    const games = await res.json();
    
    if (!Array.isArray(games)) {
      throw new Error("Invalid response format");
    }
    
    // Clear container
    listContainer.innerHTML = "";
    
    if (games.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎮</div>
          <h3 style="margin-bottom: 0.5rem;">No games yet</h3>
          <p>Add your first game to get started!</p>
        </div>
      `;
      return;
    }
    
    // Render games
    games.forEach((game, index) => {
      const card = createGameCard(game, index);
      listContainer.appendChild(card);
    });
    
  } catch (error) {
    console.error("Error loading games:", error);
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #f44336;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
        <div><strong>Error:</strong> ${error.message}</div>
        <button onclick="loadGameList()" style="margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #1e88e5; color: white; cursor: pointer;">
          Try Again
        </button>
      </div>
    `;
  }
}

// Create Game Card Element
function createGameCard(game, index) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    animation: fadeInUp 0.4s ease backwards;
    animation-delay: ${index * 0.05}s;
  `;
  
  card.innerHTML = `
    <div style="flex: 1;">
      <h3 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.1rem;">
        ${escapeHtml(game.title)}
      </h3>
      <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #666;">
        <span>🎮 ID: ${game._id.slice(-6)}</span>
        ${game.category ? `<span>📁 ${escapeHtml(game.category)}</span>` : ''}
      </div>
    </div>
    <div style="display: flex; gap: 0.5rem;">
      <button 
        onclick="editGame('${game._id}')" 
        style="padding: 0.6rem 1.2rem; border: none; border-radius: 6px; background: #2196f3; color: white; cursor: pointer; font-weight: 600; transition: all 0.2s ease;"
        onmouseover="this.style.background='#1976d2'; this.style.transform='translateY(-2px)'"
        onmouseout="this.style.background='#2196f3'; this.style.transform='translateY(0)'"
      >
        ✏️ Edit
      </button>
      <button 
        onclick="deleteGame('${game._id}')" 
        style="padding: 0.6rem 1.2rem; border: none; border-radius: 6px; background: #f44336; color: white; cursor: pointer; font-weight: 600; transition: all 0.2s ease;"
        onmouseover="this.style.background='#d32f2f'; this.style.transform='translateY(-2px)'"
        onmouseout="this.style.background='#f44336'; this.style.transform='translateY(0)'"
      >
        🗑️ Delete
      </button>
    </div>
  `;
  
  return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Delete Game with Confirmation Modal
async function deleteGame(id) {
  // Create custom confirmation modal
  const confirmed = await showConfirmDialog(
    'Delete Game',
    'Are you sure you want to delete this game? This action cannot be undone.'
  );
  
  if (!confirmed) return;
  
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const res = await fetch(`${API}/games/${id}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication failed");
      }
      throw new Error(`Failed to delete game: ${res.status}`);
    }
    
    showNotification("Game deleted successfully!", "success");
    loadGameList();
    
  } catch (error) {
    console.error("Error deleting game:", error);
    showNotification(`Error: ${error.message}`, "error");
  }
}

// Edit Game with Better Input Validation
async function editGame(id) {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    // Fetch current game data
    const res = await fetch(`${API}/games/${id}`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch game data");
    }
    
    const game = await res.json();
    
    // Get new values with current values as defaults
    const title = prompt("Enter game title:", game.title);
    if (title === null) return; // User cancelled
    
    if (!title.trim()) {
      showNotification("Title cannot be empty", "error");
      return;
    }
    
    const html = prompt("Enter game HTML/URL:", game.html);
    if (html === null) return; // User cancelled
    
    if (!html.trim()) {
      showNotification("HTML/URL cannot be empty", "error");
      return;
    }
    
    // Optional: Add more fields
    const category = prompt("Enter category (optional):", game.category || "");
    const description = prompt("Enter description (optional):", game.description || "");
    
    // Update game
    const updateRes = await fetch(`${API}/games/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        title: title.trim(), 
        html: html.trim(),
        ...(category && { category: category.trim() }),
        ...(description && { description: description.trim() })
      })
    });
    
    if (!updateRes.ok) {
      throw new Error(`Failed to update game: ${updateRes.status}`);
    }
    
    showNotification("Game updated successfully!", "success");
    loadGameList();
    
  } catch (error) {
    console.error("Error editing game:", error);
    showNotification(`Error: ${error.message}`, "error");
  }
}

// Custom Confirm Dialog (Better than default confirm)
function showConfirmDialog(title, message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: scaleIn 0.3s ease;
    `;
    
    dialog.innerHTML = `
      <h3 style="margin: 0 0 1rem 0; color: #333;">${escapeHtml(title)}</h3>
      <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">${escapeHtml(message)}</p>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button id="cancelBtn" style="padding: 0.6rem 1.5rem; border: 1px solid #ddd; border-radius: 6px; background: white; color: #666; cursor: pointer; font-weight: 600;">
          Cancel
        </button>
        <button id="confirmBtn" style="padding: 0.6rem 1.5rem; border: none; border-radius: 6px; background: #f44336; color: white; cursor: pointer; font-weight: 600;">
          Delete
        </button>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    dialog.querySelector('#confirmBtn').onclick = () => {
      overlay.remove();
      style.remove();
      resolve(true);
    };
    
    dialog.querySelector('#cancelBtn').onclick = () => {
      overlay.remove();
      style.remove();
      resolve(false);
    };
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
        style.remove();
        resolve(false);
      }
    };
  });
}

// Add fadeInUp animation to document if not present
if (!document.querySelector('#admin-animations')) {
  const style = document.createElement('style');
  style.id = 'admin-animations';
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin panel loaded');
  
  // Check if user is authenticated
  const token = getToken();
  if (!token && window.location.pathname.includes('admin.html')) {
    showNotification('Please login first', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }
});