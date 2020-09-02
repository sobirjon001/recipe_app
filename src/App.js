import React, { useEffect, useState, useRef } from "react";
import Recipe from "./Recipe";
import "./App.css";

const App = () => {
  const APP_ID = "41456eaf";
  const APP_KEY = "0c679c6c87d15f4a447a8c28afed63b2";
  const searchInput = useRef(null);

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("start");
  const [recipe_recs, setRecip_recs] = useState([]);

  useEffect(() => {
    getRecipes();
  }, [query]);

  // load storage
  const loadStorage = () => {
    if (localStorage.getItem("recipe_recs")) {
      setRecip_recs(JSON.parse(localStorage.getItem("recipe_recs")));
    }
  };
  loadStorage();

  const saveToStorage = () => {
    localStorage.setItem("recipe_recs", JSON.stringify(recipe_recs));
  };

  const getRecipes = () => {
    if (recipe_recs.includes((recipe_rec) => recipe_rec.title === query)) {
      alert("This recipe already saved. Please load it from saved recipes");
      setSearch("");
      searchInput.current.focus();
    } else if (
      query === "" ||
      query === " " ||
      query === "  " ||
      query === "   "
    ) {
      alert("Please write valid recipe for search");
      setSearch("");
      searchInput.current.focus();
    } else if (query === "start") {
      alert("Welcome to my recipe app! Please search for a recipe");
    } else {
      fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      )
        .then((rec) => rec.json())
        .then((data) => {
          setRecipes(data.hits);
          setRecip_recs([...recipe_recs, { title: data.q, hits: data.hits }]);
        });
    }
  };

  return (
    <div className="App">
      <div className="search-form">
        <input
          ref={searchInput}
          className="search-bar"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          className="search-button"
          onClick={() => {
            setQuery(search);
            setSearch("");
          }}
        >
          Submit
        </button>
        <button
          className="search-button"
          onClick={() => {
            saveToStorage();
          }}
        >
          Save
        </button>
      </div>
      <div className="recipes">
        {recipes.map((recipe) => (
          <Recipe
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            key={recipe.recipe.label}
            ingredients={recipe.recipe.ingredientLines}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
