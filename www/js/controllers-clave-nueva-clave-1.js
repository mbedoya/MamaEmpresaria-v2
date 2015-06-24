moduloControlador.controller('ClaveNuevaClave1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Ingreso Nueva Clave");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };
    
    $scope.confirmar = function(){
      // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '',
    title: 'Creación de clave',
    subTitle: '¿Esta es tu Campaña?',
    scope: $scope,
    buttons: [
      { text: 'No' ,
          onTap: function(e) {
            console.log(e);
            return false;
        }
       },
      {
        text: '<b>Si</b>',
        type: 'button-positive',
        onTap: function(e) {
            console.log(e);
            return true;
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });  
    };

    $scope.modelo = { clave: ''};

    //Autenticar a la Mamá Empresaria
    $scope.continuar = function() {
        
        $scope.confirmar();

        //Cédula vacía
        if(!$scope.modelo.clave){
            $scope.mostrarAyuda("Creación de clave","Ingresa tu clave");
            return;
        }

        //Cantidad de caracteres
        if(String($scope.modelo.clave).length != 4){
            $scope.mostrarAyuda("Creación de clave","Ingresa 4 dígitos");
            return;
        }

        //Caracteres especiales
        if(String($scope.modelo.clave).indexOf(".") >= 0 || String($scope.modelo.clave).indexOf(",") >= 0){
            $scope.mostrarAyuda("Creación de clave","Ingresa sólo números");
            return;
        }

        //Guardar la clave ingresada para posterior comparac
        $rootScope.clave1 = $scope.modelo.clave;

        try{

            if(Internet.get()){

                $location.path('/app/clave-nueva-clave-2');

            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
            }

        }catch (err){
            alert(err.message);
        }


    }
});