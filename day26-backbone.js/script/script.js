var app = {};
app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    initialize: function () {
        if (!this.get('title')) {
            this.set({"title": this.defaults.title})
        }
    },
    toggle: function () {
        this.save({
            completed: !this.get('completed')
        });
    }
});

app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo"),
    completed: function () {
        return this.where({completed: true})
    },
    active: function () {
        return this.where({completed: false})
    }
});

app.todoList = new app.TodoList();

app.TodoView = Backbone.View.extend({
    tagname: 'li',
    template: _.template($('#task-template').html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this;
    },

    initialize: function () {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },

    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'changeTask',
        'blur .edit': 'close',
        'click .checkbox': 'checked',
        'click .destroy': 'destroy'
    },

    edit: function () {
        this.$el.addClass('editing');
        this.input.select();
        this.input.focus();
    },

    close: function () {
        var value = this.input.val().trim();
        if (value) {
            this.model.save({title: value});
        }
        this.$el.removeClass('editing');
    },

    changeTask: function (e) {
        if (e.which == 13) {
            this.close();
        }
    },
    checked: function () {
        this.model.toggle();
    },

    destroy: function () {
        this.model.destroy();
    }
});


app.AppView = Backbone.View.extend({
    el: '#main-app',
    initialize: function () {
        this.input = this.$('#new-task');
        this.allCheckbox = this.$('#select-all')[0];

        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.on('all', this.render, this);
        app.todoList.fetch();
    },
    events: {
        'keypress #new-task': 'createNewTask',
        'click #select-all': 'selectAll',
        'click #remove-completed': 'removeCompleted',
        'click #display-all': 'addAll',
        'click #display-active': 'displayActive',
        'click #display-completed': 'displayCompleted'
    },
    render: function () {
        this.allCheckbox.checked = !app.todoList.active().length;
    },
    createNewTask: function (e) {
        if (e.which !== 13 || !this.input.val().trim()) {
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val('');
    },
    addOne: function (task) {
        var view = new app.TodoView({model: task});
        $('#todo-list').append(view.render().el);
    },
    addAll: function () {
        this.$('#todo-list').html('');
        app.todoList.each(this.addOne, this);
    },
    newAttributes: function () {
        return {
            title: this.input.val().trim(),
            completed: false
        }
    },
    removeCompleted: function () {
        _.invoke(app.todoList.completed(), 'destroy');
        return false;
    },
    selectAll: function () {
        var complete = this.allCheckbox.checked;
        app.todoList.each(function (task) {
            task.save({'completed': complete});
        });
    },
    displayActive: function () {
        this.$('#todo-list').html('');
        app.todoList.each(function (task) {
            if (task.get('completed') === false) {
                var view = new app.TodoView({model: task});
                $('#todo-list').append(view.render().el);
            }
        });
    },
    displayCompleted: function () {
        this.$('#todo-list').html('');
        app.todoList.each(function (task) {
            if (task.get('completed') === true) {
                var view = new app.TodoView({model: task});
                $('#todo-list').append(view.render().el);
            }
        });
    }
});

app.appView = new app.AppView();