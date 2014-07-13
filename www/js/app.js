// Ionic Parse Todo
angular.module('todo', ['ionic', 'ui.router', 'ngCordova', 'services'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/netstatus');

    $stateProvider
    .state('netstatus', {
        url: '/netstatus',
        templateUrl: 'page.netstatus.html',
        controller: 'NetStatusCtrl'
    })
    .state('todo', {
        url: '/todo',
        templateUrl: 'page.todo.html',
        controller: 'TodoCtrl'
    });
}])

.controller('NetStatusCtrl', ['$scope', '$cordovaNetwork', '$state', '$ionicLoading', function($scope, $cordovaNetwork, $state, $ionicLoading){
    $scope.online = true;

    $scope.checkConnection = function(){
        $ionicLoading.show({
            template: 'Checking for internet connection...'
        });

        setTimeout(function(){
            $scope.online = $cordovaNetwork.isOnline();
            $ionicLoading.hide();

            if($scope.online){
                $state.go('todo');
            }
        }, 1000);
    };

    $scope.checkConnection();
}])

.controller('TodoCtrl', ['$scope', '$ionicModal', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaNetwork', 'TodoService',
        function($scope, $ionicModal, $ionicSideMenuDelegate, $ionicPopup, $cordovaNetwork, TodoService){

    $scope.projects = TodoService.projects;
    $scope.tasks = TodoService.tasks;
    $scope.activeProject = null;
    $scope.loading = true;

    $ionicModal.fromTemplateUrl('modal.newtask.html', function(modal){
        $scope.taskModal = modal;
    }, {
        scope: $scope
    });

    var setLoading = function(status){
        $scope.loading = status;
    };

    var filterTasks = function(project){
        setLoading(true);

        TodoService.query_tasks(project, function(objs){
            setLoading(false);

            $scope.$apply(function(){
                $scope.tasks.reset(objs);
            });
        });
    };

    $scope.projects.fetch({
        success: function(){
            $scope.$apply(function(){
                setLoading(false);

                $scope.activeProject = $scope.projects.models[0];
                if($scope.activeProject){
                    filterTasks($scope.activeProject);
                }
            });
        },
        error: function(){
            setLoading(false);
        }
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
}]);
