import React from "react";
import Modal from "react-modal";
import { Meteor } from "meteor/meteor";

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      url: "",
      isOpen: false
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { url } = this.state; // Equivalent to: const url = this.state.url;

    if (url) {
      Meteor.call("links.insert", url, (err, res) => {
        if (err) {
          console.log("From Links.js :", err);
          this.setState({ error: err.reason });
        } else {
          this.handleModalClose();
        }
      });
    }
  };

  handleModalClose() {
    this.setState({ isOpen: false, url: "", error: "" });
  }

  render() {
    return (
      <div>
        <button className='button' onClick={() => this.setState({ isOpen: true })}>
          + Add Link
        </button>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Add Link"
          appElement={document.getElementById("app")}
          onAfterOpen={() => this.refs.url.focus()}
          onRequestClose={this.handleModalClose.bind(this)}
          className='boxed-view__box'
          overlayClassName='boxed-view boxed-view--modal'
        >
          <h3>Add Link</h3>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form className='boxed-view__form' onSubmit={this.onSubmit.bind(this)}>
            <input
              type="text"
              placeholder="URL"
              ref="url"
              value={this.state.url}
              onChange={e => {
                this.setState({ url: e.target.value.trim() });
              }}
            />
            <button className='button'>Add the new link</button>
            <button className='button button--secondary' type='button' onClick={this.handleModalClose.bind(this)}>Cancel</button>
          </form>
        </Modal>
      </div>
    );
  }
}
