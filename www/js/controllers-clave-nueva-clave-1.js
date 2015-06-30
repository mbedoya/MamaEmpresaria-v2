moduloControlador.controller('ClaveNuevaClave1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Ingreso Nueva Clave");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.limpiar = function(){
        $scope.modelo = { clave: ''};
    }

    $scope.confirmar = function(){

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste ' + $scope.modelo.clave + ' como tu clave, ¿Es correcto?',
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

                    Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                        $ionicLoading.hide();

                        if(success){
                            $scope.mostrarAyuda("Creación de clave", "Tu clave para ingresar es " + $scope.modelo.clave + ", puedes cambiarla en el momento en que lo desees desde esta Aplicación");
                            $location.path('/app/terminos-condiciones');

                        }else{
                            $scope.mostrarAyuda("Creación de clave", mensajeError);
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

        //Cédula vacía
        if(!$scope.modelo.clave){
            $scope.mostrarAyuda("Creación de clave","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(String($scope.modelo.clave).length != 4){
            $scope.mostrarAyuda("Creación de clave","Ingresa 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(String($scope.modelo.clave).indexOf(".") >= 0 || String($scope.modelo.clave).indexOf(",") >= 0){
            $scope.mostrarAyuda("Creación de clave","Ingresa sólo números");
            return;
        }

        $scope.confirmar();
    }

    $scope.inicializar = function(){
        $scope.limpiar();
    }

    $scope.inicializar();
});