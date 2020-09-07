import React, { useEffect, useState, useRef } from "react";
import Recipe from "./Recipe";
import "./App.css";
import ItemRecipe from "./ItemRecipe";

const App = () => {
  const APP_ID = ""; // get your id from edamam.com
  const APP_KEY = ""; // get your key from edamam.com
  const searchInput = useRef(null);

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("start");
  const [recipe_recs, setRecipe_recs] = useState([]);
  const [item_recipe, setItem_recipe] = useState({ active: false, recipe: {} });

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

  const getRecipes = async () => {
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
      const responce = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      const data = await responce.json();
      const loaded = [];
      data.hits.forEach((entry) => {
        entry = { ...entry, ...{ q: data.q } };
        loaded.push(entry);
      });
      setRecipes(loaded);
      setRecipe_recs([...recipe_recs, ...loaded]);
      setQuery("start");
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
    if (e.target.value == "init") {
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

  const clickHandle = (e) => {
    const list = recipes.concat();
    const listRec = recipe_recs.concat();
    if (e.target.localName === "img") {
      const title = e.target.parentElement.children[0].innerText;
      list.forEach((item, index) => {
        if (item.recipe.label == title) {
          item.bookmarked = recipes[index].bookmarked;
          setRecipes(list);
        }
      });

      listRec.forEach((item, index) => {
        if (item.recipe.label == title) {
          item.bookmarked = !recipe_recs[index].bookmarked;
        }
      });
      setRecipe_recs(listRec);
    } else if (e.target.localName === "div") {
      const title = e.target.children[0].innerText;
      const x = list.find((item) => item.recipe.label == title);
      setItem_recipe({ active: !item_recipe.active, recipe: x });
    } else if (e.target.localName === "button") {
      setItem_recipe({ active: !item_recipe.active, recipe: {} });
    }
  };

  const deleteHandler = () => {
    if (!item_recipe.active) {
      const a = recipe_recs.concat();
      const c = recipes[0].q;
      recipe_recs.map((b) => {
        if (b.q === c) {
          let i = a.findIndex((v) => v.q === c);
          a.splice(i, 1); // mutating a that's why findIndex
        }
      });
      setRecipe_recs(a);
      setRecipes([]);
    } else {
      // for storage
      const a = recipe_recs.concat();
      const c = item_recipe.recipe.recipe.label;
      const i = a.findIndex((v) => v.recipe.label === c);
      a.splice(i, 1);
      setRecipe_recs(a);
      // for recipes
      const _a = recipes.concat();
      const _i = _a.findIndex((b) => b.recipe.label === c);
      _a.splice(_i, 1);
      setRecipes(_a);
      setItem_recipe({ active: !item_recipe.active, recipe: {} });
    }
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

  const recipesRender = () => {
    if (!item_recipe.active) {
      const x = recipes.map((recipe, index) => (
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
            clickHandle(e);
          }}
        />
      ));
      return x;
    } else {
      const y = Object.assign(item_recipe.recipe);
      const x = (
        <ItemRecipe
          image={y.recipe.image}
          title={y.recipe.label}
          liked={y.bookmarked}
          calories={y.recipe.calories}
          ingredients={y.recipe.ingredients}
          url={y.recipe.url}
          onClick={(e) => {
            e.persist();
            clickHandle(e);
          }}
        />
      );
      return x;
    }
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
          <option hidden value="init">
            Load saved
          </option>
          <option value="liked">Liked Recipes</option>
          {selectFilter().map((option) =>
            option ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : null
          )}
        </select>
        <button
          className="search-button"
          onClick={(e) => {
            e.preventDefault();
            deleteHandler();
          }}
        >
          Delete current recipes
        </button>
      </form>
      <div className="recipes">{recipesRender()}</div>
    </div>
  );
};

export default App;
