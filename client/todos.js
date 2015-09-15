var Tasks = new Mongo.Collection("tasks");

Template.body.helpers({
  tasks: function() {
    var tasks = Session.get('hideCompleted') ? { checked: { $ne: true } } : {}
    ;

    return Tasks.find(tasks, { sort: { createdAt: -1 }});
  },

  hideCompleted: function(){
    return Session.get('hideCompleted');
  },

  incompleteCount: function() {
    return Tasks.find({ checked: { $ne: true }}).count();
  }
});

Template.body.events({
  "submit .new-task": function(ev) {
    var text = ev.target.text.value
    ;

    Tasks.insert({
      text: text,
      createdAt: new Date()
    });

    ev.target.text.value = '';
    ev.preventDefault();
  },

  'change .hide-completed input': function(ev) {
    Session.set('hideCompleted', ev.target.checked);
  }
});

Template.task.events({
  'click .toggle-checked': function(ev) {
    Tasks.update(this._id, {
      $set: { checked: !this.checked }
    });
  },

  'click .delete': function() {
    Tasks.remove(this._id);
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});