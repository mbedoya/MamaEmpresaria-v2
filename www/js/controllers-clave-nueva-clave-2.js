moduloControlador.controller('ClaveNuevaClave2Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Verificacion Nueva Clave");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    //Autenticar a la Mamá Empresaria
    $scope.continuar = function() {

        /*

        //Cédula vacía
        if(!$scope.clave){
            $scope.mostrarAyuda("Creación de clave","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(String($scope.clave).length != 4){
            $scope.mostrarAyuda("Creación de clave","Ingresa 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(String($scope.clave).indexOf(".") >= 0 || String($scope.clave).indexOf(",") >= 0){
            $scope.mostrarAyuda("Creación de clave","Ingresa sólo números");
            return;
        }

        */

        try{

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Estableciendo clave')
                });

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();

                    if(success){
                        $scope.mostrarAyuda("Creación de clave", "Tu clave para ingresar a la Aplicación es 1234, puedes cambiarla en el momento en que lo desees");
                        $location.path('/app/bienvenida');

                    }else{
                        $scope.mostrarAyuda("Creación de clave", mensajeError);
                    }

                });

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }


    }
});