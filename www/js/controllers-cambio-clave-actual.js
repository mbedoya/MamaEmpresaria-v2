moduloControlador.controller('CambioClaveActualCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Cambio Clave - Ingreso Clave Actual");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.limpiar = function(){
        $scope.modelo = { clave: ''};
    }

    //Autenticar a la Mamá Empresaria
    $scope.continuar = function() {

        //Clave vacía
        if(!$scope.modelo.clave && String($scope.modelo.clave).length == 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(String($scope.modelo.clave).length != 4){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(String($scope.modelo.clave).indexOf(".") >= 0 || String($scope.modelo.clave).indexOf(",") >= 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
            return;
        }

        try{

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Validando clave')
                });

                $rootScope.datos.clave = $scope.modelo.clave;

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();

                    if(success){

                        $location.path('/app/cambio-clave-nueva');

                    }else{

                        if(data.mostrarSolicitudAyuda || data.enviarSolicitudAsesor){
                            $scope.mostrarAyuda("Ingreso de clave", "Identificamos que no puedes recordar tu clave, responde la siguiente pregunta para recuperarla");
                            $rootScope.recuperarClave = true;
                            $location.path('/app/clave-pregunta-1');

                        }else{
                            $scope.mostrarAyuda("Ingreso de clave", mensajeError);
                        }
                    }

                });

            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }

    }

    $scope.inicializar = function(){
        $scope.limpiar();
    }

    $scope.inicializar();
});
