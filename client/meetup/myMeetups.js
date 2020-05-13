import {Meetup} from "../../lib/collection";

Template.myMeetups.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");
};

Template.myMeetups.events({
    'click #createButton' : function () {
        Router.go('/create_meetup');
    },
    'click #deleteButton' : function () {
        Meteor.call('deleteMeetup', this._id);
    },
    'click #indexButton' : function () {
        Router.go('/index_meetup')
    },
    'click #backButton' : function () {
        Router.go('/home');
    },
    'click #showButton' : function () {
        Session.set('meetup_id', this._id);
        Router.go('showMeetup');
    }
});



Template.myMeetups.helpers({
    meetup : function () {
        return Meetup.find({owner_id: Meteor.userId()});
    },
    isEmpty: function () {
        return Meetup.find({owner_id: Meteor.userId()}).count() === 0;
    },
    numPeopleInvited : function () {
        return this.invited.length;
    },
});


Template.mapcardPriv.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            var lat = this.latitude;
            var long = this.longitude;
            return {
                center: new google.maps.LatLng(lat, long),
                zoom: 13
            };
        }
    }
});


Template.mapcardPriv.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        // console.log("I'm ready!");
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
    });
});