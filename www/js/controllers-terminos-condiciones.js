moduloControlador.controller('TerminosCondicionesCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Terminos y condiciones");

    $scope.inicializar = function(){

        /*
        Pedido.getAgotadosAnterior($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.agotadosAnterior = data;
            }else{

            }
        });
        */
    }

    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });

});