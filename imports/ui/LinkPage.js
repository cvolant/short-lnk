import React from "react";

import PrivateHeader from "./PrivateHeader.js";
import LinkList from "./LinkList.js";
import AddLink from "./AddLink.js";
import LinkListFilter from "./LinkListFilter";

export default props => {
  return (
    <div>
      <PrivateHeader title="Your links" />
      <div className="page-content">
        <LinkListFilter />
        <AddLink />
        <LinkList />
      </div>
    </div>
  );
};
