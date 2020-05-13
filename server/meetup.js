
import {Meetup} from "../lib/collection";

Meteor.startup(() => {

});

Meteor.methods({
    createMeetup:function (newMeetup) {
        // console.log("New meet up created");
        var geo = new GeoCoder();
        var result = geo.geocode(newMeetup.location);
        newMeetup.latitude = result[0].latitude;
        newMeetup.longitude = result[0].longitude;

        // console.log(result[0]);
        Meetup.insert(newMeetup);
    },
    updateMeetup:function (updatedMeetup, id) {
        // console.log("Updated a meet up");
        var geo = new GeoCoder();
        var result = geo.geocode(updatedMeetup.location);
        Meetup.update({_id:id},
            {$set:
                {
                    title: updatedMeetup.title,
                    location: updatedMeetup.location,
                    description: updatedMeetup.description,
                    visibility: updatedMeetup.visibility,
                    dateTime: updatedMeetup.dateTime,
                    latitude: result[0].latitude,
                    longitude: result[0].longitude,
                    agenda: updatedMeetup.agenda
                }
            }
        );
    },
    deleteMeetup:function(meetup_id){
        // console.log("Deleted a meet up");
        Meetup.remove({_id: meetup_id});
    },
    updateInvitedList:function (updatedInvitedList, meetup_id) {
        // console.log(meetup_id);
        Meetup.update({_id:meetup_id},
            {$set:
                {
                    invited: updatedInvitedList
                }
            }
        );
    },
    updateAgenda:function(meetup_id, taskObj){
        // console.log("Updating agenda");
        Meetup.update(meetup_id,
            {$push:
                {
                    agenda: taskObj
                }
            }
        );
    },
    updateComments:function (meetup_id, commentObj) {
        // console.log("Updating comments: " + meetup_id);
        Meetup.update(meetup_id,
            {$push:
                {
                    comments: commentObj
                }
            }
        );
    },
    updateVotes:function (meetup_id, voteObj, commentObj) {
        // console.log("Updating votes: ");

        var commentList = (Meetup.findOne({_id: meetup_id})).comments;
        var commentIndex;
        var shouldPush = true;

        for(var i = 0; i < commentList.length; i++){
            if(commentList[i].userId === commentObj.userId &&
                commentList[i].userName === commentObj.userName &&
                commentList[i].comment === commentObj.comment &&
                commentList[i].upvote === commentObj.upvote &&
                commentList[i].downvote === commentObj.downvote){

                commentIndex = i;
                break;
            }
        }


        var tempVoteList = commentList[commentIndex].voteList;
        if(tempVoteList !== undefined) {
            var length = tempVoteList.length;
            if (length !== 0) {
                for (var i = 0; i < length; i++) {
                    if (tempVoteList[i].userId === Meteor.userId()) {
                        if (tempVoteList[i].voteType === 'downvote' && voteObj.voteType === 'upvote') {
                            for(var j = 0; j < commentList[commentIndex].voteList.length; j++){
                                if(commentList[commentIndex].voteList[j].userId === voteObj.userId){
                                    commentList[commentIndex].voteList[j].voteType = voteObj.voteType;
                                    commentList[commentIndex].downvote += 1;
                                    shouldPush = false;
                                }
                            }
                        }else if(tempVoteList[i].voteType === 'upvote' && voteObj.voteType === 'downvote'){
                            for(var j = 0; j < commentList[commentIndex].voteList.length; j++){
                                if(commentList[commentIndex].voteList[j].userId === voteObj.userId){
                                    commentList[commentIndex].voteList[j].voteType = voteObj.voteType;
                                    commentList[commentIndex].upvote -= 1;
                                    shouldPush = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        if(shouldPush){
            commentList[commentIndex].voteList.push(voteObj);
        }

        if(voteObj.voteType === 'upvote'){
            commentList[commentIndex].upvote += 1;
        }else if(voteObj.voteType === 'downvote'){
            commentList[commentIndex].downvote -= 1;
        }

        Meetup.update({_id: meetup_id},
            {$set:
                    {
                        comments: commentList
                    }
            }
        );
    },
    deleteMeetupTask:function(meetup_id, task){
        // console.log("deleting task: " + task + ". Id of meetup is: " + meetup_id);
        let newAgenda = (Meetup.findOne({_id: meetup_id})).agenda;

        let length = newAgenda.length;
        var indexToDelete = -1;
        for(var i = 0; i < length; i++){
            if(newAgenda[i].task === task){
                indexToDelete = i;
            }
        }

        if(indexToDelete !== -1){
            newAgenda.splice(indexToDelete, 1);
        }
        // console.log(newAgenda);
        Meetup.update(meetup_id,
            {$set:
                {
                    agenda: newAgenda
                }
            }
        );
    },
    deleteComment:function(meetup_id, commentObj){
        // console.log('deleting comment');
        var commentsArray = (Meetup.findOne({_id: meetup_id})).comments;
        var index = 0;
        var i = 0;
        commentsArray.forEach(function(comment){
           if (comment.userId === commentObj.userId &&
               comment.comment === commentObj.comment &&
               comment.userName === commentObj.userName &&
               comment.upvote === commentObj.upvote &&
               comment.downvote === commentObj.downvote
                ){
                index = i;
           }
           i++;
        });
        if (index > -1) {
            commentsArray.splice(index, 1);
        }

        Meetup.update(meetup_id,
            {$set:
                    {
                        comments: commentsArray
                    }
            }
        );
    },
    updateTaskIsChecked:function(meetup_id, taskToChange) {
        // console.log("updating checkbox with task: " + taskToChange);
        var tempAgenda = (Meetup.findOne({_id: meetup_id})).agenda;
        tempAgenda.forEach(function(agendaTask) {
           if(agendaTask.task === taskToChange){
               agendaTask.isChecked = !agendaTask.isChecked;
           }
        });


        Meetup.update({_id:meetup_id},
            {$set:
                    {
                        agenda: tempAgenda
                    }
            }
        );
    }
});