moduloControlador.controller('ClavePregunta1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, Mama, Internet, GA, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 1");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.inicializar = function() {

        $scope.campanaActual = "";
        $scope.campanasAnoActual = new Array();

        $rootScope.zona = "655";
        $rootScope.seccion = "0";

        Campana.getRecordatoriosCampanaOperativa(function (success, data) {
            if (success) {
                $scope.campanaActual = data.campagna;
                var i=1;
                if(Number($scope.campanaActual)-9 > 0){
                    i=Number($scope.campanaActual)-9;
                }
                while(i < Number($scope.campanaActual)){
                    $scope.campanasAnoActual.push({"nombre": i});
                    i=i+1;
                }
            }
        });
    }

    $scope.inicializar();

    $scope.mostrarAyuda("Creación de clave", "Mamá, nos encanta tenerte con nosotros. Para que puedas disfrutar de esta aplicación te invitamos a responder unas preguntas y crear tu clave");

    $scope.continuar = function() {

            if(Internet.get()){

                var respuestaValida = false;

                if(respuestaValida){
                    $location.path('/app/bienvenida');
                }else{
                    $scope.mostrarAyuda("Creación de clave", "Lo sentimos, has fallado en esta respuesta, responde una pregunta más");
                    $location.path('/app/clave-pregunta-2');
                }

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
            }
    }

    $scope.mostrarAnoAnterior = function(){
        if($scope.campanaActual != ""){
            if($scope.campanaActual >= 10){
                return false;
            }
        }
        return true;
    }

});