
import './friendRow.html';
Template.friendRow.events({
    'click #person-unfollow-btn': function(event) {
        event.preventDefault();

        const userToUnFollow = $(event.target).data('value');

        Meteor.call('removeFollow', userToUnFollow, function(error) {
            if(!error) {
                sAlert.info("User un-followed",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            }
        });
    }
});

Template.friendRow.helpers({
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