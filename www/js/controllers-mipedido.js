moduloControlador.controller('MiPedidoCtrl', function($scope, $rootScope, $state, $location, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido");
    
    $scope.consultaPedidoAnteriorFinalizada = function(){
        return $scope.pedidoAnteriorFinalizado;
    }

    $scope.inicializar = function(mostrarIndicador){
        
        $scope.pedidoAnteriorFinalizado = false;

        try{

            if(mostrarIndicador){
                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Estamos consultando el estado de tu pedido')
                });
            }

            Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
                
                $scope.pedidoAnteriorFinalizado = true;
                
                if(success){
                    $scope.pedidoAnterior = data.historiaEstados;

                    console.log("Trazabilidad anterior - pedidoAnterior: " + $scope.pedidoAnterior);
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
                console.log("Esconde la ruedita ");

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

        }catch(err){
            console.log(err.message);
            alert("Lo sentimos, no podemos consultar tu Pedido en este momento");
        }

    }

    $scope.irATrazabilidadAnterior = function(){
        $state.go('app.menu.tabs.mipedido-trazabilidad-anterior', null, {reload:true});
    }

    $scope.irATrazabilidadActual = function(){
        $state.go('app.menu.tabs.mipedido-trazabilidad');
    }

    $scope.getNumeroCampanaAnterior = function(){

        if($rootScope.campana.numero == 1){
            return $rootScope.numeroCampanasAno;
        }else{
            return $rootScope.campana.numero-1;
        }

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

    $scope.agotadoReal = function(agotado){
        //Hay sustitutos?
        if(agotado.listaSustitutos && agotado.listaSustitutos.length > 0){
            //El sustituto es igual al original?
            if(agotado.nombre == agotado.listaSustitutos[0].sustituto){
                return false;
            }
        }
        return true;
    }
    
    //Si hay agotados reales? es decir que el mismo producto no se haya agotado y luego si esté disponible
    $scope.hayAgotadosAnteriorReales = function(){

        try{

            var contadorAgotados = 0;
            var contadorSustituidos = 0;

            if($scope.agotadosAnterior && $scope.agotadosAnterior.agotadosME){
                //Recorrer todos los agotados
                for(i=0; i<$scope.agotadosAnterior.agotadosME.length;i++){

                    if($scope.agotadosAnterior.agotadosME[i].tipoAgotado == "AGOTADO SUSTITUIDO"){
                        if($scope.agotadoReal($scope.agotadosAnterior.agotadosME[i])){
                            contadorSustituidos = contadorSustituidos + 1;
                        }
                    }else{
                        contadorAgotados = contadorAgotados + 1;
                    }
                }
            }else{
                return false;
            }

            return contadorAgotados > 0 || contadorSustituidos > 0;

        }catch(err){
            console.log(err.message);
        }

        return false;
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
        //$scope.inicializar();
    });

    $scope.$on('$ionicView.beforeEnter', function(){
        //Si no se ha cargado la información entonces inicializar
        if(!$rootScope.cargaDatos.ventanaMiPedido){
            $rootScope.cargaDatos.ventanaMiPedido = true;
            $scope.inicializar(true);
        }
    });

});