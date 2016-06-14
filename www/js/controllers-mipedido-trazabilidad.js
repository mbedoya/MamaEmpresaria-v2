moduloControlador.controller('MiPedidoTrazabilidadCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, $ionicModal, Mama, Internet, GA, Pedido, Utilidades, Campana) {

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
        return $scope.agotadosActual;
    }

    $scope.noSeEnviaAgotado = function(cantPedida, cantEnviada){
        return cantPedida - cantEnviada == 0;
    }

    $scope.agotadoSustituido = function(tipo){
        return tipo == 'AGOTADO SUSTITUIDO';
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

    $scope.inicializar = function(mostrarIndicador){

        if(Internet.get()) {

            if(mostrarIndicador){
                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Estamos consultando el estado de tu pedido')
                });
            }

            Pedido.getTrazabilidadActual($rootScope.datos.cedula, function (success, data){
                $ionicLoading.hide();

                if(success){
                    $rootScope.pedido = data;
                }else{
                    $scope.mostrarAyuda("Mi Pedido","En este momento no podemos consultar tu información");
                }
            });

            Pedido.getAgotadosActual($rootScope.datos.cedula, function (success, data){
                if(success){
                    $scope.agotadosActual = data;
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
        //$scope.inicializar();
    });

    //$scope.inicializar(true)
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar(true);
    });

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

    $scope.fechaRepartoPedido = function(fecha){
        if($rootScope.campana && $rootScope.campana.fechaReparto1 &&  $rootScope.campana.fechaReparto2){   
            if(new Date(Utilidades.validarFormatoFecha(fecha)) <= new Date(Utilidades.validarFormatoFecha($rootScope.campana.fechaMontajePedido)))
                return $rootScope.campana.fechaReparto1;  
            else return $rootScope.campana.fechaReparto2;
        }else{
            return "";
        }
    }

    $scope.estadoEncontrado = function(estado){
        return Pedido.estadoEncontrado(estado);
    }
    
    /* Inicio - Funciones para Novedades en Tracking Secundario */
    $scope.novedadEncontrada = function(estado){
        $scope.nombreMotivo = estado.motivo;
        if($scope.nombreMotivo == "Tercero en domicilio" || $scope.nombreMotivo == "Faltante" 
           || $scope.nombreMotivo == "Porteria" || $scope.nombreMotivo == "Datos errados" 
           || $scope.nombreMotivo == "No lo quiere recibir" || $scope.nombreMotivo == "Nadie en casa" 
           || $scope.nombreMotivo == "Inseguridad en zona"){
            return true;
        }
        return false;
    }

    $scope.buscarTextoNovedad = function(estadoSeleccionado){
        $scope.textoNovedad = estadoSeleccionado.motivo;
        if($scope.textoNovedad){
            switch($scope.textoNovedad){
                case "Tercero en domicilio":
                    $scope.mostrarRazonNovedad("- Mamá fuimos a entregarte tu pedido y no estabas. Este lo recibió una persona diferente a ti.");
                    break;
                case "Faltante":
                    $scope.mostrarRazonNovedad("- Mamá no pudimos entregarte tu pedido completo. Por favor comunicate con servicio al cliente para que te podamos ayudar.");
                    break;
                case "Porteria":
                    $scope.mostrarRazonNovedad("- Mamá no pudimos entregarte tu pedido completo. Por favor comunicate con servicio al cliente para que te podamos ayudar.");
                    break;
                case "Datos errados":
                    $scope.mostrarRazonNovedad("- Mamá no pudimos entregarte tu pedido pues los datos estaban errados. Te pedimos actualizar pronto la información para enviártelo de nuevo.");
                    break;
                case "No lo quiere recibir":
                    $scope.mostrarRazonNovedad("- Mamá nos expresaste no querer recibir tu pedido, por esta razón lo devolvimos a la Compañía.");
                    break;
                case "Nadie en casa":
                    $scope.mostrarRazonNovedad("- Mamá no pudimos entregar tu pedido porque no había nadie en casa.");
                    break;
                case "Inseguridad en zona":
                    $scope.mostrarRazonNovedad("- Mamá tu pedido no fue entregado ya que por motivos de seguridad no pudimos ingresar a la zona. Pronto te lo enviaremos de nuevo.");
                    break;
            }
        }
    }

    $scope.mostrarRazonNovedad = function(mensaje){
        var alertPopup = $ionicPopup.alert({
            title: "Mi Pedido",
            template: mensaje
        });
    };

    $scope.formatoFecha = function(fecha){
        var dia = fecha.substring(0, 2);
        var mes = fecha.substring(3, 5);
        var ano = fecha.substring(6, 10);
        var fecha = ano+"-"+mes+"-"+dia;
        return new Date(Utilidades.validarFormatoFecha(fecha));
    }    

    $scope.noMostrar = function(estado){

        if($scope.estadoActual){
            if($scope.estadoActual.codigoEstado == "05") return false;
        }

        $scope.estadoActual = estado;

        switch(estado.codigoEstado){
            case "02":                
            case "05":               
            case "04":
            /*case "En proceso de empaque":*/
            /*case "Entregado al transportador":*/
            case "11":
            case "13":
            case "14":
            case "16":
            case "17":
            case "15":
                return true;
            default:
                return false
        }
    }

    $scope.imagenPedido = function(estado){

        var src = "";

        switch(estado.codigoEstado){
            case "02"/*"Recibido"*/:
                src = "img/pedido1-selected.png";
                break;

            case "05"/*"Anulado"*/:
                src = "img/anulado.png";
                break;

            case "04"/*"Facturado"*/:
                src = "img/pedido2-selected.png";
                break;

            /*case "En proceso de empaque":
                src = "img/pedido3-selected.png";
                break;*/

            /*case "Entregado al transportador":
                src = "img/pedido4-selected.png";
                break;*/

            case "11"/*"En bodega operador secundario"*/:
                src = "img/bodega_transp.png";
                break;

            case "13"/*"En ruta"*/:
                src="img/en_camino.png";
                break;

            case "14"/*"En ruta nuevamente"*/:
                src="img/nuevo_intento_entrega.png";
                break;

            case "16"/*"Entregado totalmente"*/:
                src="img/entregado.png";
                break;

            case "17"/*"Entregado parcialmente"*/:
                src="img/entregado_novedad.png";
                break;

            case "15"/*"No entregado"*/:
                src="img/no_entregado.png";
                break;

            default:
                src="img/pedido1.png";  
                break;
        }

        return src;
    }
    
    /* Fin - Funciones para Novedades en Tracking Secundario */
    
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
                valorHiddenEstados = valorHiddenEstados + Utilidades.cambiarNombreEstadoPedido($rootScope.pedido.historiaEstados[i].estado) + ","
            }
        }
        $("#estados").val(valorHiddenEstados);
    });

});