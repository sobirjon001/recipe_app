import React from "react";
import style from "./recipe.module.css";
import like from "./img/001-like.svg";
import thumb from "./img/002-thumb-up.svg";
import ingr from "./img/ingredients.jpeg";
import e from "cors";

const ItemRecipe = (props) => {
  const openDirections = (e) => {
    console.log(e);
  };

  return (
    <div className={style.itemRecipe}>
      <div className={style.titleContainer}>
        <img className={style.image} src={props.image} alt="" />
        <div className="textContainer">
          <h1>{props.title}</h1>
          <img
            src={props.liked ? thumb : like}
            alt=""
            className={style.like}
            onClick={props.onClick}
          />
          <p>Calories: {props.calories}</p>
          <p>{props.ingredients.length} ingredients</p>
          <button className={style.closeBtn} onClick={props.onClick}>
            Close
          </button>
          <a target="_blank" href={props.url} className={style.closeBtn}>
            Directions
          </a>
        </div>
      </div>
      <div className={style.ingredientsListContainer}>
        <ol>
          {props.ingredients.map((ingredient, index) => (
            <li key={ingredient.index} className={style.ingrList}>
              <div className={style.listContainer}>
                <img
                  className={style.ingrImage}
                  src={ingredient.image ? ingredient.image : ingr}
                  alt=""
                />
                <div className={style.ingredientContainer}>
                  <p>{ingredient.text}</p>
                  <p>Weight: {ingredient.weight}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ItemRecipe;
