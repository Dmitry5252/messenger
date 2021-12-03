import React from "react";
import style from "../styles/Image.module.scss";
import { useActions, useTypedSelector } from "../app/hooks";
import { baseURL } from "../config/axiosInstance";
import saveImage from "../images/save.svg";

const Image = () => {
  const { ShowImageAction } = useActions();
  const { imageName, imageSrc } = useTypedSelector((state) => state.appReducer);
  return (
    <div onClick={() => ShowImageAction()} className={style.imageWrapper}>
      <img onClick={(e) => e.stopPropagation()} alt="Message" src={`${baseURL}getImage/${imageSrc}/${imageName}`}></img>
      <a onClick={(e) => e.stopPropagation()} href={`${baseURL}getImage/${imageSrc}/${imageName}`}>
        <img alt="Save" src={saveImage} />
      </a>
    </div>
  );
};

export default Image;
