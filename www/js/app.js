// Ionic Parse Todo
angular.module('todo', ['ionic', 'services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('TodoCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, TodoService){

    // Load projects
    $scope.projects = TodoService.projects;
    $scope.tasks = TodoService.tasks;
    $scope.activeProject = null;

    var filterTasks = function(project){
        TodoService.query_tasks(project, function(objs){
            $scope.$apply(function(){
                $scope.tasks.reset(objs);
            });
        });
    };

    $scope.projects.fetch({
        success: function(){
            $scope.$apply(function(){
                $scope.activeProject = $scope.projects.models[0];
                if($scope.activeProject){
                    filterTasks($scope.activeProject);
                }
            });
        }
    });

    // Create modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal){
        $scope.taskModal = modal;
    }, {
        scope: $scope
    });

    // Open new task modal
    $scope.newTask = function(){
        $scope.taskModal.show();
    };

    // Menu open
    $scope.toggleProjects = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };

    // Save new task
    $scope.createTask = function(task){
        if(!task) return;

        var newTask = TodoService.create_task(task.title, $scope.activeProject, function(obj, error){
            $scope.tasks.add(obj);
            $scope.taskModal.hide();
            task.title = '';
        });
    };

    // Delete task
    $scope.deleteTask = function(task){
        task.destroy();
    };

    // Toggle done task
    $scope.toggleDone = function(task){
        if(task.is_done()){
            task.setDone(false);
        }else{
            task.setDone(true);
        }
    };

    // Close modal
    $scope.closeNewTask = function(){
        $scope.taskModal.hide();
    };


    // New project
    $scope.newProject = function(){
        var project = prompt('Project name');
        if(!project) return;

        TodoService.create_project(project, function(obj, error){
            $scope.projects.add(obj);
            $scope.selectProject(obj);
        });
    };

    // Select project
    $scope.selectProject = function(project){
        $scope.activeProject = project;
        filterTasks(project);
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    // Delete project
    $scope.deleteProject = function(project, index){
        project.destroy({
            success: function(obj){
                if($scope.activeProject == project || $scope.projects.length == 0){
                    $scope.$apply(function(){
                        $scope.activeProject = null;
                        filterTasks();
                    });
                }
            }
        });
    };

    $scope.projectTitle = function(){
        if($scope.activeProject){
            return 'Tasks for `'+ $scope.activeProject.the_title() +'`';
        }
    };
});
