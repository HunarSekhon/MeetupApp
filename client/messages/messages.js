import { Template } from 'meteor/templating';
import { Messages } from '../../imports/api/messages.js';
import './messages.html';


Template.messages.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').addClass("active");


};

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('messages');
});

Template.messageDetail.helpers({
    messageDetails: function (){
        return Messages.findOne(Router.current().params._id);
    },
    comment_list() {
        var message =  Messages.findOne(Router.current().params._id);
        return message.comments;
    }
});

Template.messages.helpers({
  message_list() {
    return Messages.find({}, { sort: { createdAt: -1 } });
  }
});

Template.messages.events({
    'submit .new-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.message.value;
        const comments = [];
        // Insert a message into the collection
        Meteor.call('messages.insert', text, comments);

        // Clear form
        target.message.value = '';
    },
    'click .remove'(event) {
        new Confirmation({
            message: "Are you sure?",
            title: "Confirmation",
            cancelText: "Cancel",
            okText: "Ok",
            success: true, // whether the button should be green or red
            focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
            }, function (ok) {
                Meteor.call('messages.remove');
            }
        );
    },
});

Template.messageDetail.events({
    'submit form'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const commenter =  Meteor.users.findOne({ _id: Meteor.userId() }).username;
        const comment = target.comment.value;

        // Insert a message into the collection
        Meteor.call('messages.update', Router.current().params._id, commenter, comment);

        // Clear form
        target.comment.value = '';       
    }
});