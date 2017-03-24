moduloControlador.controller('HomeCtrl', function ($scope, $rootScope, $location, $state, $ionicPopup, GA, Campana, Utilidades, Pedido) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Home");

    //Estas variables permiten ir a ver del log del App
    $scope.numeroClicksCampana = 0;
    $scope.mostrarLog = false;


    // SÓLO PARA PRUEBAS
    // Se cambia el color del ícono de red social a rojo, para indicar que la app está apuntando a PRUEBAS
    if (!$rootScope.versionProduccion) {
        $("button.button-icon.icono-header-menu.button-clear.ion-social-rss").css("background-color", "red");
    }

    $scope.irAEncuesta = function () {
        console.log("encuesta");
        if (!$rootScope.versionProduccion) {
            $location.path('/app/menu/tabs/mas/encuestapedido');
        }
    }

    $scope.tieneEncuentro = function () {
        return Campana.tieneEncuentro();
    }

    $scope.mostrarCupo = function () {
        return Number($rootScope.datos.cupo) > 0;
    }

    $scope.buscarEstado = function (estado) {
        return Pedido.buscarEstado(estado);
    }

    $scope.mamaEnMora = function () {
        var estadoNovedad = Pedido.buscarEstado('Novedad');
        if (estadoNovedad) {
            if (estadoNovedad.motivo.toLowerCase().indexOf('morosa') >= 0) {
                return true;
            }
        }

        return false;
    }

    // El Saldo es de la próxima campaña si
    // ya se ha efectuado el encuentro y tengo información de pedido
    // y no tengo novedad de morosidad
    $scope.saldoEsDeProximaCampana = function () {
        return false;
        //return $scope.encuentroRealizado() && !$scope.pedido().razonRechazo && !$scope.mamaEnMora();
    }

    $scope.pedido = function () {
        return $rootScope.pedido;
    }

    //Indica si ya se hizo el Encuentro para la campaña actual
    $scope.encuentroRealizado = function () {
        return Campana.encuentroRealizado();
    }

    //Indica si hoy es encuentro
    $scope.hoyEsEncuentro = function () {
        if ($scope.pago) {
            var fechaActual = new Date();
            var coincidenFechas = Utilidades.formatearFecha(fechaActual) === Utilidades.formatearFecha($scope.pago);
            return coincidenFechas;
        }
    }

    //Indica si hoy es correteo
    $scope.hoyEsCorreteo = function () {
        if ($scope.pago2) {
            var fechaActual = new Date();
            var coincidenFechas = Utilidades.formatearFecha(fechaActual) === Utilidades.formatearFecha($scope.pago2);
            return coincidenFechas;
        }
    }

    $scope.etiquetaSaldo = function () {

        var etiqueta = "Saldo a pagar";

        if ($rootScope.datos && $rootScope.datos.saldo) {

            if (Number($rootScope.datos.saldo) < 0) {
                etiqueta = "Saldo a favor";
            } else {
                etiqueta = "Debes pagar " + $scope.saldo() + " de la Campaña XXX";
            }
        }

        return etiqueta;
    }

    $scope.clickCampana = function () {
        $scope.numeroClicksCampana++;

        if ($scope.numeroClicksCampana == 5) {
            console.log($rootScope.fechas);
            console.log($rootScope.fechasAnteriores);
            $scope.mostrarLog = true;
        }
    }

    $scope.mostrarLogApp = function () {
        return $scope.mostrarLog;
    }

    $scope.estiloAlternateFechaPago = function () {
        if ($scope.mostrarCupo) {
            return "alternate";
        } else {
            return "";
        }
    }

    $scope.mostrarSaldoFavor = function () {
        return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
    }

    $scope.mostrarSaldoPagar = function () {
        return !$scope.mostrarSaldoFavor();
    }

    $scope.nombre = function () {

        if (!$rootScope.datos.nombre) {
            return "";
        }

        var nombrePascal = $rootScope.datos.nombre.split(' ');
        for (index = 0; index < nombrePascal.length; index++) {
            nombrePascal[index] = nombrePascal[index].substring(0, 1).toUpperCase() + nombrePascal[index].substring(1, nombrePascal[index].length).toLowerCase();
        }

        return nombrePascal.join(' ');
    }

    $scope.segmento = function () {
        return $rootScope.datos.segmento;
    }

    $scope.segmentoFormateado = function () {
        if (!$rootScope.datos.segmento) {
            return "";
        }
        return $rootScope.datos.segmento.toLocaleLowerCase().replace("í", "i");
    }

    $scope.saldo = function () {
        return Math.abs(Number($rootScope.datos.saldo));
    }

    $scope.cupo = function () {
        return $rootScope.datos.cupo;
    }

    $scope.numeroCampana = function () {
        return $rootScope.campana.numero;
    }

    $scope.fechaMontajePedidoCampana = function () {
        return $rootScope.campana.fechaMontajePedido;
    }

    $scope.fechaCorreteo = function () {
        return $rootScope.campana.fechaCorreteo;
    }

    $scope.flexibilizacion = function () {
        return $rootScope.datos.valorFlexibilizacion;
    }

    $scope.flexibilizacionPago = function () {
        //La flexibilización es mayor que el valor a Pagar?
        if (Number($rootScope.datos.valorFlexibilizacion) > Number($rootScope.datos.saldo)) {
            return 0;
        } else {
            return Number($rootScope.datos.saldo) - Number($rootScope.datos.valorFlexibilizacion);
        }
    }

    $scope.flexibilizacionDeuda = function () {
        //La flexibilización es mayor que el valor a Pagar?
        if (Number($rootScope.datos.valorFlexibilizacion) > Number($rootScope.datos.saldo)) {
            return Number($rootScope.datos.saldo);
        } else {
            return Number($rootScope.datos.valorFlexibilizacion);
        }
    }

    $scope.esAntesMediaNoche = function () {
        return new Date().getHours() <= 23;
    }

    $scope.mostrarAyudaSaldoPagar = function () {
        //$scope.mostrarAyuda('Pagos','El pago que dejas de hacer es debido al beneficio que tienes llamado "Flexibilización", los $' + $scope.flexibilizacionDeuda() + ' que quedas debiendo, los debes cancelar antes de tu próximo pedido.');
    }

    $scope.diasParaPago = function () {

        var fechaActual = new Date();
        var dias = Utilidades.diferenciaFechaDias(fechaActual, $scope.pago);

        return dias;
    }

    $scope.fechaPago1 = function () {
        if (!$scope.pago) {
            $scope.pago = Campana.getFechaPago1();
        }
        return $scope.pago;
    }

    $scope.fechaPago2 = function () {
        if (!$scope.pago2 && $scope.pago) {
            $scope.pago2 = Campana.getFechaPago2($scope.pago);
        }
        return $scope.pago2;
    }

    $scope.inicializar = function () {

        if (window.plugins && window.plugins.OneSignal) {
            window.plugins.OneSignal.sendTag("segmento", $rootScope.datos.segmento);
        }

        if (!$rootScope.cargaDatos.popupMamaNueva && $rootScope.mamaNueva) {

            var alertPopup = $ionicPopup.alert({
                title: "Información",
                template: "Mamá toda la información de la campaña estará disponible cuando montes tu primer pedido"
            });
        }
    }

    $scope.inicializar();

});