import {Meetup} from "../../lib/collection";

Template.showMeetup.helpers({
    meetup : function () {
        return Meetup.find({_id:Session.get('meetup_id')});
    },
    invite : function () {
        return this.invited;
    },
    numPeopleInvited : function () {
        return this.invited.length;
    },
    isNotInvited : function () {
        var isInvited = true;
        if(this.invited === undefined){
            return isInvited;
        }else{
            this.invited.forEach(function(user){
                if(user.userId === Meteor.userId()){
                       isInvited = false;
                }
            });
        }
        return isInvited;
    },
    isInProgress : function () {
        return this.inProgress;
    },
    currUser : function () {
        return this.owner_id === Meteor.userId();
    },
    tasks : function () {
        return Meetup.findOne({_id: this._id}).agenda;

    },
    itIsChecked : function (isChecked) {
        return isChecked;
    },

});



Template.showMeetup.events({
   'click #editButton' :function () {
       if(Meteor.userId() === this.owner_id){
           // alert(Meteor.userId() + ", " + this.owner_id);
           Router.go('/edit_meetup');
       }else{
           alert("Can't edit someone else's meetup!");
       }
   },

    'click #joinMeetupButton' : function () {
        var myObj = {
            userId: Meteor.userId(),
            userName: (Meteor.users.findOne({_id: Meteor.userId()})).username
        };

        var tempInvitedList = this.invited;
        tempInvitedList.push(myObj);

        Meteor.call('updateInvitedList', tempInvitedList, this._id);
    },
    'click #leaveMeetupButton' : function() {
        // alert(Meteor.userId());
        var length = this.invited.length;
        var tempInvitedList = this.invited;
        for(var i = 0; i < length; i++){
            if(tempInvitedList[i].userId === Meteor.userId()){
                tempInvitedList.splice(i, 1);
                Meteor.call('updateInvitedList', tempInvitedList, this._id);
            }
        }
    },
    'click #taskCheckBox' : function () {
       Meteor.call('updateTaskIsChecked', Session.get('meetup_id'), this.task);
        // let checkValue = !this.isChecked;

        // alert(this.task);
        // console.log(this);
    },
    'click #deleteButton' : function (event) {
       event.preventDefault();
        Meteor.call('deleteMeetup', this._id);
        Router.go("/index_meetup")
   }
});


Template.showMeetup.onRendered(function() {
    GoogleMaps.load({key:'AIzaSyCY2ZTXlhCnnQKuLzgyu_SA2waeFdrdR4Q'});
});


Template.map.helpers({
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


Template.comments_showMeetup.helpers({
    isMyComment : function (id) {
        return id === Meteor.userId();
    },
    comments : function () {
        let meetup = Meetup.findOne({_id: this._id});
        var commentsArray = meetup.comments;
        if(commentsArray === undefined){
            alert("comments array is undefined");
        }else{
            return commentsArray;
        }
    }
});

Template.comments_showMeetup.events({
    'click #addCommentButton':function () {
        let comment = $('#addComment');
        if(comment.val().length === 0 || comment.val() === ' '){
            comment.val('');
            return;
        }
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        var commentObj = {
            userId: user._id,
            userName: user.username,
            comment: comment.val(),
            upvote:0,
            downvote:0,
            voteList:[]
        };
        // console.log(commentObj);
        Meteor.call('updateComments', Session.get('meetup_id'), commentObj);
        comment.val('');
    },
    'click #deleteCommentButton' : function () {
        // alert(this.index);
        if(this.userId !== Meteor.userId()){
            alert("Cannot delete, not your comment");
        }else{
            Meteor.call('deleteComment', Session.get('meetup_id'), this);
            sAlert.success("Deleted",
                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        }
    },
    'click #upvoteButton' : function () {
        var tempVoteList = this.voteList;

        if(tempVoteList !== undefined) {
            var length = tempVoteList.length;
            if (length !== 0) {
                for (var i = 0; i < length; i++) {
                    if (tempVoteList[i].userId === Meteor.userId()) {
                        if (tempVoteList[i].voteType === 'upvote') {
                            // alert("Can't upvote more than once");
                            sAlert.error("Can't upvote more than once",
                                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
                            return;
                        }
                    }
                }
            }
        }

        var voteObj = {
            userId: Meteor.userId(),
            voteType: 'upvote'
        };

        var commentObj = {
            userId: this.userId,
            userName: this.userName,
            comment: this.comment,
            upvote: this.upvote,
            downvote: this.downvote,
            voteList: this.voteList
        };

        Meteor.call('updateVotes', Session.get('meetup_id'), voteObj, commentObj);
    },
    'click #downvoteButton' : function () {
        var tempVoteList = this.voteList;

        if(tempVoteList !== undefined) {
            var length = tempVoteList.length;
            if (length !== 0) {
                for (var i = 0; i < length; i++) {
                    if (tempVoteList[i].userId === Meteor.userId()) {
                        if (tempVoteList[i].voteType === 'downvote') {
                            // alert("Can't downvote more than once");
                            sAlert.error("Can't downvote more than once",
                                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
                            return;
                        }
                    }
                }
            }
        }

        var voteObj = {
            userId: Meteor.userId(),
            voteType: 'downvote'
        };

        var commentObj = {
            userId: this.userId,
            userName: this.userName,
            comment: this.comment,
            upvote: this.upvote,
            downvote: this.downvote,
            voteList: this.voteList
        };

        Meteor.call('updateVotes', Session.get('meetup_id'), voteObj, commentObj);
    }

});


Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        // console.log("I'm ready!");
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
    });
});