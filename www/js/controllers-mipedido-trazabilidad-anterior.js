moduloControlador.controller('MiPedidoTrazabilidadAnteriorCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicModal, $http, $ionicPopup, Mama, Internet, GA, Pedido, Utilidades, Campana) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Mi Pedido Detalle");

    $ionicModal.fromTemplateUrl('templates/mipedido-anterior-agotados-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.openModal = function() {
        $scope.modal.show();
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.mostrarAgotados = function(){
        $scope.openModal();
    }

    $scope.agotados = function(){
        return $scope.agotadosAnterior;
    }

    $scope.noSeEnviaAgotado = function(cantPedida, cantEnviada){
        return cantPedida - cantEnviada == 0;
    }

    $scope.agotadoSustituido = function(tipo){
        return tipo == 'AGOTADO SUSTITUIDO';
    }

    $scope.inicializar = function(mostrarIndicador){

        if(Internet.get()) {

            if(mostrarIndicador){
                $scope.loading =  $ionicLoading.show({
                    template: 'Estamos consultando el estado de tu pedido'
                });
            }

            Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
                $ionicLoading.hide();

                if(success){
                    $rootScope.pedidoAnterior = data;
                }else{
                    $scope.mostrarAyuda("Mi Pedido","En este momento no podemos consultar tu información");
                }
            });

            Pedido.getAgotadosAnterior($rootScope.datos.cedula, function (success, data){
                if(success){
                    $scope.agotadosAnterior = data;
                }else{

                }
            });
        }else{
            $scope.mostrarAyuda("Mi Pedido","Por favor verifica tu conexión a internet");
        }

    }

    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });

    $scope.inicializar(true);

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
        if($rootScope.campanaAnterior && $rootScope.campanaAnterior.fechaReparto ){
            
             return $rootScope.campanaAnterior.fechaReparto;       
        }else{
            return "";
        }
    }

    $scope.estadoEncontrado = function(estado){
        return Pedido.estadoEncontrado(estado, $rootScope.pedidoAnterior);
    }

    $scope.buscarEstado = function(estado){
        return Pedido.buscarEstado(estado, $rootScope.pedidoAnterior);
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