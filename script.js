let currentCategory = null;
let cameFromSearch = false;
// Show a category's recipe cards
function showCategory(category) {
  currentCategory = category;

  document.getElementById("category-title").textContent = category;

  const categoryCards = document.getElementById("category-cards");
  categoryCards.innerHTML = "";

  const filtered = recipes.filter(r => r.category === category);

  if (filtered.length === 0) {
    categoryCards.innerHTML = "<p>No recipes here yet — check back soon!</p>";
  } else {
    filtered.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.onclick = () => showRecipe(recipe.id);
      card.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>Serves: ${recipe.serves}</p>
      `;
      categoryCards.appendChild(card);
    });
  }

  document.getElementById("welcome-view").style.display = "none";
  document.getElementById("category-view").style.display = "block";
  document.getElementById("recipe-view").style.display = "none";
  document.getElementById("add-recipe-view").style.display = "none";
}

// Show a single recipe's full details
function showRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  const ingredientsHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
  const stepsHTML = recipe.steps.map(s => `<li>${s}</li>`).join("");

  document.getElementById("recipe-content").innerHTML = `
    <h2>${recipe.title}</h2>
    <p><em>Serves: ${recipe.serves}</em></p>
    <h3>Ingredients</h3>
    <ul>${ingredientsHTML}</ul>
    <h3>Instructions</h3>
    <ol>${stepsHTML}</ol>
  `;

  clearSearch();

  document.getElementById("welcome-view").style.display = "none";
  document.getElementById("category-view").style.display = "none";
  document.getElementById("recipe-view").style.display = "block";
  document.getElementById("add-recipe-view").style.display = "none";
}

function clearSearch() {
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").innerHTML = "";
  document.getElementById("category-buttons").style.display = "flex";
}
function backFromRecipe() {
  if (cameFromSearch) {
    cameFromSearch = false;
    showWelcome();
  } else {
    backToCategory();
  }
}
// Go back to the welcome page
function showWelcome() {
  document.getElementById("welcome-view").style.display = "block";
  document.getElementById("category-view").style.display = "none";
  document.getElementById("recipe-view").style.display = "none";
  document.getElementById("add-recipe-view").style.display = "none";
}

// Go back from a recipe to its category list
function backToCategory() {
  showCategory(currentCategory);
}
// Live search on the welcome page
function handleSearch() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("search-results");
  const categoryButtons = document.getElementById("category-buttons");

  if (query === "") {
    resultsDiv.innerHTML = "";
    categoryButtons.style.display = "flex";
    return;
  }

  categoryButtons.style.display = "none";

  const matches = recipes.filter(r => r.title.toLowerCase().includes(query));

  if (matches.length === 0) {
    resultsDiv.innerHTML = "<p>No recipes match your search.</p>";
    return;
  }

  resultsDiv.innerHTML = "";
  matches.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.onclick = () => { cameFromSearch = true; showRecipe(recipe.id); };
    card.innerHTML = `
      <h2>${recipe.title}</h2>
      <p>Serves: ${recipe.serves}</p>
      ${recipe.category ? `<p class="category-tag">${recipe.category}</p>` : ""}
    `;
    resultsDiv.appendChild(card);
  });
}

// Secret trigger: click the title 5 times quickly to reveal the Add Recipe button
let titleClickCount = 0;
let titleClickTimer = null;

function handleTitleClick() {
  titleClickCount++;

  clearTimeout(titleClickTimer);
  titleClickTimer = setTimeout(() => { titleClickCount = 0; }, 2000);

  if (titleClickCount === 5) {
    document.getElementById("add-recipe-btn").style.display = "inline-block";
    titleClickCount = 0;
  }
}

// Show the Add Recipe form
function showAddRecipe() {
  document.getElementById("welcome-view").style.display = "none";
  document.getElementById("category-view").style.display = "none";
  document.getElementById("recipe-view").style.display = "none";
  document.getElementById("add-recipe-view").style.display = "block";
}

// Build the code block from the form
function generateRecipeCode() {
  const title = document.getElementById("new-title").value.trim();
  const serves = document.getElementById("new-serves").value.trim();
  const category = document.getElementById("new-category").value;
  const ingredientsRaw = document.getElementById("new-ingredients").value.trim();
  const stepsRaw = document.getElementById("new-steps").value.trim();

  if (!title || !ingredientsRaw || !stepsRaw) {
    alert("Please fill in at least the title, ingredients, and instructions.");
    return;
  }

  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const servesValue = isNaN(serves) || serves === "" ? `"${serves || "Unknown"}"` : serves;

  const ingredientsList = ingredientsRaw.split("\n").filter(line => line.trim() !== "");
  const stepsList = stepsRaw.split("\n").filter(line => line.trim() !== "");

  const ingredientsCode = ingredientsList.map(i => `      "${i.trim().replace(/"/g, '\\"')}"`).join(",\n");
  const stepsCode = stepsList.map(s => `      "${s.trim().replace(/"/g, '\\"')}"`).join(",\n");

  const code = `  {
    id: "${id}",
    title: "${title.replace(/"/g, '\\"')}",
    serves: ${servesValue},
    category: "${category}",
    ingredients: [
${ingredientsCode}
    ],
    steps: [
${stepsCode}
    ]
  },`;

  document.getElementById("generated-code").value = code;
}

// Run this when the page first loads
showWelcome();