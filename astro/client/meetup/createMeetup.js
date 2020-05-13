var invitedUsers = [];


Template.createMeetup.helpers({
   friend : function () {
       let currUserID =  Meteor.userId();
       var currUserObj = Meteor.users.findOne({_id: currUserID});

       let numFriends = currUserObj.profile.friends.length;

       var friendsNames = [];

       for(let i = 0; i < numFriends; i++){
           let currUserFriendID = currUserObj.profile.friends[i];
           let friendObj = Meteor.users.findOne({_id: currUserFriendID});
           var friendKeyPair = {
               userId: friendObj._id,
               userName: friendObj.username
           };
           friendsNames.push(friendKeyPair);
       }
       return friendsNames;
   },
    // isNotInvited : function () {
    //     var isInvited = true;
    //     if(this.invited === undefined){
    //         return isInvited;
    //     }else{
    //         this.invited.forEach(function(user){
    //             if(user.userId === Meteor.userId()){
    //                 isInvited = false;
    //             }
    //         });
    //     }
    //     console.log("isInvited value: " + isInvited);
    //     return isInvited;
    // }
});



Template.createMeetup.events({
    'click #submitButton' : function (event) {
        // event.preventDefault();
        // console.log("Clicked the Button");
        let isValid = addMeetup();
        if(isValid){
            // console.log(isValid);
            Router.go("/index_meetup");
        }
    },
    'click #backButton' : function () {
        Router.go('/index_meetup');
    },
    'click #debugButton' : function () {
        // var result = Meteor.call('getLatAndLong', "17389 64ave Surrey");
        // console.log("From client" + result[0]);
        alert((Meteor.users.findOne({_id: Meteor.userId()})).username);
    },
    'click #inviteButton' : function () {
        var isInvited = false;
        var thisUserId = this.userId;
        if(invitedUsers.length === 0){
            invitedUsers.push(this);
            sAlert.success(this.userName + ' is invited',
                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            return;
        }else{
            invitedUsers.forEach(function(user){
                if(user.userId === thisUserId){
                    isInvited = true;
                }
            });
        }

        if(isInvited === false){
            invitedUsers.push(this);
            sAlert.success(this.userName + ' is invited',
                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        }else{
            sAlert.error(this.userName + ' has already been invited',
                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        }



    }
});


Template.createMeetup.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();

    $('#smailbox').removeClass("active");
    $('#smeetups').removeClass("active");
    $('#sfriendslist').removeClass("active");
    $('#sleaderboards').removeClass("active");
    $('#smessageboards').removeClass("active");

    // GoogleMaps.load();
});



function addMeetup(){
    let meetupTitle = $('#addTitle');
    let meetupLocation = $('#addLocation');
    let meetupDescription = $('#addDescription');
    let meetupDateTime = $('.set-due-date');

    let isValid = false;
    if(!meetupTitle || !meetupTitle.val()){
       // alert('Must enter a title for your meet up');
        sAlert.error('Must enter a title for your meet up',
            {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        return;
    }else if(!meetupLocation || !meetupLocation.val()){
        //alert('Must enter a location for your meet up');
        sAlert.error('Must enter a location for your meet up',
            {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        return;
    }else if(!meetupDateTime || !meetupDateTime.val()){
        //alert('Must enter a date and time');
        sAlert.error('Must enter a date and time for your meet up',
            {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
        return;
    }else{
        isValid = true;
    }

    var meetupVisibility = "";

    if(document.getElementById('visibility_public').checked) {
        meetupVisibility = "public"
    }else if(document.getElementById('visibility_private').checked) {
        meetupVisibility = "private";
        var privateMeetupInfo = "Meetup: " + meetupTitle.val() + " can be accessed via My Meetups page";
        sAlert.info(privateMeetupInfo,
            {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
    }

    // console.log("This is the visibility: " + meetupVisibility);
    // console.log("Meetup  Location: "  + meetupLocation.val());


    //invite the user who created the meetup
    let inviteMyselfObj = {
        userId: Meteor.userId(),
        userName: (Meteor.users.findOne({_id: Meteor.userId()})).username
    };

    invitedUsers.push(inviteMyselfObj);
    var commentsSkelliton = [];

    var tasksList = [];
    var newMeetup = {
        owner_id:Meteor.userId(),
        title:meetupTitle.val(),
        location:meetupLocation.val(),
        description:meetupDescription.val(),
        visibility: meetupVisibility,
        dateTime:meetupDateTime.val(),
        inProgress:false,
        invited:invitedUsers,
        agenda:tasksList,
        comments:commentsSkelliton
    };
    Meteor.call('createMeetup', newMeetup, function(err){
        if(err){
            // console.log(err);
            sAlert.error(err.reason,
                {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            return false;
        }
    });
    if (isValid){
        meetupTitle.val('');
        meetupLocation.val('');
        meetupDescription.val('');
        invitedUsers = [];
    }
    return isValid;
}