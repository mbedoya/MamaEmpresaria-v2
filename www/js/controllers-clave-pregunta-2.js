moduloControlador.controller('ClavePregunta2Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 2");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.continuar = function() {

        try{

            if(Internet.get()){

                var respuestaValida = true;

                if(respuestaValida){
                    $location.path('/app/clave-nueva-clave-1');
                }else{
                    $scope.mostrarAyuda("Creación de clave", "No hemos pedido validar correctamente tu información, uno de nuestros asesores te estará contactando en XXX");
                }

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }


    }
});