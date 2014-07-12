angular.module('services', [])

.factory('TodoService', function(){
    var parseAppId = 'jeH6Sld5vOzC6WdngapLJ4u5zWMyW62wmaPvPTBW',
        parseAppKey = 'Idjev7cVQkEFoCHrRrBwv7lSfbnM2QZvjbEdo9Z8';

    Parse.initialize(parseAppId, parseAppKey);

    // Project object and collections
    var Project = Parse.Object.extend('Project', {
        the_title: function(){
            return this.get('title');
        },
        the_ID: function(){
            return this.get('objectId');
        }
    });
    var ProjectList = Parse.Collection.extend({
        model: Project
    });
    var projects = new ProjectList();


    // Tasks object and collections
    var Task = Parse.Object.extend('Task', {
        defaults: {
            done: false
        },
        the_title: function(){
            return this.get('title');
        },
        the_ID: function(){
            return this.get('objectId');
        },
        is_done: function(){
            return this.get('done');
        },
        setDone: function(status){
            this.set({done: status});
            this.save();
        }
    });
    var TaskList = Parse.Collection.extend({
        model: Task
    });
    var tasks = new TaskList();

    return{
        projects: projects,
        create_project: function(title, callback){
            var project = new Project({title: title});
            project.save(null, {
                success: function(obj){
                    callback(obj, null);
                },
                error: function(obj, eror){
                    callback(obj, error);
                }
            });
        },
        tasks: tasks,
        create_task: function(title, project, callback){
            var task = new Task({title: title});
            task.set('project', project);
            task.save(null, {
                success: function(obj){
                    callback(obj, null);
                },
                error: function(obj, eror){
                    callback(obj, error);
                }
            });
        },
        query_tasks: function(project, callback){
            var query = new Parse.Query(Task);
            query.equalTo('project', project);
            query.find({
                success: function(tasks) {
                    callback(tasks);
                }
            });
        }
    }
});