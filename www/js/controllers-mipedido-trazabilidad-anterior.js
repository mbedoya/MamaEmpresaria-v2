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
    $scope.hayAgotadosReales = function(){
        if($scope.agotadosAnterior.agotadosME && $scope.agotadosAnterior.agotadosME.length == 1){
            return $scope.agotadoReal($scope.agotadosAnterior.agotadosME[0]);
        }

        return true;
    }

    //Si hay agotados reales? es decir que el mismo producto no se haya agotado y luego si esté disponible
    $scope.hayAgotadosAnteriorReales = function(){

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
    }

    //Si sustituidos reales? es decir que el mismo producto no se haya agotado y luego si esté disponible
    $scope.haySustituidos = function(){

        var contadorSustituidos = 0;

        if($scope.agotadosAnterior && $scope.agotadosAnterior.agotadosME){
            //Recorrer todos los agotados
            for(i=0; i<$scope.agotadosAnterior.agotadosME.length;i++){

                if($scope.agotadosAnterior.agotadosME[i].tipoAgotado == "AGOTADO SUSTITUIDO"){
                    if($scope.agotadoReal($scope.agotadosAnterior.agotadosME[i])){
                        contadorSustituidos = contadorSustituidos + 1;
                    }
                }
            }    
        }else{
            return false;
        }

        return contadorSustituidos > 0;
    }

    $scope.inicializar = function(mostrarIndicador){

        if(Internet.get()) {

            if(mostrarIndicador){
                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Estamos consultando el estado de tu pedido')
                });
            }

            Pedido.getTrazabilidadAnterior($rootScope.datos.cedula, function (success, data){
                $ionicLoading.hide();

                if(success){
                    $rootScope.pedidoAnterior = data;
                    $scope.pedidoAnterior = data;
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
        //$scope.inicializar();
    });

    //$scope.inicializar(true);

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

    $scope.fechaRepartoPedido = function(fecha){
        if($rootScope.campanaAnterior && $rootScope.campanaAnterior.fechaReparto1 &&  $rootScope.campanaAnterior.fechaReparto2){   
            if(new Date(Utilidades.validarFormatoFecha(fecha)) <= new Date(Utilidades.validarFormatoFecha($rootScope.campanaAnterior.fechaMontajePedido)))
                return $rootScope.campanaAnterior.fechaReparto1;  
            else return $rootScope.campanaAnterior.fechaReparto2;
        }else{
            return "";
        }
    }

    $scope.estadoEncontrado = function(estado){
        return Pedido.estadoEncontrado(estado, $rootScope.pedidoAnterior);
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
            case "07":
            case "08":
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
            case "00"/*"Ingresado"*/:
                src = "img/pedido1-selected.png";
                break;

            case "05"/*"Anulado"*/:
                src = "img/anulado.png";
                break;

            case "04"/*"Facturado"*/:
                src = "img/pedido2-selected.png";
                break;

            case "07"/*"En linea"*/:
                src = "img/pedido3-selected.png";
                break;

            case "08"/*"Cargue"*/:
                src = "img/pedido4-selected.png";
                break;
                
            case "10":/*en transito bodega operador*/
                src = "img/pedido4-selected.png";
                break;                

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