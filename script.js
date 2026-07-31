// Build the home page cards
function renderHome() {
  const homeView = document.getElementById("home-view");
  homeView.innerHTML = ""; // clear it out first

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.onclick = () => showRecipe(recipe.id);

    card.innerHTML = `
      <h2>${recipe.title}</h2>
      <p>Serves: ${recipe.serves}</p>
      ${recipe.category ? `<p class="category-tag">${recipe.category}</p>` : ""}
    `;

    homeView.appendChild(card);
  });
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

  document.getElementById("home-view").style.display = "none";
  document.getElementById("recipe-view").style.display = "block";
}

// Go back to the home page
function showHome() {
  document.getElementById("recipe-view").style.display = "none";
  document.getElementById("home-view").style.display = "block";
}

// Run this when the page first loads
renderHome();