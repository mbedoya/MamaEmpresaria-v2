moduloControlador.controller('EncuestaPedidoCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $filter, $ionicHistory, $ionicScrollDelegate, Mama, Internet, GA, Encuesta, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Encuesta Pedido");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.irAtras = function() {
        if ($scope.indice > 0) {
            $scope.indice = $scope.indice - 1;
        }
    }

    $scope.mostrarAtras = function() {
        return $scope.indice > 0;
    }

    $scope.continuar = function() {

        console.log("Indice respuesta:" + $scope.indiceRespuesta);
        console.log("Cerrada simple" + $scope.EsPreguntaCerradaSimple());

        //Validación de ingreso de respuesta cerrada única
        if($scope.indiceRespuesta == -1 && $scope.EsPreguntaCerradaSimple()){
            $scope.mostrarAyuda("","Debes seleccionar una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if($scope.indiceRespuesta == -1  && $scope.EsPreguntaCerradaMultiple()){
            $scope.mostrarAyuda("","Debes seleccionar mínimo una opción");
            return;
        }

        //Validación de ingreso de respuesta cerrada múltiple
        if(String($scope.respuestaTexto.valor).trim().length == 0 && $scope.EsPreguntaAbierta()){
            $scope.mostrarAyuda("","Por favor contesta la pregunta");
            return;
        }

        //Obtener las respuestas dadas por la Mamá
        var respuestas = new Array();
        if($scope.EsPreguntaCerradaSimple() || $scope.EsPreguntaCerradaMultiple()){
            respuestas.push($scope.obtenerPregunta().posiblesRespuestas[$scope.indiceRespuesta].posibleRespuesta);
        }else{
            respuestas.push($scope.respuestaTexto.valor);
        }

        //Crear el objeto de respuesta completo
        $scope.respuestas.push({ pregunta: $scope.obtenerPregunta().pregunta, respuestas: respuestas });

        $scope.indiceRespuesta = -1;
        $scope.respuestaTexto.valor = "";

        if($scope.indice + 1 < $scope.preguntas.length){
            $scope.indice++;
            $ionicScrollDelegate.scrollTop();
        }else{

            $scope.loading =  $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Enviando las respuestas de la Encuesta')
            });

            var objetoRespuesta = { 
                preguntas: $scope.respuestas
             };

            Encuesta.enviarRespuestasEncuesta(objetoRespuesta ,function(success, data) {

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
        $scope.indiceRespuesta = indice;
    }

    $scope.contestarPreguntaTexto = function () {
        
    }

    $scope.obtenerPregunta = function(){
        if($scope.indice == -1){
            return null;
        }

        return $scope.preguntas[$scope.indice];
    }

    $scope.EsPreguntaCerradaMultiple = function(){

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            $scope.preguntas[$scope.indice].respuestaMultiple && 
            $scope.preguntas[$scope.indice].posiblesRespuestas && $scope.preguntas[$scope.indice].posiblesRespuestas.length > 0;

    }

    $scope.EsPreguntaCerradaSimple = function(){

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            !$scope.preguntas[$scope.indice].respuestaMultiple && 
            $scope.preguntas[$scope.indice].posiblesRespuestas && $scope.preguntas[$scope.indice].posiblesRespuestas.length > 0;
    }

    $scope.EsPreguntaAbierta = function(){

        return $scope.preguntas && $scope.preguntas.length > 0 &&
            !$scope.preguntas[$scope.indice].respuestaMultiple &&
            (!$scope.preguntas[$scope.indice].posiblesRespuestas || $scope.preguntas[$scope.indice].posiblesRespuestas.length == 0);
    }

    $scope.inicializar = function() {

        $scope.respuestas = new Array();
        $scope.indiceRespuesta = -1;
        $scope.respuestaTexto = { valor: ''};
        $scope.indice = -1;

        if(Internet.get()){

            $scope.loading =  $ionicLoading.show({
                template: Utilidades.getPlantillaEspera('Consultando la Encuesta')
            });

            Encuesta.obtenerPreguntasEncuesta(function(success, data) {

                $ionicLoading.hide();

                if (success) {
                    $scope.preguntas = data.preguntas;
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

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });
    
});