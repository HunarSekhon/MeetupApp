
// Tracker.autorun(function(){
//     if(Meteor.userId()){
//         Router.go("/");
//     }
// });


Template.login.events({

    'submit .login-form':function (event) {

        event.preventDefault();
      // event.preventDefault();
       var email = event.target.email.value;
       var password = event.target.password.value;

        Meteor.loginWithPassword(email,password, function(err){
            if(err) {

                console.log(err.reason);
                sAlert.error(err.reason,
                    {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
            } else{
                $('#login').modal('hide');
                Router.go('/index_meetup');
            }
        });

    }


});


Template.signup.events({

   'submit .login-signup':function (event) {

       event.preventDefault();

       var userName = event.target.username.value;
       var email = event.target.email.value;
       var password1 = event.target.password1.value;
       var password2 = event.target.password2.value;
       var alias = event.target.alias.value;

       if(password1 !== password2){
           sAlert.error("Passwords do not match",
               {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
           return false;
       }

       var newUser = {
           username:userName,
           email:email,
           password:password1,
           profile:{
               alias:alias,
               starpoints:0,
               level:1,
               friends: [],
           }
       };


       Meteor.call('signupUser',newUser);
       sAlert.info("New user created",
           {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});


       Meteor.loginWithPassword(email,password1, function(err){
           if(err) {
               console.log(err.reason);
               sAlert.error(err.reason,
                   {effect: 'flip', position: 'bottom', timeout: 4000, onRouteClose: false, stack: false});
           } else{

               var userStats = {

                   userId: Meteor.userId(),
                   username:userName,
                   email:email,
                   starPoints: 20,
                   level: 1,
                   xp:0,
                   multiplier: 1,
                   maxXp: 1000,
                   boosterActive: false
               };

               Meteor.call('newStat', userStats);
               Router.go("/index_meetup");
           }
       });

       Router.go("/index_meetup");


   }

});