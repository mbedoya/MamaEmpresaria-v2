/*
Guía de datos de que la aplicación maneja
Los datos se almacenan generalmente en $rootScope.

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

Recordatorios - Informacion de campana para la zona de la Mamá
$rootScope.fechas

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

    .factory('Mama', function() {

        return {
            autenticar: function(cedula, rootScope, http, filter, factory, fx) {
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
                                
                                rootScope.campana = {numero: '-', fechaMontajePedido:'-', fechaEncuentro:'-'};
                                
                                //Obtener el estado del pedido 
                                factory.getTrazabilidadPedido(rootScope.datos.cedula, rootScope, http, function (success, data){
                                    if(success){
                                        rootScope.pedido = data;
                                    }else{
                                    }
                                });
                                
                                //Obtener la campaña operativa
                                factory.getRecordatoriosCampanaOperativa(rootScope.zona, rootScope, http, function (success, data){
                                    if(success){
                                      
                                         //Obtener la fecha de montaje de pedido (Encuentro)
                                         encuentro = '';
                                         for (i = 0; i < data.listaRecordatorios.length; i++){
                                           if(data.listaRecordatorios[i].actividad.toLowerCase() == 'encuentro'){
                                            encuentro = data.listaRecordatorios[i].fecha;
                                            break;
                                           }
                                         }
                                        
                                        rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido: encuentro, fechaEncuentro: encuentro};
                                        rootScope.fechas = data.listaRecordatorios;
                                        
                                    }else{                                        
                                    }
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
            getPuntos: function(cedula, rootScope, http, fx) {
            	var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula;
            	
                    http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getTrazabilidadPedido: function(cedula, rootScope, http, fx) {
                var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;

                http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getAgotadosPedido: function(pedido, rootScope, http, fx){
            
               //var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;
               var urlServicio = "http://www.mocky.io/v2/54ee3b594e65b0e60a4fb38f";

                http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
               
            },
            getRecordatoriosCampanaOperativa: function(zona, rootScope, http, fx){
                var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + zona;

                http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getRecordatorios: function(ano, campana, zona, rootScope, http, fx){
                var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/"+ ano +"/" + campana + "/" + zona;

                http.get(urlServicio).
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

        return {
            mostrarMensaje: function(scope, mensaje) {
            
               
                
            },
            
            getPlantillaEspera: function(mensaje) {
               return mensaje + '<br /><br /> <img style="max-width:50px; max-height:50px;" src="img/loading.gif">';
            }
        }
    })
;
