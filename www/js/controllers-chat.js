moduloControlador.controller('ChatCtrl', function($scope, $rootScope, $sce, GA) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Chat");

    $scope.getRutaIframe = function(){
        var ruta = $sce.trustAsResourceUrl("http://laboru.co/zopim?cedula=" + $rootScope.datos.cedula +
            "&nombre=" + $rootScope.datos.nombre + "&segmento=" + $rootScope.datos.segmento);
        return ruta;
    }

});
