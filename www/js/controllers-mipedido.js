moduloControlador.controller('MiPedidoCtrl', function($scope, $rootScope, $state, $location, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido");


    $scope.agotados = function(){
        console.log($rootScope.agotados.agotadosME);
        return $rootScope.agotados.agotadosME;
    }

    $scope.inicializar = function(mostrarIndicador){

        console.log("initialize home pedido");

        if(mostrarIndicador){
            $scope.loading =  $ionicLoading.show({
                template: 'Estamos consultando el estado de tu pedido'
            });
        }
        
        Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.pedidoAnterior = data.historiaEstados;

                console.log("Trazabilidad anterior");
                console.log($scope.pedidoAnterior);
            }else{

            }
        });
        
        Pedido.getAgotadosAnterior($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.agotadosAnterior = data;
            }else{

            }
        });

        Pedido.getTrazabilidadActual($rootScope.datos.cedula, function (success, data){

            $ionicLoading.hide();

            if(success){
                console.log(data);
                $scope.pedidoActual = data.historiaEstados;
            }else{

            }
        });

        Pedido.getAgotadosActual($rootScope.datos.cedula, function (success, data){
            if(success){
                $scope.agotadosActual = data;
            }else{

            }
        });
    }

    $scope.irATrazabilidadAnterior = function(){
        console.log("Trazabilidad anterior");
        //$location.path('/app//mipedido-trazabilidad-anterior');
        $state.go('app.menu.tabs.mipedido-trazabilidad-anterior', null, {reload:true});
    }

    $scope.irATrazabilidadActual = function(){
        $state.go('app.menu.tabs.mipedido-trazabilidad');
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
            cantidad = $scope.pedidoActual.length;
            estadoEncontrado = false;

            var estadoPedido = null;

            while(cantidad >0 && !estadoEncontrado){
                if($scope.pedidoActual[cantidad-1].estado.toLowerCase() != "novedad"){
                    estadoPedido = $scope.pedidoActual[cantidad-1];
                    estadoPedido.estado = Utilidades.cambiarNombreEstadoPedido(estadoPedido.estado);
                    estadoEncontrado = true;
                }
                cantidad = cantidad-1;
            }

            if(estadoEncontrado){
                $("#estadoPedidoActual").val(estadoPedido.estado);
                return estadoPedido;
            }
        }

        return null;
    }

    $scope.ultimoEstadoPedidoAnterior = function(){

        if($scope.pedidoAnterior && $scope.pedidoAnterior.length > 0){
            cantidad = $scope.pedidoAnterior.length;
            estadoEncontrado = false;

            var estadoPedido = null;

            while(cantidad >0 && !estadoEncontrado){
                if($scope.pedidoAnterior[cantidad-1].estado.toLowerCase() != "novedad"){
                    estadoPedido = $scope.pedidoAnterior[cantidad-1];
                    estadoPedido.estado = Utilidades.cambiarNombreEstadoPedido(estadoPedido.estado);
                    estadoEncontrado = true;
                }
                cantidad = cantidad-1;
            }

            if(estadoEncontrado){
                $("#estadoPedidoAnterior").val(estadoPedido.estado);
                return estadoPedido;
            }
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
        $scope.inicializar(true);
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });

    $scope.inicializar(true);

    //$scope.$on('$ionicView.beforeEnter', function(){
    //    $scope.inicializar();
    //});

});