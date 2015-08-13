moduloControlador.controller('ClaveCtrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Clave");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.limpiar = function(){
        $scope.modelo = { clave: ''};
    }

    $scope.irARecuperarClave = function(){
        $rootScope.recuperarClave = true;
        $location.path('/app/clave-pregunta-1');
    }

    $scope.enviarSolicitudContacto = function(){
        //Enviar solicitus de contacto

        if(Internet.get()){
            Mama.solicitarContactoAsesor("INTENTOS_FALLIDOS", function(success, data) {
                if (success) {

                }
            });
        }else{
            $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet, no ha sido posible enviar la solicitud de contacto");
        }
    }

    $scope.confirmar = function(mensaje) {

        var myPopup = $ionicPopup.show({
            template: mensaje,
            title: '',
            subTitle: '',
            scope: $scope,
            buttons: [
                { text: 'No',
                    onTap: function (e) {
                        console.log(e);
                        return false;
                    }
                },
                {
                    text: '<b>Si</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log(e);
                        return true;
                    }
                }
            ]
        });

        myPopup.then(function (res) {
            if(res){
                $scope.enviarSolicitudContacto();
            }else{

            }

        });
    };

    //Autenticar a la Mamá Empresaria
    $scope.continuar = function() {
        
        var clave = $("#txtClaveLogin").val();
        
        //alert($("#txtClave").val());

        //Cédula vacía
        if(!clave || clave.length == 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(clave.length != 4){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa 4 dígitos");
            return;
        }
        
        //Cantidad de caracteres
        if(clave.length > 4){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa únicamente 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(clave.indexOf(".") >= 0 || clave.indexOf(",") >= 0){
            $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
            return;
        }

        try{

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Validando clave')
                });

                $rootScope.datos.clave = clave;

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function(success, mensajeError, data){

                    $ionicLoading.hide();

                    //alert(success);

                    if(success){

                        $scope.loading =  $ionicLoading.show({
                            template: Utilidades.getPlantillaEspera('Iniciando sesión')
                        });

                        Mama.getInformacionBasica(function(success, mensajeError){

                            $ionicLoading.hide();

                            if(success){
                                
                                $scope.modelo.clave = '';

                                //Almacenar datos si hay almacenamiento local
                                if(localStorage){

                                    localStorage.cedula = $rootScope.datos.cedula;
                                    localStorage.nombre = $rootScope.datos.nombre;
                                    localStorage.segmento = $rootScope.datos.segmento;
                                    localStorage.clave = $rootScope.datos.clave;
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

                        //alert(data.mostrarSolicitudAyuda);

                        if(data.mostrarSolicitudAyuda){
                            $scope.confirmar(mensajeError);
                        }else{
                            $scope.mostrarAyuda("Ingreso de clave", mensajeError);

                            if(data.enviarSolicitudAsesor){
                                $scope.enviarSolicitudContacto();
                            }
                        }
                    }

                });

            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }

    }

    $scope.inicializar = function(){
        $scope.limpiar();
    }

    $scope.inicializar();
});