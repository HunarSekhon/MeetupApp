import {Meetup} from "../../lib/collection";

Template.editMeetup.helpers({
    meetup : function () {
        return Meetup.find({_id: Session.get('meetup_id'), owner_id: Meteor.userId()});
    },
    task : function () {
        return (Meetup.findOne({_id: Session.get('meetup_id'), owner_id: Meteor.userId()}).agenda);
    }
});

Template.editMeetup.events({
    'click #backButton' : function () {
        Router.go('/show_meetup');
    },
    'click #doneButton' : function () {
        let isValid = addMeetup();
        if(isValid){
            console.log(isValid);
            Router.go("/show_meetup");
        }
    },
    'click #addTaskButton' : function(){
        let task = $('#newTask');
        let taskVal = task.val();

        let taskObj = {
            task: taskVal,
            isChecked: false
        };

        Meteor.call('updateAgenda', this._id, taskObj);
        task.val('');
    },
    'click #deleteTaskButton' : function (){
        // alert("Going to send this task to get deleted: " + this.task);
        Meteor.call('deleteMeetupTask', Session.get('meetup_id'), this.task);
        // alert("Does nothing right now");
    }
});


function addMeetup(){
    let meetupTitle = $('#addTitle');
    let meetupLocation = $('#addLocation');
    let meetupDescription = $('#addDescription');
    let meetupTasks = $('#addTasks');
    let meetupDateTime = $('.set-due-date');

    let isValid = false;
    if(!meetupTitle || !meetupTitle.val()){
        alert('Must enter a title for your meet up');
        return;
    }else if(!meetupLocation || !meetupLocation.val()){
        alert('Must enter a location for your meet up');
        return;
    }else if(!meetupDateTime || !meetupDateTime.val()){
        alert('Must enter a date and time');
        return;
    }else{
        isValid = true;
    }

    var meetupVisibility = "";

    if(document.getElementById('visibility_public').checked) {
        meetupVisibility = "public"
    }else if(document.getElementById('visibility_private').checked) {
        meetupVisibility = "private";
    }

    // console.log("This is the visibility: " + meetupVisibility);

    var updatedMeetup = {
        owner_id:Meteor.userId(),
        title:meetupTitle.val(),
        location:meetupLocation.val(),
        description:meetupDescription.val(),
        visibility: meetupVisibility,
        dateTime:meetupDateTime.val(),
        tasks:meetupTasks.val(),
    };



    Meteor.call('updateMeetup', updatedMeetup, this._id);
    if (isValid){
        meetupTitle.val('');
        meetupLocation.val('');
        meetupDescription.val('');
        meetupTasks.val('');
    }
    return isValid;
}
