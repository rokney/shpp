var app = {};
Backbone.emulateHTTP = true;
app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: 1
    },
    initialize: function () {
        if (!this.get('title')) {
            this.set({"title": this.defaults.title})
        }
    },
    toggle: function () {
        if(this.get('completed') == 0){
            this.set({completed: 1})
        }else{
            this.set({completed: 0});
        }
    },
    sync: function () {
        return false;
    }
});

app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    url: '/tasks',
    //localStorage: new Store("backbone-todo"),
    completed: function () {
        return this.where({completed: 1});
    },
    active: function () {
        return this.where({completed: 0});
    },
    saveToDB: function () {
        var self = this;
        var options = {
            success: function (model, resp, xhr) {
                self.reset(model);
            }
        };
        Backbone.sync('update', this, options);
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
            app.todoList.saveToDB();
        }
    },
    checked: function () {
        this.model.toggle();
        app.todoList.saveToDB();
    },

    destroy: function () {
        this.model.destroy();
        app.todoList.saveToDB();
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
        app.todoList.saveToDB();
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
            completed: 0
        }
    },
    removeCompleted: function () {
        _.invoke(app.todoList.completed(), 'destroy');
        app.todoList.saveToDB();
        return false;
    },
    selectAll: function () {
        var complete = this.allCheckbox.checked ? 1 : 0;
        app.todoList.each(function (task) {
            task.save({'completed': complete});
        });
        app.todoList.saveToDB();
    },
    displayActive: function () {
        this.$('#todo-list').html('');
        app.todoList.each(function (task) {
            if (task.get('completed') == 0) {
                var view = new app.TodoView({model: task});
                $('#todo-list').append(view.render().el);
            }
        });
    },
    displayCompleted: function () {
        this.$('#todo-list').html('');
        app.todoList.each(function (task) {
            if (task.get('completed') == 1) {
                var view = new app.TodoView({model: task});
                $('#todo-list').append(view.render().el);
            }
        });
    }
});

app.appView = new app.AppView();