moduloControlador.controller('TerminosCondicionesCtrl', function($scope, $rootScope, $state, $location, $ionicLoading, GA, Mama) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Terminos y condiciones");

    $scope.continuar = function(){
        Mama.registrarHabeasData(function (success, data){
            if(success){
                $location.path('/app/bienvenida');
            }else{

            }
        });

    };

    $scope.inicializar = function(){

        $scope.texto = $rootScope.datos.mensajeHabeasData;

        /*
        TerminosCondiciones.getTerminosCondiciones(function (success, data){
            if(success){
                console.log(data);
                $scope.texto = data.texto;
            }else{

            }
        });
        */
    };

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