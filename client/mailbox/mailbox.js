import {Mailbox} from "../../lib/collection";

Template.mailBox.rendered = function () {
    $('#smailbox').addClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");


};

Meteor.subscribe('mailboxcollection');
Meteor.subscribe('getMeteorUsers');

Template.mailBox.helpers({

    'getTestMails':function () {

        return Mailbox.find();

    },

    'hasReceivedMail': function () {
        var count =  Mailbox.find({to:Meteor.userId()}).count();
        if(count === 0){
            return false;
        }
        return true;
    },

    'getMails':function () {
      return Mailbox.find({to:Meteor.userId()});
    },

    'getSendableUsers':function () {
        // return Meteor.users.find({_id:{$ne:Meteor.userId()}});
        var regexp = new RegExp(Session.get('searchKey'), 'i');
        return Meteor.users.find({$and:[{_id:{$ne:Meteor.userId()}},{username:regexp}]});
    },

    'fromUser':function () {
        var fromUserId = Mailbox.findOne({_id:this._id});
        var fromUser = Meteor.users.findOne({_id:fromUserId.from});
        return fromUser.username;
    }

});


Template.mailBox.events({

    'click .mailtest':function () {

        var mailjson = {
          from:"Test",
          to: "me"
        };
        console.log("Called mailboxtest");
        Meteor.call('mailBoxTest', mailjson);
    },

    'keyup #mailboxsearch':function (event) {

        Session.set('searchKey', event.target.value);
    },

    'click .chipSend':function(event){
        event.preventDefault();
        Session.set('sendToNameId',this._id);
        console.log(Session.get('sendToNameId'));

        var sendToName = Meteor.users.findOne({_id:Session.get('sendToNameId')});
        console.log(sendToName.username);
    }

});

Template.sendMail.helpers({

    'getSendToName':function () {

        var sendToName = Meteor.users.findOne({_id:Session.get('sendToNameId')});
        return sendToName.username;

    }


});

Template.sendMail.events({

    'submit .send-form':function (event) {

        event.preventDefault();
        var subject = event.target.subject.value;
        var body = event.target.message.value;

        var mailJson = {

          from:Meteor.userId(),
          to:Session.get('sendToNameId'),
          subject:subject,
          body:body
        };

        Meteor.call('mailBoxSend',mailJson);

        sAlert.info("Mail sent",
            {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});

        event.target.subject.value = "";
        event.target.message.value = "";

        $('#mailbox-send').modal('hide');



    }

});