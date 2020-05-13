import {Stats} from "../../lib/collection";

Template.sidebar.helpers({

    'getLevel':function () {

        return Stats.findOne({userId:Meteor.userId()}).level;

    }

});

Template.sidebar.events({
    'click #createMeetup' : function () {
        Router.go('/create_meetup');
    },
    'click #myMeetupsButton' : function () {
        Router.go('/my_meetups');
    },
    'click #logout':function(event){
        event.preventDefault();

        Meteor.logout(function(err){
            if(err){
                console.log(err.reason);
                sAlert.error(err.reason,
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            } else {

                sAlert.info("Successfully logged out",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
                Router.go("/");
            }
        })
    }
});

Template.home.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').addClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");

};