import React from "react";
import Recipe from "./Recipe";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      search: "",
      query: "chicken",
      recipe_recs: [],
      APP_ID: "41456eaf",
      APP_KEY: "0c679c6c87d15f4a447a8c28afed63b2",
    };
    this.loadStorage = this.loadStorage.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.getSearch = this.getSearch.bind(this);
    this.saveToStorage = this.saveToStorage(this);
  }

  // load storage
  loadStorage() {
    if (localStorage.getItem("recipe_recs") === null) {
      localStorage.setItem("recipe_recs", JSON.stringify([]));
    } else {
      this.setState({
        recipe_recs: JSON.parse(localStorage.getItem("recipe_recs")),
      });
    }
  }

  getRecipes() {
    if (
      this.state.recipe_recs.includes(
        (recipe_rec) => recipe_rec.title === this.state.query
      )
    ) {
      alert("This recipe already saved. Please load it from saved recipes");
      this.setState({ search: "" });
    } else if (
      this.state.query === "" ||
      this.state.query === " " ||
      this.state.query === "  " ||
      this.state.query === "   "
    ) {
      alert("Please wrigh valid recipe for cearch");
      this.state.search("");
    } else {
      fetch(
        `https://api.edamam.com/search?q=${this.state.query}&app_id=${this.state.APP_ID}&app_key=${this.state.APP_KEY}`
      )
        .then((rec) => rec.json())
        .then((data) => {
          console.log("happend 1");
          console.log(data.hits);
          this.setState({ recipes: [data.hits] });
          console.log("happend 2");
          console.log(data.hits);
          this.setState({
            recipe_recs: [
              ...this.state.recipe_recs,
              { title: data.q, hits: [data.hits] },
            ],
          });
        });
      this.saveToStorage();
    }
  }
  updateSearch(e) {
    this.setState({ search: e.target.value });
  }

  getSearch(e) {
    e.preventDafault();
    console.log(e);
    this.setState({ query: this.state.search });
    this.setState({ search: "" });
    this.getRecipes();
  }

  saveToStorage() {
    localStorage.setItem("recipe_recs", JSON.stringify(this.state.recipe_recs));
  }

  render() {
    return (
      <div className="App">
        <form className="search-form" onSubmit={this.getSearch}>
          <input
            ref={this.searchInput}
            className="search-bar"
            type="text"
            value={this.state.search}
            onChange={this.updateSearch}
          />
          <input className="search-button" type="submit" />
        </form>
        <div className="recipes">
          {this.state.recipes.map((recipe) => (
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
  }
}

export default App;
