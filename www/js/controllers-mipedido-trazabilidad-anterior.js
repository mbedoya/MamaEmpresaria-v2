moduloControlador.controller('MiPedidoTrazabilidadAnteriorCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido Detalle");


    $scope.agotados = function(){
        console.log($rootScope.agotados.agotadosME);
        return $rootScope.agotados.agotadosME;
    }

    $scope.inicializar = function(){

        if(Internet.get()) {

            $scope.loading =  $ionicLoading.show({
                template: 'Estamos consultando el estado de tu pedido'
            });

            Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
                $ionicLoading.hide();

                if(success){
                    $scope.pedidoAnterior = data;
                }else{
                    $scope.mostrarAyuda("Mi Pedido","En este momento no podemos consultar tu información");
                }
            });
        }else{
            $scope.mostrarAyuda("Mi Pedido","Por favor verifica tu conexión a internet");
        }

    }

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('loggedin', function(event, args){
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
        return $rootScope.pedidoAnterior;
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
        return $rootScope.campanaAnterior.fechaReparto;
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
        return $rootScope.campanaAnterior.fechaCorreteo;
    }

    $scope.fechaEncuentro = function(){
        return $rootScope.campanaAnterior.fechaEncuentro;
    }

    $scope.fechaLuegoEncuentro = function(){
        var fecha = new Date($rootScope.campanaAnterior.fechaEncuentro);
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

    $scope.$on('$ionicView.beforeEnter', function(){
        var valorHiddenEstados = '';
        if($rootScope.pedidoAnterior && $rootScope.pedidoAnterior.historiaEstados){
            for (i = 0; i < $rootScope.pedidoAnterior.historiaEstados.length; i++) {
                valorHiddenEstados = valorHiddenEstados + Utilidades.cambiarNombreEstadoPedido($rootScope.pedidoAnterior.historiaEstados[i].estado) + ","
            }
        }
        $("#estados").val(valorHiddenEstados);
    });

});