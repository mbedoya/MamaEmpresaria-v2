var moduloControlador = angular.module('novaventa.controllers', ['novaventa.filters'])

.controller('AppCtrl', function($scope, $state, $rootScope, $location, $ionicHistory, $ionicModal, $ionicPopup, Utilidades, $ionicPopover, GA/*, $firebaseObject*/) {

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.buscarNotificacionPendiente();
    });

    /*var fb = new Firebase("https://criteriochat.firebaseio.com");

            var fbObject = $firebaseObject(fb);

            fbObject.$bindTo($scope, "dato");*/

    $ionicPopover.fromTemplateUrl('templates/social-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    $ionicModal.fromTemplateUrl('templates/notificaciones-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;

        $scope.modalRightButtons = [
            {
                type: 'button-clear',
                content: 'Cancel',
                tap: function(e) {
                    $scope.modal.hide();
                }
            }];
    });

    $scope.openModal = function() {
        $scope.modal.show();
        $scope.buscarNotificacionPendiente();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        localStorage.setItem("push-"+$rootScope.datos.cedula, angular.toJson($scope.notificacionesAlmacenadas));
        $scope.buscarNotificacionPendiente();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.abrirLink = function(indice){
        var url="";
        switch(indice){
            case 0:
                url='https://twitter.com/Novaventa_Catg/';
                GA.trackEvent($rootScope.gaPlugin, "Social", "Twitter", indice);
                break;
            case 1:
                url='https://www.facebook.com/novaventa/';
                GA.trackEvent($rootScope.gaPlugin, "Social", "Facebook", indice);
                break;
            case 2:
                url='https://www.youtube.com/user/novaventaoficial/';
                GA.trackEvent($rootScope.gaPlugin, "Social", "Youtube", indice);
                break;
            case 3:
                url='https://es.pinterest.com/novaventa/';
                GA.trackEvent($rootScope.gaPlugin, "Social", "Pinterest", indice);
                break;
        }
        window.open(url, '_system', 'location=yes');
    };

    $scope.versionPruebas = function() {
        return !$rootScope.versionProduccion;
    }

    $scope.cambiarServidor = function() {
        var servidor = prompt("Ingresa el número del servidor")
        $rootScope.configuracion = { instancia: "AntaresSecureWebServices" + servidor };

        $scope.cerrarSesion();
    }

    $scope.cerrarSesion = function() {
        if(localStorage && localStorage.cedula){
            localStorage.removeItem("cedula");
            localStorage.removeItem("me_fechaConsultaNotificaciones");
            localStorage.removeItem("me_notificaciones");
        }
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        //Eliminar toda las variables de estado de carga de información de pantallas
        $rootScope.cargaDatos = { ventanaMiPedido: null, ventanaMisPuntos: null, ventanaInformacionFechas: null, ventanaBuzones: null, popupMamaNueva: null };

        $location.path('/app/login');
    };

    $scope.validarFecha = function(fecha){
        $scope.fechaNotificacion=new Date(Utilidades.validarFormatoFecha(fecha));
        return $scope.fechaNotificacion;
    }

    $scope.mostrarNotificacion = function(notificacion){
        var titulo;
        if(notificacion.titulo)titulo=notificacion.titulo;
        else titulo="Notificación Mamá Empresaria"
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: notificacion.mensaje
        });

        alertPopup.then(function(res) {
            notificacion.leido=true;
            if(notificacion.url){
                window.open(notificacion.url);
            }
        });
    }

    $scope.alternar = function(alternar){
        if(alternar)
            return "item item-icon-left detalle-item alternate";
        else
            return "item item-icon-left detalle-item";
    }

    $scope.vistaPrevia = function(notificacion, tamañoDefecto){
        $scope.validarFecha(notificacion.fecha);
        var arregloSplit=notificacion.mensaje.split(" ");
        var tamaño=arregloSplit.length>=tamañoDefecto?tamañoDefecto:arregloSplit.length;
        var previa="";
        for(var i=0; i<tamaño; i++){
            var separador;
            if(i<tamañoDefecto-1)separador=" ";
            else separador="...";
            previa=previa+arregloSplit[i]+separador;
        }
        return previa;
    }

    $scope.hayNotificaciones = function(){
        if($scope.hayNotificacionesNuevas()){
            return "button button-icon ion-email icono-header-menu circle";
        }else{
            return "button button-icon button-clear ion-email icono-header-menu";   
        }
    }

    $scope.hayNotificacionesNuevas = function(){
        return $rootScope.notificacionesNuevas && $rootScope.notificacionesNuevas.length > 0;
    }

    $scope.buscarNotificacionPendiente = function(){
        $scope.contNotificaciones=0;
        $scope.notificacionesAlmacenadas = $rootScope.notificacionesHistorial; //JSON.parse(localStorage.getItem("push-"+$rootScope.datos.cedula));
    }

    $scope.irACambioClave = function() {
        //$ionicHistory.nextViewOptions({ disableBack: false });
        $location.path('/app/cambio-clave-actual');
    };
})

.controller('TabsCtrl', function($scope, $rootScope, $state, $filter, $ionicActionSheet, Pedido) {

    $scope.mostrarMiNegocio = function(){
        return Number($rootScope.datos.cupo) > 0 || Math.abs(Number($rootScope.datos.saldo)) > 0;
    }

    $scope.mostrarBadge = function(){
        return Pedido.hayPedido() && Pedido.estadoEncontrado('Novedad')
            && !Pedido.estadoEncontrado('Anulado')
            && !Pedido.estadoEncontrado('Facturado')
            && Pedido.hayNovedadGestionable();
    }

    $scope.cantidadBadge = function(){
        if($scope.mostrarBadge()){
            return "1";
        }else{
            return "";
        }
    }

    $scope.condicionChat = function(){
        $scope.dato = $rootScope.dato;
        console.log("FIREBASE SEGMENTO", $scope.dato.segmentos);
        console.log("FIREBASE SEGMENTO", $scope.dato.zonas);
        if(!$rootScope.versionProduccion){
            if((!$scope.dato.segmentos || $scope.dato.segmentos.indexOf($rootScope.datos.segmento)!=-1) && (!$scope.dato.zonas  || $scope.dato.zonas.indexOf($rootScope.zona)!=-1)){
                return true;
            }
        }
    }

    $scope.irAPedido = function() {
        $state.go('app.menu.tabs.mipedido');
    }

    $scope.mostrarOpcionesMas = function() {
        var botones = [
            { text: 'Mi Negocio' },
            { text: 'Productos no disponibles' },
            { text: 'Buzones'}
        ];

        if($scope.condicionChat()){
            botones.push({ text: 'Chat'});
        }

        var hojaOpciones = $ionicActionSheet.show({

            buttons: botones,
            cancelText: 'Cancelar',
            cancel: function() {
            },
            buttonClicked: function(index) {

                switch(index){
                    case 0:
                        $state.go('app.menu.tabs.mas.minegocio');
                        break;
                    case 1:
                        $state.go('app.menu.tabs.mas.agotados.actual');
                        break;
                    case 2:
                        $state.go('app.menu.tabs.mas.buzones');
                        break;
                    case 3:
                        $state.go('app.menu.tabs.mas.chat');
                        break
                }

                /*if(index == 0){
                         $state.go('app.menu.tabs.mas.minegocio');
                         //$state.go('app.menu.tabs.mas.club.piedrapreciosa');
                         }else{
                         if(index == 1){
                         $state.go('app.menu.tabs.mas.agotados.actual');
                         //$state.go('app.menu.tabs.mas.informacion.fechas');
                         }else{
                         if(hipmob && !$rootScope.datosChatEnviados){

                         $rootScope.datosChatEnviados = true;

                         hipmob.set_name($rootScope.datos.nombre);
                         hipmob.set_context('Cedula:' + $rootScope.datos.cedula + ',' + 'Segmento:' + $rootScope.datos.segmento + ',' + 'Saldo:' + $filter('currency')($rootScope.datos.saldo, '$', 0) );
                         hipmob.open();
                         }
                         //navigator.app.loadUrl($rootScope.urlChat, { openExternal: true });
                         //$state.go('app.menu.tabs.mas.contacto');
                         }
                         }*/

            }
        });
    };

})

.controller('BienvenidaCtrl', function($scope, $state, $rootScope, $ionicHistory, $location) {

    $scope.segmentoFormateado = function(){
        if($rootScope.datos.segmento){
            return $rootScope.datos.segmento.toLocaleLowerCase().replace("í","i");
        }else{
            return "";
        }
    }

    $scope.segmento = function(){
        if($rootScope.datos.segmento){
            return $rootScope.datos.segmento;
        }else{
            return "";
        }
    }

    $scope.nombre = function(){
        if($rootScope.datos.nombre){
            return $rootScope.datos.nombre;
        }else{
            return "Mamá Empresaria";
        }
    }

    $scope.ingresar = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
        });

        $location.path('/app/menu/tabs/home');
        //$state.go('app.menu.tabs.home');
    };

    $scope.test = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
        });

        $location.path('/app/menu/tabs/home');
        //$state.go('app.menu.tabs.home');
    };
})

.controller('PuntosPagoCtrl', function($scope, $rootScope, $ionicLoading, $state, $http, $ionicPopup, PuntosPago, Internet, GA) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Puntos de Pago");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    //Establecer la posición por defecto para el Mapa si no se ha iniciado el GPS
    $rootScope.posicion = { latitud: 6.222611, longitud: -75.57935};

    $scope.mostrarError = true;

    $scope.puntos = function(){
        return $rootScope.puntosPago;
    }

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    $scope.onSuccess = function(position) {

        $ionicLoading.hide();

        $rootScope.posicion = { latitud: position.coords.latitude, longitud: position.coords.longitude};

        if(Internet.get()){

            $scope.loading =  $ionicLoading.show({
                template: 'Estamos buscando los puntos cercanos a ti'
            });

            PuntosPago.get(position.coords.latitude, position.coords.longitude, $http, function(success, data){
                if(success){
                    $ionicLoading.hide();
                    //$scope.puntos = data.puntosDePago;
                    $rootScope.puntosPago = data.puntosDePago;

                }else{
                    $ionicLoading.hide();
                    $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                }

            });

        }else{
            $scope.mostrarAyuda("Puntos de Pago","Por favor verifica tu conexión a internet");
        }


    };

    // onError Callback receives a PositionError object
    //
    $scope.onError =function(error) {

        $ionicLoading.hide();

        console.log('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');

        $rootScope.errorPosicion = true;

        $state.go("app.menu.tabs.puntospago.puntospagomapa");

    }

    if(navigator && navigator.geolocation){
        $scope.loading =  $ionicLoading.show({
            template: 'Estamos detectando tu ubicación'
        });

        navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, { maximumAge: 3000, timeout: 8000, enableHighAccuracy: true });
    }else{
        $scope.mostrarAyuda("Puntos de Pago","Lo sentimos, no es posible detectar tu ubicación, veras los puntos cercanos a tu zona");
        $state.go("app.menu.tabs.puntospago.puntospagomapa");
    }


})

.controller('PuntosPagoMapaCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, PuntosPago, Internet, GA) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Puntos de Pago - Mapa");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.intentosGps = 0;


    $scope.inicializar = function(){

        console.log($rootScope.posicion);

        var myLatlng = new google.maps.LatLng($rootScope.posicion.latitud, $rootScope.posicion.longitud);

        var mapOptions = {
            center: myLatlng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
                                      mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4
            },
            map: map,
            title: 'Novaventa'
        });

        $.each ($rootScope.puntosPago, function(i, val){

            var nombrePunto = val.nombre;
            var direccion = val.direccion;
            var horario = val.horario;

            var marcador = new google.maps.Marker({
                position: new google.maps.LatLng(val.latitud, val.longitud),
                map: map,
                title:  nombrePunto
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<div style="height:60px">' + nombrePunto + '<br />' + direccion + '<br />' + horario + '</div>'
            });

            google.maps.event.addListener(marcador, 'click', function() {
                infowindow.open(map,marcador);
            });
        });

        $scope.map = map;
    }

    $scope.onSuccess = function(position) {

        $ionicLoading.hide();
        clearInterval($scope.interval);

        $rootScope.posicion = { latitud: position.coords.latitude, longitud: position.coords.longitude};

        if(Internet.get()){

            $scope.loading =  $ionicLoading.show({
                template: 'Estamos buscando los puntos cercanos a ti'
            });

            PuntosPago.get(position.coords.latitude, position.coords.longitude, $http, function(success, data){
                if(success){
                    $ionicLoading.hide();
                    $rootScope.puntosPago = data.puntosDePago;

                    $scope.inicializar();

                }else{
                    $ionicLoading.hide();
                    $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                }

            });

        }else{
            $scope.mostrarAyuda("Puntos de Pago","Por favor verifica tu conexión a internet");
        }


    };

    // onError Callback receives a PositionError object
    //
    $scope.onError =function(error) {

        console.log('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');

        $scope.intentosGps = $scope.intentosGps + 1;

    }

    if($rootScope.errorPosicion){
        $scope.mostrarAyuda("Puntos de Pago","Lo sentimos, no podemos encontrar tu ubicación, si dispones de GPS debes prenderlo para mejorar tu experiencia");

        $scope.loading =  $ionicLoading.show({
            template: 'Esperando activación de GPS'
        });

        $scope.interval = setInterval(function(){

            if($scope.intentosGps < 4){
                console.log("intentando leer gps nuevamente");
                navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, { maximumAge: 3000, timeout: 8000, enableHighAccuracy: true });
            }else{
                $ionicLoading.hide();
                clearInterval($scope.interval);

                //Mostrar Puntos Acorde a la Zona de la Mamá
                $scope.loading =  $ionicLoading.show({
                    template: 'Estamos buscando los puntos cercanos tu zona'
                });

                PuntosPago.get(6.222611, -75.57935, $http, function(success, data){
                    if(success){
                        $ionicLoading.hide();
                        $rootScope.puntosPago = data.puntosDePago;

                        $scope.inicializar();

                    }else{
                        $ionicLoading.hide();
                        $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                    }

                });
            }

        }, 4000);
    }else{
        $scope.inicializar();
    }

})

.controller('ContactoCtrl', function($scope, $rootScope) {

    $scope.nombre = function(){
        var nombre = $rootScope.datos.nombre.split(' ');
        return nombre[0].substring(0,1).toUpperCase() + nombre[0].substring(1,nombre[0].length).toLowerCase();
    }

})

.controller('MiNegocioCtrl', function($scope, $rootScope, $ionicPopup, $filter, $ionicModal, Pedido, Mama, $ionicLoading, Utilidades, Internet) {

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });

    $ionicModal.fromTemplateUrl('templates/minegocio-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;

        $scope.modalRightButtons = [
            {
                type: 'button-clear',
                content: 'Cancel',
                tap: function(e) {
                    $scope.modal.hide();
                }
            }];
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.inicializar = function(){

        $scope.listaCL = new Array();
        $scope.valorCL = 0;
        $scope.campana = $rootScope.campana.numero;
        $scope.fechaCalendario = new Date();
        $scope.ano = $scope.fechaCalendario.getFullYear();
        $scope.consultarEstadoPedido($rootScope.numeroPedido, true);

        Mama.getNotasCredito(Utilidades.getAnoCampana(), function (success, data){
            if(success){
                $scope.notasCredito = data;
                $scope.formatoNC();
            }else{
                console.log("En este momento no podemos consultar tu información");
            }
        });
    }

    $scope.formatoNC = function(){
        for(var i=0; i<$scope.notasCredito.listaNC.length; i++){
            for(var j=0; j<$scope.notasCredito.listaNC[i].listaCl.length;j++){
                $scope.listaCL.push($scope.notasCredito.listaNC[i].listaCl[j]);
                $scope.valorCL = $scope.valorCL + parseInt($scope.notasCredito.listaNC[i].listaCl[j].valor);
            }
        }
        console.log("Mi Negocio - ListaCL", $scope.listaCL);
    }

    $scope.alternar = function(alternar){
        if(alternar)
            return "item item-icon-left detalle-item alternate";
        else
            return "item item-icon-left detalle-item";
    }

    $scope.consultarEstadoPedido = function(numeroPedido, deInicializar){
        Pedido.getEstadoPedido(numeroPedido, function (success, data){

            // Se valida si el llamado al método viene desde Inicializar o desde el evento
            // on-click de la barra de campañas
            if(deInicializar){
                // Obliga a los servicios a llamar todo con la campaña actual
                $scope.estadoPedidoData = null;
            }

            if(success){
                $scope.estadoPedidoData = data;
                console.log("Mi Negocio - Estado pedido", data);
            }else{
                console.log("En este momento no podemos consultar tu información " + $scope.estadoPedidoData);
            }
        });
    }

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.mostrarSaldoFavor = function(){
        return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
    }

    $scope.mostrarSaldoPagar = function(){
        return !$scope.mostrarSaldoFavor();
    }

    $scope.cupo = function(){
        return $rootScope.datos.cupo;
    }

    $scope.saldo = function(){
        return Math.abs(Number($rootScope.datos.saldo)) ;
    }

    $scope.flexibilizacion = function(){
        return $rootScope.datos.valorFlexibilizacion;
    }

    $scope.flexibilizacionPago = function(){
        if(isNaN($rootScope.datos.valorFlexibilizacion)) return 0;
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

    $scope.flexibilizacionEjemploPago = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return 0;
        }else{
            return Number($rootScope.datos.saldo)-Number($rootScope.datos.valorFlexibilizacion)/2;
        }
    }

    $scope.flexibilizacionEjemploDeuda = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return Number($rootScope.datos.saldo);
        }else{
            return Number($rootScope.datos.valorFlexibilizacion)/2;
        }
    }

    $scope.mostrarAyudaFlexUso = function(){
        $scope.mostrarAyuda('Recuerda que puedes volver a usar este beneficio una vez canceles la totalidad de tu próximo pedido. Si ya pagaste consulta de nuevo en 24 horas.');
    }


    $scope.mostrarAyudaFlexibilizacion = function() {

        if($scope.flexibilizacionPago() > 0){
            $scope.mostrarAyuda('Mi Negocio','-Estás usando tu flexibilización por un valor de: '+$filter('currency')($scope.flexibUso(), '$', 0)+'<br /><br />-Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.  De ser necesario usa los ' + $filter('currency')($scope.flexibilizacionDeuda(), '$', 0) + ' o parte de estos. Ejemplo: Paga ' +
                                $filter('currency')($scope.flexibilizacionEjemploPago(), '$', 0) + ' y queda debiendo ' +
                                $filter('currency')($scope.flexibilizacionEjemploDeuda(), '$', 0) + ', debes cancelar este valor antes de tu próximo pedido.');
        }else{
            if($scope.flexibilizacionPago() == 0){
                $scope.mostrarAyuda('Mi Negocio','-Estás usando tu flexibilización por un valor de: '+$filter('currency')($scope.flexibUso(), '$', 0)+'<br /><br />-Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.');
            }
        }
    }

    $scope.flexibUso = function() {
        if(!$scope.estadoPedidoData) return 0;
        if($scope.estadoPedidoData.flexibUso == 0){
            return 0;
        }else{
            return Number($scope.estadoPedidoData.flexibUso);
        }
    }

    $scope.ganancia = function() {
        if(!$scope.estadoPedidoData){
            return 0;
        }

        if($scope.estadoPedidoData.ganancia == 0){
            return 0;
        }else{
            return Number($scope.estadoPedidoData.ganancia);
        }
    }

    $scope.aumentarCampanaNegocio = function(){
        if(!Internet.get()){
            $scope.mostrarAyuda("Aumentar campaña","Por favor verifica tu conexión a internet");
            return;
        }

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        if($scope.campana == $rootScope.numeroCampanasAno){
            $scope.campana = 1;
            $scope.ano = $scope.ano + 1;
        }else{
            $scope.campana = $scope.campana + 1;
        }
        $scope.buscarPedido();
    }

    $scope.disminuirCampanaNegocio = function(){
        if(!Internet.get()){
            $scope.mostrarAyuda("Disminuir campaña","Por favor verifica tu conexión a internet");
            return;
        }

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        if($scope.campana == 1){
            $scope.campana = $rootScope.numeroCampanasAno;
            $scope.ano = $scope.ano - 1;
        }else{
            $scope.campana = $scope.campana - 1;
        }
        $scope.buscarPedido();
    }

    $scope.buscarPedido = function(){
        var anoCampana = $scope.ano + "" + $scope.campana;
        Pedido.getPedidoPorCampana(anoCampana, $rootScope.datos.cedula, function (success, data){
            if(success){
                //  Pedido obtenido según la campaña
                $scope.pedidoPorCampana = data.numeroPedido
                if($scope.pedidoPorCampana){
                    $scope.consultarEstadoPedido($scope.pedidoPorCampana, false);
                } else {
                    $scope.estadoPedidoData = null;
                }
                console.log("before hide " + $scope.estadoPedidoData);
                $ionicLoading.hide();
                $scope.$apply();
            }else{
                console.log("No se pudo obtener el pedido por campaña");
            }
        });

        Mama.getNotasCredito(anoCampana, function (success, data){
            if(success){
                $scope.notasCredito = data;
                $scope.formatoNC();
                $scope.$apply();
            }else{
                console.log("En este momento no podemos consultar tu información");
            }
        });
    }

    $scope.esCampagnaActual = function(){
        if($scope.campana == $rootScope.campana.numero){
            return true;
        }
        return false;
    }

})

.controller('AgotadosCampanaCtrl', function($scope, $rootScope, $ionicLoading, Campana, Utilidades) {

    $scope.agotados = function(){
        return $rootScope.agotadosCampana;
    }

    $scope.estiloAlternate = function(indice){
        if (indice % 2 == 0){
            return "alternate";
        }else{
            return "";
        }
    }

    $scope.inicializar = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Buscando Productos no disponibles')
        });

        Campana.getAgotados(function(success, data){

            $ionicLoading.hide();

            if(success){
                $rootScope.agotadosCampana = data.listaCatalogo;
            }else{
                $scope.mostrarAyuda("Productos no disponibles", "No es posible consultar los productos no disponibles");
            }

        });

    }

    $scope.inicializar();

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.mostrarSaldoFavor = function(){
        return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
    }

    $scope.mostrarSaldoPagar = function(){
        return !$scope.mostrarSaldoFavor();
    }

    $scope.cupo = function(){
        return $rootScope.datos.cupo;
    }

    $scope.saldo = function(){
        return Math.abs(Number($rootScope.datos.saldo)) ;
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

    $scope.flexibilizacionEjemploPago = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return 0;
        }else{
            return Number($rootScope.datos.saldo)-Number($rootScope.datos.valorFlexibilizacion)/2;
        }
    }

    $scope.flexibilizacionEjemploDeuda = function(){
        //La flexibilización es mayor que el valor a Pagar?
        if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
            return Number($rootScope.datos.saldo);
        }else{
            return Number($rootScope.datos.valorFlexibilizacion)/2;
        }
    }


    $scope.mostrarAyudaFlexibilizacion = function() {

        if($scope.flexibilizacionPago() > 0){
            $scope.mostrarAyuda('Mi Negocio','Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.  De ser necesario usa los ' + $filter('currency')($scope.flexibilizacionDeuda(), '$', 0) + ' o parte de estos. Ejemplo: Paga ' +
                                $filter('currency')($scope.flexibilizacionEjemploPago(), '$', 0) + ' y queda debiendo ' +
                                $filter('currency')($scope.flexibilizacionEjemploDeuda(), '$', 0) + ', debes cancelar este valor antes de tu próximo pedido.');
        }else{
            if($scope.flexibilizacionPago() == 0){
                $scope.mostrarAyuda('Mi Negocio','Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.');
            }
        }
    }
})

.controller('AgotadosCampanaSiguienteCtrl', function($scope, $rootScope, $ionicLoading, Campana, Utilidades) {
    $scope.agotados = function(){
        return $rootScope.agotadosCampanaSiguiente;
    }

    $scope.estiloAlternate = function(indice){
        if (indice % 2 == 0){
            return "alternate";
        }else{
            return "";
        }
    }

    $scope.inicializar = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Buscando Productos no disponibles')
        });

        Campana.getAgotadosSiguiente(function(success, data){

            $ionicLoading.hide();

            if(success){
                $rootScope.agotadosCampanaSiguiente = data.listaCatalogo;
            }else{
                $scope.mostrarAyuda("Productos no disponibles", "No es posible consultar los productos no disponibles");
            }

        });

    }

    $scope.inicializar();
})

;
