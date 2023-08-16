const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("search-btn");
const mealContainer = document.getElementById("meal-container");
const receipeDetailContent = document.getElementById("receipe-details-content");
const receipeCloseBtn = document.getElementById("receipe-close-btn");
const favorite = document.getElementsByClassName("fa-heart");
const favoriteContainer = document.getElementById("favorite-sec");

//function to get receipes
const fetchRecipes = async (query) => {
  try {
    mealContainer.innerHTML = "<h2>fetching receipes...</h2>";
    console.log(query);
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();
    console.log(response);

    mealContainer.innerHTML = "";
    response.meals.forEach((meal) => {
      const receipeDiv = document.createElement("div");
      receipeDiv.classList.add("receipe");

      receipeDiv.innerHTML = `
    <img src=${meal.strMealThumb}>
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span> Dish</p>
    <p>Belongs to <span>${meal.strCategory}</span></p>
    `;

      const heart = document.createElement("button");
      heart.classList.add("heart");
      heart.innerHTML = `<i class="fa-regular fa-heart fa-lg" style="color: #c8ccd0;"></i>`;
      receipeDiv.appendChild(heart);

      // function for favorite list

      heart.addEventListener("click", () => {
        const ans = confirm(
          "Do you want to add this recipe to your favorite."
        );
        if (!ans) {
          return;
        } else {
          addfavlist();
        }
      });
     
      //function for add favorite 
      const addfavlist = () => {
        const clickheart = document.createElement("button");
        clickheart.classList.add("ch");
        clickheart.innerHTML = `<i class="fa-regular fa-heart fa-lg" style="color: #c8ccd0;"></i>`;
        receipeDiv.removeChild(heart);
        receipeDiv.appendChild(clickheart);

        // console.log(meal);

        clickheart.addEventListener("click", () => {
          const ans = confirm(
            "Do you want to remove this recipe to your favorite."
          );
          if (!ans) {
            return;
          } else {
            openremove();
          }
        });

        const openremove = () => {
          receipeDiv.removeChild(clickheart);
          receipeDiv.appendChild(heart);
        };
      };

      const viewbutton = document.createElement("button");
      viewbutton.classList.add("view-button");
      viewbutton.textContent = "view receipe";
      receipeDiv.appendChild(viewbutton);

      //add event listener to receipe button

      viewbutton.addEventListener("click", () => {
        receipeDiv.parentElement.style.opacity = "20%";
        openReceipePopup(meal);
      });
      mealContainer.appendChild(receipeDiv);
    });
  } catch (error) {
    mealContainer.innerHTML = `<h2>Error in Fetching Recpies...</h2>`;
  }
};

// funtction to fetch Ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientslist = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientslist += `<li>${ingredient}:  ${measure}</li>`;
    } else {
      break;
    }
  }
  return ingredientslist;
};

//function for open-receipe popup
const openReceipePopup = (meal) => {
  const youtubeEl = meal.strYoutube;
  const selectURL = youtubeEl.match(/(?<=\=).{1,}/g);
  receipeDetailContent.innerHTML = `
  <h2 class="receipeName">${meal.strMeal}</h2>


  <iframe class="video-wrap" width="100%" height="315" src="https://www.youtube.com/embed/${selectURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

  <h3>Ingredients:</h3>
  <ul class="ingredientList">${fetchIngredients(meal)}</ul>
  <dvi>
    <h3>
        Instructions:
    </h3>
    <p class="instructions">${meal.strInstructions}</p>
  </dvi>
  
  `;

  receipeDetailContent.parentElement.style.display = "block";
};

//EventListener for receipe-details-close button
receipeCloseBtn.addEventListener("click", () => {
  receipeDetailContent.parentElement.style.display = "none";
  mealContainer.style.opacity = "100%";
});

//EvenListener for search button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchint = searchBox.value.trim();
  if (!searchint) {
    mealContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
    return;
  }

  fetchRecipes(searchint);
});
