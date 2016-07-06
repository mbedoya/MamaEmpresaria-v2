moduloControlador.controller('BuzonesCtrl', function($scope, $rootScope, $ionicLoading, $state, $http, $document, GA, Mama, Utilidades) {

    var document=$document[0];

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Buzones");
    
    $scope.traerBuzones = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando informacion de buzones')
        });
        
        Mama.getBuzones(function (success, data){

            $ionicLoading.hide();

            if(success){
                $scope.buzones = data.buzones;
                console.log("buzones - datos recibidos", data);

            }else{
                console.log("Fallo");
            }
        });
    }

    $scope.inicializar = function(){

        $scope.traerBuzones();
        
        //$rootScope.cargaDatos.ventanaBuzones = true;
    }

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('loggedin', function(event, args){
        //$scope.inicializar();
    });

    $scope.inicializar();

    $scope.$on('$ionicView.beforeEnter', function(){
        //Si no se ha cargado la información entonces inicializar
        if(!$rootScope.cargaDatos.ventanaBuzones){
            //$scope.inicializar();
        }
    });

});