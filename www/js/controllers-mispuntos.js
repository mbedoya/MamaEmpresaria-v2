moduloControlador.controller('MisPuntosCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $http, Mama, Internet, GA, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mis Puntos");

    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

    $scope.hoyEsEncuentro = function(){
        return Campana.hoyEsEncuentro();
    }

    $scope.diasParaPago = function(){

        var stringFecha =  Utilidades.formatearFechaActual();

        if($rootScope.campana && $rootScope.campana.fechaMontajePedido){
            return Utilidades.diferenciaFechaDias(new Date(stringFecha), new Date($rootScope.campana.fechaMontajePedido));
        }else{
            return "";
        }
    }

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.inicializar = function(mostrarIndicador){
        if(Internet.get()){

            if(mostrarIndicador){
                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Estamos consultando tus puntos')
                });
            }


            Mama.getPuntos($rootScope.datos.cedula, function (success, data){
                if(success){

                    if(mostrarIndicador) {
                        $ionicLoading.hide();
                    }
                    $rootScope.puntos = data;

                }else{
                    if(mostrarIndicador) {
                        $ionicLoading.hide();
                    }
                    $scope.mostrarAyuda("Mis Puntos","En este momento no podemos acceder a tu información");
                }
            });
        }else{
            $scope.mostrarAyuda("Mis Puntos","Por favor verifica tu conexión a internet");
        }
    }

    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.inicializar(true);

    $scope.mostrarPremios = function(){
        $state.go('app.menu.tabs.mispuntos.mispremiosredimidos');
        //href="#/app/menu/tabs/mispremiosredimidos"
    }

    $scope.campanaVencimientoPuntos = function(){
        return String($rootScope.puntos.agnoCampagnaVencimiento).substr(4,2) + " de " + String($rootScope.puntos.agnoCampagnaVencimiento).substr(0,4);
    }

    $scope.puntosDisponibles = function(){
        return $rootScope.puntos.puntosDisponibles;
    }

    $scope.puntosPorPerder = function(){
        return $rootScope.puntos.puntosPorPerder;
    }

    $scope.puntosAVencer = function(){
        return $rootScope.puntos.puntosAVencer;
    }

    $scope.puntosRedimidos = function(){
        return $rootScope.puntos.puntosRedimidos;
    }

    $scope.fechaMontajePedidoCampana = function(){
        return $rootScope.campana.fechaMontajePedido;
    }

    $scope.mostrarPuntosRedimidos = function(){
        return false;
        //return $rootScope.puntos.puntosRedimidos && Number($rootScope.puntos.puntosRedimidos) > 0;
    }

    $scope.mostrarPuntosAVencer = function(){
        return $rootScope.puntos.puntosAVencer && Number($rootScope.puntos.puntosAVencer) > 0;
    }

    $scope.mostrarPuntosPorPerder = function(){
        return $rootScope.puntos.puntosPorPerder && Number($rootScope.puntos.puntosPorPerder) > 0;
    }

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar(false);
    });

});