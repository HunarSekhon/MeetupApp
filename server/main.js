import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {Stats} from "../lib/collection";
import '../imports/api/messages.js';


Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

    signupUser:function(newUser){
        console.log("New user created");
        return Accounts.createUser(newUser);
    },

    getUsers:async function(userIDs) {
        let foundusers = [];

        for(i = 0; i < userIDs.length; i++) {
            foundusers.push(await Meteor.users.find({_id: userIDs[i]}).fetch());
        }

        return foundusers;
    },

    getPeople:async function() {
        let people =  await Meteor.users.find({ _id: {$ne : Meteor.user()._id}}).fetch();
        return people;
    },

    addFollow:function(userID) {

        if(userID === Meteor.user()._id) {
            return;
        }

        Meteor.users.update({_id: Meteor.user()._id}, {$addToSet: { "profile.friends" : userID}});
    },
    removeFollow:function(userID) {

        if(userID === Meteor.user()._id) {
            return;
        }

        Meteor.users.update({_id: Meteor.user()._id}, {$pull: {"profile.friends" : userID}});
    },
    updateAvatar: function(avatarSelected) {
        if(!Meteor.user()) {
            return;
        }
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {"avatar": avatarSelected}});
    },

    getAvatar: async function(user) {
        let person = await Meteor.users.findOne({_id: user});

        if(person.avatar) {
            return "/avatars/" + person.avatar;
        } else {
            return "/pp.png";
        }
    },

    buyAvatar(avatar) {
        if(!Meteor.user()) {
            return;
        }

        let userStats = Stats.findOne({username: Meteor.user().username});

        const userStartPts = userStats.starPoints;

        if(userStartPts >= 10) {
            Meteor.users.update({_id: Meteor.user()._id}, {$addToSet: { "profile.boughtAvatars" : avatar}});

            Stats.update({userId: Meteor.user()._id}, {$set: {"starPoints": userStartPts - 10}});
        } else {
            return -1;
        }
    },

    userOwnsAvatar(avatar) {
        try {
            let user = Meteor.user();

            let avatars = user.profile.boughtAvatars;

            if(avatars) {
                return avatars.indexOf(avatar.toLowerCase()) > -1;
            }
        } catch(e) {
            return false;
        }
    }
});
