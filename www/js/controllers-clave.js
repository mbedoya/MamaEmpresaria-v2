moduloControlador.controller('ClaveCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Clave");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.limpiar = function(){
        $scope.modelo = { clave: ''};
    }

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

        try{

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Validando clave')
                });

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();

                    if(success){

                        var irABienvenida = !(localStorage && localStorage.nombre);

                        //Almacenar la cédula si hay almacenamiento local
                        if(localStorage ){

                            localStorage.cedula = $scope.datosInicio.cedula;
                            localStorage.nombre = $rootScope.datos.nombre;
                            localStorage.segmento = $rootScope.datos.segmento;
                        }

                        $scope.datosInicio = {cedula: '' };

                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        if(irABienvenida){
                            //$state.go('app.bienvenida');
                            $location.path('/app/bienvenida');
                        }else{
                            $location.path('/app/menu/tabs/home');
                            //$state.go('app.menu.tabs.home');
                        }


                    }else{
                        $scope.mostrarAyuda("Ingreso de clave", mensajeError);
                    }

                });

            }else{
                $scope.mostrarAyuda("Ingreso de clave","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }

    }

    $scope.inicializar = function(){
        $scope.limpiar();
    }

    $scope.inicializar();
});