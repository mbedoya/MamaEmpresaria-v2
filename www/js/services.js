/*
 Guía de datos de que la aplicación maneja
 Los datos se almacenan generalmente en $rootScope.

 Configuracion
 $rootScope.configuracion.ip_servidores
 $rootScope.numeroCampanasAno
 $rootScope.lineaAtencion
 $rootScope.correo

 Informacion basica
 $rootScope.datos.nombre
 $rootScope.datos.segmento
 $rootScope.datos.cupo
 $rootScope.datos.saldo
 $rootScope.datos.valorFlexibilizacion
 $rootScope.zona

 Campana
 $rootScope.campana.numero
 $rootScope.campana.fechaMontajePedido
 $rootScope.campana.fechaEncuentro
 $rootScope.campana.fechaReparto
 $rootScope.campana.diasEnEjecucion

 Recordatorios - Informacion de campana para la zona de la Mamá
 $rootScope.fechas
 $rootScope.fechasAnteriores - Campaña anterior a la operativa

 Pedido
 $rootScope.pedido
 $rootScope.pedido.razonRechazo - Indica mensaje cuando no hay pedido para la Mama

 Puntos
 $rootScope.puntos.puntosDisponibles
 $rootScope.puntos.puntosPorPerder
 $rootScope.puntos.puntosAVencer
 $rootScope.puntos.puntosRedimidos

 */


angular.module('novaventa.services', [])
    .factory('Pedido', function($rootScope, $http, Utilidades){

        var self = this;

        return {
            hayPedido: function(){
				if($rootScope.pedido){
				   if(!$rootScope.pedido.razonRechazo){
				      return true;
				   }
				}
				
				return false;
            },
            hayNovedadGestionable: function(){
               var novedad = false;

                if($rootScope.pedido && $rootScope.pedido.historiaEstados){
                    for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) {
                        if($rootScope.pedido.historiaEstados[i].motivo && 
                             ( $rootScope.pedido.historiaEstados[i].motivo.toLowerCase().indexOf('cupo') >= 0 ||
                                $rootScope.pedido.historiaEstados[i].motivo.toLowerCase().indexOf('morosa') >= 0 
                              ) 
                           ){
                            novedad = true;
                            break;
                        }
                    }
                }

                return novedad;
            },
            getTrazabilidad: function(cedula, fx) {
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            buscarEstado: function(estado){
                var miestado = null;

                if($rootScope.pedido && $rootScope.pedido.historiaEstados){
                    for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) {
                        if(Utilidades.cambiarNombreEstadoPedido($rootScope.pedido.historiaEstados[i].estado) == estado){
                            miestado = $rootScope.pedido.historiaEstados[i];
                            break;
                        }
                    }
                }

                return miestado;
            },
            estadoEncontrado: function(estado){
                var encontrado = false;

                if($rootScope.pedido && $rootScope.pedido.historiaEstados){
                    for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) {
                        if(Utilidades.cambiarNombreEstadoPedido($rootScope.pedido.historiaEstados[i].estado) == estado){
                            encontrado = true;
                            break;
                        }
                    }
                }

                return encontrado;
            }

        }
    })

    .factory('Campana', function($rootScope, $http, Utilidades){

        var self = this;

        return {
            hoyEsCorreteo: function(){
                var realizado = false;

                if($rootScope.fechas && $rootScope.fechas.length > 0){

                    for (i = 0; i < $rootScope.fechas.length; i++){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                            if(Utilidades.formatearFechaActual() == $rootScope.fechas[i].fecha){
                                realizado = true;
                                break;
                            }
                        }
                    }
                }
                return realizado;
            },
            hoyEsEncuentro: function(){
                var realizado = false;

                if($rootScope.fechas && $rootScope.fechas.length > 0){

                    for (i = 0; i < $rootScope.fechas.length; i++){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'encuentro'){
                            if(Utilidades.formatearFechaActual() == $rootScope.fechas[i].fecha){
                                realizado = true;
                                break;
                            }
                        }
                    }
                }

                return realizado;
            },
            campanaFinalizada: function(){
                var realizado = false;

                var fechaActual = new Date(Utilidades.formatearFechaActual());

                if($rootScope.fechas && $rootScope.fechas.length > 0){

                    for (i = 0; i < $rootScope.fechas.length; i++){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                            if(fechaActual > new Date($rootScope.fechas[i].fecha)){
                                realizado = true;
                                break;
                            }
                        }
                    }
                }

                return realizado;
            },
            encuentroRealizado: function(){
                var realizado = false;

                if($rootScope.fechas && $rootScope.fechas.length > 0){

                    for (i = 0; i < $rootScope.fechas.length; i++){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'encuentro'){
                            if(new Date() >= new Date($rootScope.fechas[i].fecha)){
                                realizado = true;
                                break;
                            }
                        }
                    }
                }

                return realizado;
            },
            getRecordatoriosCampanaOperativa: function(fx){

                var zona = $rootScope.zona;
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + zona;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getRecordatorios: function(ano, campana, zona, fx){
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/"+ ano +"/" + campana + "/" + zona;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            }
        }
    })

    .factory('Mama', function(Campana, Pedido, Utilidades, $rootScope, $http) {

        return {
            autenticar: function(cedula, rootScope, http, filter, factoryMama, fx) {
                http.get(rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/validacionAntares/" + cedula +"/1").
                    success(function(data, status, headers, config) {

                        var mensajeError;

                        //Error en la autenticación?
                        if(data && data.razonRechazo){

                            if(data.razonRechazo == "El usuario no se encuentra registrado en Antares."){
                                mensajeError = "Lo sentimos no existe información para esta cédula. Comunícate con la Línea de Atención";
                            }else{
                                mensajeError = data.razonRechazo;
                            }
                        }else{

                            //Tipo de usuario recibido?
                            if(data.tiposUsuarios && data.tiposUsuarios.length > 0 && (data.tiposUsuarios[0] == "1" || data.tiposUsuarios[0] == "3")){

                                //Establecer los datos de resumen de la Mamá
                                rootScope.datos.nombre = data.nombreCompleto;
                                rootScope.datos.segmento = data.clasificacionValor;
                                rootScope.datos.cupo = data.cupo;
                                rootScope.datos.saldo = data.saldoBalance;
                                rootScope.datos.valorFlexibilizacion = data.valorFlexibilizacion;
                                rootScope.zona = data.listaZonas[0];

                                rootScope.campana = {numero: '-', fechaMontajePedido:'-', fechaEncuentro:'-', fechaCorreteo: '-', fechaMontajePedido: '-', diasEnEjecucion: ''};

                                //Obtener el estado del pedido
                                Pedido.getTrazabilidad(rootScope.datos.cedula, function (success, data){
                                    if(success){
                                        rootScope.pedido = data;
                                    }else{
                                    }
                                });

                                //Obtener la campaña operativa
                                Campana.getRecordatoriosCampanaOperativa(function (success, data){
                                    if(success){

                                        //Obtener la fecha de montaje de pedido (Encuentro)
                                        encuentro = '';

                                        correteo = '';
                                        for (i = 0; i < data.listaRecordatorios.length; i++){
                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                                encuentro = data.listaRecordatorios[i].fecha;
                                            }
                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                correteo = data.listaRecordatorios[i].fecha;
                                            }
                                        }

                                        rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro,
                                            fechaCorreteo: correteo, fechaReparto: '',  diasEnEjecucion: ''};

                                        rootScope.fechas = data.listaRecordatorios;

                                        //Buscar si el encuentro ya se ha realizado, si es así entonces se debe ir a la
                                        //siguiente campaña
                                        if(Campana.campanaFinalizada() ||
                                            ( Campana.encuentroRealizado() && ( Pedido.estadoEncontrado('Novedad') || Pedido.estadoEncontrado('Facturado')  ) )){

                                            var ano = new Date().getFullYear();
                                            var siguienteCampana = rootScope.campana.numero + 1;
                                            //Si la siguiente campana supera al numero de campanas al
                                            //ano entonces moverse a la campana 1 del siguiente ano
                                            if(siguienteCampana > rootScope.numeroCampanasAno){
                                                siguienteCampana = 1;
                                                ano = ano + 1;
                                            }

                                            //Obtener la campaña siguiente
                                            Campana.getRecordatorios(ano, siguienteCampana, rootScope.zona, function (success, data){
                                                if(success){

                                                    //Obtener la fecha de montaje de pedido (Encuentro)
                                                    encuentro = '';

                                                    //Obtener la fecha de Correteo
                                                    correteo = '';

                                                    for (i = 0; i < data.listaRecordatorios.length; i++){
                                                        if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                                            encuentro = data.listaRecordatorios[i].fecha;
                                                        }

                                                        if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                            correteo = data.listaRecordatorios[i].fecha;
                                                        }
                                                    }

                                                    //Obtener la fecha de reparto. Esta es la campaña anterior si me muevo
                                                    reparto = '';

                                                    for (i = 0; i < rootScope.fechas.length; i++){
                                                        if(rootScope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1'){
                                                            reparto = rootScope.fechas[i].fecha;
                                                        }
                                                    }

                                                    //Correteo Anterior
                                                    correteoAnterior = ''
                                                    for (i = 0; i < rootScope.fechas.length; i++){
                                                        if(rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                                                            correteoAnterior = rootScope.fechas[i].fecha;
                                                        }
                                                    }

                                                    var diferenciaDias = Utilidades.diferenciaFechaDias(new Date(correteoAnterior), new Date());

                                                    rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro,
                                                        fechaCorreteo: correteo, fechaReparto: reparto,  diasEnEjecucion: diferenciaDias};
                                                    rootScope.fechasAnteriores = rootScope.fechas;
                                                    rootScope.fechas = data.listaRecordatorios;

                                                    console.log("Moviendose a nueva camapaña " + rootScope.campana.numero);

                                                }else{
                                                }
                                            });

                                        }else{

                                            //Obtener la campaña anterior
                                            var ano = new Date().getFullYear();
                                            var siguienteCampana = rootScope.campana.numero - 1;
                                            //Si la siguiente campana supera al numero de campanas al
                                            //ano entonces moverse a la campana 1 del siguiente ano
                                            if(siguienteCampana == 0){
                                                siguienteCampana = rootScope.numeroCampanasAno;
                                                ano = ano - 1;
                                            }

                                            Campana.getRecordatorios(ano, siguienteCampana, rootScope.zona, function (success, data){
                                                if(success){
                                                    rootScope.fechasAnteriores = data.listaRecordatorios;

                                                    //Obtener la fecha de Correteo
                                                    correteo = '';

                                                    for (i = 0; i < data.listaRecordatorios.length; i++){
                                                        if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                            correteo = data.listaRecordatorios[i].fecha;
                                                        }
                                                    }

                                                    //Para la fecha de reparto de pedido, si han transcurrido 5 días o menos de campaña
                                                    //entonces se muestra la fecha anterior, de lo contrario la actual
                                                    var diferenciaDias = Utilidades.diferenciaFechaDias(new Date(correteo), new Date());
                                                    rootScope.campana.diasEnEjecucion = diferenciaDias;

                                                    //Si han pasado mas de 5 días entonces mostrar campaña actual
                                                    //si no mostrar campaña anterior
                                                    if(diferenciaDias > 5){
                                                        //Obtener la fecha de reparto.
                                                        reparto = '';

                                                        for (i = 0; i < rootScope.fechas.length; i++){
                                                            if(rootScope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1'){
                                                                reparto = rootScope.fechas[i].fecha;
                                                            }
                                                        }

                                                        rootScope.campana.fechaReparto = reparto;
                                                    }else{
                                                        //Obtener la fecha de reparto.
                                                        reparto = '';

                                                        for (i = 0; i < rootScope.fechasAnteriores.length; i++){
                                                            if(rootScope.fechasAnteriores[i].actividad.toLowerCase() == 'reparto de pedido 1'){
                                                                reparto = rootScope.fechasAnteriores[i].fecha;
                                                            }
                                                        }

                                                        rootScope.campana.fechaReparto = reparto;
                                                    }

                                                }else{
                                                }
                                            });


                                        }//mover de campaña

                                    }else{
                                    }//success
                                });

                            }else{

                                if(data.tiposUsuarios && data.tiposUsuarios.length > 0 && (data.tiposUsuarios[0] == "2")){
                                    mensajeError = "Hola Mamá, te invitamos a montar tu primer pedido para disfurtar de esta Aplicación, para este cuentas con un cupo de " + filter('currency')(data.cupo, '$', 0);
                                }else{
                                    if(data.tiposUsuarios){
                                        mensajeError = "Tu rol no es válido para nuestra Aplicación";
                                    }else{
                                        //$scope.mostrarMensajeError = true;
                                        mensajeError = "Mamá Empresaria, esta aplicación sólo funciona con internet, verifica tu conexión. En este momento no podemos consultar tu información";
                                    }
                                }
                            }
                        }

                        if(mensajeError && mensajeError.length > 0){
                            fx(false, mensajeError, data);
                        }else{
                            fx(true, mensajeError, data);
                        }

                    }).
                    error(function(data, status, headers, config) {
                        fx(false, "Mamá Empresaria, esta aplicación sólo funciona con internet, verifica tu conexión. En este momento no podemos consultar tu información", {});
                    });

            },
            getPuntos: function(cedula, fx) {
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getAgotadosPedido: function(pedido, fx){

                //var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;
                var urlServicio = "http://www.mocky.io/v2/54ee3b594e65b0e60a4fb38f";

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });

            }
        }
    })

    .factory('PuntosPago', function() {

        return {
            get: function(latitud, longitud, http, fx) {
                http.get("http://www.mocky.io/v2/54da1eff267da3fc05b0f358").
                    success(function(data, status, headers, config) {
                        console.log(data);
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            }
        }
    })

    .factory('Internet', function() {

        return {
            get: function() {
                var connection = navigator.connection;

                //Se puede establecer el tipo de conexión a Internet?
                if(connection && connection.type){
                    return connection.type.toLowerCase() != "none";
                }else{
                    return true;
                }
            }
        }
    })

    .factory('GA', function() {

        return {
            trackPage: function(gaPlugin, page) {

                if(gaPlugin){
                    gaPlugin.trackPage(function(){

                    }, function(){

                    }, page);
                }

            }
        }
    })

    .factory('Utilidades', function() {

        this.padStr = function(i) {
            return (i < 10) ? "0" + i : "" + i;
        };

        var self = this;

        return {
            mostrarMensaje: function(scope, mensaje) {


            },
            diferenciaFechaDias: function(fechaInicial, fechaFinal){

                var stringFechaInicial = self.padStr(fechaInicial.getFullYear()) + "-" +
                    self.padStr(1 + fechaInicial.getMonth()) + "-" + fechaInicial.getDate()

                var stringFechaFinal = self.padStr(fechaFinal.getFullYear()) + "-" +
                    self.padStr(1 + fechaFinal.getMonth()) + "-" + fechaFinal.getDate()

                var t2 = new Date(stringFechaFinal).getTime();
                var t1 = new Date(stringFechaInicial).getTime();

                return parseInt((t2-t1)/(24*3600*1000));
            },
            formatearFechaActual: function(){
                var fecha = new Date();

                var dateStr = self.padStr(fecha.getFullYear()) + "-" +
                    self.padStr(1 + fecha.getMonth()) + "-" +
                    fecha.getDate();

                return dateStr;
            },
            formatearFecha: function(fecha){
                var dateStr = self.padStr(fecha.getFullYear()) + "-" +
                    self.padStr(1 + fecha.getMonth()) + "-" +
                    fecha.getDate();

                return dateStr;
            },
            cambiarNombreEstadoPedido: function(nombre){

                if(nombre.toLowerCase() == "ingresado" || nombre.toLowerCase() == "ingresada"){
                    return "Recibido";
                }else{
                    if(nombre.toLowerCase() == "en línea"){
                        return "En proceso de empaque";
                    }else{

                        if(nombre.toLowerCase() == "cargue"){
                            return "Entregado al transportador";
                        }
                    }
                }

                return nombre;
            },

            getPlantillaEspera: function(mensaje) {
                return mensaje + '<br /><br /> <img style="max-width:50px; max-height:50px;" src="img/loading.gif">';
            }
        }
    })
;
