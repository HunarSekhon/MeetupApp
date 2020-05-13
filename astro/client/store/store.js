import {Stats} from "../../lib/collection";

Meteor.subscribe('stats');

Template.boosters.helpers({

    'getIsActive':function(){

        return Stats.findOne({userId:Meteor.userId()}).boosterActive;

    }

});


Template.boosters.events({

  'click #buyBooster':function(event){

      if(Stats.findOne({userId:Meteor.userId()}).starPoints < 35 ){
          sAlert.error("Not enough starpoints",
              {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
          return;
      } else{
        Meteor.call('setBooster', Meteor.userId());
      }

  }

});


