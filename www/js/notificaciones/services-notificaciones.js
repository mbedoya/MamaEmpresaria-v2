moduloServicios
    .factory('Notificaciones', function ($rootScope, $http, Utilidades) {

        return {

            inicializar: function () {


            },

            //Se busca en Antares por la última fecha de acceso al App y las locales como historial
            consultar: function (fx) {

                //Consultar si existía una última fecha de consulta
                if (!localStorage.me_fechaConsultaNotificaciones) {
                    localStorage.me_fechaConsultaNotificaciones = Utilidades.formatearFechaActual();
                }
                var fechaConsulta = localStorage.me_fechaConsultaNotificaciones;

                var urlServicio = "http://www.mocky.io/v2/57ab5fba120000e41a73b664"
                //var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/crm/encuestas/guardarEncuesta";

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: { fecha: fechaConsulta }
                };

                $http(request).
                    success(function (data, status, headers, config) {

                        //Almacenar esta fecha como la última fecha de consulta
                        localStorage.me_fechaConsultaNotificaciones = Utilidades.formatearFechaActual();

                        //Verificar si ya habían notificaciones locales
                        var notificaciones;    
                        if (localStorage.me_notificaciones) {
                            notificaciones = JSON.parse(localStorage.me_notificaciones);
                        }

                        //Guardar todas localmente 
                        if(notificaciones){
                            localStorage.me_notificaciones = JSON.stringify(notificaciones.concat(data.notificaciones));
                        }else{
                            localStorage.me_notificaciones = JSON.stringify(data.notificaciones);
                        }

                        //Retornar las locales y las nuevas
                        fx(true, notificaciones, data.notificaciones);
                    }).
                    error(function (data, status, headers, config) {

                        //Si se produce error consultando en Antares mostrar sólo las locales
                        fx(false, JSON.parse(localStorage.me_notificaciones), null);
                    });
            }
        }

    })