moduloControlador.controller('ChatCtrl', function($scope, $rootScope, $sce, GA) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Chat");

    $scope.getRutaIframe = function(){

        //var ruta = 'http://www.google.com';
        var ruta = $sce.trustAsResourceUrl('http://laboru.co/jivo/index.html');

        console.log(ruta);

        /*
        var ruta = $sce.trustAsResourceUrl("http://mechat.site88.net?cedula=" + $rootScope.datos.cedula +
            "&nombre=" + $rootScope.datos.nombre + "&segmento=" + $scope.datos.segmento); */
        return ruta;
    }

});
