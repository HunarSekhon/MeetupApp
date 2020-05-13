import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import {Stats} from "../../lib/collection";



Template.main_layout.helpers({

    'getStarPoints':function () {
        return Stats.findOne({userId:Meteor.userId()}).starPoints;
    }

});


Template.main_layout.events({

    'click .logout-link':function(event){
        event.preventDefault();

        Meteor.logout(function(err){
            if(err){
                console.log(err.reason);
                sAlert.error(err.reason,
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            } else {

                sAlert.info("Successfully logged out",
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
                Router.go("/");
            }
        })
    }

});
