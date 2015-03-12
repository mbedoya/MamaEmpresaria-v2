moduloControlador.controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

       //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Inicio de sesión");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         };
         
    	$scope.datosInicio = {cedula: '' };
    
    	//Autenticar a la Mamá Empresaria
        $scope.capturarCedula = function() {

            $rootScope.datos = { cedula: $scope.datosInicio.cedula }
            
            //Cédula vacía
            if(!$rootScope.datos.cedula){
                $scope.mostrarAyuda("Inicio de sesión","Ingresa tu cédula");
                return;
            }

            //Cantidad de caracteres
            if(String($rootScope.datos.cedula).length < 6 || String($rootScope.datos.cedula).length > 10){
                $scope.mostrarAyuda("Inicio de sesión","Ingresa entre 6 y 10 dígitos");
                return;
            }

            //Caracteres especiales
            if(String($rootScope.datos.cedula).indexOf(".") >= 0 || String($rootScope.datos.cedula).indexOf(",") >= 0){
                $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
                return;
            }

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                        template: Utilidades.getPlantillaEspera('Iniciando sesión')
                    });

            	Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();
                    
                    if(success){
                        
                               $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};
                                
                                Mama.getPuntos($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                                 if(success){
                                    $rootScope.puntos = data;

                                   }else{
                                    //alert("En este momento no podemos acceder a tu información");
                                   }
                                });
                                
                                var irABienvenida = !(localStorage && localStorage.nombre);

                            //Almacenar la cédula si hay almacenamiento local
                            if(localStorage ){
                                
                                localStorage.cedula = $scope.datosInicio.cedula;
                                localStorage.nombre = $rootScope.datos.nombre;
                                localStorage.segmento = $rootScope.datos.segmento;
                                
                            }
                            
                            $scope.datosInicio = {cedula: '' };

                            $ionicHistory.nextViewOptions({
                             disableBack: true
                            });
   
                            //Si se notifica inmediatamente no son alcanzados todos los controladores                         
                            setTimeout( function(){
                               //Notificar que el usuario se ha logueado
                               $rootScope.$broadcast('loggedin');
                            }, 1500);
                            
                            if(irABienvenida){
                               $state.go('app.bienvenida');
                            }else{
                               $state.go('app.menu.tabs.home');
                            }
                           
                            
                        }else{
                           $scope.mostrarAyuda("Inicio de sesión", mensajeError);
                        }

            	});
            	
            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }
        }
    });