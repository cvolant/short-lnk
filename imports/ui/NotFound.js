import React from "react";
import { Link } from "react-router";

export default () => {
  return (
    <div className="boxed-view">
      <div className="boxed-view__box">
        <h1>Not found</h1>
        <p>... Hmmm, sorry! :/</p>
        <Link className='button button--link' to='/'>Head home</Link>
      </div>
    </div>
  );
};
