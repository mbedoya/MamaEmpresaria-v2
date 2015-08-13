moduloControlador.controller('ClaveNuevaClave1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Ingreso Nueva Clave");

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
            title: 'Creación de clave',
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

                    $rootScope.datos.clave = $scope.clave;
                    
                    Mama.asignarClave(function(success, data){

                        $ionicLoading.hide();

                        if(success){

                            $scope.modelo = { clave: ''};
                            
                            $scope.loading =  $ionicLoading.show({
                                template: Utilidades.getPlantillaEspera('Iniciando sesión')
                            });    
        
                            Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){
        
                                $ionicLoading.hide();
        
                                if(success){
                                    
                                    $location.path('/app/terminos-condiciones');
        
                                }else{
                                    $scope.mostrarAyuda("Creación de clave", mensajeError);
                                }
        
                            });
                            

                        }else{
                            $scope.mostrarAyuda("Creación de clave", "Mamá, no ha sido posible crear tu clave, comunícate con la línea de atención");
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

        var clave = $("#txtClaveNuevaClave").val();

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