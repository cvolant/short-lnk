import { Meteor } from "meteor/meteor";
import React from "react";
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import FlipMove from 'react-flip-move';

import { Links } from "../api/links";
import LinkListItem from "./LinkListItem.js";

export default class LinksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    };
  }
  componentDidMount() {
    this.linksTracker = Tracker.autorun(() => {
      Meteor.subscribe("linksPub");
      const showHidden = Session.get("showHidden");
      const links = Links.find({
        $or: [{ visible: true }, { visible: !showHidden }]
      }, { sort: { createdAt: -1 } }).fetch();
      this.setState({ links });
    });
  }
  componentWillUnmount() {
    this.linksTracker.stop();
  }

  renderLinksListItems() {
    if (this.state.links.length === 0) {
      return (
        <div className="item">
          <p className='item__status-message'>No links found.</p>
        </div>
      );
    }
    return this.state.links.map(link => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      return <LinkListItem key={link._id} shortUrl={shortUrl} {...link} />;
    });
  }

  render() {
    return (
      <div>
      <FlipMove maintainContainerHeight='true'>
        {this.renderLinksListItems()}
      </FlipMove>
      </div>
    );
  }
}
