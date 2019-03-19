import { Meteor } from "meteor/meteor";
import React from "react";
import PropType from "prop-types";
import ClipBoard from "clipboard";
import moment from "moment";

export default class LinkListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justCopied: false,
      visible: this.props.visible
    };
  }
  componentDidMount() {
    this.clipboard = new ClipBoard(this.refs.copy);
    this.clipboard
      .on("success", () => {
        this.setState({ justCopied: true });
        setTimeout(() => this.setState({ justCopied: false }), 1000);
      })
      .on("error", () => {
        alert("Unable to copy. Please copy manually.");
      });
  }
  componentWillUnmount() {
    this.clipboard.destroy();
  }
  toggleVisible = function() {
    const visible = !this.state.visible;
    this.setState({ visible });
    Meteor.call("links.setVisibility", this.props._id, visible);
  };

  delete = function() {
    const visible = !this.state.visible;
    this.setState({ visible });
    Meteor.call("links.remove", this.props._id);
  };

  renderStats() {
    const visitedCount = this.props.visitedCount;
    const lastVisitedAt = this.props.lastVisitedAt;
    return (
      <p className='item__message'>
        {visitedCount} visit{visitedCount !== 1 ? "s" : ""}
        {lastVisitedAt ? ` (visited ${moment(lastVisitedAt).fromNow()})` : ""}
      </p>
    );
  }
  render() {
    return (
      <div className='item'>
        <h2>{this.props.url}</h2>
        <p className='item__message'>{this.props.shortUrl}</p>
        {this.renderStats()}
        <button className='button button--pill' onClick={this.toggleVisible.bind(this)}>
          {this.state.visible === false ? "Unhide" : "Hide"}
        </button>
        <button className='button button--pill' ref="copy" data-clipboard-text={this.props.shortUrl}>
          {this.state.justCopied ? "Copied" : "Copy"}
        </button>
        <a className='button button--link button--pill' href={this.props.url} target='_blank'>Visit</a>
        <button className='button button--pill' onClick={this.delete.bind(this)}>
          Delete
        </button>
      </div>
    );
  }
}

LinkListItem.propTypes = {
  _id: PropType.string.isRequired,
  shortUrl: PropType.string.isRequired,
  url: PropType.string.isRequired,
  owner: PropType.string.isRequired,
  visible: PropType.bool.isRequired,
  visitedCount: PropType.number.isRequired,
  lastVisitedAt: PropType.number
};
