import React from "react";
import style from "./recipe.module.css";

const Recipe = (data) => {
  console.log(data.recipe.recipe);
  const ingredients = data.recipe.recipe.ingredientLines;
  return (
    <div className={style.recipe}>
      <h1>{data.recipe.recipe.label}</h1>
      <ol>
        {ingredients.map((ingredient) => (
          <li>{ingredient}</li>
        ))}
      </ol>
      <p>Calories: {data.recipe.recipe.calories}</p>
      <img className={style.image} src={data.recipe.recipe.image} alt="" />
    </div>
  );
};

export default Recipe;
