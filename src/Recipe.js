import React from "react";
import style from "./recipe.module.css";

const Recipe = (props) => {
  return (
    <div className={style.recipe}>
      <h1>{props.label}</h1>
      <ol>
        {props.ingredients.map((ingredient) => (
          <li>{ingredient}</li>
        ))}
      </ol>
      <p>Calories: {props.calories}</p>
      <img className={style.image} src={props.image} alt="" />
    </div>
  );
};

export default Recipe;
