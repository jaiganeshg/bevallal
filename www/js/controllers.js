angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $http, ChatLog, $ionicPopup, $state, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  /*Chats.all($http).success(function(chats) {            
            $scope.chats = chats;
        })
        .error(function() {
            console.log('chats retrieval failed.');
        });*/
 /* $scope.remove = function(chat) {
    Chats.remove(chat);
};*/
//console.log(a);

  var chats = ChatLog.getAvailableSurplusFood($http).success(function(chats) {            
            $scope.chats = chats;
        })
        .error(function() {
            console.log('chats retrieval failed.');
        });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, ChatLog, $http, $state, $ionicPopup) {
  console.log("I am here");
  console.log($stateParams);
  
  var chats = ChatLog.getSponsorDetails($http, $stateParams.chatId).success(function(chat) {            
            $scope.chat = chat;
        })
        .error(function() {
            console.log('chat retrieval failed.');
        });

  //$scope.chat = Chats.get($stateParams.chatId);

    $scope.getFood = function() {
        var data = {
            offerer_phone: $scope.chat.phone,
            id: $scope.chat._id,
            receiver_phone: localStorage.getItem("mobilenumber"),
        };
             ChatLog.getFood($http, data);
            var alertPopup = $ionicPopup.alert({
                title: 'Thanks for Asking',
                template: 'Please collect your food before it gets spoiled!'
            });
            $state.go('tab.dash');
    }
})

.controller('LoginCtrl', function($scope, $http, LoginService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($http, $scope.data.mobilenumber).success(function(data) {
            $scope.mobilenumber = $scope.data.mobilenumber;
            console.log("logggggggggggggggggg");
            console.log(data);
            localStorage.setItem("mobilenumber", $scope.mobilenumber);
            localStorage.setItem("type", data.type);
            if (data.type=='partyhall') {
                $scope.partyhall = true;
            }
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('DashCtrl', function($scope, $http, DonateService, $ionicPopup, $state) {
    $scope.data = {};

    var type = localStorage.getItem("type");
    console.log(type);
    if (type == 'partyhall') {
        $scope.data.partyhall = true;
        $scope.data.donateFood = false;
        $scope.data.donateDiv = true;
        console.log("heree");
    }
    else {
        $scope.data.donateFood = true;
        $scope.data.donateDiv = true;
        $scope.data.receiver = true;
    }
    console.log("heree123");

    $scope.donateFood = function() {      
      $scope.data.donateFood = false;
      $scope.data.donateDiv = true;
      $scope.mobilenumber = localStorage.getItem("mobilenumber");
      var $data = {
        offerer_phone: $scope.mobilenumber,
        count: $scope.data.count,
      };
      DonateService.DonateFood($http, $data).success(function(data) {
            //$scope.mobilenumber = $scope.data.mobilenumber;
            console.log("Donate successfull");
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Donation failed!',
                template: 'Please try again!'
            });
        });

      var alertPopup = $ionicPopup.alert({
                title: 'Thanks for donating!',
                template: 'Your donation makes million people happy!'
            });
    }

    $scope.donateOptionOpen = function() {
      console.log("Donate option open");
      $scope.data.donateFood = true;
      $scope.data.donateDiv = false;
    }
})

.controller('SignupCtrl', function($scope, $http, SignupService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.signup = function() {
        SignupService.SingupUser($http, $scope.data).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Sign up failed!',
                template: 'Please try again!'
            });
        });
    }
    
})

.controller('AccountCtrl', function($scope, $http, AccoutService, $ionicPopup, $state) {

  AccoutService.getHistory($http, localStorage.getItem("mobilenumber")).success(function(hisotry) {            
            $scope.userhistory = hisotry;
            console.log("Getprevious hisotry");
            console.log(hisotry);
        })
        .error(function() {
            console.log('chat retrieval failed.');
        });

});
