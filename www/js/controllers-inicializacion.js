moduloControlador.controller('InicializacionCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, $ionicHistory, $http, $state, $filter, Internet, Mama, GA, Utilidades) {

    $scope.mostrarMensajeError = false;

     setTimeout(function(){
     
       if(window.plugins && window.plugins.gaPlugin){
       
        	$rootScope.gaPlugin = window.plugins.gaPlugin;
    	    $rootScope.gaPlugin.init(
    	      function(){
    	         //Registro en Analytics      
                  GA.trackPage($rootScope.gaPlugin, "App Iniciada");  
              }, 
              function(){
              
              }, 
              "UA-60445801-1", 
              10);
        }
        
        document.addEventListener("online", function(){
          $rootScope.$broadcast('online');   
        }, false);     
              
     }, 2000);
         
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

        $scope.inicializar = function(){
			
            //$rootScope.configuracion = { ip_servidores: 'http://200.47.173.66:9081' };
            $rootScope.configuracion = { ip_servidores: 'http://transferenciaelectronica.novaventa.com.co' };

            //Almacenar la cédula si hay almacenamiento local
            if(localStorage && localStorage.cedula){

                $rootScope.datos = { cedula: localStorage.cedula }

                if(Internet.get()){

                    $scope.loading =  $ionicLoading.show({
                        template: Utilidades.getPlantillaEspera('Iniciando sesión')
                    });

                    Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                        $ionicLoading.hide();
                        
                        if(success){

								$ionicHistory.nextViewOptions({
                                   historyRoot: true
                                });
                                
                                $state.go('app.menu.tabs.home');
                           
                            
                        }else{
                           $scope.mostrarAyuda("Inicio de sesión", mensajeError);
                        }

                    });

                }else{
                    $scope.mostrarMensajeError = true;
                    $scope.mostrarAyuda("Inicio de sesión","Esta aplicación sólo funciona con internet, verifica tu conexión")
                }

            }else{

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('app.login');

            }
        }

        $scope.inicializar();


    });