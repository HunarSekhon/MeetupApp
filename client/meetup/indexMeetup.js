import {Meetup} from "../../lib/collection";


Template.indexMeetup.rendered = function () {
    $('#smailbox').removeClass("active");
    $('#smeetups').addClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");
    // $('#searchside').addClass("searchSidebar");
    GoogleMaps.load({key:'AIzaSyCY2ZTXlhCnnQKuLzgyu_SA2waeFdrdR4Q'});

};

// Meetup = new Mongo.Collection('meetup');
Meteor.subscribe('getMeetups');

Template.indexMeetup.events({
    'click #createButton' : function () {
        Router.go('/create_meetup');
    },
    'click #deleteButton' : function () {
        Meteor.call('deleteMeetup', this._id);
    },
    'click #myMeetupsButton' : function () {
        Router.go('/my_meetups');
    },
    'click #backButton' : function () {
        Router.go('/my_meetups');
    },
    'click #showButton' : function () {
        Session.set('meetup_id', this._id);
        Router.go('showMeetup');
    }
});



Template.indexMeetup.helpers({
   meetup : function () {
       var regexpM = new RegExp(Session.get('meetupSearchKey'), 'i');
       return Meetup.find({$and:[{visibility:"public"},{title:regexpM}]});
       // return Meetup.find({visibility: "public"});
   },

    isEmpty: function () {
        return Meetup.find({visibility: "public"}).count() === 0;
    },

    numPeopleInvited : function () {
        return this.invited.length;
    },

    author : function () {
        return (Meteor.users.findOne({_id: this.owner_id})).username;
    },

    isCurrUser : function () {
        return this.owner_id === Meteor.userId();
    }
});




Template.mapcard.helpers({
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


Template.mapcard.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        // console.log("I'm ready!");
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
    });
});


Template.searchsidebar.events({

    'keyup #meetupsSearch':function (event) {

        Session.set('meetupSearchKey', event.target.value);
    }
});