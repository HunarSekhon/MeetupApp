import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('messages', function messagesPublication() {
    return Messages.find();
  });
}

Meteor.methods({
    'messages.insert'(text, comments) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
      
    Messages.insert({
        text,
        comments,
        createdAt: new Date()
    });
  },
    'messages.update'(id, commenter, comment) {
        var message = Messages.findOne(id)
        Messages.update(id, { $push: { comments: { commenter: commenter, comment: comment} }
        });
    },
    'messages.remove'() {
 
    Messages.remove({});
  },
});

