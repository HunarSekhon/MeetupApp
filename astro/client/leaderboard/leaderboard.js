import {Stats} from "../../lib/collection";

import './leaderboard.html'


Meteor.subscribe('getMeteorUsers');
Meteor.subscribe('stats');

Template.leaderboard.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').addClass("active");
    $('#smessageboards').removeClass("active");

};

Template.registerHelper('progressBar', function () {
    return {
        percent (a,b) { return (a/b) * 100}
    }
});

Template.leaderboard.helpers({
  
    'getStats': function () {

        var top5 = Stats.find({},{sort:{level:-1,xp:-1}, limit:5});
        return top5.fetch();

    },

    'getTop': function () {
        // return Stats.fetch({},{$sort :{level:-1,xp:-1}})[0].username;
        var topName =  Stats.find({},{sort:{level:-1,xp:-1}});
        topName.forEach(function (stat) {
            console.log(stat.username);
        });

        var username = topName.fetch()[0].username;
        return username;
    },

    'getAvatarForUser': function(userId) {
        Meteor.call('getAvatar', userId, function(error, result) {
            if(!error) {
                res = result;
                Session.set(`PPLB${userId}`, res);
            }
        });

        res = Session.get(`PPLB${userId}`);

        return res;
    }

});
