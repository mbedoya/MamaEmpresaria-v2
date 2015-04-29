moduloControlador.controller('InicializacionCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, $ionicHistory, $http, $state, $filter, Internet, Mama, GA, Utilidades) {

    $scope.mostrarMensajeError = false;
    
    //Existe un método en el rootscope para esto, sin embargo,
    //por ser la primera página algunas veces no está disponible
    $scope.mostrarAyuda = function(titulo, mensaje) {
	   var alertPopup = $ionicPopup.alert({
		 title: titulo,
		 template: mensaje
	   });
	 };

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
            //Número de campañas que se ejecutan al año
            $rootScope.numeroCampanasAno = 18;
            $rootScope.lineaAtencion = "01 8000 515 101";
            $rootScope.correo = "servicioalcliente@novaventa.com";

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

                            $location.path('/app/menu/tabs/home');
                            //$state.go('app.menu.tabs.home');
                           
                            
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
        
        $scope.$on('online', function(event, args){
			$scope.inicializar(true);
		});

        $scope.inicializar();


    });