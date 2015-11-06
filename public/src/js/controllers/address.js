'use strict';

angular.module('insight.address').controller('AddressController',
  function($scope, $rootScope, $routeParams, $location, Global, Address, getSocket) {
    $scope.global = Global;


    var socket = getSocket($scope);

    var _startSocket = function () {
      socket.emit('subscribe', $routeParams.addrStr);
      socket.on($routeParams.addrStr, function(tx) {
        $rootScope.$broadcast('tx', tx);
        var beep = new Audio('/sound/transaction.mp3');
        beep.play();
      });
    };

    socket.on('connect', function() {
      _startSocket();
    });

    $scope.params = $routeParams;


    $scope.findOne = function() {
      $rootScope.currentAddr = $routeParams.addrStr;
      _startSocket();

      Address.get({
          addrStr: $routeParams.addrStr
        },
        function(address) {
          $rootScope.titleDetail = address.addrStr.substring(0, 7) + '...';
          $rootScope.flashMessage = null;
          if (address.addrStr == 'c81P34RRjGEEbweXYAEPJjR1St94Z6am86')
            $scope.flashMessage = 'This is the disappeared old dev development fund address (c81P34RRjGEEbweXYAEPJjR1St94Z6am86) with donated coins. This address has been blocked forever via hardfork, coins (245126.14146 CLICK) cant be moved, spent or staked.';
          else
            $scope.flashMessage = null;
          $scope.address = address;
        },
        function(e) {
          if (e.status === 400) {
            $rootScope.flashMessage = 'Invalid Address: ' + $routeParams.addrStr;
          } else if (e.status === 503) {
            $rootScope.flashMessage = 'Backend Error. ' + e.data;
          } else {
            $rootScope.flashMessage = 'Address Not Found';
          }
          $location.path('/');
        });
    };

  });
