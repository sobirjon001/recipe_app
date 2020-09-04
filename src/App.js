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
  const [recipe_recs, setRecipe_recs] = useState([{ title: "init" }]);

  useEffect(() => {
    getRecipes();
  }, [query]);

  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    saveToStorage();
    fn();
  }, [recipe_recs]);

  useEffect(() => {
    // fn();
  }, [recipes]);

  const fn = () => {
    console.log(recipe_recs);
  };

  // load storage
  const loadStorage = () => {
    if (localStorage.getItem("recipe_recs")) {
      setRecipe_recs(JSON.parse(localStorage.getItem("recipe_recs")));
    }
  };

  const saveToStorage = () => {
    localStorage.setItem("recipe_recs", JSON.stringify(recipe_recs));
  };

  const getRecipes = () => {
    if (recipe_recs.find((recipe_rec) => recipe_rec.title === query)) {
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
      return;
    } else {
      fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      )
        .then((rec) => rec.json())
        .then((data) => {
          setRecipes(data.hits);
          recipe_recs.title === "init"
            ? setRecipe_recs({ title: data.q, hits: data.hits })
            : setRecipe_recs(...recipe_recs, {
                title: data.q,
                hits: data.hits,
              });
          setQuery("start");
        });
    }
  };

  const selectHandler = (e) => {
    if (e.target.value !== "initial") {
      let chousen = recipe_recs.find(
        (record) => record.title === e.target.value
      );
      setRecipes(chousen.hits);
    } else {
      return;
    }
  };

  const likeHandle = (i) => {
    const list = recipes.concat();
    list.map((item, index) => {
      if (index == i) {
        item.bookmarked = !recipes[i].bookmarked;
      }
    });
    setRecipes(list);
    updateLikesToRecs(list);
  };

  const updateLikesToRecs = (list) => {
    const index = recipe_recs.findIndex(
      (rec) => rec.recipe.label === list.recipe.label
    );
    console.log(index);
  };

  return (
    <div className="App">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search);
          setSearch("");
        }}
      >
        <input
          ref={searchInput}
          className="search-bar"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <input className="search-button" type="submit" />
        <select
          className="saved_rec search-button"
          onChange={(e) => {
            e.persist();
            selectHandler(e);
          }}
        >
          <option value="initial">Please chouse</option>
          {recipe_recs.title === "init"
            ? null
            : recipe_recs.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
        </select>
      </form>
      <div className="recipes">
        {recipes.map((recipe, index) => (
          <Recipe
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            key={recipe.recipe.label}
            ingredients={recipe.recipe.ingredientLines}
            liked={recipe.bookmarked}
            index={index}
            onClick={(e) => {
              e.persist();
              likeHandle(e.target.attributes.value.value);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
