moduloControlador.controller('EncuestaPedidoCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Pedido, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.continuar = function() {

        console.log($scope.indiceRespuesta);
        console.log($scope.EsPreguntaCerradaSimple());

        //Validación de ingreso de respuesta cerrada única
        if($scope.indiceRespuesta.length == 0 && $scope.EsPreguntaCerradaSimple()){
            $scope.mostrarAyuda("","Debes seleccionar una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if($scope.indiceRespuesta.length == 0 && $scope.EsPreguntaCerradaMultiple()){
            $scope.mostrarAyuda("","Debes seleccionar mínimo una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if($scope.respuestaTexto.valor.trim().length == 0){
            $scope.mostrarAyuda("","Por favor contesta la pregunta");
            return;
        }

        $scope.respuestas.push("P" + $scope.indice + 1 + "=" + $scope.indiceRespuesta);
        $scope.indiceRespuesta = "";

        if($scope.indice + 1 < $scope.preguntas.length){
            $scope.indice++;
        }else{

            $scope.loading =  $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Enviando las respuestas de la Encuesta')
            });

            Pedido.enviarRespuestasEncuesta($scope.respuestas.join("&") ,function(success, data) {

                $ionicLoading.hide();

                if (success) {
                    console.log("Encuesta enviada");
                }else{
                    console.log("Error al enviar encuesta");
                }

                $scope.mostrarAyuda("Inicio de sesión","Encuesta finalizada! Muchas gracias por tu participación");
                $location.path('/app/menu/tabs/home');

            });

        }
    };

    $scope.contestarPregunta = function (indice) {
        console.log("Indice respuesta: " + indice);
        $scope.indiceRespuesta = indice;
    }

    $scope.contestarPreguntaTexto = function () {
        console.log("respuesta texto: " + $scope.respuestaTexto.valor);
    }

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

        $scope.respuestas = new Array();
        $scope.indiceRespuesta = "";
        $scope.respuestaTexto = { valor: ''};
        $scope.indice = -1;

        if(Internet.get()){

            $scope.loading =  $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Consultando la Encuesta')
            });

            Pedido.obtenerPreguntasEncuesta(function(success, data) {

                $ionicLoading.hide();

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