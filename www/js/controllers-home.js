moduloControlador.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicPopup, GA, Campana) {

        //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Home");

        $scope.mostrarCupo = function(){
            return Number($rootScope.datos.cupo) > 0;
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
        
        $scope.mamaEnMora = function(){
            var estadoNovedad = $scope.buscarEstado('Novedad');
            if(estadoNovedad){
               if (estadoNovedad.motivo.toLowerCase().indexOf('morosa')>=0){
                  return true;
               }
            }
            
            return false;
        }
        
        // El Saldo es de la próxima campaña si
        // ya se ha efectuado el encuentro y tengo información de pedido
        // y no tengo novedad de morosidad
        $scope.saldoEsDeProximaCampana = function(){
           return false;
           //return $scope.encuentroRealizado() && !$scope.pedido().razonRechazo && !$scope.mamaEnMora();
        }

        $scope.pedido = function(){
            return $rootScope.pedido;
        }

        //Indica si ya se hizo el Encuentro para la campaña actual
        $scope.encuentroRealizado = function(){
            
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
        }

        $scope.etiquetaSaldo = function(){

            var etiqueta = "Saldo a pagar";

            if($rootScope.datos && $rootScope.datos.saldo){

                if(Number($rootScope.datos.saldo) < 0) {
                    etiqueta = "Saldo a favor";
                }else{
                    etiqueta = "Debes pagar " + $scope.saldo() + " de la Campaña XXX";
                }
            }

            return etiqueta;
        }
        
        $scope.estiloAlternateFechaPago = function(){
           if($scope.mostrarCupo){
              return "alternate";
           }else{
              return "";
           }
        }

        $scope.mostrarSaldoFavor = function(){
            return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
        }

        $scope.mostrarSaldoPagar = function(){
            return !$scope.mostrarSaldoFavor();
        }

        $scope.nombre = function(){
             var nombrePascal = $rootScope.datos.nombre.split(' ');
             for	(index = 0; index < nombrePascal.length; index++) {  
               nombrePascal[index] = nombrePascal[index].substring(0,1).toUpperCase() + nombrePascal[index].substring(1, nombrePascal[index].length).toLowerCase();
             }
            
            return nombrePascal.join(' ');
        }

        $scope.segmento = function(){
            return $rootScope.datos.segmento;
        }

        $scope.segmentoFormateado = function(){
            return $rootScope.datos.segmento.toLocaleLowerCase().replace("í","i");
        }

        $scope.saldo = function(){
            return Math.abs(Number($rootScope.datos.saldo));
        }

        $scope.cupo = function(){
            return $rootScope.datos.cupo;
        }

        $scope.numeroCampana = function(){
            return $rootScope.campana.numero;
        }

        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }
        
        $scope.fechaCorreteo = function(){
            return $rootScope.campana.fechaCorreteo;
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
        
        $scope.padStr = function(i) {
           return (i < 10) ? "0" + i : "" + i;
        }
        
        $scope.diasParaPago = function(){
        
           var fechaActual = new Date();
           var stringFecha = $scope.padStr(fechaActual.getFullYear()) + "-" +
                  $scope.padStr(1 + fechaActual.getMonth()) + "-" + fechaActual.getDate()
          
        
           if($rootScope.campana && $rootScope.campana.fechaMontajePedido){
               var t2 = new Date($rootScope.campana.fechaMontajePedido).getTime();
               var t1 = new Date(stringFecha).getTime();

               return parseInt((t2-t1)/(24*3600*1000));    
           }else{
              return -2;
           }
        }
        
        $scope.esAntesMedioDia = function(){
           return new Date().getHours() < 12;
        }
        
        $scope.mostrarAyudaSaldoPagar = function(){
           //$scope.mostrarAyuda('Pagos','El pago que dejas de hacer es debido al beneficio que tienes llamado "Flexibilización", los $' + $scope.flexibilizacionDeuda() + ' que quedas debiendo, los debes cancelar antes de tu próximo pedido.');
        }
        
        $scope.hoyEsCorreteo = function(){
           return Campana.hoyEsCorreteo();
        }

    });