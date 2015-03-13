moduloControlador.controller('MiPedidoCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA) {

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
    });