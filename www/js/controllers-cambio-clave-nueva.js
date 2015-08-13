moduloControlador.controller('CambioClaveNuevaCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Cambio Clave - Ingreso Clave Nueva");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.limpiar = function(){
        $scope.modelo = { clave: ''};
        $scope.clave = '';
    }

    $scope.confirmar = function(){

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste ' + $scope.clave + ' como tu clave, ¿Es correcto?',
            title: '',
            subTitle: '',
            scope: $scope,
            buttons: [
                { text: 'No' ,
                    onTap: function(e) {
                        console.log(e);
                        return false;
                    }
                },
                {
                    text: '<b>Si</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        console.log(e);
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res){

                if(Internet.get()){

                    $scope.loading =  $ionicLoading.show({
                        template: Utilidades.getPlantillaEspera('Guardando tu clave')
                    });

                    var claveActual = $rootScope.datos.clave;    
                    $rootScope.datos.clave = $scope.clave;
                    
                    Mama.cambiarClave(claveActual, $rootScope.datos.clave,  function(success, data){

                        $ionicLoading.hide();

                        if(success){

                            console.log(data);
                            
                            $scope.loading =  $ionicLoading.show({
                                template: Utilidades.getPlantillaEspera('Iniciando sesión')
                            });    
        
                            Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){
        
                                $ionicLoading.hide();
        
                                if(success){

                                    $scope.loading =  $ionicLoading.show({
                                        template: Utilidades.getPlantillaEspera('Iniciando sesión')
                                    });

                                    Mama.getInformacionBasica(function(success, mensajeError){

                                        $ionicLoading.hide();

                                        if(success){

                                            //Almacenar datos si hay almacenamiento local
                                            if(localStorage){

                                                localStorage.cedula = $rootScope.datos.cedula;
                                                localStorage.nombre = $rootScope.datos.nombre;
                                                localStorage.segmento = $rootScope.datos.segmento;
                                                localStorage.clave = $scope.modelo.clave;
                                            }

                                            $scope.datosInicio = {clave: '' };

                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            
                                            $scope.mostrarAyuda("Creación de clave", "Tu clave ha sido actualizada");

                                            //Si la Mamá tiene versión para aceptar entonces ir a terminos y condiciones
                                            if ($rootScope.datos.versionHabeasData){
                                                $rootScope.irAHomeLuegoTerminos = true;
                                                $location.path('/app/terminos-condiciones');
                                            }else{
                                                $location.path('/app/menu/tabs/home');
                                            }

                                        }else{
                                            $scope.mostrarAyuda("Creación de clave", mensajeError);
                                        }

                                    });

        
                                }else{
                                    $scope.mostrarAyuda("Creación de clave", mensajeError);
                                }
        
                            });
                            

                        }else{
                            $scope.mostrarAyuda("Creación de clave", "Mamá, no ha sido posible cambiar tu clave, comunícate con la línea de atención");
                        }

                    });

                    

                }else{
                    $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
                }

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor ingresa tu clave nuevamente");
                $scope.limpiar();
            }
            
        });
    };

    //Autenticar a la Mamá Empresaria
    $scope.continuar = function() {

        var clave = $("#txtCambioClaveNueva").val();

        //Cédula vacía
        if(!clave || clave.length == 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(clave.length != 4){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa 4 dígitos");
            return;
        }
        
        //Cantidad de caracteres
        if(clave.length > 4){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa únicamente 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(clave.indexOf(".") >= 0 || clave.indexOf(",") >= 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
            return;
        }
        
        $scope.clave = clave;

        $scope.confirmar();
    }

    $scope.inicializar = function(){
        $scope.limpiar();
    }

    $scope.inicializar();
});