moduloControlador.controller('EncuestaPedidoCtrl', function ($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $filter, $ionicHistory, $ionicScrollDelegate, Mama, Internet, GA, Encuesta, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido");

    $scope.mostrarAyuda = function (titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.volverAtras = function(){
        $location.path('/app/menu/tabs/home');
    }

    $scope.crearVectorRespuestas = function () {

        for (var index = 0; index < $rootScope.preguntasEncuesta.length; index++) {
            var element = $rootScope.preguntasEncuesta[index];

            //Crear el objeto de respuesta completo
            $rootScope.respuestasEncuesta.push({ pregunta: element.pregunta, respuestas: null });
        }
    }

    $scope.inicializar = function () {

        $rootScope.respuestasEncuesta = new Array();
        $rootScope.indicePregunta = 0;

        if (Internet.get()) {

            $scope.loading = $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Consultando la Encuesta')
            });

            Encuesta.obtenerPreguntasEncuesta(function (success, data) {

                $ionicLoading.hide();

                if (success) {
                    $rootScope.preguntasEncuesta = data.preguntas;
                    $scope.crearVectorRespuestas();

                    $location.path('/app/menu/tabs/mas/encuestapedidoresponder');
                    $location.replace();

                } else {
                    $location.path('/app/menu/tabs/home');
                    $scope.mostrarAyuda("Inicio de sesión", "No es posible cargar la Encuesta");
                }
            });
        } else {
            $scope.mostrarAyuda("Inicio de sesión", "Por favor verifica tu conexión a internet, no ha sido posible enviar la solicitud de contacto");
        }
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.inicializar();
    });

});