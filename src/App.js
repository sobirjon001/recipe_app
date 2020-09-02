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
    // this.loadStorage = this.loadStorage.bind(this);
  }

  loadStorage() {
    if (localStorage.getItem("recipe_recs")) {
      this.setState({
        recipe_recs: JSON.parse(localStorage.getItem("recipe_recs")),
      });
    }
  }

  render() {
    this.state.recipes.map((recipe) => {
      console.log(recipe);
    });
    return (
      <div className="App">
        <div className="search-form">
          <input
            className="search-bar"
            type="text"
            onChange={(e) => {
              this.setState({ search: e.target.value });
            }}
          />
          <button
            className="search-button"
            onClick={() => {
              this.setState({ query: this.state.search });
              this.setState({ search: "" });
              this.getRecipes();
            }}
          >
            Submit
          </button>
          <button className="search-button" onClick={this.saveToStorage}>
            Save
          </button>
        </div>
        <div className="recipes">
          {this.state.recipes.map((recipe) => (
            <Recipe recipe={recipe} key={recipe.recipe.label} />
          ))}
        </div>
      </div>
    );
  }

  getRecipes = () => {
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
      this.setState({ search: "" });
    } else {
      fetch(
        `https://api.edamam.com/search?q=${this.state.query}&app_id=${this.state.APP_ID}&app_key=${this.state.APP_KEY}`
      )
        .then((rec) => rec.json())
        .then((data) => {
          this.setState({ recipes: data.hits });
          this.setState({
            recipe_recs: [
              ...this.state.recipe_recs,
              { title: data.q, hits: data.hits },
            ],
          });
        });
    }
  };

  saveToStorage = () => {
    localStorage.setItem("recipe_recs", JSON.stringify(this.state.recipe_recs));
  };
}

export default App;
