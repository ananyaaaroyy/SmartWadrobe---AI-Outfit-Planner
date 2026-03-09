// Global State
let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [
  {
    id: 1,
    name: "Classic Beige Trench",
    category: "tops",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Silk Slip Dress",
    category: "tops",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "High-Waist Wide Leg Trousers",
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Pointed Leather Mules",
    category: "footwear",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Gold Pendant Layer",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Oversized Cashmere Knit",
    category: "tops",
    image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Structured Satin Skirt",
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=400&auto=format&fit=crop",
  }
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  if (document.getElementById("wardrobeGrid")) renderWardrobe();
  if (document.getElementById("plannerWorkspace")) initPlanner();
  if (document.getElementById("weatherDisplay")) initWeather();
});

// Navbar Scroll Effect
function initNavbar() {
  const nav = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
}

// Render Wardrobe Items
function renderWardrobe(filter = "all") {
  const grid = document.getElementById("wardrobeGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const items =
    filter === "all" ? wardrobe : wardrobe.filter((i) => i.category === filter);

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item-card animate-up";
    div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-overlay">
                <button class="btn btn-outline" onclick="deleteItem(${item.id})">Remove</button>
            </div>
            <div style="padding: 1rem;">
                <h4 style="font-size: 0.9rem;">${item.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">${item.category}</p>
            </div>
        `;
    grid.appendChild(div);
  });
}

// Filter Functionality
function filterItems(category) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
    if (
      tab.innerText.toLowerCase() === category ||
      (category === "all" && tab.innerText === "All Items")
    ) {
      tab.classList.add("active");
    }
  });
  renderWardrobe(category);
}

// Modal Logic
function openModal() {
  document.getElementById("uploadModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("uploadModal").style.display = "none";
}

// Form Submission
const addItemForm = document.getElementById("addItemForm");
if (addItemForm) {
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: document.getElementById("itemName").value,
      category: document.getElementById("itemCategory").value,
      image: document.getElementById("itemImage").value,
    };
    wardrobe.push(newItem);
    localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
    renderWardrobe();
    closeModal();
    addItemForm.reset();
  });
}

function deleteItem(id) {
  wardrobe = wardrobe.filter((i) => i.id !== id);
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
  renderWardrobe();
}

// --- Planner Logic (for planner.html) ---
function initPlanner() {
  const sidebar = document.getElementById("plannerSidebar");
  wardrobe.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.image;
    img.className = "draggable-item";
    img.draggable = true;
    img.dataset.category = item.category;
    img.addEventListener("dragstart", handleDragStart);
    sidebar.appendChild(img);
  });

  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData("src", e.target.src);
  e.dataTransfer.setData("category", e.target.dataset.category);
}

function handleDrop(e) {
  e.preventDefault();
  const src = e.dataTransfer.getData("src");
  const category = e.dataTransfer.getData("category");
  const zoneCategory = e.currentTarget.dataset.zone;

  if (category === zoneCategory) {
    e.currentTarget.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
  } else {
    alert("Please drop items in their correct category zone!");
  }
}

// --- Weather Logic (for weather.html) ---
async function initWeather() {
  const weatherData = {
    temp: 18,
    condition: "Partly Cloudy",
    location: "New York, NY",
  };

  const display = document.getElementById("weatherDisplay");
  if (!display) return;

  display.innerHTML = `
        <div class="glass" style="padding: 3rem; text-align: center;">
            <h2 style="font-size: 4rem; margin-bottom: 0.5rem;">${weatherData.temp}°C</h2>
            <p style="font-size: 1.5rem; color: var(--accent);">${weatherData.condition}</p>
            <p style="color: var(--text-dim);">${weatherData.location}</p>
        </div>
    `;

  suggestWeatherOutfit(weatherData.temp);
}

function suggestWeatherOutfit(temp) {
  const suggestions = document.getElementById("weatherSuggestions");
  let items = [];

  if (temp < 15) {
    items = wardrobe.filter(
      (i) =>
        i.name.toLowerCase().includes("coat") ||
        i.name.toLowerCase().includes("boots"),
    );
  } else {
    items = wardrobe.filter(
      (i) =>
        i.name.toLowerCase().includes("shirt") ||
        i.name.toLowerCase().includes("blouse"),
    );
  }

  if (suggestions) {
    suggestions.innerHTML = "";
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item-card";
      div.innerHTML = `<img src="${item.image}"><p style="padding: 1rem;">${item.name}</p>`;
      suggestions.appendChild(div);
    });
  }
}
