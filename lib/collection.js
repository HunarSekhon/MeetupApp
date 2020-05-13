
export const Mailbox = new Mongo.Collection('mailbox');
export const Notifications = new Mongo.Collection('notifications');
export const Stats = new Mongo.Collection('stats');
export const Meetup = new Mongo.Collection('meetup');

if(Meteor.isServer){

    Meteor.publish('mailboxcollection', function () {
        return Mailbox.find();
    });

    Meteor.publish('getMeteorUsers', function () {
        return Meteor.users.find();
    });

    Meteor.publish('getNotifications', function() {
       return Notifications.find();
    });

    Meteor.publish('stats', function() {
        return Stats.find();
    });

    Meteor.publish('getMeetups', function() {
        return Meetup.find();
    });
  

}


Meteor.methods({

   'mailBoxTest':function (mailboxjson) {
       console.log("Inserting mailbox");
       Mailbox.insert(mailboxjson);
   },

    'mailBoxSend':function (mailboxjson) {
        Mailbox.insert(mailboxjson);
    },

    'notificationsRemove': function (notificationsId) {
        Notifications.remove({_id:notificationsId});
    },

    'statsUpdate': function (statsJson, userId) {
        // Stats.update(userId,{$set: {}})
    },

    'newStat': function (statsJsonUserID) {
        Stats.insert(statsJsonUserID);
    },

    'setBooster':function(id){
       Stats.update({userid:id},{$set:{boosterActive:true}});
       var starPointsp = Stats.findOne({userid:id}).starPoints;
       Stats.update({userid:id},{$set:{starPoints:starPointsp - 35}});
   }

});
