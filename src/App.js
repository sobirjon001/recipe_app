import React, { useEffect, useState, useRef } from "react";
import Recipe from "./Recipe";
import "./App.css";

const App = () => {
  const APP_ID = "41456eaf";
  const APP_KEY = "0c679c6c87d15f4a447a8c28afed63b2";
  const searchInput = useRef(null);

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("chicken");
  const [recipe_recs, setRecip_recs] = useState([]);

  // load storage
  loadStorage(() => {
    if (localStorage.getItem("recipe_recs")) {
      setRecip_recs(JSON.parse(localStorage.getItem("recipe_recs")));
    }
  });

  useEffect(() => {
    getRecipes();
  }, [query]);

  useEffect(() => {
    saveToStorage();
  }, [recipe_recs]);

  saveToStorage = () => {
    localStorage.setItem("recipe_recs", JSON.stringify(recipe_recs));
  };

  getRecipes = () => {
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

  updateSearch = (e) => {
    setSearch(e.target.value);
  };

  getSearch = (e) => {
    e.preventDafault();
    setQuery(search);
    setSearch("");
  };

  return (
    <div className="App">
      <form className="search-form" onSubmit={getSearch}>
        <input
          ref={searchInput}
          className="search-bar"
          type="text"
          value={search}
          onChange={updateSearch}
        />
        <input className="search-button" type="submit" />
      </form>
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
