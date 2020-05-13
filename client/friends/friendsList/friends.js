import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './friendRow';

Template.friends.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').addClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");


};

Template.friends.helpers({
    getFriends() {
        const userProf = Meteor.user().profile;

        let friendsIDs = [];

        if(userProf.friends) {
            for (i = 0; i < userProf.friends.length; i++) {
                friendsIDs.push(userProf.friends[i]);
            }
        }

        let foundFriends = [];

        Meteor.call('getUsers', friendsIDs, function(error, result) {

            if(result) {
                let final = [];
                for(i = 0; i < result.length; i++) {
                    final.push(result[i][0]);

                }

                Session.set("friendsList", final);
            }
        });

        foundFriends = Session.get("friendsList");
        return foundFriends;
    }
});