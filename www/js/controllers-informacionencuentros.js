moduloControlador.controller('InformacionEncuentrosCtrl', function($scope, $rootScope, $ionicLoading, $state, $ionicPopup, $ionicModal, $http, $document, GA, Mama, Campana, Utilidades) {

    var document=$document[0];
    
    $scope.openMyPopUp = function() {
        var alertPopup = $ionicPopup.alert({
            title: "prueba",
            template: "msj prueba"
        });
    };

    //Registro en Analytics
    GA.trackPage($rootScope.gaPlugin, "Calendario");

    $ionicModal.fromTemplateUrl('templates/informacionfechas-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;

        $scope.modalRightButtons = [
            {
                type: 'button-clear',
                content: 'Cancel',
                tap: function(e) {
                    $scope.modal.hide();
                }
            }];
    })

    $scope.openModal = function() {
        $scope.modal.show();
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.encuentrosMesActual=function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });


        $scope.ano=$scope.fechaCalendario.getFullYear();
        $scope.mes=$scope.fechaCalendario.getMonth()+1;

        Campana.getEncuentros($scope.ano, $scope.mes, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasMes = data;
                console.log("informacionFechas.encuentrosMesActual - datos enviados", $scope.ano, $scope.campana);
                console.log("informacionFechas.encuentrosMesActual - datos recibidos", data);
                $ionicLoading.hide();
            }else{
                console.log("Fallo");
            }
        });
    }

    $scope.hayLugar=function(fecha){
        return fecha.lugar!="..";
    }

    $scope.hayHora=function(fecha){
        return fecha.hora!=null;
    }

    $scope.aumentarMes=function(){
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        //var ano=$scope.fechaCalendario.getFullYear();
        $scope.mes++;

        if($scope.mes==13){
            $scope.mes = 1;
            $scope.ano++;           
        }


        Campana.getEncuentros($scope.ano, $scope.mes, $rootScope.zona, function (success, data){
            if(success){
                if(!data.razonRehazo){
                    $scope.fechasMes = data;
                }else{
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para los próximos meses");  
                    $scope.disminuirMes();
                    return false;
                }
                console.log("informacionFechas.aumentarMes - datos enviados", $scope.ano, $scope.campana);
                console.log("informacionFechas.aumentarMes - datos recibidos", data);
                $ionicLoading.hide();
                return true;
            }else{
                console.log("Fallo");
                return false;
            }
        });

    }

    $scope.disminuirMes=function(){
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        //var ano=$scope.fechaCalendario.getFullYear();
        
        $scope.mes--;
        
        if($scope.mes==0){
            $scope.mes=12;
            $scope.ano--;
        }

        Campana.getEncuentros($scope.ano, $scope.mes, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasMes = data;
                console.log("informacionFechas.disminuirMes - datos enviados", $scope.ano, $scope.campana);
                $ionicLoading.hide();
            }else{
                console.log("Fallo");
            }
        });
    }

    $scope.mostrarAtras = function(){
        return $scope.campana > $rootScope.campana.numero;
    }

    $scope.fechasModal = function(fecha){
        return !$scope.noMostrar(fecha);
    }

    $scope.formatoFecha = function(fecha){
        return Utilidades.validarFormatoFecha(fecha);
    } 

    $scope.textoMostrar=function(fecha){        
        $scope.fechaSeleccionada=new Date($scope.formatoFecha(fecha.fecha));
        switch(fecha.tipoActividad){
            default:
                return "Tienes encuentro";
        }
    }

    $scope.diasFaltantes=function(fecha){
        var multiplicador=0;
        var diaCalendario=new Date($scope.formatoFecha(fecha.fecha));
        multiplicador=diaCalendario<$scope.fechaCalendario?-1:1;
        var diferenciaTiempo=Math.abs($scope.fechaCalendario - diaCalendario);
        var diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        return diferenciaDias*multiplicador;
    }

    /*$scope.formatoLugar=function(fecha){
        var arrayLugar=fecha.lugar.split(" ");
        var lugarFormateado="";
        for(var i=0; i<arrayLugar.length; i++){
            lugarFormateado+=arrayLugar[i]+" ";
            if(i==1){
                lugarFormateado+="<br>";    
            }
        }
        return lugarFormateado;
    }*/

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.hoyPar = function(fecha){
        if(fecha.fecha == Utilidades.formatearFechaActual()){
            return "item item-icon-left item-hoy-dia";    
        }else{
            return "item item-icon-left alternate";
        }
    }

    $scope.hoyImpar = function(fecha){
        if(fecha.fecha == Utilidades.formatearFechaActual()){
            return "item item-icon-left item-hoy-dia";    
        }else{
            return "item item-icon-left";
        }
    }

    $scope.inicializar = function(){

        $rootScope.cargaDatos.ventanaInformacionEncuentros = true;

        //El calendario inicia en el mes actual
        $scope.fechaCalendario = new Date();

        $scope.fechaSeleccionada = $scope.fechaCalendario;
        
        $scope.fechaPrincipal;

        //Fechas de la campana que se está visualizando
        $scope.fechas = $rootScope.fechas;

        $scope.campana = $rootScope.campana.numero;        

        $scope.recordatorio;

        //$scope.semanasCalendario();
        $scope.encuentrosMesActual();

        $ionicLoading.hide();

    }

    $scope.$on('online', function(event, args){
        $scope.inicializar();
    });

    $scope.$on('loggedin', function(event, args){
        //$scope.inicializar();
    });

    //$scope.inicializar();

    $scope.$on('$ionicView.beforeEnter', function(){
        //Si no se ha cargado la información entonces inicializar
        if(!$rootScope.cargaDatos.ventanaInformacionEncuentros){
            $scope.inicializar();
        }
    });

});