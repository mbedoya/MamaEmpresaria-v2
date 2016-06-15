moduloControlador.controller('EncuestaPedidoCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Pedido) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.continuar = function() {
        if($scope.indice + 1 < $scope.preguntas.length){
            $scope.indice++;
        }else{
            $scope.mostrarAyuda("Inicio de sesión","Encuesta finalizada! Muchas gracias por tu participación");
            $location.path('/app/menu/tabs/home');
        }
    };

    $scope.obtenerPregunta = function(){
        if($scope.indice == -1){
            return null;
        }

        return $scope.preguntas[$scope.indice];
    }

    $scope.EsPreguntaCerradaMultiple = function(){
        return $scope.preguntas && $scope.preguntas.length > 0 &&
            $scope.preguntas[$scope.indice].tipo.toLowerCase() == "cerrada" &&
            $scope.preguntas[$scope.indice].multiple.toLowerCase() == "si";
    }

    $scope.EsPreguntaCerradaSimple = function(){
        return $scope.preguntas && $scope.preguntas.length > 0 &&
            $scope.preguntas[$scope.indice].tipo.toLowerCase() == "cerrada" &&
            $scope.preguntas[$scope.indice].multiple.toLowerCase() == "no";
    }

    $scope.EsPreguntaAbierta = function(){
        return $scope.preguntas && $scope.preguntas.length > 0 &&
            $scope.preguntas[$scope.indice].tipo.toLowerCase() == "abierta";
    }

    $scope.inicializar = function() {

        $scope.indice = -1;

        if(Internet.get()){
            Pedido.obtenerPreguntasEncuesta(function(success, data) {
                if (success) {
                    $scope.preguntas = data;
                    $scope.indice = 0;
                    console.log($scope.preguntas);
                }else{
                    $location.path('/app/menu/tabs/home');
                    $scope.mostrarAyuda("Inicio de sesión","No es posible cargar la Encuesta");
                }
            });
        }else{
            $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet, no ha sido posible enviar la solicitud de contacto");
        }
    }

    $scope.inicializar();
});
