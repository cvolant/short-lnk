import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import shortid from "shortid";

export const Links = new Mongo.Collection("links");

if (Meteor.isServer) {
  Meteor.publish("linksPub", function() {
    return Links.find({ owner: this.userId });
  });
}

Meteor.methods({
  "links.insert"(url) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    new SimpleSchema({
      url: {
        type: String,
        label: "Your URL",
        regEx: SimpleSchema.RegEx.Url
      }
    }).validate({ url });
    Links.insert({
      _id: shortid.generate(),
      createdAt: new Date(),
      url,
      owner: this.userId,
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null
    });
  },

  "links.remove"(_id) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    new SimpleSchema({
      _id: {
        type: String,
        min: 1,
        label: "link id"
      }
    }).validate({ _id });

    link = Links.findOne({ _id });
    if (!link) throw new Meteor.Error("link-not-found");
    else if (link.owner !== this.userId)
      throw new Meteor.Error("not-authorized");
    else Links.remove(_id);
  },

  "links.setVisibility"(_id, visible) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    new SimpleSchema({
      _id: {
        type: String,
        min: 1,
        label: "link id"
      },
      visible: {
        type: Boolean
      }
    }).validate({ _id, visible });

    link = Links.findOne({ _id });
    if (!link) throw new Meteor.Error("link-not-found");
    else if (link.owner !== this.userId)
      throw new Meteor.Error("not-authorized");
    else Links.update(_id, { $set: { visible } });
  },

  "links.trackVisit"(_id) {
    console.log('Call handled...\n');
    new SimpleSchema({
      _id: {
        type: String,
        min: 1,
        label: "link id"
      }
    }).validate({ _id });
    Links.update(
      { _id },
      {
        $set: { lastVisitedAt: new Date().getTime() },
        $inc: { visitedCount: 1 }
      }
    );
  }
});
