moduloServicios
    .factory('Encuesta', function ($rootScope, $http) {

        return {
            obtenerPreguntasEncuesta: function (fx) {

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/crm/encuestas/getEncuesta/" + $rootScope.numeroEncuesta;

                $http.get(urlServicio).
                    success(function (data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function (data, status, headers, config) {
                        fx(false, {});
                    });
            },
            enviarRespuestasEncuesta: function (respuestas, fx) {

                if(!$rootScope.campanaEncuesta){
                    $rootScope.campanaEncuesta = "2016" + $rootScope.campanaAnterior.numero;
                }

                //Adicionar información general a las respuestas
                respuestas["codigo"] = $rootScope.numeroEncuesta;
                respuestas["agnoCampagna"] = $rootScope.campanaEncuesta;
                console.log(respuestas);

                var urlServicio = $rootScope.configuracion.ip_servidores +  "/" + $rootScope.configuracion.instancia + "/crm/encuestas/guardarEncuesta";

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