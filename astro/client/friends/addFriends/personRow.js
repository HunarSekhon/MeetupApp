import { Template } from 'meteor/templating';


Template.personRow.events({
   'click #person-follow-btn': function(event) {
       event.preventDefault();

       const userToFollow = $(event.target).data('value');

       Meteor.call('addFollow', userToFollow, function(error) {
           if(!error) {
               sAlert.info("User followed",
                   {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
           }
       });




   }
});

Template.personRow.helpers({
    getAvatarStr(user) {
        let res;

        Meteor.call('getAvatar', user._id, function(error, result) {
            if(!error) {
                res = result;
                Session.set(`PP${user._id}`, res);
            }
        });

        res = Session.get(`PP${user._id}`);

        return res;
    }
});