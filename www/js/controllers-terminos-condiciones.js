moduloControlador.controller('TerminosCondicionesCtrl', function($scope, $rootScope, $state, $location, $ionicHistory, $ionicLoading, $http, $filter, GA, Mama, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Terminos y condiciones");

    $scope.modelo = { seleccionado : false};

    $scope.continuar = function(){    

        var mensaje = 'Aceptando términos y condiciones';
        if(!$rootScope.versionProduccion){
            mensaje = mensaje + " " + $rootScope.datos.versionHabeasData; 
        }
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera(mensaje)
        });

        Mama.registrarHabeasData(function (success, data){

            $ionicLoading.hide();

            console.log(data);

            if(success){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Iniciando sesión')
                });

                Mama.getInformacionBasica(function(success, mensajeError){

                    $ionicLoading.hide();

                    if(success){

                        //Almacenar datos si hay almacenamiento local
                        if(localStorage){

                            localStorage.cedula = $rootScope.datos.cedula;
                            localStorage.nombre = $rootScope.datos.nombre;
                            localStorage.segmento = $rootScope.datos.segmento;
                            localStorage.clave = $rootScope.datos.clave;
                        }

                        if($rootScope.irAHomeLuegoTerminos){
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $location.path('/app/menu/tabs/home');
                        }else{
                            $location.path('/app/bienvenida');
                        }

                    }else{
                        $scope.mostrarAyuda("Creación de clave", mensajeError);
                    }

                });
            }else{

                $scope.mostrarAyuda("", "Se ha presentado un error registrando términos y condiciones");
                if(!$rootScope.versionProduccion){
                    $scope.mostrarAyuda("", data.razonRechazo);
                }

            }
        });

    };

    $scope.inicializar = function(){

        $("#txtTexto").focus();

        //Solución a problema de ingreso al TextArea desde iOS
        $("#txtTexto").click(function(){
            $(this).focus();
        });

        if($rootScope.datos){
            $("#txtTexto").val($rootScope.datos.mensajeHabeasData);
        }
        $scope.modelo.seleccionado = false;

        console.log('Habeas data ' + $rootScope.datos.versionHabeasData);
    };

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });

});