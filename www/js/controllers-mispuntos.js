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

                if(mostrarIndicador){
                   $ionicLoading.hide();
                }

                if(success){
                    $rootScope.puntos = data;

                }else{
                    $scope.mostrarAyuda("Mis Puntos","En este momento no podemos acceder a tu información");
                }
            });
        }else{
            $scope.mostrarAyuda("Mis Puntos","Por favor verifica tu conexión a internet");
        }
    }

    $scope.mostrarPremios = function(){
        $state.go('app.menu.tabs.mispuntos.mispremiosredimidos');
        //href="#/app/menu/tabs/mispremiosredimidos"
    }

    $scope.campanaVencimientoPuntos = function(){
        return String($rootScope.puntos.agnoCampagnaVencimiento).substr(4,2) + " de " + String($rootScope.puntos.agnoCampagnaVencimiento).substr(0,4);
    }

    $scope.puntosDisponibles = function(){

        if ($rootScope.puntos){
            return $rootScope.puntos.puntosDisponibles;
        }else{
            return "";
        }
    }

    $scope.puntosPorPerder = function(){
        if ($rootScope.puntos){
            return $rootScope.puntos.puntosPorPerder;
        }else{
            return "";
        }
    }

    $scope.puntosAVencer = function(){
        if ($rootScope.puntos){
            return $rootScope.puntos.puntosAVencer;
        }else{
            return "";
        }
    }

    $scope.puntosRedimidos = function(){
        if ($rootScope.puntos){
            return $rootScope.puntos.puntosRedimidos;
        }else{
            return "";
        }
    }

    $scope.fechaMontajePedidoCampana = function(){
        return $rootScope.campana.fechaMontajePedido;
    }

    $scope.mostrarPuntosRedimidos = function(){
        return $rootScope.puntos && $rootScope.puntos.puntosRedimidos && Number($rootScope.puntos.puntosRedimidos) > 0;
    }

    $scope.mostrarPuntosAVencer = function(){
        return $rootScope.puntos && $rootScope.puntos.puntosAVencer && Number($rootScope.puntos.puntosAVencer) > 0;
    }

    $scope.mostrarPuntosPorPerder = function(){
        return $rootScope.puntos && $rootScope.puntos.puntosPorPerder && Number($rootScope.puntos.puntosPorPerder) > 0;
    }
    
    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar(false);
    });
    
    $scope.inicializar(true);

});