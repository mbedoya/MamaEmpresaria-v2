moduloControlador.controller('InicializacionCtrl', function ($scope, $rootScope, $ionicPopup, $location, $ionicLoading, $ionicHistory, $http, $state, $filter, Internet, Mama, GA, Utilidades, Notificaciones) {

    $scope.mostrarMensajeError = false;

    //Existe un método en el rootscope para esto, sin embargo,
    //por ser la primera página algunas veces no está disponible
    $scope.mostrarAyuda = function (titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    setTimeout(function () {

        if (window.plugins && window.plugins.gaPlugin) {

            var codigoAnalytics = '';
            if ($rootScope.versionProduccion) {
                codigoAnalytics = "UA-67054199-1";
            } else {
                codigoAnalytics = "UA-60445801-1";
            }

            $rootScope.gaPlugin = window.plugins.gaPlugin;
            $rootScope.gaPlugin.init(
                function () {
                    //Registro en Analytics
                    GA.trackPage($rootScope.gaPlugin, "App Iniciada");
                },
                function () {

                },
                codigoAnalytics,
                10);
        }

        document.addEventListener("online", function () {
            $rootScope.$broadcast('online');
        }, false);

    }, 2000);

    $scope.segmentoFormateado = function () {
        if ($rootScope.datos && $rootScope.datos.segmento) {
            return $rootScope.datos.segmento.toLocaleLowerCase().replace("í", "i");
        } else {
            return "";
        }
    }

    $scope.segmento = function () {
        if ($rootScope.datos && $rootScope.datos.segmento) {
            return $rootScope.datos.segmento;
        } else {
            return "";
        }
    }

    $scope.nombre = function () {
        if ($rootScope.datos && $rootScope.datos.nombre) {
            return $rootScope.datos.nombre;
        } else {
            return "Mamá Empresaria";
        }
    }

    $scope.inicializar = function () {

        //Establecer valores generales del App
        if (!$rootScope.configuracion) {
            Utilidades.inicializar();
        }

        jQuery.support.cors = true;
        //$.mobile.allowCrossDomainPages = true;

        //Almacenar la cédula si hay almacenamiento local
        if (localStorage && localStorage.cedula) {

            $rootScope.datos = { cedula: localStorage.cedula, clave: localStorage.clave }

            if (Internet.get()) {

                $scope.loading = $ionicLoading.show({
                    template: Utilidades.getPlantillaEspera('Iniciando sesión')
                });

                Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, $filter, Mama, function (success, mensajeError, data) {

                    $ionicLoading.hide();

                    if (success) {

                        if (data.valido == "1") {

                            $scope.loading = $ionicLoading.show({
                                template: Utilidades.getPlantillaEspera('Iniciando sesión')
                            });

                            //Consultar las Notificaciones de Antares e Historial
                            Notificaciones.consultar(function (success, historial, antaresNuevas) {
                                if (success) {
                                    $rootScope.notificacionesHistorial = historial;
                                    $rootScope.notificacionesNuevas = antaresNuevas;

                                    //Si hay notificaciones nuevas hoy entonces mostrar la primera
                                    if (antaresNuevas && antaresNuevas.length > 0 &&
                                        Utilidades.formatearFechaActual() == Utilidades.formatearFechaCadena(antaresNuevas[0].fecha)) {
                                            Notificaciones.mostrarNotificacionNueva(antaresNuevas[0]);
                                    }
                                } else {
                                    $rootScope.notificacionesHistorial = historial;
                                }
                            });

                            Mama.getInformacionBasica(function (success, mensajeError) {

                                $ionicLoading.hide();

                                if (success) {

                                    //Almacenar datos si hay almacenamiento local
                                    if (localStorage) {

                                        localStorage.cedula = $rootScope.datos.cedula;
                                        localStorage.nombre = $rootScope.datos.nombre;
                                        localStorage.segmento = $rootScope.datos.segmento;
                                    }

                                    $scope.datosInicio = { clave: '' };

                                    /*$ionicHistory.nextViewOptions({
                                     disableBack: true
                                     });*/

                                    //Si la Mamá tiene versión para aceptar entonces ir a terminos y condiciones
                                    if ($rootScope.datos.versionHabeasData) {
                                        $rootScope.irAHomeLuegoTerminos = true;
                                        $location.path('/app/terminos-condiciones');
                                    } else {
                                        $ionicHistory.nextViewOptions({
                                            historyRoot: true
                                        });
                                        $location.path('/app/menu/tabs/home');
                                    }

                                } else {
                                    $scope.mostrarAyuda("Creación de clave", mensajeError);
                                }

                            });

                        } else {
                            $location.path('/app/login');
                        }

                    } else {
                        $scope.mostrarAyuda("Inicio de sesión", mensajeError);
                    }

                });

            } else {
                $scope.mostrarMensajeError = true;
                $scope.mostrarAyuda("Inicio de sesión", "Esta aplicación sólo funciona con internet, verifica tu conexión")
            }

        } else {

            $ionicHistory.nextViewOptions({
                historyRoot: true
            });

            $location.path('/app/login');

        }
    }

    $scope.$on('online', function (event, args) {
        $scope.inicializar(true);
    });

    $scope.inicializar();


});