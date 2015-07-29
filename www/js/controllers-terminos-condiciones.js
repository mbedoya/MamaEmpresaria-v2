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

                Mama.getInformacionBasica(function(success, mensajeError){

                    $ionicLoading.hide();

                    if(success){

                        if($rootScope.irAHomeLuegoTerminos){
                            $location.path('/app/menu/tabs/home');
                        }else{
                            $location.path('/app/bienvenida');
                        }

                    }else{
                        $scope.mostrarAyuda("Creación de clave", mensajeError);
                    }

                });
            }else{

            }
        });

    };

    $scope.inicializar = function(){
        if($rootScope.datos){
            $("#txtTexto").val($rootScope.datos.mensajeHabeasData);
        }
    };

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });
    
    $scope.inicializar();

});