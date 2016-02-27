'use strict';

var appControllers = angular.module('receiptzApp.controllers', ['receiptzApp.services']);

// landing controller
appControllers.controller('LandingController', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {
  $scope.login = function(credentials) {
    UserService.login(credentials).then(function() {
      $state.go('home');
    });
  };
}]);

// register controller
appControllers.controller('RegisterController', ['$scope', 'UserService', 'notify', '$state', function($scope, UserService, notify, $state) {
  $scope.organization = {
    country: {
      name: ''
    }
  };

  $scope.register = function(organization) {
    UserService.registerOrganization(organization).then(function() {
      notify({ message: 'Thank you for your registration, kindly login', position: 'right', classes: 'alert alert-success' });
      $state.go('landing');
    });
  };
}]);

// Home controller
appControllers.controller('HomeController', ['$scope', 'dashboard', function($scope, dashboard) {

  // Massage the data
  dashboard.forEach(function(t) {
    t.dd = new Date(t.createdAt);
    t.month = d3.time.month(t.dd);
    t.year = d3.time.year(t.dd);
    t.week = d3.time.week(t.dd);
  });
  var ndx = crossfilter(dashboard);
  $scope.salesVolumeDim = ndx.dimension(function(t) {
    return t.month;
  });
  $scope.getDateRange = function() {
    return [moment().startOf('month').valueOf(), moment().endOf('month').valueOf()];
  };
  // Group Ticket Volumes
  $scope.salesVolumeGroup = $scope.salesVolumeDim.group().reduceSum(function(t) {
    return 1;
  });
  $scope.volumeScale = d3.time.scale().domain($scope.getDateRange());
}]);

// Sale controller
appControllers.controller('SaleController', ['$scope', 'items', '$uibModal', 'notify', 'ReceiptService', function($scope, items, $uibModal, notify, ReceiptService) {
  $scope.items = JSON.parse(items);
  $scope.total = 0.00;
  $scope.taxPercentage = 12.36;
  $scope.taxes = 0.00;
  $scope.order = [];

  $scope.addToOrder = function(item, quantity) {
    var flag = 0;
    if ($scope.order.length > 0) {
        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {
                item.quantity += quantity;
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            item.quantity = 1;
        }
        if (item.quantity < 2) {
            $scope.order.push(item);
        }
    } else {
        item.quantity = quantity;
        $scope.order.push(item);
    }

    $scope.total = $scope.total + (item.pricePerUnit * quantity);
    $scope.taxes = ($scope.total * $scope.taxPercentage) / 100;
  };

  $scope.sale = function() {
    // get mobile number
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'partials/mobile-no-modal.html',
      controller: 'MobileNoModalController'
    });

    modalInstance.result.then(function(mobileNumber) {
      if(mobileNumber) {
        var entity = {
          mobileNumber: mobileNumber,
          type: 'purchase',
          amount: $scope.total,
          items: $scope.order
        };
        ReceiptService.create(entity).then(function() {
          notify({message: 'Sales receipt added successfully', position: 'right', classes: 'alert alert-success'});
        });
      } else {
        notify({message: 'Mobile no is mandatory', position: 'right', classes: 'alert alert-warning'});
      }
    });
  };
}]);

appControllers.controller('MobileNoModalController', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close($scope.mobileNumber);
  };
}]);

