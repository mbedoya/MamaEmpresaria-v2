var moduloControlador = angular.module('novaventa.controllers', ['novaventa.filters'])

    .controller('AppCtrl', function($scope, $state, $rootScope, $ionicHistory) {

        $scope.cerrarSesion = function() {
            console.log("cerrando sesión");

            if(localStorage && localStorage.cedula){
                localStorage.removeItem("cedula");
            }
            $ionicHistory.clearCache();
            $state.go('app.login');
        };
    })
    
    .controller('TabsCtrl', function($scope, $rootScope, $state, $ionicActionSheet) {

        $scope.mostrarMiNegocio = function(){
            return Number($rootScope.datos.cupo) > 0 || Math.abs(Number($rootScope.datos.saldo)) > 0;
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
                    { text: 'Fechas importantes' }
                ],
                cancelText: 'Cancelar',
                cancel: function() {
                },
                buttonClicked: function(index) {

                    if(index == 0){
                        $state.go('app.menu.tabs.mas.informacion.fechas');
                        //$state.go('app.menu.tabs.mas.club.piedrapreciosa');
                    }else{
                        if(index == 1){
                            $state.go('app.menu.tabs.mas.informacion.fechas');
                        }else{
                            $state.go('app.menu.tabs.mas.contacto');
                        }
                    }

                }
            });
        };

    })
    
    .controller('BienvenidaCtrl', function($scope, $state, $rootScope, $ionicHistory) {

       $scope.segmentoFormateado = function(){
            if(localStorage){
               return localStorage.segmento.toLocaleLowerCase().replace("í","i");     
            }else{
               return ""; 
            }
        }
        
        $scope.segmento = function(){
            if(localStorage){
               return localStorage.segmento;     
            }else{
               return ""; 
            }
        }
        
        $scope.nombre = function(){
            if(localStorage){
               return localStorage.nombre;     
            }else{
               return "Mamá Empresaria"; 
            }
        }

        $scope.ingresar = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        
            $state.go('app.menu.tabs.home');
        };
    })

    .controller('MisPuntosCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $http, Mama, Internet, GA) {

         //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Mis Puntos");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         }; 
         
         $scope.inicializar = function(){
            if(Internet.get()){
        
           $scope.loading =  $ionicLoading.show({
                    template: 'Estamos consultando tus puntos'
                });
          
            Mama.getPuntos($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                if(success){
					$ionicLoading.hide();
                    $rootScope.puntos = data;

                }else{
                    $ionicLoading.hide();
                    $scope.mostrarAyuda("Mis Puntos","En este momento no podemos acceder a tu información");
                }
            });
          }else{
            $scope.mostrarAyuda("Mis Puntos","Por favor verifica tu conexión a internet");
          }  
         }
        
        $scope.$on('online', function(event, args){
           $scope.inicializar();
        });
        
        $scope.inicializar();
        
        $scope.mostrarPremios = function(){
           $state.go('app.menu.tabs.mispuntos.mispremiosredimidos');
           //href="#/app/menu/tabs/mispremiosredimidos"
        }

        $scope.campanaVencimientoPuntos = function(){
            return String($rootScope.puntos.agnoCampagnaVencimiento).substr(4,2) + " de " + String($rootScope.puntos.agnoCampagnaVencimiento).substr(0,4);
        }

        $scope.puntosDisponibles = function(){
            return $rootScope.puntos.puntosDisponibles;
        }

        $scope.puntosPorPerder = function(){
            return $rootScope.puntos.puntosPorPerder;
        }

        $scope.puntosAVencer = function(){
            return $rootScope.puntos.puntosAVencer;
        }

        $scope.puntosRedimidos = function(){
            return $rootScope.puntos.puntosRedimidos;
        }
        
        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }

        $scope.mostrarPuntosRedimidos = function(){
            return $rootScope.puntos.puntosRedimidos && Number($rootScope.puntos.puntosRedimidos) > 0;
        }

        $scope.mostrarPuntosAVencer = function(){
            return $rootScope.puntos.puntosAVencer && Number($rootScope.puntos.puntosAVencer) > 0;
        }

        $scope.mostrarPuntosPorPerder = function(){
            return $rootScope.puntos.puntosPorPerder && Number($rootScope.puntos.puntosPorPerder) > 0;
        }

    })
    
    .controller('MiPedidoCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA) {

        //Registro en Analytics
        GA.trackPage($rootScope.gaPlugin, "Mi Pedido");

        $scope.mostrarAyuda = function(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
                });
            };
            
            
        $scope.agotados = function(){
           console.log($rootScope.agotados.agotadosME);
           return $rootScope.agotados.agotadosME;
        }
        
        $scope.inicializar = function(){

            /*
            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: 'Estamos consultando el estado de tu pedido'
                });

                Mama.getTrazabilidadPedido($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                    if(success){
                        $ionicLoading.hide();
                        $rootScope.pedido = data;

                        Mama.getAgotadosPedido($rootScope.pedido.numeroPedido, $rootScope, $http, function (success, data){
                            if(success){
                                //$ionicLoading.hide();
                                $rootScope.agotados = data;

                                console.log($rootScope.agotados);

                            }else{
                                //$ionicLoading.hide();
                                //$scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
                            }
                        });

                        console.log("Pedido");
                        console.log($rootScope.pedido);

                    }else{
                        $ionicLoading.hide();
                        $scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
                    }
                });


            }else{
                $scope.mostrarAyuda("Mi Pedido","Por favor verifica tu conexión a internet");
            }

            */

        }
        
        $scope.$on('online', function(event, args){
           $scope.inicializar();
        });
        
        $scope.inicializar();
        
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
        
        $scope.fechaRepartoPedido = function(){
            var fecha = '';
            for (i = 0; i < $rootScope.fechas.length; i++){
                if($rootScope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1'){
                     fecha = $rootScope.fechas[i].fecha;
                     break;
                }
            }
            return fecha;
       }
        
        $scope.estadoEncontrado = function(estado){
           var encontrado = false;
           
           if($rootScope.pedido && $rootScope.pedido.historiaEstados){
             for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) { 
              if($scope.cambiarNombreEstado($rootScope.pedido.historiaEstados[i].estado) == estado){
                 encontrado = true;
                 break;
              }
             }
           }
           
           return encontrado;
        }
        
        $scope.buscarEstado = function(estado){
           var miestado = null;
           
           if($rootScope.pedido && $rootScope.pedido.historiaEstados){
             for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) { 
              if($scope.cambiarNombreEstado($rootScope.pedido.historiaEstados[i].estado) == estado){
                 miestado = $rootScope.pedido.historiaEstados[i];
                 break;
              }
             }
           }
           
           return miestado;
        }

        $scope.cambiarNombreEstado = function(nombre){

            if(nombre.toLowerCase() == "ingresado" || nombre.toLowerCase() == "ingresada"){
                return "Recibido";
            }else{
                if(nombre.toLowerCase() == "en línea"){
                    return "En proceso de empaque";
                }else{

                    if(nombre.toLowerCase() == "cargue"){
                        return "Entregado al transportador";
                    }else{
                        return nombre;
                    }
                }
            }
        }

        $scope.fechaCorreteo = function(){
            fecha = null;
            for (i = 0; i < $rootScope.fechas.length; i++){
                if($rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                     fecha = $rootScope.fechas[i].fecha;
                     break;
                }
            }
            return fecha;
        }

        $scope.mostrarNovedad = function(novedad){
            var mostrar = false;
            if(novedad.toLowerCase().indexOf('morosa')>=0 ||
                novedad.toLowerCase().indexOf('tope')>=0){
                mostrar = true;
            }
            return mostrar;
        }

        $scope.padStr = function(i) {
           return (i < 10) ? "0" + i : "" + i;
        }
        
        $scope.hoyEsCorreteo = function(){
        
           var temp = new Date();
           var dateStr = $scope.padStr(temp.getFullYear()) + "-" +
                  $scope.padStr(1 + temp.getMonth()) + "-" +
                  $scope.padStr(temp.getDate());
           
           correteo = false;
            for (i = 0; i < $rootScope.fechas.length; i++){
                if($rootScope.fechas[i].fecha == dateStr){
                     correteo = true;
                     break;
                }
            }
            return correteo;
        }
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
    
    .controller('InformacionFechasCtrl', function($scope, $rootScope, $ionicLoading, $state, $ionicPopup, $http, Mama) {

            $scope.mostrarAyuda = function(titulo, mensaje) {
                var alertPopup = $ionicPopup.alert({
                    title: titulo,
                    template: mensaje
                });
            };

            $scope.padStr = function(i) {
                return (i < 10) ? "0" + i : "" + i;
            }

            $scope.estiloTexto = function(fecha){
                var fechaActual = $scope.fechaCalendario;

                var dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
                    $scope.padStr(1 + fechaActual.getMonth()) + "-" +
                    fechaActual.getDate();

                if(fecha == dateStr){
                    return "assertive";
                }else{
                    return "";
                }
            }

            $scope.fechaVisibleCalendario = function(){
                return $scope.fechaCalendario;
            }

            $scope.mostrarAtras = function(){
                return $scope.campana > $rootScope.campana.numero;
            }

            $scope.mesAnterior = function(){

                //Establecer la fecha al día 1 del mes actual
                var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                    $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';

                //Devolverse 1 mes
                $scope.fechaCalendario = new Date(cadenaFecha);
                $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() - 2);

                //Establecer la fecha al día 1 del mes siguiente
                //La fecha se está retornando 1 día al hacer el new Date()
                //, no se sabe la razón, por esto se pone 02
                cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                    $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';

                return new Date(cadenaFecha);
            }

            $scope.disminuirMes = function(){

                $scope.loading =  $ionicLoading.show({
                    template: 'Cargando información de campaña.'
                });

                $scope.fechaCalendario = $scope.mesAnterior();

                //Disminuir la campana
                $scope.campana = $scope.campana - 1;

                Mama.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana, $rootScope.zona, $rootScope, $http, function (success, data){
                    if(success){
                        $scope.fechas = data.listaRecordatorios;

                        //Generar el calendario nuevamente
                        $scope.semanasCalendario();

                        $ionicLoading.hide();

                    }else{
                        $ionicLoading.hide();
                        $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
                    }
                });
            }

            $scope.aumentarMes = function(){

                $scope.loading =  $ionicLoading.show({
                    template: 'Cargando información de campaña.'
                });

                //Establecer la fecha al día 1 del mes actual
                var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                    $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';

                //Moverse 1 mes
                $scope.fechaCalendario = new Date(cadenaFecha);
                $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() + 32);

                //Establecer la fecha al día 1 del mes siguiente
                //La fecha se está retornando 1 día al hacer el new Date()
                //, no se sabe la razón, por esto se pone 02
                cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                    $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';

                $scope.fechaCalendario = new Date(cadenaFecha);

                //Aumentar la campana
                $scope.campana = $scope.campana + 1;

                Mama.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana, $rootScope.zona, $rootScope, $http, function (success, data){
                    if(success){
                        $scope.fechas = data.listaRecordatorios;

                        //Generar el calendario nuevamente
                        $scope.semanasCalendario();

                        $ionicLoading.hide();

                    }else{
                        $ionicLoading.hide();

                        $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
                    }
                });
            }

            $scope.numeroCampana = function(){
                return $scope.campana;
            }

            $scope.fechaEsCampanaVisible = function(fecha){

                encontrado = false;

                var fechaCalendario = new Date(fecha);

                var cadenaFechaCorreteo = '';
                //Buscar la fecha de encuentro
                for (i = 0; i < $scope.fechas.length; i++){
                    if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                        cadenaFechaCorreteo = $scope.fechas[i].fecha;
                        break;
                    }
                }

                var fechaCorreteo = new Date(cadenaFechaCorreteo);

                //Buscar la fecha de inicio de la campaña
                var fechaMinimaCampana = new Date(cadenaFechaCorreteo);
                fechaMinimaCampana.setDate(fechaMinimaCampana.getDate()-21);

                for (i = 0; i < $scope.fechas.length; i++){
                    if(fechaCalendario <= fechaCorreteo &&
                        fechaCalendario >= fechaMinimaCampana){
                        encontrado = true;
                        break;
                    }
                }
                return encontrado;

            }

            $scope.fechaEsCorreteo = function(fecha){
                encontrado = false;
                for (i = 0; i < $scope.fechas.length; i++){
                    if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo' &&
                        $scope.fechas[i].fecha == fecha ){
                        encontrado = true;
                        break;
                    }
                }

                //Si no se ha encontrado buscar en la siguiente campana
                if(!encontrado && $scope.fechasSiguienteCampana){
                    for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                        if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'fecha correteo' &&
                            $scope.fechasSiguienteCampana[i].fecha == fecha ){
                            encontrado = true;
                            break;
                        }
                    }
                }

                return encontrado;
            }

            $scope.fechaEsEncuentro = function(fecha){
                encontrado = false;
                for (i = 0; i < $scope.fechas.length; i++){
                    if($scope.fechas[i].actividad.toLowerCase() == 'encuentro' &&
                        $scope.fechas[i].fecha == fecha ){
                        encontrado = true;
                        break;
                    }
                }

                //Si no se ha encontrado buscar en la siguiente campana
                if(!encontrado && $scope.fechasSiguienteCampana){
                    for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                        if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'encuentro' &&
                            $scope.fechasSiguienteCampana[i].fecha == fecha ){
                            encontrado = true;
                            break;
                        }
                    }
                }

                return encontrado;
            }

            $scope.fechaEsRepartoPedido = function(fecha){
                encontrado = false;
                for (i = 0; i < $scope.fechas.length; i++){
                    if($scope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1' &&
                        $scope.fechas[i].fecha == fecha ){
                        encontrado = true;
                        break;
                    }
                }

                //Si no se ha encontrado buscar en la siguiente campana
                if(!encontrado && $scope.fechasSiguienteCampana){
                    for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                        if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'reparto de pedido 1' &&
                            $scope.fechasSiguienteCampana[i].fecha == fecha ){
                            encontrado = true;
                            break;
                        }
                    }
                }

                return encontrado;
            }

            $scope.seleccionarFecha = function(fecha){

                if($scope.cadenaFechaSeleccionada != ''){
                    $("#" + $scope.cadenaFechaSeleccionada).removeClass("positive");
                }

                $scope.cadenaFechaSeleccionada = fecha;
                $("#" + $scope.cadenaFechaSeleccionada).addClass("positive");

                var fechaEsCorreteo = false;
                var fechaEsRepartoPedido = false;

                var listaEventos = new Array();

                for (i = 0; i < $scope.fechas.length; i++){
                    if($scope.fechas[i].fecha == fecha){
                        listaEventos.push($scope.fechas[i]);
                        if($scope.fechas[i].actividad.toLowerCase() == "fecha correteo"){
                            fechaEsCorreteo = true;
                        }
                        if($scope.fechas[i].actividad.toLowerCase() == "reparto de pedido 1"){
                            fechaEsRepartoPedido = true;
                        }
                    }
                }

                if($scope.fechasSiguienteCampana && $scope.fechasSiguienteCampana.length > 0 ){
                    for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                        if($scope.fechasSiguienteCampana[i].fecha == fecha){
                            listaEventos.push($scope.fechas[i]);
                            if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "fecha correteo"){
                                fechaEsCorreteo = true;
                            }
                            if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "reparto de pedido 1"){
                                fechaEsRepartoPedido = true;
                            }
                        }
                    }
                }

                $scope.fechaSeleccionada = new Date(fecha);
                //Esto se hace por bug en manejo de fechas
                $scope.fechaSeleccionada.setDate($scope.fechaSeleccionada.getDate() + 1);

                //Si la fecha es correteo mostramos una información diferente
                if(fechaEsCorreteo){
                    listaEventos = [];
                    listaEventos.push({ "actividad": "Monta tu pedido este día, por la Página web, antes de las 12 del medio día." });
                    listaEventos.push({ "actividad": "Cancela tu pedido anterior este día antes de las 4 de la tarde." });
                }

                if(fechaEsRepartoPedido){
                    listaEventos = [];
                    listaEventos.push({ "actividad": "Posible entrega de pedido." });
                }

                $scope.detalleFecha = listaEventos;
            }

            $scope.semanasCalendario = function(){

                //Obtener los recordatorios de la siguiente campana
                Mama.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana+1, $rootScope.zona, $rootScope, $http, function (success, data){
                    if(success){
                        $scope.fechasSiguienteCampana = data.listaRecordatorios;
                    }else{

                    }
                });

                var fechaActual = $scope.fechaCalendario;

                var dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
                    $scope.padStr(1 + fechaActual.getMonth()) + "-" +
                    $scope.padStr('01');

                var primerDiaMes = new Date(dateStr).getDay();
                var inicioMes = new Date(dateStr);

                //Objeto con todas las semanas
                var semanas = new Array();

                var finMes = false;
                var diaMes = 0;
                var indiceDias = 0;
                var mesActual = fechaActual.getMonth();
                var reiniciarDia = true;

                while(!finMes){

                    //Objeto con cada semana
                    var semana = new Array();
                    //Si no hay registros entonces adicionar a la primera semana los registros necesarios del mes anterior

                    if(semanas.length == 0){
                        for(j=primerDiaMes; j>0; j--){
                            var fechaAnterior = new Date(dateStr);
                            fechaAnterior.setDate(-j+1);
                            semana.push({ "dia": fechaAnterior.getDate(),
                                "fechaCompleta":  $scope.padStr(fechaAnterior.getFullYear()) + "-" +
                                    $scope.padStr(1 + fechaAnterior.getMonth()) + "-" +
                                    $scope.padStr(fechaAnterior.getDate())
                            });
                        }
                        for(i=0; i<7-primerDiaMes; i++){

                            var nuevaFecha = new Date();
                            nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                            if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                                diaMes = 0;
                                reiniciarDia = false;
                            }
                            semana.push({ "dia": diaMes + 1,
                                "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                    $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                    $scope.padStr(nuevaFecha.getDate())
                            });
                            indiceDias++;
                            diaMes++;
                        }
                    }else{
                        for(i=0; i<7; i++){

                            var nuevaFecha = new Date();
                            nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                            if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                                diaMes = 0;
                                finMes = true;
                                reiniciarDia = false;
                            }
                            semana.push({ "dia": diaMes + 1,
                                "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                    $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                    $scope.padStr(nuevaFecha.getDate())
                            });
                            indiceDias++;
                            diaMes++;
                        }
                    }

                    //al terminar la semana verificar nuevamente si el inicio de la semana entrante no corresponde a
                    //otro mes
                    var nuevaFecha = new Date();
                    nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                    if(nuevaFecha.getMonth() != mesActual){
                        finMes = true;
                    }

                    semanas.push(semana);
                }

                $scope.semanas = semanas;
            }

            $scope.inicializar = function(){

                $scope.cadenaFechaSeleccionada = '';

                $scope.detalleFecha = null;

                $scope.semanas = null;

                //El calendario inicia en el mes actual
                $scope.fechaCalendario = new Date();

                $scope.fechaSeleccionada = $scope.fechaCalendario;

                //Fechas de la campana que se está visualizando
                $scope.fechas = $rootScope.fechas;

                $scope.campana = $rootScope.campana.numero;

                $scope.semanasCalendario();

                //Seleccionar la fecha actual
                $scope.seleccionarFecha($scope.padStr($scope.fechaCalendario.getFullYear()) + "-" +
                    $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" +
                    $scope.fechaCalendario.getDate());

            }

            $scope.$on('online', function(event, args){
                $scope.inicializar();
            });

            $scope.$on('loggedin', function(event, args){
                $scope.inicializar();
            });

            $scope.inicializar();

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
                $scope.mostrarAyuda('Mi Negocio','Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.  De ser necesario usa los ' + $filter('currency')($scope.flexibilizacionDeuda()) + ' o parte de estos. Ejemplo: Paga ' +
                $filter('currency')($scope.flexibilizacionEjemploPago()) + ' y queda debiendo ' +
                $filter('currency')($scope.flexibilizacionEjemploDeuda()) + ', debes cancelar este valor antes de tu próximo pedido.');
            }else{
                if($scope.flexibilizacionPago() == 0){
                    $scope.mostrarAyuda('Mi Negocio','Este beneficio te permite cubrir parte de tu pago en caso de tener inconvenientes con tus clientes.');
                }
            }
        }

    })

;
