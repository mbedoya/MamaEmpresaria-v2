moduloControlador.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicPopup, GA, Campana, Utilidades, Pedido) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Home");

    $scope.tieneEncuentro = function(){
        return Campana.tieneEncuentro();
    }

    $scope.mostrarCupo = function(){
        return Number($rootScope.datos.cupo) > 0;
    }

    $scope.buscarEstado = function(estado){
        return Pedido.buscarEstado(estado);
    }

    $scope.mamaEnMora = function(){
        var estadoNovedad = Pedido.buscarEstado('Novedad');
        if(estadoNovedad){
            if (estadoNovedad.motivo.toLowerCase().indexOf('morosa')>=0){
                return true;
            }
        }

        return false;
    }

    // El Saldo es de la próxima campaña si
    // ya se ha efectuado el encuentro y tengo información de pedido
    // y no tengo novedad de morosidad
    $scope.saldoEsDeProximaCampana = function(){
        return false;
        //return $scope.encuentroRealizado() && !$scope.pedido().razonRechazo && !$scope.mamaEnMora();
    }

    $scope.pedido = function(){
        return $rootScope.pedido;
    }

    //Indica si ya se hizo el Encuentro para la campaña actual
    $scope.encuentroRealizado = function(){
        return Campana.encuentroRealizado();
    }

    //Indica si hoy es encuentro
    $scope.hoyEsEncuentro = function(){
        return Campana.hoyEsEncuentro();
    }

    //Indica si hoy es correteo
    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

    $scope.etiquetaSaldo = function(){

        var etiqueta = "Saldo a pagar";

        if($rootScope.datos && $rootScope.datos.saldo){

            if(Number($rootScope.datos.saldo) < 0) {
                etiqueta = "Saldo a favor";
            }else{
                etiqueta = "Debes pagar " + $scope.saldo() + " de la Campaña XXX";
            }
        }

        return etiqueta;
    }

    $scope.estiloAlternateFechaPago = function(){
        if($scope.mostrarCupo){
            return "alternate";
        }else{
            return "";
        }
    }

    $scope.mostrarSaldoFavor = function(){
        return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
    }

    $scope.mostrarSaldoPagar = function(){
        return !$scope.mostrarSaldoFavor();
    }

    $scope.nombre = function(){
        var nombrePascal = $rootScope.datos.nombre.split(' ');
        for	(index = 0; index < nombrePascal.length; index++) {
            nombrePascal[index] = nombrePascal[index].substring(0,1).toUpperCase() + nombrePascal[index].substring(1, nombrePascal[index].length).toLowerCase();
        }

        return nombrePascal.join(' ');
    }

    $scope.segmento = function(){
        return $rootScope.datos.segmento;
    }

    $scope.segmentoFormateado = function(){
        return $rootScope.datos.segmento.toLocaleLowerCase().replace("í","i");
    }

    $scope.saldo = function(){
        return Math.abs(Number($rootScope.datos.saldo));
    }

    $scope.cupo = function(){
        return $rootScope.datos.cupo;
    }

    $scope.numeroCampana = function(){
        return $rootScope.campana.numero;
    }

    $scope.fechaMontajePedidoCampana = function(){
        return $rootScope.campana.fechaMontajePedido;
    }

    $scope.fechaCorreteo = function(){
        return $rootScope.campana.fechaCorreteo;
    }

    $scope.flexibilizacion = function(){
        return $rootScope.datos.valorFlexibilizacion;
    }

    $scope.flexibilizacionPago = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return 0;
        }else{
            return Number($rootScope.datos.saldo)-Number($rootScope.datos.valorFlexibilizacion);
        }
    }

    $scope.flexibilizacionDeuda = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return Number($rootScope.datos.saldo);
        }else{
            return Number($rootScope.datos.valorFlexibilizacion);
        }
    }

    $scope.diasParaPago = function(){

        var stringFecha =  Utilidades.formatearFechaActual();

        if($rootScope.campana && $rootScope.campana.fechaMontajePedido){
            return Utilidades.diferenciaFechaDias(new Date(stringFecha), new Date($rootScope.campana.fechaMontajePedido));
        }else{
            return "";
        }
    }

    $scope.esAntesMedioDia = function(){
        return new Date().getHours() < 12;
    }

    $scope.mostrarAyudaSaldoPagar = function(){
        //$scope.mostrarAyuda('Pagos','El pago que dejas de hacer es debido al beneficio que tienes llamado "Flexibilización", los $' + $scope.flexibilizacionDeuda() + ' que quedas debiendo, los debes cancelar antes de tu próximo pedido.');
    }

    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

});