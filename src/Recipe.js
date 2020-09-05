import React from "react";
import style from "./recipe.module.css";
import like from "./img/001-like.svg";
import thumb from "./img/002-thumb-up.svg";

const Recipe = (props) => {
  return (
    <div className={style.recipe} onClick={props.onClick}>
      <h1 className={style.noPointerEv}>{props.title}</h1>
      <img className={style.image} src={props.image} alt="" />
      <p className={style.noPointerEv}>Calories: {props.calories}</p>
      <img src={props.liked ? thumb : like} alt="" className={style.like} />
      <p className={style.noPointerEv}>
        {props.ingredients.length} ingeadients
      </p>
    </div>
  );
};

export default Recipe;
