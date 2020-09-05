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
  const [recipe_recs, setRecipe_recs] = useState([]);

  useEffect(() => {
    getRecipes();
  }, [query]);

  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    saveToStorage();
    selectFilter();
  }, [recipe_recs]);

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
    if (recipe_recs.find((recipe_rec) => recipe_rec.q === query)) {
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
          const loaded = [];
          data.hits.forEach((entry) => {
            entry = { ...entry, ...{ q: data.q } };
            loaded.push(entry);
          });
          setRecipes(loaded);
          setRecipe_recs([...recipe_recs, ...loaded]);
          setQuery("start");
        });
    }
  };

  const loadLiked = () => {
    const likedRecs = [];
    recipe_recs.forEach((rec) => {
      if (rec.bookmarked) {
        likedRecs.push(rec);
      }
    });
    if (likedRecs.length == 0) {
      alert("You didn't like any recipe yet");
    } else {
      setRecipes(likedRecs);
    }
  };

  const selectHandler = (e) => {
    if (e.target.value == "initial") {
      return;
    } else if (e.target.value == "liked") {
      loadLiked();
    } else {
      const chousen = recipe_recs.filter(
        (record) => record.q === e.target.value
      );
      setRecipes(chousen);
    }
  };

  const likeHandle = (title) => {
    const list = recipes.concat();
    list.forEach((item, index) => {
      if (item.recipe.label == title) {
        item.bookmarked = recipes[index].bookmarked;
        setRecipes(list);
      }
    });

    const listRec = recipe_recs.concat();
    listRec.forEach((item, index) => {
      if (item.recipe.label == title) {
        item.bookmarked = !recipe_recs[index].bookmarked;
      }
    });
    setRecipe_recs(listRec);
  };

  const selectFilter = () => {
    let x = Object.assign({}, recipe_recs[0]);
    const options = [x.q];
    recipe_recs.forEach((rec) => {
      if (rec.q === x.q) {
      } else if (rec.q != x) {
        options.push(rec.q);
        x = rec.q;
      }
    });
    return options;
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
          <option value="liked">Liked Recipes</option>
          {selectFilter().map((option) =>
            option ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : null
          )}
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
              likeHandle(e.target.parentElement.children[0].innerText);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
