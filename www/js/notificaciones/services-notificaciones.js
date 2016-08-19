moduloServicios
    .factory('Notificaciones', function ($rootScope, $http, Utilidades) {

        return {

            inicializar: function () {


            },

            //Se busca en Antares por la última fecha de acceso al App y las locales como historial
            consultar: function (fx) {

                var fechaActual = Utilidades.formatearFechaActualCompleta();

                //Consultar si existía una última fecha de consulta
                if (!localStorage.me_fechaConsultaNotificaciones) {
                    localStorage.me_fechaConsultaNotificaciones = fechaActual;
                }
                var fechaConsulta = localStorage.me_fechaConsultaNotificaciones;

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/notificaciones/getNotificaciones/" + fechaConsulta;

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
                        if(notificaciones){
                            localStorage.me_notificaciones = JSON.stringify(notificaciones.concat(data.notificaciones));
                        }else{
                            localStorage.me_notificaciones = JSON.stringify(data.notificaciones);
                        }

                        //Retornar las locales y las nuevas
                        fx(true, notificaciones, data.notificaciones);
                    }).
                    error(function (data, status, headers, config) {

                        //Si se produce error consultando en Antares mostrar sólo las locales (si hay)
                        if (localStorage.me_notificaciones) {
                            fx(false, JSON.parse(localStorage.me_notificaciones), null);                            
                        }else{
                            fx(false, null, null);
                        }

                    });
            }
        }

    })