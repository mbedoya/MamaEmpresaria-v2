moduloControlador.controller('ClavePregunta2Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 2");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.respuestaSeleccionada = function(respuesta){
        $scope.respuesta = respuesta;
    };

    $scope.confirmar = function() {

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste la opción "' + $scope.respuesta + '" ¿Es correcto?',
            title: 'Creación de clave',
            subTitle: '',
            scope: $scope,
            buttons: [
                { text: 'No',
                    onTap: function (e) {
                        console.log(e);
                        return false;
                    }
                },
                {
                    text: '<b>Si</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log(e);
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function (res) {

            if(res){

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
            }

        });
    };

    $scope.inicializar = function() {

        $scope.respuesta = "";
        $scope.respuestas = new Array();

        Mama.getRespuestasPregunta2(function (success, data) {
            if (success) {
                $scope.respuestas = data.respuestas;
                console.log($scope.respuestas);
            }
        });
    }

    $scope.inicializar();

    $scope.continuar = function() {

        $scope.confirmar();
    }
});