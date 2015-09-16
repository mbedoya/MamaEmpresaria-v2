var moduloControlador = angular.module('novaventa.controllers', ['novaventa.filters'])

        .controller('AppCtrl', function($scope, $state, $rootScope, $location, $ionicHistory) {

            $scope.cerrarSesion = function() {
                if(localStorage && localStorage.cedula){
                    localStorage.removeItem("cedula");
                }
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $location.path('/app/login');
            };

            $scope.irACambioClave = function() {
                $location.path('/app/cambio-clave-actual');
            };
        })

        .controller('TabsCtrl', function($scope, $rootScope, $state, $ionicActionSheet, Pedido) {

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

            $scope.mostrarOpcionesMas = function() {
                //Mostrar las opciones
                var hojaOpciones = $ionicActionSheet.show({

                    /*

                     buttons: [
                     { text: 'Club de Privilegios' },
                     { text: 'Información general' },
                     { text: 'Contacto' }
                     ],

                     */
                    buttons: [
                        { text: 'Mi Negocio' },
                        { text: 'Productos no disponibles' }
                    ],
                    cancelText: 'Cancelar',
                    cancel: function() {
                    },
                    buttonClicked: function(index) {

                        if(index == 0){
                            $state.go('app.menu.tabs.mas.minegocio');
                            //$state.go('app.menu.tabs.mas.club.piedrapreciosa');
                        }else{
                            if(index == 1){
                                $state.go('app.menu.tabs.mas.agotados.actual');
                                //$state.go('app.menu.tabs.mas.informacion.fechas');
                            }else{
                                //navigator.app.loadUrl($rootScope.urlChat, { openExternal: true });
                                //$state.go('app.menu.tabs.mas.contacto');
                            }
                        }

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
                    disableBack: true
                });

                $location.path('/app/menu/tabs/home');
                //$state.go('app.menu.tabs.home');
            };

            $scope.test = function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true
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

        .controller('MiNegocioCtrl', function($scope, $rootScope, $ionicPopup, $filter) {

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
