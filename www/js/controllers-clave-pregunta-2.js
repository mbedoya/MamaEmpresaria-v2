moduloControlador.controller('ClavePregunta2Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 2");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.respuestaSeleccionada = function(respuesta, indice){
        $scope.respuesta = respuesta;
        $scope.indiceRespuesta = indice;
    }
    
    $scope.enviarSolicitudContacto = function(){
        //Enviar solicitus de contacto

        if(Internet.get()){
            Mama.solicitarContactoAsesor("SEGUNDA_RESPUESTA_INCORRECTA", function(success, data) {
                if (success) {

                }
            });
        }else{
            $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet, no ha sido posible enviar la solicitud de contacto");
        }
    }

    $scope.confirmar = function() {

        //Validar que se haya seleccionado año y campaña
        if($scope.respuesta == ""){
            $scope.mostrarAyuda("Creación de clave","Mamá, por favor selecciona una opción");
            return;
        }    

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste la opción "' + $scope.respuesta + '" ¿Es correcto?',
            title: '',
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

                    $scope.loading =  $ionicLoading.show({
                        template: Utilidades.getPlantillaEspera('Validando respuesta')
                    });

                    Mama.responderPregunta("2", $scope.indiceRespuesta , function(success, data){

                        $ionicLoading.hide();

                        if(success){

                            console.log(data);

                            if(data.valido && data.valido == 1){
                                $location.path('/app/clave-nueva-clave-1');
                            }else{
                                $scope.enviarSolicitudContacto();
                                $scope.mostrarAyuda("Creación de clave", "No hemos podido validar correctamente tu información, uno de nuestros asesores te estará contactando");
                                $location.path('/app/login');
                            }

                        }else{


                        }

                    });


                }else{
                    $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
                }
            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor selecciona nuevamente tu último valor de factura");
            }

        });
    };

    $scope.inicializar = function() {

        $scope.respuesta = "";
        $scope.respuestas = new Array()
        
        $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Cargando información')
                });

        Mama.getPregunta2(function (success, data) {
            
            $ionicLoading.hide();
            
            if (success) {

                console.log(data);
                if(data.valido && data.valido == 1){
                    $scope.respuestas = data.respuestas;
                   
               }else{
                   console.log(data.razonRechazo);
                   if(data.razonRechazo && 
                       (data.razonRechazo == "Pregunta 2 ya ha sido contestada" || data.razonRechazo == "Pregunta 1 ya ha sido contestada") ){
                       $scope.mostrarAyuda("Creación de clave", "No hemos podido validar correctamente tu información, uno de nuestros asesores te estará contactando");
                       $location.path('/app/login');
                   }else{

                       if(data.razonRechazo &&
                           (data.razonRechazo == "Pregunta 2 ya ha sido contestada correctamente" || data.razonRechazo == "Pregunta 1 ya ha sido contestada correctamente") ){
                           $location.path('/app/clave-nueva-clave-1');
                       }else{
                           $scope.mostrarAyuda("Creación de clave",data.razonRechazo);
                           $location.path('/app/login');
                       }
                   }
               }
            }else{
                $scope.mostrarAyuda("Creación de clave", "No hemos podido validar tu información, comunícate con la línea de atención");
                $location.path('/app/login');
            }

        });
    }

    //$scope.inicializar();

    $scope.continuar = function() {

        $scope.confirmar();
    }
    
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });
});