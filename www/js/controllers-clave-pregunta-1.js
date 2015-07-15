moduloControlador.controller('ClavePregunta1Ctrl', function($scope, $location, $rootScope, $ionicLoading, $ionicPopup, Mama, Internet, GA, Campana, Utilidades) {

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Creacion Clave - Pregunta 1");

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });
    };

    $scope.inicializar = function() {
        
        Mama.getPregunta1(function (success, data) {
            if (success) {
               
               if(data.valido && data.valido == 1){

                   if(!$rootScope.recuperarClave){
                       $scope.mostrarAyuda("Creación de clave", "Mamá, nos encanta tenerte con nosotros. Para que puedas disfrutar de esta aplicación te invitamos a responder unas preguntas y crear tu clave");
                   }
                   
               }else{
                   console.log(data.razonRechazo);
                   if(data.razonRechazo && 
                       (data.razonRechazo == "Pregunta 1 ya ha sido contestada") ){
                       $location.path('/app/clave-pregunta-2');
                   }else{
                       $location.path('/app/clave-pregunta-2');
                   }
                      
               }
               
            }else{
                $scope.mostrarAyuda("Creación de clave", "Lo sentimos, no es posible mostrarte esta pregunta. Responde una pregunta más");
                $location.path('/app/clave-pregunta-2');
            }
        });

        $scope.modelo = { campana:'', ano: ''};
        $scope.campanaActual = "";
        $scope.campanasAnoActual = new Array();

        $scope.campanaActual = "12";

        /*
        $rootScope.zona = "655";
        $rootScope.seccion = "0";

        Campana.getRecordatoriosCampanaOperativa(function (success, data) {
            if (success) {
                $scope.campanaActual = data.campagna;
                var i=1;
                if(Number($scope.campanaActual)-9 > 0){
                    i=Number($scope.campanaActual)-9;
                }
                while(i < Number($scope.campanaActual)){
                    $scope.campanasAnoActual.push({"nombre": i});
                    i=i+1;
                }
            }
        });
        */
    }

    $scope.inicializar();

    $scope.cambioAno = function(){

        $scope.campanasAnoActual = [];


        //Año actual
        if($scope.modelo.ano == $scope.anoActual()){

            console.log("Año actual");

            var i=1;
            if(Number($scope.campanaActual)-9 > 0){
                i=Number($scope.campanaActual)-9;
            }
            while(i < Number($scope.campanaActual)){
                $scope.campanasAnoActual.push({"nombre": i});
                i=i+1;
            }
        }else{
            //Año anterior
            if($scope.modelo.ano == $scope.anoAnterior()){

                console.log("Año anterior");

                var i=9-Number($scope.campanaActual)+1;
                var j=1;
                while(j <= i){
                    $scope.campanasAnoActual.push({"nombre": $rootScope.numeroCampanasAno-i+j});
                    j=j+1;
                }
            }else{

                console.log("sin año");

            }
        }

    }

    $scope.anoActual = function(){
        return new Date().getFullYear();
    }

    $scope.anoAnterior = function(){
        var ano = $scope.anoActual();
        return ano-1;
    }

    $scope.confirmar = function() {

        var myPopup = $ionicPopup.show({
            template: 'Mamá, elegiste la Campaña ' + $scope.modelo.campana + ' de ' + $scope.modelo.ano + ', ¿Es correcto?',
            title: 'Creación de clave',
            subTitle: '',
            scope: $scope,
            buttons: [
                { text: 'No',
                    onTap: function (e) {
                        console.log(e);
                        return false;
                    }
                },
                {
                    text: '<b>Si</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log(e);
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function (res) {

            if(res){
                if(Internet.get()){

                    $scope.loading =  $ionicLoading.show({
                        template: Utilidades.getPlantillaEspera('Validando respuesta')
                    });

                    Mama.responderPregunta("1", $scope.modelo.ano + Utilidades.Pad($scope.modelo.campana), function(success, data){

                        $ionicLoading.hide();

                        if(success){

                            console.log(data);

                            if(data.valido && data.valido == 1){
                                $location.path('/app/clave-nueva-clave-1');
                            }else{
                                $scope.mostrarAyuda("Creación de clave", "Lo sentimos, has fallado en esta respuesta. Responde una pregunta más");
                                $location.path('/app/clave-pregunta-2');
                            }

                        }else{


                        }

                    });

                }else{
                    $scope.mostrarAyuda("Creación de clave","Por favor verifica tu conexión a internet");
                }
            }else{
                $scope.mostrarAyuda("Creación de clave","Por favor selecciona nuevamente la campaña");
            }

        });
    };

    $scope.continuar = function() {

        console.log($scope.modelo.campana);
        $scope.confirmar();

    }

    $scope.mostrarAnoAnterior = function(){
        if($scope.campanaActual != ""){
            if($scope.campanaActual >= 10){
                return false;
            }
        }
        return true;
    }

});