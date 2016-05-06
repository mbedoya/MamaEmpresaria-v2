moduloControlador.controller('ChatCtrl', function($scope, $rootScope, $sce, GA) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Chat");

    $scope.getRutaIframe = function(){
        var ruta = $sce.trustAsResourceUrl("http://mechat.site88.net?cedula=" + $rootScope.datos.cedula +
            "&nombre=" + $rootScope.datos.nombre + "&segmento=" + $rootScope.datos.segmento);
        return ruta;
    }

});
