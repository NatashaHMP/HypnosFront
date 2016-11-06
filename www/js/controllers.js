angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {

  $scope.getData = function() {
    $http({
      method: 'GET',
      url: "http://c0e36a29-9e47-4cb0-a0c8-a3d62e2d0589:t7YT5rumqujq@hypnosbluehack.mybluemix.net/test/?text=Breathing%20pauses;%20Awakenings%20from%20sleep;%20Morning%20headache",

    }).then(function(data){
      console.log(data);
      return data;
    }, function(response) {
      alert("error", response);
    });
  };

  $scope.getData();

  $scope.isActive = false;
  $scope.stats = 'Start';

  $scope.activeButton = function() {
    $scope.isActive = !$scope.isActive;
    if($scope.stats === 'Start'){
      $scope.stats = 'Stop';
    }
    else {
      $scope.stats = 'Start';
    }
  };

})

.controller('ChatsCtrl', function($scope, Chats) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
