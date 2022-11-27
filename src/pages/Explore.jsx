import React from "react";
import { Link } from "react-router-dom";

import Slider from "../components/Slider";

import saleCategoryImage from "../assets/jpg/saleCategoryImage.jpg";
import rentCategotyImage from "../assets/jpg/rentCategoryImage.jpg";

const Explore = () => {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <Slider />
        <p className="categoriesHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img
              className="exploreCategoryImg"
              src={rentCategotyImage}
              alt="rent"
            />
            <p className="exploreCategoryName">Places for rent</p>
          </Link>
          <Link to="/category/sale">
            <img
              className="exploreCategoryImg"
              src={saleCategoryImage}
              alt="sale"
            />
            <p className="exploreCategoryName">Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore;
