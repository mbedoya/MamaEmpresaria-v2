moduloControlador.controller('InicializacionCtrl', function($scope, $rootScope, $ionicPopup,$location, $ionicLoading, $ionicHistory, $http, $state, $filter, Internet, Mama, GA, Utilidades) {

    $scope.mostrarMensajeError = false;

    //Existe un método en el rootscope para esto, sin embargo,
    //por ser la primera página algunas veces no está disponible
    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    setTimeout(function(){

        if(window.plugins && window.plugins.gaPlugin){

            //Pruebas: UA-60445801-1
            //Producción: UA-67054199-1

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

    $scope.inicializar = function(){

        
        $rootScope.configuracion = { ip_servidores: 'http://200.47.173.68:9081' };
        //$rootScope.configuracion = { ip_servidores: 'http://200.47.173.67:9080' };
        //$rootScope.configuracion = { ip_servidores: 'http://200.47.173.67:9082' };
        //$rootScope.configuracion = { ip_servidores: 'http://transferenciaelectronica.novaventa.com.co' };
        //Número de campañas que se ejecutan al año
        $rootScope.numeroCampanasAno = 18;
        $rootScope.lineaAtencion = "01 8000 515 101";
        $rootScope.correo = "servicioalcliente@novaventa.com";
        $rootScope.urlChat = 'http://twnl.co/novaventas';

        jQuery.support.cors = true;
        //$.mobile.allowCrossDomainPages = true;

        //Almacenar la cédula si hay almacenamiento local
        if(localStorage && localStorage.cedula){

            $rootScope.datos = { cedula: localStorage.cedula, clave: localStorage.clave }

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Iniciando sesión')
                });

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){    
                                
                    $ionicLoading.hide();

                    if(success){

                        if(data.valido == "1"){

                            $scope.loading =  $ionicLoading.show({
                                template: Utilidades.getPlantillaEspera('Iniciando sesión')
                            });

                            Mama.getInformacionBasica(function(success, mensajeError){

                                $ionicLoading.hide();

                                if(success){

                                    //Almacenar datos si hay almacenamiento local
                                    if(localStorage){

                                        localStorage.cedula = $rootScope.datos.cedula;
                                        localStorage.nombre = $rootScope.datos.nombre;
                                        localStorage.segmento = $rootScope.datos.segmento;
                                    }

                                    $scope.datosInicio = {clave: '' };

                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });

                                    //Si la Mamá tiene versión para aceptar entonces ir a terminos y condiciones
                                    if ($rootScope.datos.versionHabeasData){
                                        $rootScope.irAHomeLuegoTerminos = true;
                                        $location.path('/app/terminos-condiciones');
                                    }else{
                                        $location.path('/app/menu/tabs/home');
                                    }

                                }else{
                                    $scope.mostrarAyuda("Creación de clave", mensajeError);
                                }

                            });

                        }else{
                            $location.path('/app/login');
                        }

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

            $location.path('/app/login');

        }
    }

    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.inicializar();


});