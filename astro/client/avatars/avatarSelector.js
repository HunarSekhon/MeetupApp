import { Template } from 'meteor/templating';

Template.avatarSelector.events({
    'click #select': function(event) {
        event.preventDefault();

        const avatarSelected = $(event.target).data('value');

        Meteor.call('updateAvatar', avatarSelected, function(error) {
            if(!error) {
                sAlert.info("Avatar Updated!",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            }
        });
    },

    'click #buyAvatar': function(event) {
        event.preventDefault();

        const avatarSelected = $(event.target).data('value');

        Meteor.call('buyAvatar', avatarSelected, function(error, res) {
            if(!error && res !== -1) {
                sAlert.info("Avatar Bought!",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});

                $(event.target).text("Use this avatar");
                $(event.target).prop("id", "select");
            } else {
                sAlert.error("Not enough Star points to buy this avatar!",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            }
        });
    }
});

Template.avatarSelector.helpers({
    getAllAvatars() {
        return ["av1.jpg","av2.jpg","av3.jpg","av4.jpg","av5.jpg","av6.jpg","av7.jpg","av8.jpg"]
    },

    plusOne(index) {
        return index + 1;
    },

    userHasAvatar(avatar) {

        Meteor.call('userOwnsAvatar', avatar, function(error, res) {
            Session.set(`bought${avatar}`, res);
        });

        return Session.get(`bought${avatar}`);
    },

    makeNewRow(index) {
        return (index % 2) === 0;
    },

    tableRowStart() {
        return "<tr>";
    },

    tableRowEnd() {
        return "</tr>";
    }
});
