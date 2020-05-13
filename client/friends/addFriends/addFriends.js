import { Template } from 'meteor/templating';

Template.addFriends.helpers({
    getAllPeople() {

        Meteor.call('getPeople', function(error, result) {
            let final = [];
            if(result) {
                for(i = 0; i < result.length; i++) {
                    final.push(result[i]);
                }

                Session.set("people", final);
            }
        });

        let foundPeople = Session.get("people");

        return foundPeople;

    }
});