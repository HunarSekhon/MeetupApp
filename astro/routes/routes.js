Router.configure({
    layoutTemplate: 'main_layout',
    notFoundTemplate: 'noroute',
});

Router.map(function(){

    //home
    this.route('root', {
        path: '/',
        template: 'home'
    });

    //home
    this.route('home', {
        path: '/home',
        template: 'home'
    });

    this.route('friends', {
        path: '/friends',
        template: 'friends',
    });

    this.route('mailbox', {
       path: '/mailbox',
       template: 'mailBox'
    });

    this.route('addFriends', {
        path: '/addFriends',
        template: 'addFriends',
    });

    this.route('leaderboard', {
        path: '/leaderboard',
        template: 'leaderboard',
    });

    //create meetup
    this.route('createMeetup', {
        path: '/create_meetup',
        template: 'createMeetup'
    });

    //view all meetups
    this.route('indexMeetup', {
        path: '/index_meetup',
        template: 'indexMeetup'
    });

    //view my Meet ups
    this.route('myMeetups,', {
        path: '/my_meetups',
        template: 'myMeetups'
    });

    //show one meetup
    this.route('showMeetup', {
        path: '/show_meetup',
        template: 'showMeetup'
    });

    //edit meetup
    this.route('editMeetup', {
        path: '/edit_meetup',
        template: 'editMeetup'
    });
    //messages
    this.route('messages', {
        path: '/messages',
        template: 'messages'
    });

    //message detail
    this.route('messageDetail', {
        path: '/messages/:_id',
        template: 'messageDetail'
    });

    this.route('avatars', {
        path: '/avatars',
        template: 'avatarSelector',
    });
    this.route('store', {
        path:'/store',
        template: 'store'
    })
});
