moduloServicios
    .factory('Notificaciones', function ($rootScope, $http, $ionicPopup, $location, Utilidades) {

        this.mostrarNotificacionNuevaInterna = function (notificacion) {

            //Si la notificacion es de pedido terminado entonces invitar a la encuesta
            if (notificacion.mensaje.toLowerCase().indexOf("pedido") > -1
                && notificacion.mensaje.toLowerCase().indexOf("entrega") > -1) {

                var confirmPopup = $ionicPopup.confirm({
                    title: "Notificaciones",
                    template: notificacion.mensaje + ".<br /> ¿Deseas participar en una Encuesta de Satisfacción sobre tu Pedido?"
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        $location.path('/app/menu/tabs/mas/encuestapedido');
                    }
                });

            } else {

                var alertPopup = $ionicPopup.alert({
                    title: "Notificaciones",
                    template: notificacion.mensaje
                });
            }
        };

        var self = this;

        return {

            inicializar: function () {


            },

            proceasarNotificacionOneSignal: function (notificacion) {
                //Si las notificaciones ya han sido cargadas entonces verificar si la notificación ya la ha regresado Antares
                if ($rootScope.notificacionesCargadas) {
                    var notificacionEncontrada = false;
                    //Verificar si la notifcación ya está en la lista
                    for (var index = 0; index < $rootScope.notificacionesNuevas.length; index++) {
                        var element = $rootScope.notificacionesNuevas[index];
                        if (element.mensaje == notificacion.mensaje) {
                            notificacionEncontrada = true;
                            break;
                        }
                    }

                    //Si la notificación no se ha encontrado entonces adicionarla a la lista y mostrarla
                    if (!notificacionEncontrada) {
                        $rootScope.notificacionesNuevas.splice(0, notificacion);
                        self.mostrarNotificacionNuevaInterna(notificacion);
                    }
                }
            },
            mostrarNotificacionNueva: function (notificacion) {
                self.mostrarNotificacionNuevaInterna(notificacion);
            },

            //Se busca en Antares por la última fecha de acceso al App y las locales como historial
            consultar: function (fx) {

                var fechaActual = Utilidades.formatearFechaActualCompleta();

                //Consultar si existía una última fecha de consulta
                if (!localStorage.getItem("me_fechaConsultaNotificaciones_" + $rootScope.datos.cedula)) {
                    //Si no había fecha entonces buscar las de los 15 días anteriores
                    fechaActual = Utilidades.formatearFechaNotificacionesCompleta();
                    localStorage.setItem("me_fechaConsultaNotificaciones_" + $rootScope.datos.cedula, fechaActual);
                }
                var fechaConsulta = localStorage.getItem("me_fechaConsultaNotificaciones_" + $rootScope.datos.cedula);

                var urlServicio = $rootScope.configuracion.ip_servidores + "/" + $rootScope.configuracion.instancia + "/notificaciones/getNotificaciones/" + fechaConsulta;

                var request = {
                    method: 'GET',
                    url: urlServicio
                };

                $http(request).
                    success(function (data, status, headers, config) {

                        $rootScope.notificacionesCargadas = true;

                        //Almacenar esta fecha como la última fecha de consulta
                        localStorage.setItem("me_fechaConsultaNotificaciones_" + $rootScope.datos.cedula, fechaActual);

                        //Verificar si ya habían notificaciones locales
                        var notificaciones;
                        if (localStorage.getItem("me_notificaciones_" + $rootScope.datos.cedula)) {
                            notificaciones = JSON.parse(localStorage.getItem("me_notificaciones_" + $rootScope.datos.cedula));
                        }

                        var notificacionesAAlmacenar;

                        //Guardar todas localmente 
                        if (notificaciones) {
                            notificacionesAAlmacenar = data.notificaciones.concat(notificaciones);
                        } else {
                            notificacionesAAlmacenar = data.notificaciones;
                        }

                        //Si el número de notificaciones supera las 30 entonces recortar, se muestran todas
                        if (notificacionesAAlmacenar && notificacionesAAlmacenar.length > 30) {
                            notificacionesAAlmacenar.length = 30;
                        }

                        localStorage.setItem("me_notificaciones_" + $rootScope.datos.cedula, JSON.stringify(notificacionesAAlmacenar));

                        //Retornar las locales y las nuevas
                        fx(true, notificaciones, data.notificaciones);
                    }).
                    error(function (data, status, headers, config) {

                        $rootScope.notificacionesCargadas = true;

                        //Si se produce error consultando en Antares mostrar sólo las locales (si hay)
                        if (localStorage.getItem("me_notificaciones_" + $rootScope.datos.cedula)) {
                            fx(false, JSON.parse(localStorage.getItem("me_notificaciones_" + $rootScope.datos.cedula)), new Array());
                        } else {
                            fx(false, new Array(), new Array());
                        }

                    });
            }
        }

    })