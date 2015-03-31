moduloControlador.controller('MiPedidoCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido");


    $scope.agotados = function(){
        console.log($rootScope.agotados.agotadosME);
        return $rootScope.agotados.agotadosME;
    }

    $scope.inicializar = function(){

        /*
         if(Internet.get()){

         $scope.loading =  $ionicLoading.show({
         template: 'Estamos consultando el estado de tu pedido'
         });

         Mama.getTrazabilidadPedido($rootScope.datos.cedula, $rootScope, $http, function (success, data){
         if(success){
         $ionicLoading.hide();
         $rootScope.pedido = data;

         Mama.getAgotadosPedido($rootScope.pedido.numeroPedido, $rootScope, $http, function (success, data){
         if(success){
         //$ionicLoading.hide();
         $rootScope.agotados = data;

         console.log($rootScope.agotados);

         }else{
         //$ionicLoading.hide();
         //$scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
         }
         });

         console.log("Pedido");
         console.log($rootScope.pedido);

         }else{
         $ionicLoading.hide();
         $scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
         }
         });


         }else{
         $scope.mostrarAyuda("Mi Pedido","Por favor verifica tu conexión a internet");
         }

         */

    }

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.inicializar();

    $scope.saldo = function(){
        return Math.abs(Number($rootScope.datos.saldo));
    }

    $scope.verAyudaNovedad = function(){
        //$scope.mostrarAyuda('Novedades', 'Debes cancelar $50.000 antes del 24 de febrero para que tu pedido sea enviado');
    }

    $scope.pedido = function(){
        return $rootScope.pedido;
    }

    $scope.motivoNovedadEncontrado = function(motivo){
        var estadoNovedad = $scope.buscarEstado('Novedad');
        if(estadoNovedad){
            if (estadoNovedad.motivo.toLowerCase().indexOf(motivo.toLowerCase())>=0){
                return true;
            }
        }

        return false;
    }

    $scope.fechaRepartoPedido = function(){
        return $rootScope.campana.fechaReparto;
    }

    $scope.estadoEncontrado = function(estado){
        return Pedido.estadoEncontrado(estado);
    }

    $scope.buscarEstado = function(estado){
        return Pedido.buscarEstado(estado);
    }

    $scope.cambiarNombreEstado = function(nombre){
        return Utilidades.cambiarNombreEstadoPedido(nombre);
    }

    $scope.fechaCorreteo = function(){
        return $rootScope.campana.fechaCorreteo;
    }

    $scope.fechaEncuentro = function(){
        return $rootScope.campana.fechaEncuentro;
    }

    $scope.fechaLuegoEncuentro = function(){
        var fecha = new Date($rootScope.campana.fechaEncuentro);
        fecha.setDate(fecha.getDate() + 2);
        return fecha;
    }

    $scope.mostrarNovedad = function(novedad){
        var mostrar = false;
        if(novedad.toLowerCase().indexOf('morosa')>=0 ||
            novedad.toLowerCase().indexOf('cupo')>=0 ||
            novedad.toLowerCase().indexOf('tope')>=0){
            mostrar = true;
        }
        return mostrar;
    }

    $scope.padStr = function(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

    $scope.encuentroRealizado = function(){
        return Campana.encuentroRealizado();
    }

    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

    $scope.hoyEsEncuentro = function(){
        return Campana.hoyEsEncuentro();
    }

    $scope.diasEnEjecucionCampana = function(){

        console.log("dias: " + $rootScope.campana.diasEnEjecucion);

        if ($rootScope.campana.diasEnEjecucion != '-'){
            console.log("dias: " + Number($rootScope.campana.diasEnEjecucion));
            return Number($rootScope.campana.diasEnEjecucion);
        }else{
            return null;
        }
    }

    $scope.campanaAnterior = function(){
        if($rootScope.campana.numero == 1){
            return $rootScope.numeroCampanasAno;
        }else{
            return $rootScope.campana.numero-1;
        }
    }

    $scope.$on('$ionicView.beforeEnter', function(){
        var valorHiddenEstados = '';
        if($rootScope.pedido && $rootScope.pedido.historiaEstados){
            for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) {
                valorHiddenEstados = valorHiddenEstados + Utilidades.cambiarNombreEstadoPedido($rootScope.pedido.historiaEstados[i].estado) + ";"
            }
        }
        $("#estados").val(valorHiddenEstados);
    });

});