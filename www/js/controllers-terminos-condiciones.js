moduloControlador.controller('TerminosCondicionesCtrl', function($scope, $rootScope, $state, $location, $ionicLoading, GA, TerminosCondiciones) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Terminos y condiciones");

    $scope.continuar = function(){
        $location.path('/app/bienvenida');
    };

    $scope.inicializar = function(){

        TerminosCondiciones.getTerminosCondiciones(function (success, data){
            if(success){
                console.log(data);
                $scope.texto = data.texto;
            }else{

            }
        });
    };

    $scope.$on('online', function(event, args){
        $scope.inicializar(true);
    });

    $scope.$on('loggedin', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.inicializar();
    });

});