var app = angular.module("myApp",[]);

app.controller("myCtrl", function($scope, $http){
    $scope.valFrom = "0";
    $scope.fromCurrency = "";
    $scope.toCurrency = "";

    $scope.rates = {};

    var getRateForBase = function(fromCurrency){
        if(!fromCurrency || !$scope.rates.rates || !$scope.rates.base){
            return null;
        }

        if($scope.rates.rates[fromCurrency]){
            return 1/$scope.rates.rates[fromCurrency];
        }

        if(fromCurrency === $scope.rates.base){
            return 1;
        }

        return null;
    };

    var getRateFromBase = function(toCurrency){
        if(!toCurrency || !$scope.rates.rates || !$scope.rates.base){
            return null;
        }

        if(toCurrency === $scope.rates.base){
            return 1;
        }

        if($scope.rates.rates[toCurrency]){
            return $scope.rates.rates[toCurrency];
        }

        return null;
    };

    $scope.convert = function(){
        if(isNaN($scope.valFrom)){
            return;
        }

        var parsedFrom = parseFloat($scope.valFrom);

        var returnVal = 0;

        if(!$scope.fromCurrency || $scope.fromCurrency === ""){
            return 0;
        }

        var rateForBase = getRateForBase($scope.fromCurrency);

        if(!rateForBase){
            return 0;
        }

        var baseRateForFrom = rateForBase * parsedFrom;

        if(!$scope.toCurrency || $scope.toCurrency === ""){
            return 0;
        }

        var rateFromBase = getRateFromBase($scope.toCurrency);

        if(!rateFromBase){
            return 0;
        }

        returnVal = baseRateForFrom * rateFromBase;

        return returnVal;
    };

    var onFetchSuccess = function(data){
        console.log("Fetch Successful.." + JSON.stringify(data.data));
        $scope.rates = data.data;

        $scope.toCurrency = $scope.rates.base;
        $scope.fromCurrency = $scope.rates.base;
    };

    var onFetchFail = function(data){
        console.log("Err: " + JSON.stringify(data));
        $scope.rates = {};
        $scope.fromCurrency = "";
        $scope.toCurrency = "";
    };

    var onRegister = function(){
        var url = "http://api.fixer.io/latest";

        var conversionRates = $http.get(url).then(onFetchSuccess, onFetchFail);
    };

    onRegister();
});