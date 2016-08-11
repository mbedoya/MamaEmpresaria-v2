moduloControlador.controller('EncuestaPedidoCtrl', function ($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $filter, $ionicHistory, $ionicScrollDelegate, Mama, Internet, GA, Encuesta, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido");

    $scope.mostrarAyuda = function (titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.irAtras = function () {
        if ($scope.indice > 0) {
            $scope.indice = $scope.indice - 1;

            $scope.actualizarValoresRespuestas();
        }
    }

    $scope.mostrarAtras = function () {
        return $scope.indice > 0;
    }

    $scope.actualizarValoresRespuestas = function () {

        //Respuesta Abierta
        $scope.respuestaTexto = { valor: '' };
        //Respuesta Multiple Cerrada
        $scope.respuestaMultipleCerrada = { valor: null };
        //Respuesta Multiple Varias Selecciones
        $scope.respuestaMultipleMultiple = { valor: new Array() };

        if ($scope.indice > -1) {

            if ($scope.EsPreguntaCerradaSimple() && $scope.preguntaContestada()) {
                $scope.respuestaMultipleCerrada = { valor: $scope.preguntaContestada()[0] };
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
        }
    }

    $scope.continuar = function () {

        alert("a continuar");

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

        if ($scope.indice + 1 < $scope.preguntas.length) {

            $scope.indice++;
            $ionicScrollDelegate.scrollTop();

            //Actualizar la respuesta
            $scope.actualizarValoresRespuestas();

        } else {

            $scope.loading = $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Enviando las respuestas de la Encuesta')
            });

            var objetoRespuesta = {
                preguntas: $scope.respuestas
            };

            Encuesta.enviarRespuestasEncuesta(objetoRespuesta, function (success, data) {

                $ionicLoading.hide();

                if (success) {
                    console.log("Encuesta enviada");
                } else {
                    console.log("Error al enviar encuesta");
                }

                $scope.mostrarAyuda("Inicio de sesión", "Encuesta finalizada! Muchas gracias por tu participación");
                $location.path('/app/menu/tabs/home');

            });

        }
    };

    $scope.contestarPregunta = function (indice) {
        $scope.indiceRespuesta = indice;

        if ($scope.EsPreguntaCerradaSimple()) {
            $scope.respuestas[$scope.indice].respuestas = new Array();
            $scope.respuestas[$scope.indice].respuestas.push($scope.respuestaMultipleCerrada.valor);
        }
    }

    $scope.contestarPreguntaAbierta = function () {
        $scope.respuestas[$scope.indice].respuestas = new Array();
        $scope.respuestas[$scope.indice].respuestas.push($scope.respuestaTexto.valor);
    }

    $scope.contestarPreguntaMultiple = function (indice) {

        console.log($scope.obtenerPregunta().posiblesRespuestas[indice].posibleRespuesta);

        if (!$scope.preguntaContestada()) {
            $scope.respuestas[$scope.indice].respuestas = new Array();
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
            $scope.respuestas[$scope.indice].respuestas.splice(indiceEncontrado, 1);
            $scope.respuestaMultipleMultiple.valor[indice] = false;
        } else {
            $scope.respuestas[$scope.indice].respuestas.push($scope.obtenerPregunta().posiblesRespuestas[indice].posibleRespuesta);
            $scope.respuestaMultipleMultiple.valor[indice] = true;
        }

        console.log($scope.respuestas);
    }

    $scope.preguntaContestada = function () {
        return $scope.respuestas[$scope.indice].respuestas;
    }

    $scope.obtenerPregunta = function () {
        if ($scope.indice == -1) {
            return null;
        }

        return $scope.preguntas[$scope.indice];
    }

    $scope.EsPreguntaCerradaMultiple = function () {

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            $scope.preguntas[$scope.indice].respuestaMultiple &&
            $scope.preguntas[$scope.indice].posiblesRespuestas && $scope.preguntas[$scope.indice].posiblesRespuestas.length > 0;

    }

    $scope.EsPreguntaCerradaSimple = function () {

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            !$scope.preguntas[$scope.indice].respuestaMultiple &&
            $scope.preguntas[$scope.indice].posiblesRespuestas && $scope.preguntas[$scope.indice].posiblesRespuestas.length > 0;
    }

    $scope.EsPreguntaAbierta = function () {

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            !$scope.preguntas[$scope.indice].respuestaMultiple &&
            (!$scope.preguntas[$scope.indice].posiblesRespuestas || $scope.preguntas[$scope.indice].posiblesRespuestas.length == 0);
    }

    $scope.crearVectorRespuestas = function () {

        for (var index = 0; index < $scope.preguntas.length; index++) {
            var element = $scope.preguntas[index];

            //Crear el objeto de respuesta completo
            $scope.respuestas.push({ pregunta: element.pregunta, respuestas: null });
        }
    }

    $scope.inicializar = function () {

        $scope.respuestas = new Array();

        $scope.indiceRespuesta = -1;
        $scope.indice = -1;

        $scope.actualizarValoresRespuestas();

        if (Internet.get()) {

            $scope.loading = $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Consultando la Encuesta')
            });

            Encuesta.obtenerPreguntasEncuesta(function (success, data) {

                $ionicLoading.hide();

                if (success) {
                    $scope.preguntas = data.preguntas;
                    $scope.indice = 0;

                    $scope.crearVectorRespuestas();
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