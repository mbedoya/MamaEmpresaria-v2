moduloServicios
    .factory('Encuesta', function ($rootScope, $http) {

        return {
            obtenerPreguntasEncuesta: function (fx) {

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/crm/encuestas/getEncuesta/01";
                //var urlServicio = "http://www.mocky.io/v2/5761768e2500004d0f8460e6";

                $http.get(urlServicio).
                    success(function (data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function (data, status, headers, config) {
                        fx(false, {});
                    });
            },
            enviarRespuestasEncuesta: function (respuestas, fx) {

                //alert(respuestas);

                //var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/interfaceAntares/getRecordatoriosAntares/" + zona + "/" + seccion;
                var urlServicio = "http://www.mocky.io/v2/5761768e2500004d0f8460e6";

                var request = {
                    method: 'POST',
                    url: urlServicio,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: respuestas
                };

                $http(request).
                    success(function (data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function (data, status, headers, config) {
                        fx(false, {});
                    });
            }
        }

    })