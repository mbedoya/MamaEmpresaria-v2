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

        if(!$rootScope.recuperarClave){
            $scope.mostrarAyuda("Creación de clave", "Mamá, nos encanta tenerte con nosotros. Para que puedas disfrutar de esta aplicación te invitamos a responder unas preguntas y crear tu clave");            
        }

        $scope.modelo = { campana:''};
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

    $scope.confirmar = function() {

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste la Campaña ' + $scope.modelo.campana + ' de ' + '2015' + ', ¿Es correcto?',
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

                    var respuestaValida = false;

                    if(respuestaValida){
                        $location.path('/app/bienvenida');
                    }else{
                        $scope.mostrarAyuda("Creación de clave", "Lo sentimos, has fallado en esta respuesta. Responde una pregunta más");
                        $location.path('/app/clave-pregunta-2');
                    }

                }else{
                    $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
                }
            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor selecciona nuevamente la campaña");
            }

        });
    };

    $scope.continuar = function() {

        console.log($scope.modelo.campana);
        $scope.confirmar();

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