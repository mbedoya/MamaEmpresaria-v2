moduloControlador.controller('MiPedidoCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido");


    $scope.agotados = function(){
        console.log($rootScope.agotados.agotadosME);
        return $rootScope.agotados.agotadosME;
    }

    $scope.inicializar = function(){

        Pedido.getTrazabilidadActual($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.pedidoActual = data.historiaEstados;
            }else{

            }
        });

        Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.pedidoAnterior = data.historiaEstados;
            }else{

            }
        });

        Pedido.getAgotadosActual($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.agotadosActual = data;
            }else{

            }
        });

        Pedido.getAgotadosAnterior($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.agotadosAnterior = data;
            }else{

            }
        });
    }

    $scope.agotadosPedidoActual = function(){
        if($scope.agotadosActual && !$scope.agotadosActual.razonRechazo){
            return $scope.agotadosActual;
        }else{
            return null;
        }
    }

    $scope.agotadosPedidoAnterior = function(){
        if($scope.agotadosAnterior && !$scope.agotadosAnterior.razonRechazo){
            return $scope.agotadosAnterior;
        }else{
            return null;
        }
    }

    $scope.ultimoEstadoPedidoActual = function(){
        if($scope.pedidoActual && $scope.pedidoActual.length > 0){
            var estadoPedido = $scope.pedidoActual[$scope.pedidoActual.length-1];
            estadoPedido.estado = Utilidades.cambiarNombreEstadoPedido(estadoPedido.estado);
            $("#estadoPedidoActual").val(estadoPedido.estado);
            return estadoPedido;
        }

        return null;
    }

    $scope.ultimoEstadoPedidoAnterior = function(){
        if($scope.pedidoAnterior && $scope.pedidoAnterior.length > 0){
            var estadoPedido = $scope.pedidoAnterior[$scope.pedidoAnterior.length-1];
            estadoPedido.estado = Utilidades.cambiarNombreEstadoPedido(estadoPedido.estado);
            return estadoPedido;
        }

        return null;
    }

    $scope.fechaLuegoEncuentro = function(){
        var fecha = new Date($rootScope.campana.fechaEncuentro);
        fecha.setDate(fecha.getDate() + 2);
        return fecha;
    }

    $scope.estadoEncontrado = function(estado){
        return Pedido.estadoEncontrado(estado);
    }

    $scope.buscarEstado = function(estado){
        return Pedido.buscarEstado(estado);
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

    $scope.encuentroRealizado = function(){
        return Campana.encuentroRealizado();
    }

    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

    $scope.hoyEsEncuentro = function(){
        return Campana.hoyEsEncuentro();
    }

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });

    $scope.inicializar();

});