moduloControlador.controller('TerminosCondicionesCtrl', function($scope, $rootScope, $state, $location, $ionicLoading, $http, $filter, GA, Mama, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Terminos y condiciones");

    $scope.continuar = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Aceptando términos y condiciones')
        });

        Mama.registrarHabeasData(function (success, data){

            $ionicLoading.hide();

            if(success){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Iniciando sesión')
                });

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();

                    if(success){
                        $location.path('/app/bienvenida');

                    }else{
                        $scope.mostrarAyuda("Creación de clave", mensajeError);
                    }

                });

                $location.path('/app/bienvenida');
            }else{

            }
        });

    };

    $scope.inicializar = function(){

        $scope.texto = $rootScope.datos.mensajeHabeasData;

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