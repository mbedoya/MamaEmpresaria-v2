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

 Campana Anterior
 $rootScope.campanaAnterior.numero
 $rootScope.campanaAnterior.fechaMontajePedido
 $rootScope.campanaAnterior.fechaEncuentro
 $rootScope.campanaAnterior.fechaReparto
 $rootScope.campanaAnterior.diasEnEjecucion

 $rootScope.agotadosCampana

 Recordatorios - Informacion de campana para la zona de la Mamá
 $rootScope.fechas
 $rootScope.fechasAnteriores - Campaña anterior a la operativa

 Pedido
 $rootScope.pedido
 $rootScope.pedido.razonRechazo - Indica mensaje cuando no hay pedido para la Mama

 Pedido Anterior
 $rootScope.pedidoAnterior
 $rootScope.pedidoAnterior.razonRechazo - Indica mensaje cuando no hay pedido para la Mama

 Puntos
 $rootScope.puntos.puntosDisponibles
 $rootScope.puntos.puntosPorPerder
 $rootScope.puntos.puntosAVencer
 $rootScope.puntos.puntosRedimidos

 var req = {
 method: 'POST',
 url: 'http://example.com',
 headers: {
 'Content-Type': undefined
 },
 data: { test: 'test' }
 }

 $http(req).success(function(){...}).error(function(){...});

 */


angular.module('novaventa.services', [])
    .factory('Pedido', function($rootScope, $http, Utilidades){

        this.ajustarEstadosPedido = function(estados) {
            if(estados && estados.length > 0){
                
                var indiceIngresado = -1;
                
                for	(index = 0; index < estados.length; index++) {
                    if (estados[index].estado.toLowerCase() == "ingresado"){
                        indiceIngresado = index;
                    }
                }
                
                //Si el estado ingresado se ha encontrado entonces se deben eliminar 
                //los estados que sean anteriores a el. Si el estado está en la posición 0 no se hace nada
                if(indiceIngresado > 0){
                    estados.splice(0,indiceIngresado);
                }               
            }
            return estados;
        };

        var self = this;

        return {
            getAgotadosActual: function(cedula, fx){

                var anoCampana = Utilidades.getAnoCampana();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/documento/agotadosPedido/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },

            getAgotadosAnterior: function(cedula, fx){

                var anoCampana = Utilidades.getAnoCampanaAnterior();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/documento/agotadosPedido/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },

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
                                $rootScope.pedido.historiaEstados[i].motivo.toLowerCase().indexOf('morosa') >= 0 ||
                                $rootScope.pedido.historiaEstados[i].motivo.toLowerCase().indexOf('tope') >= 0
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

                        data.historiaEstados = self.ajustarEstadosPedido(data.historiaEstados);

                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getTrazabilidadActual: function(cedula, fx) {

                var anoCampana = Utilidades.getAnoCampana();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {

                        data.historiaEstados = self.ajustarEstadosPedido(data.historiaEstados);

                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getTrazabilidadAnterior: function(cedula, fx) {

                var anoCampana = Utilidades.getAnoCampanaAnterior();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        
                        data.historiaEstados = self.ajustarEstadosPedido(data.historiaEstados);
                        
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            buscarEstado: function(estado, pedido){
                var miestado = null;

                var mipedido = $rootScope.pedido;

                if(pedido){
                    mipedido = pedido;
                }

                if(mipedido && mipedido.historiaEstados){
                    for (i = 0; i < mipedido.historiaEstados.length; i++) {
                        if(Utilidades.cambiarNombreEstadoPedido(mipedido.historiaEstados[i].estado) == estado){
                            miestado = mipedido.historiaEstados[i];
                            break;
                        }
                    }
                }

                return miestado;
            },
            estadoEncontrado: function(estado, pedido){
                var encontrado = false;

                var mipedido = $rootScope.pedido;

                if(pedido){
                    mipedido = pedido;
                }

                if(mipedido && mipedido.historiaEstados){
                    for (i = 0; i < mipedido.historiaEstados.length; i++) {
                        if(Utilidades.cambiarNombreEstadoPedido(mipedido.historiaEstados[i].estado) == estado){
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
            tieneEncuentro: function(){
                var tiene = false;

                if($rootScope.fechas && $rootScope.fechas.length > 0){
                    for (i = 0; i < $rootScope.fechas.length; i++){
                        //if($rootScope.fechas[i].actividad.toLowerCase() == 'encuentro'){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'toma de pedido'){
                            tiene = true;
                            break;
                        }
                    }
                }

                return tiene;
            },
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
                        //if($rootScope.fechas[i].actividad.toLowerCase() == 'encuentro'){
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'toma de pedido'){
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
                        if($rootScope.fechas[i].actividad.toLowerCase() == 'toma de pedido'){
                        //if($rootScope.fechas[i].actividad.toLowerCase() == 'encuentro'){    
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
                var seccion = $rootScope.seccion;
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + zona + "/" + seccion;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getRecordatorios: function(ano, campana, zona, fx){

                campana = Utilidades.Pad(campana);
                var seccion = $rootScope.seccion;
                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/"+ ano +"/" + campana + "/" + zona + "/" + seccion;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getAgotados: function(fx){
                var fecha = new Date();
                var anoCampana = Utilidades.getAnoCampana();

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/productoDeCampagna/agotadosCampagna/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getAgotadosSiguiente: function(fx){
                var fecha = new Date();
                var anoCampana = Utilidades.getAnoCampanaSiguiente();

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/productoDeCampagna/agotadosCampagna/" + anoCampana;


                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getCampanaOperativa: function(fx){

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/campagnaOperativa";

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
            registrarHabeasData: function(fx){

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/terminosYCondiciones/autorizarME";

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: "version=" + $rootScope.datos.versionHabeasData
                };

                $http(request).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getPregunta1: function(fx){

                var cedula = $rootScope.datos.cedula;
                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/consultarPreguntasME/" + cedula +  "/1";

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getPregunta2: function(fx){

                var cedula = $rootScope.datos.cedula;
                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/consultarPreguntasME/" + cedula +  "/2";

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            responderPregunta: function(pregunta, respuesta, fx){

                var cedula = $rootScope.datos.cedula;
                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/respuestasPreguntasME";

                console.log(respuesta);

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: "cedulaRepresentante=" + cedula + "&pregunta="+ pregunta +"&respuesta=" + respuesta
                };

                $http(request).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            asignarClave: function(fx){

                var cedula = $rootScope.datos.cedula;
                var clave = $rootScope.datos.clave;

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/creacionClaveME";

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: "cedulaRepresentante=" + cedula + "&clave="+ clave
                };

                $http(request).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            cambiarClave: function(claveActual, claveNueva, fx){

                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/cambioClaveME";

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: "claveActual=" + claveActual + "&claveNueva="+ claveNueva
                };

                $http(request).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            validarCedula: function(fx){
                var cedula = $rootScope.datos.cedula;
                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/validarME/" + cedula;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            solicitarContactoAsesor: function(tipoContacto, fx){
                var cedula = $rootScope.datos.cedula;
                var urlServicio = $rootScope.configuracion.ip_servidores + "/AntaresWebServices/autenticacion/emailAsesor/" + cedula + "/" + tipoContacto;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getInformacionBasica: function(fx){
               
                var urlAutenticacion = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/validacionAntares";
                
                var mensajeError = '';

                $http.get(urlAutenticacion).
                    success(function(data, status, headers, config) {

                    //Establecer los datos de resumen de la Mamá
                    $rootScope.datos.nombre = data.nombreCompleto;
                    $rootScope.datos.segmento = data.clasificacionValor;
                    $rootScope.datos.cupo = data.cupo;
                    $rootScope.datos.saldo = data.saldoBalance;
                    $rootScope.datos.valorFlexibilizacion = data.valorFlexibilizacion;

                    $rootScope.zona = data.estructuraList[0].zona;
                    $rootScope.seccion = data.estructuraList[0].seccion;

                    var campanaInicial = '-';
                    Campana.getRecordatoriosCampanaOperativa(function (success, data) {
                        if (success) {
                            
                            campanaInicial = data.campagna;

                            $rootScope.campana = {numero: campanaInicial, fechaEncuentro:'-', fechaCorreteo: '-', fechaMontajePedido: '-', diasEnEjecucion: ''};
                            
                            $rootScope.campanaAntares = campanaInicial;

                            //Obtener el estado del pedido
                            Pedido.getTrazabilidadActual($rootScope.datos.cedula, function (success, data){
                                if(success){

                                    $rootScope.pedido = data;

                                    //Obtener la campaña operativa
                                    Campana.getRecordatoriosCampanaOperativa(function (success, data){
                                        if(success){
                                            
                                           

                                            //Obtener la fecha de montaje de pedido (Encuentro)
                                            //Agosto 11-2015
                                            //Con la fecha de toma de pedido se reemplazará al Encuentro
                                            //de esta manera no se tendrá que cambiar la lógica en toda la App
                                            
                                            encuentro = '';
                                            
                                            encuentroOriginal = '';

                                            reparto = '';

                                            correteo = '';
                                            for (i = 0; i < data.listaRecordatorios.length; i++){
                                                
                                                //El Encuentro original se cambiara de nombre y se usará solo en casos especiales
                                                if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                                    encuentroOriginal = data.listaRecordatorios[i].fecha;
                                                }                                               
                                                
                                                //Asociar el encuentro y la toma de pedido al encuentro
                                                if(data.listaRecordatorios[i].actividad.toLowerCase() == 'toma de pedido'){
                                                    encuentro = data.listaRecordatorios[i].fecha;
                                                    tomaPedido = data.listaRecordatorios[i].fecha;
                                                }                                                
                                                
                                                if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                    correteo = data.listaRecordatorios[i].fecha;
                                                }

                                                if (data.listaRecordatorios[i].actividad.toLowerCase() == 'reparto de pedido 1') {
                                                    reparto = data.listaRecordatorios[i].fecha;
                                                }
                                            }

                                            $rootScope.campana = {numero: data.campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro,
                                                fechaEncuentroOriginal: encuentroOriginal, fechaCorreteo: correteo, fechaReparto: reparto,  diasEnEjecucion: ''};

                                            $rootScope.fechas = data.listaRecordatorios;

                                            //Buscar si el encuentro ya se ha realizado, si es así entonces se debe ir a la
                                            //siguiente campaña

                                            if(Campana.campanaFinalizada() ||
                                                ( Campana.encuentroRealizado() &&
                                                    ( Pedido.estadoEncontrado('Anulado')
                                                        || Pedido.estadoEncontrado('Facturado')
                                                        )
                                                    )
                                                ){
                                                    
                                                   

                                                var ano = new Date().getFullYear();
                                                var siguienteCampana = $rootScope.campana.numero + 1;
                                                //Si la siguiente campana supera al numero de campanas al
                                                //ano entonces moverse a la campana 1 del siguiente ano
                                                if(siguienteCampana > $rootScope.numeroCampanasAno){
                                                    siguienteCampana = 1;
                                                    ano = ano + 1;
                                                }

                                                //Obtener la campaña siguiente
                                                Campana.getRecordatorios(ano, siguienteCampana, $rootScope.zona, function (success, data){
                                                    if(success){
                                                        
                                                        //Obtener la fecha de montaje de pedido (Encuentro)
                                                        //Agosto 11-2015
                                                        //Con la fecha de toma de pedido se reemplazará al Encuentro
                                                        //de esta manera no se tendrá que cambiar la lógica en toda la App
                                                        
                                                        encuentro = '';
                                                        
                                                        encuentroOriginal = '';
            
                                                        reparto = '';
            
                                                        correteo = '';
                                                        for (i = 0; i < data.listaRecordatorios.length; i++){
                                                            
                                                            //El Encuentro original se cambiara de nombre y se usará solo en casos especiales
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                                                encuentroOriginal = data.listaRecordatorios[i].fecha;
                                                            }                                               
                                                            
                                                            //Asociar el encuentro y la toma de pedido al encuentro
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'toma de pedido'){
                                                                encuentro = data.listaRecordatorios[i].fecha;
                                                                tomaPedido = data.listaRecordatorios[i].fecha;
                                                            }                                                
                                                            
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                                correteo = data.listaRecordatorios[i].fecha;
                                                            }
            
                                                            if (data.listaRecordatorios[i].actividad.toLowerCase() == 'reparto de pedido 1') {
                                                                reparto = data.listaRecordatorios[i].fecha;
                                                            }
                                                        }

                                                        //Correteo Anterior
                                                        correteoAnterior = '';
                                                        for (i = 0; i < $rootScope.fechas.length; i++){
                                                            if($rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                                                                correteoAnterior = $rootScope.fechas[i].fecha;
                                                            }
                                                        }

                                                        var diferenciaDias = Utilidades.diferenciaFechaDias(new Date(correteoAnterior), new Date());

                                                        $rootScope.campanaAnterior = $rootScope.campana;
                                                        
                                                        $rootScope.campana = {numero: data.campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro,
                                                fechaEncuentroOriginal: encuentroOriginal, fechaCorreteo: correteo, fechaReparto: reparto, diasEnEjecucion: diferenciaDias};

                                                        $rootScope.fechasAnteriores = $rootScope.fechas;
                                                        $rootScope.fechas = data.listaRecordatorios;

                                                        console.log("Moviendose a nueva camapaña " + $rootScope.campana.numero);

                                                        //NOTIFICAR LOGGEDIN

                                                        //Si se notifica inmediatamente no son alcanzados todos los controladores
                                                        setTimeout( function(){
                                                            //Notificar que el usuario se ha logueado
                                                            $rootScope.$broadcast('loggedin');
                                                            console.log('loggedin');
                                                        }, 1500);

                                                    }else{
                                                    }
                                                });

                                            }else{
                                                
                                                //NOTIFICAR LOGGEDIN

                                                //Si se notifica inmediatamente no son alcanzados todos los controladores
                                                setTimeout( function(){
                                                    //Notificar que el usuario se ha logueado
                                                    $rootScope.$broadcast('loggedin');
                                                    console.log('loggedin');
                                                }, 1500);

                                                //Obtener la campaña anterior
                                                var ano = new Date().getFullYear();
                                                var campanaAnterior = $rootScope.campana.numero - 1;
                                                //Si la siguiente campana supera al numero de campanas al
                                                //ano entonces moverse a la campana 1 del siguiente ano
                                                if(campanaAnterior == 0){
                                                    campanaAnterior = $rootScope.numeroCampanasAno;
                                                    ano = ano - 1;
                                                }

                                                Campana.getRecordatorios(ano, campanaAnterior, $rootScope.zona, function (success, data){
                                                    if(success){
                                                        $rootScope.fechasAnteriores = data.listaRecordatorios;

                                                        //Obtener la fecha de montaje de pedido (Encuentro)
                                                        //Agosto 11-2015
                                                        //Con la fecha de toma de pedido se reemplazará al Encuentro
                                                        //de esta manera no se tendrá que cambiar la lógica en toda la App
                                                        
                                                        encuentro = '';
                                                        
                                                        encuentroOriginal = '';
            
                                                        reparto = '';
            
                                                        correteo = '';
                                                        for (i = 0; i < data.listaRecordatorios.length; i++){
                                                            
                                                            //El Encuentro original se cambiara de nombre y se usará solo en casos especiales
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                                                encuentroOriginal = data.listaRecordatorios[i].fecha;
                                                            }                                               
                                                            
                                                            //Asociar el encuentro y la toma de pedido al encuentro
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'toma de pedido'){
                                                                encuentro = data.listaRecordatorios[i].fecha;
                                                                tomaPedido = data.listaRecordatorios[i].fecha;
                                                            }                                                
                                                            
                                                            if(data.listaRecordatorios[i].actividad.toLowerCase() == 'fecha correteo'){
                                                                correteo = data.listaRecordatorios[i].fecha;
                                                            }
            
                                                            if (data.listaRecordatorios[i].actividad.toLowerCase() == 'reparto de pedido 1') {
                                                                reparto = data.listaRecordatorios[i].fecha;
                                                            }
                                                        }

                                                        $rootScope.campanaAnterior = {numero: data.campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro,
                                                fechaEncuentroOriginal: encuentroOriginal, fechaCorreteo: correteo, fechaReparto: reparto,  diasEnEjecucion: ''};
                                                
                                                        

                                                    }else{
                                                    }
                                                });


                                            }//mover de campaña

                                        }else{
                                        }//success
                                    });


                                }else{//else getTrazabilidad
                                }
                            });

                        }else{
                            mensajeError = "En este momento no podemos consultar tu información";
                        }
                    });
                }).
                error(function(data, status, headers, config) {

                    mensajeError = "En este momento no podemos consultar tu información";
                });
                                        
                                        
                    if(mensajeError && mensajeError.length > 0){
                        fx(false, mensajeError);
                    }else{
                        fx(true, mensajeError);
                    }
                        
            },
            autenticar: function(cedula, rootScope, http, filter, factoryMama, fx) {

                //Cadena en Base 64 usuario:clave
                var cadenaBase64 = btoa(cedula + ":" + rootScope.datos.clave);
                //var urlValidacion = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/validacionAntares/" + cedula +"/1";
                var urlValidacion = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/autenticacion/autenticarME";

                var req = {
                    method: 'GET',
                    url: urlValidacion,
                    headers: {
                        'Authorization': 'Basic ' + cadenaBase64
                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Basic ' + cadenaBase64;

                $http(req).
                    success(function(data, status, headers, config) {
                        
                        var mensajeError;

                        //Error en la autenticación?
                        if(data && data.razonRechazo){

                            if(data.razonRechazo == "El usuario no se encuentra registrado en Antares."){
                                mensajeError = "Lo sentimos no existe información para esta cédula. Comunícate con la Línea de Atención";
                            }else{
                                mensajeError = data.razonRechazo;
                            }

                            if(data.contactoFallido == "1"){

                                if(data.intentos == "5"){

                                    mensajeError = "Mamá, tu clave no es válida para la cédula ingresada. Deseas ser contactada por nuestros asesores de servicio? Recuerda que también puede hacer uso de la opción ¿Olvidaste tu clave?";
                                    data.mostrarSolicitudAyuda = true;

                                }else{
                                    if(data.intentos == "10"){

                                        mensajeError = "Mamá, tu clave no es válida para la cédula ingresada. Nuestros asesores de servicio te estarán contactando";
                                        data.enviarSolicitudAsesor = true;

                                    }
                                }
                            }

                        }else{
                            
                            rootScope.datos.versionHabeasData = data.version;
                            rootScope.datos.mensajeHabeasData = data.mensaje;
                            
                            //Header con la key para todas las solicitudes
                            $http.defaults.headers.common['Authorization'] = 'apikey ' + data.token;

                            //Usuario y clave válidos?
                            if(data.valido == "1"){

                                
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

                var anoCampana = Utilidades.getAnoCampana();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getPuntosCampanaAnterior: function(cedula, fx) {

                var anoCampana = Utilidades.getAnoCampanaAnterior();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula + "/" + anoCampana;

                $http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getPuntosCampanaOperativaAntares: function(cedula, fx) {

                var anoCampana = Utilidades.getAnoCampanaAntares();

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula + "/" + anoCampana;

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
                /*var connection = navigator.connection;

                //Se puede establecer el tipo de conexión a Internet?
                if(connection && connection.type){
                    return connection.type.toLowerCase() != "none";
                }else{
                    return true;
                }*/
                return true;
            }
        }
    })

    .factory('GA', function($rootScope) {

        return {
            trackPage: function(gaPlugin, page) {

                if(gaPlugin){
                    gaPlugin.trackPage(function(){

                    }, function(){

                    }, page);

                    if($rootScope.zona){

                        gaPlugin.trackPage(function(){

                        }, function(){

                        }, page + " " + $rootScope.zona);
                    }
                }
            }
        }
    })

    .factory('Utilidades', function($rootScope) {

        this.padStr = function(i) {
            return (i < 10) ? "0" + i : "" + i;
        };

        var self = this;

        return {
            Pad: function(i){
                return self.padStr(i);
            },
            mostrarMensaje: function(scope, mensaje) {


            },
            diferenciaFechaDias: function(fechaInicial, fechaFinal){

                var stringFechaInicial = self.padStr(fechaInicial.getFullYear()) + "-" +
                    self.padStr(1 + fechaInicial.getMonth()) + "-" + self.padStr(fechaInicial.getDate());

                var stringFechaFinal = self.padStr(fechaFinal.getFullYear()) + "-" +
                    self.padStr(1 + fechaFinal.getMonth()) + "-" + self.padStr(fechaFinal.getDate());

                var t2 = new Date(stringFechaFinal).getTime();
                var t1 = new Date(stringFechaInicial).getTime();

                return parseInt((t2-t1)/(24*3600*1000));
            },
            formatearFechaActual: function(){
                var fecha = new Date();

                var dateStr = self.padStr(fecha.getFullYear()) + "-" +
                    self.padStr(1 + fecha.getMonth()) + "-" +
                    self.padStr(fecha.getDate());

                return dateStr;
            },
            formatearFecha: function(fecha){
                var dateStr = self.padStr(fecha.getFullYear()) + "-" +
                    self.padStr(1 + fecha.getMonth()) + "-" +
                    self.padStr(fecha.getDate());

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
            },

            getAnoCampana: function(){
                var fecha = new Date();
                var anoCampana = fecha.getFullYear() + self.padStr($rootScope.campana.numero);

                return anoCampana;
            },
            
            getAnoCampanaAntares: function(){
                var fecha = new Date();
                var anoCampana = fecha.getFullYear() + self.padStr($rootScope.campanaAntares);

                return anoCampana;
            },

            getAnoCampanaAnterior: function(){
                var fecha = new Date();
                var anoCampana;
                if($rootScope.campana.numero == 1){
                    anoCampana = fecha.getFullYear() + self.padStr($rootScope.numeroCampanasAno);
                }else{
                    anoCampana = fecha.getFullYear() + self.padStr($rootScope.campana.numero-1);
                }

                return anoCampana;
            },

            getAnoCampanaSiguiente: function(){
                var fecha = new Date();
                var anoCampana;
                if($rootScope.campana.numero == $rootScope.numeroCampanasAno){
                    anoCampana = Number(fecha.getFullYear() + 1)  + "01";
                }else{
                    anoCampana = fecha.getFullYear() + self.padStr($rootScope.campana.numero+1);
                }

                return anoCampana;
            }
        }
    })
;
