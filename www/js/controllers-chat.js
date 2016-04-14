moduloControlador.controller('ChatCtrl', function($scope, $rootScope) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Chat");

    $scope.getRutaIframe = function(){
        return "http://laboru.co/zopim?cedula=" + $rootScope.datos.cedula +
            "&nombre=" + $rootScope.datos.nombre + "&segmento=" $rootScope.datos.segmento;
    }

});
