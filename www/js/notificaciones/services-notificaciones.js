moduloServicios
    .factory('Notificaciones', function ($rootScope, $http, $ionicPopup, Utilidades) {

        return {

            inicializar: function () {


            },

            mostrarNotificacionNueva: function (notificacion) {

                //Si la notificacion es de pedido terminado entonces invitar a la encuesta
                if (notificacion.mensaje.toLowerCase().indexOf("pedido") > -1
                    && notificacion.message.toLowerCase().indexOf("entregado") > -1
                    && !$rootScope.versionProduccion) {

                    var confirmPopup = $ionicPopup.confirm({
                        title: titulo,
                        template: jsonData.message + ".<br /> ¿Deseas participar en una Encuesta de Satisfacción sobre tu Pedido?"
                    });

                    confirmPopup.then(function (res) {
                        fueLeido();
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
            },

            //Se busca en Antares por la última fecha de acceso al App y las locales como historial
            consultar: function (fx) {

                var fechaActual = Utilidades.formatearFechaActualCompleta();

                //Consultar si existía una última fecha de consulta
                if (!localStorage.me_fechaConsultaNotificaciones) {
                    //Si no había fecha entonces buscar las de los 15 días anteriores
                    fechaActual = Utilidades.formatearFechaNotificacionesCompleta();
                    localStorage.me_fechaConsultaNotificaciones = fechaActual;
                }
                var fechaConsulta = localStorage.me_fechaConsultaNotificaciones;

                var urlServicio = $rootScope.configuracion.ip_servidores + "/" + $rootScope.configuracion.instancia + "/notificaciones/getNotificaciones/" + fechaConsulta;

                var request = {
                    method: 'GET',
                    url: urlServicio
                };

                $http(request).
                    success(function (data, status, headers, config) {

                        console.log("Notificaciones");
                        console.log(data);

                        //Almacenar esta fecha como la última fecha de consulta
                        localStorage.me_fechaConsultaNotificaciones = fechaActual;

                        //Verificar si ya habían notificaciones locales
                        var notificaciones;
                        if (localStorage.me_notificaciones) {
                            notificaciones = JSON.parse(localStorage.me_notificaciones);
                        }

                        //Guardar todas localmente 
                        if (notificaciones) {
                            localStorage.me_notificaciones = JSON.stringify(notificaciones.concat(data.notificaciones));
                        } else {
                            localStorage.me_notificaciones = JSON.stringify(data.notificaciones);
                        }

                        //Retornar las locales y las nuevas
                        fx(true, notificaciones, data.notificaciones);
                    }).
                    error(function (data, status, headers, config) {

                        //Si se produce error consultando en Antares mostrar sólo las locales (si hay)
                        if (localStorage.me_notificaciones) {
                            fx(false, JSON.parse(localStorage.me_notificaciones), null);
                        } else {
                            fx(false, null, null);
                        }

                    });
            }
        }

    })