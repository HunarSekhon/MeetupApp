
import {Meetup} from "../lib/collection";

Meteor.startup(() => {

    Meteor.setInterval(checkMeetupTime, 10000);

});


var checkMeetupTime = function () {
    //
    // var str = new Date().toLocaleString();
    // var d = Date.parse(str);
    // console.log(d);

    Meetup.find().forEach(function (document) {

        // Meetup.update(document._id,document);
        var docDate = document.dateTime;
        if(Date.parse(new Date().toLocaleString()) >= Date.parse(docDate)){

            document.inProgress = true;
        }

        Meetup.update(document._id, document);
        // if(Date.parse(str) <= Date.parse(new Date().toLocaleString())) console.log("Ive hit the date");
    });

};