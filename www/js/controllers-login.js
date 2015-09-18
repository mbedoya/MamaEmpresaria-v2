moduloControlador.controller('LoginCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Inicio de sesión");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.test = function(){
        $scope.capturarCedula();
    }

    $scope.datosInicio = {cedula: '' };

    //Autenticar a la Mamá Empresaria
    $scope.capturarCedula = function() {

        $rootScope.datos = { cedula: $scope.datosInicio.cedula };

        //Cédula vacía
        if(!$rootScope.datos.cedula && String($rootScope.datos.cedula).length == 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa tu cédula");
            return;
        }

        console.log(String($rootScope.datos.cedula).length);

        //Cantidad de caracteres
        if(String($rootScope.datos.cedula).length < 6 || String($rootScope.datos.cedula).length > 10){
            $scope.mostrarAyuda("Inicio de sesión","Este numero de cédula no es válido");
            return;
        }

        //Caracteres especiales
        if(String($rootScope.datos.cedula).indexOf(".") >= 0 || String($rootScope.datos.cedula).indexOf(",") >= 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
            return;
        }

        try{

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Iniciando sesión')
                });


                Mama.validarCedula(function(success, data){

                    $ionicLoading.hide();

                    if(success){

                        if(data.razonRechazo){
                            $scope.mostrarAyuda("Inicio de sesión", data.razonRechazo);
                        }else{
                            if(data.bloqueoME && data.bloqueoME == "1"){
                                $scope.mostrarAyuda("Inicio de sesión", "En estos momentos no podemos acceder a tu información. Comunícate con la Línea de Atención al Cliente " + $rootScope.lineaAtencion);
                            }else{

                                if(data.estadoPastDue && Number(data.estadoPastDue) >= 4){

                                    $scope.mostrarAyuda("Inicio de sesión","Hola Mamá, tienes un saldo pendiente por pagar de " + $filter('currency')(data.saldoBalance, '$', 0) +  ". Te invitamos a ponerte al día. Ten presente que este valor puede aumentar debido a los gastos adicionales que se presentan por la entidad de cobro.");

                                }else{
                                    
                                    $rootScope.datos.nombre = data.nombre;

                                    if(data.tieneClave  && data.tieneClave == "1"){

                                        //Ir a la creación de la clave
                                        $location.path('/app/clave');


                                    }else{

                                        //Ir a la creación de la clave
                                        $location.path('/app/clave-pregunta-1');
                                    }

                                }

                            }
                        }

                    }else{
                        $scope.mostrarAyuda("Inicio de sesión", "Lo sentimos, no es posible iniciar sesión en este momento");
                    }

                });


            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }


    }
});