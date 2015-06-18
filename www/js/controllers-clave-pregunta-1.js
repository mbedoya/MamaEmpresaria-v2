moduloControlador.controller('ClavePregunta1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 1");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.continuar = function() {

        try{

            if(Internet.get()){

                var respuestaValida = false;

                if(respuestaValida){
                    $location.path('/app/bienvenida');
                }else{
                    $scope.mostrarAyuda("Creación de clave", "La campaña ingresada no es correcta, te solicitaremos una nueva información");
                    $location.path('/app/clave-pregunta-2');
                }

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }


    }
});