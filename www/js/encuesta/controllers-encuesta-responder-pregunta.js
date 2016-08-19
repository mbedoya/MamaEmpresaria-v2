moduloControlador.controller('EncuestaPedidoResponderPreguntaCtrl', function ($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $filter, $ionicHistory, $ionicScrollDelegate, Mama, Internet, GA, Encuesta, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido Responder Pregunta");

    $scope.mostrarAyuda = function (titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.obtenerRutaRedireccion = function () {
        if($location.path() == '/app/menu/tabs/mas/encuestapedidoresponder2'){
            return '/app/menu/tabs/mas/encuestapedidoresponder';
        }else{
            return '/app/menu/tabs/mas/encuestapedidoresponder2'
        }
    }

    $scope.irAtras = function () {
        if ($scope.obtenerIndicePregunta() > 0) {
            $rootScope.indicePregunta = $rootScope.indicePregunta - 1;

            $location.path($scope.obtenerRutaRedireccion());
        }
    }

    $scope.mostrarAtras = function () {
        return $rootScope.indicePregunta > 0;
    }

    $scope.actualizarValoresRespuestas = function () {

        //Respuesta Abierta
        $scope.respuestaTexto = { valor: '' };
        //Respuesta Multiple Cerrada
        $scope.respuestaMultipleCerrada = { valor: null };
        //Respuesta Multiple Varias Selecciones
        $scope.respuestaMultipleMultiple = { valor: new Array() };

        console.log("actualizando valores");
        console.log($scope.preguntaContestada());

        if ($scope.EsPreguntaCerradaSimple() && $scope.preguntaContestada()) {
            console.log("cerrada simple " + $scope.preguntaContestada()[0]);
            $scope.respuestaMultipleCerrada.valor = $scope.preguntaContestada()[0];
            
        } else {

            if ($scope.EsPreguntaAbierta() && $scope.preguntaContestada()) {
                $scope.respuestaTexto = { valor: $scope.preguntaContestada()[0] };
            } else {

                if ($scope.EsPreguntaCerradaMultiple()) {
                    for (var index = 0; index < $scope.obtenerPregunta().posiblesRespuestas.length; index++) {
                        var element = $scope.obtenerPregunta().posiblesRespuestas[index];

                        var respTemp = $scope.preguntaContestada();
                        if (respTemp) {
                            var found = false;
                            for (var i = 0; i < respTemp.length; i++) {
                                var e = respTemp[i];
                                if (e == element.posibleRespuesta) {
                                    found = true;
                                    $scope.respuestaMultipleMultiple.valor.push(true);
                                    break;
                                }
                            }
                            if (!found) {
                                $scope.respuestaMultipleMultiple.valor.push(false);
                            }
                        } else {
                            $scope.respuestaMultipleMultiple.valor.push(false);
                        }
                    }

                    console.log($scope.respuestaMultipleMultiple);
                }

            }

        }

        setTimeout(function() {
            console.log("timeout");
            $scope.$apply();
        }, 2000);
    }

    $scope.continuar = function () {

        //Validación de ingreso de respuesta cerrada única
        if (!$scope.preguntaContestada() && $scope.EsPreguntaCerradaSimple()) {
            $scope.mostrarAyuda("", "Debes seleccionar una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if (!$scope.preguntaContestada() && $scope.EsPreguntaCerradaMultiple()) {
            $scope.mostrarAyuda("", "Debes seleccionar mínimo una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if (!$scope.preguntaContestada() && $scope.EsPreguntaAbierta()) {
            $scope.mostrarAyuda("", "Por favor contesta la pregunta");
            return;
        }

        if ($rootScope.indicePregunta + 1 < $rootScope.preguntasEncuesta.length) {

            $rootScope.indicePregunta = $rootScope.indicePregunta + 1;
            $ionicScrollDelegate.scrollTop();

            //Recargar la vista
            $location.path($scope.obtenerRutaRedireccion());

        } else {

            $scope.loading = $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Enviando las respuestas de la Encuesta')
            });

            var objetoRespuesta = {
                preguntas: $rootScope.respuestasEncuesta
            };

            Encuesta.enviarRespuestasEncuesta(objetoRespuesta, function (success, data) {

                $ionicLoading.hide();

                if (success) {
                    console.log("Encuesta enviada: ");
                    console.log(data);
                } else {
                    console.log("Error al enviar encuesta");
                }

                $scope.mostrarAyuda("Inicio de sesión", "Encuesta finalizada! Muchas gracias por tu participación");
                $location.path('/app/menu/tabs/home');

            });

        }
    };

    $scope.contestarPregunta = function (indice) {
        $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas = new Array();
        $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas.push($scope.respuestaMultipleCerrada.valor);

        console.log("Pregunta contestada");
        console.log($rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas);
    }

    $scope.contestarPreguntaAbierta = function () {
        $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas = new Array();
        $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas.push($scope.respuestaTexto.valor);
    }

    $scope.contestarPreguntaMultiple = function (indice) {

        if (!$scope.preguntaContestada()) {
            $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas = new Array();
        }

        var encontrado = false;
        var indiceEncontrado;
        //Buscar si no hay sido contestada, si ya lo ha sido entonces eliminarla, de lo contrario adicionarla
        for (var index = 0; index < $scope.preguntaContestada().length; index++) {
            var element = $scope.preguntaContestada()[index];

            if (element == $scope.obtenerPregunta().posiblesRespuestas[indice].posibleRespuesta) {
                encontrado = true;
                indiceEncontrado = index;
                break;
            }
        }

        if (encontrado) {
            $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas.splice(indiceEncontrado, 1);
            $scope.respuestaMultipleMultiple.valor[indice] = false;
        } else {
            $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas.push($scope.obtenerPregunta().posiblesRespuestas[indice].posibleRespuesta);
            $scope.respuestaMultipleMultiple.valor[indice] = true;
        }
    }

    $scope.preguntaContestada = function () {
        return $rootScope.respuestasEncuesta[$rootScope.indicePregunta].respuestas;
    }

    $scope.objetoRespuesta = function () {
        $rootScope.respuestasEncuesta[$rootScope.indicePregunta];
    }

    $scope.obtenerPregunta = function () {
        return $scope.pregunta;
    }

    $scope.EsPreguntaCerradaMultiple = function () {
        return $scope.cerradaMultiple;
    }

    $scope.EsPreguntaCerradaSimple = function () {
        return $scope.cerradaSimple;
    }

    $scope.EsPreguntaAbierta = function () {
        return $scope.abierta;
    }

    $scope.obtenerIndicePregunta = function () {
        return $rootScope.indicePregunta;
    }

    $scope.inicializar = function () {

        //Establecer todos los valores para la pregunta a responder
        $scope.pregunta = $rootScope.preguntasEncuesta[$rootScope.indicePregunta];

        console.log($scope.pregunta);

        $scope.cerradaMultiple = false;
        $scope.cerradaSimple = false;
        $scope.abierta = false;

        //Respuesta Cerrada con Múltiples Opciones? (Checkbox)
        if ($scope.pregunta.respuestaMultiple &&
            $scope.pregunta.posiblesRespuestas && $scope.pregunta.posiblesRespuestas.length > 0) {
            $scope.cerradaMultiple = true;
        } else {
            if (!$scope.pregunta.respuestaMultiple &&
                $scope.pregunta.posiblesRespuestas && $scope.pregunta.posiblesRespuestas.length > 0) {
                $scope.cerradaSimple = true;
            } else {
                if (!$scope.pregunta.respuestaMultiple &&
                    (!$scope.pregunta.posiblesRespuestas || $scope.pregunta.posiblesRespuestas.length == 0)) {
                    $scope.abierta = true;
                }
            }
        }

        $scope.actualizarValoresRespuestas();
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.inicializar();
    });

});