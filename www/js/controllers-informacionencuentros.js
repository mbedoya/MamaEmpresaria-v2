moduloControlador.controller('InformacionEncuentrosCtrl', function($scope, $rootScope, $ionicLoading, $state, $ionicPopup, $ionicModal, $http, $document, GA, Mama, Campana, Utilidades) {

    var document=$document[0];

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

    $scope.recordatoriosCampanaActual=function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });


        $scope.ano=$scope.fechaCalendario.getFullYear();
        var campanaActual=$scope.campana;

        if($scope.campana == 1 && $scope.fechaCalendario.getMonth() == 11){           
            $scope.ano = $scope.ano+1;
        }

        Campana.getRecordatorios($scope.ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasCampana = data.listaRecordatorios;
                console.log("informacionFechas.recordatorioCampanaActual - datos enviados", $scope.ano, $scope.campana);
                console.log("informacionFechas.recordatorioCampanaActual - datos recibidos", data);
                $ionicLoading.hide();
            }else{
                console.log("Fallo");
            }
        });
    }

    $scope.hayLugar=function(fecha){
        return fecha.lugar!="..";
    }

    $scope.hayLugar=function(fecha){
        return fecha.hora!=null;
    }

    $scope.esPedido=function(fecha){
        //return fecha.actividad=="TOMA DE PEDIDO";
        return fecha.tipoActividad==5;
    }

    $scope.aumentarCampana=function(){
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        //var ano=$scope.fechaCalendario.getFullYear();

        if($scope.campana == $rootScope.numeroCampanasAno){
            $scope.campana = 1;
            $scope.ano = $scope.ano + 1;           
        }else{
            $scope.campana = $scope.campana + 1;
        }

        Campana.getRecordatorios($scope.ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                if(data.listaRecordatorios!=null){
                    $scope.fechasCampana = data.listaRecordatorios;
                }else{
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para las próximas campañas");  
                    $scope.disminuirCampana();
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

    $scope.disminuirCampana=function(){
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        //var ano=$scope.fechaCalendario.getFullYear();

        if($scope.campana == 1){
            $scope.campana = $rootScope.numeroCampanasAno;
            $scope.ano = $scope.ano - 1;
        }else{
            $scope.campana = $scope.campana - 1;
        }

        Campana.getRecordatorios($scope.ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasCampana = data.listaRecordatorios;
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
    
    $scope.mostrarEncuentros = function(fecha){
        switch(/*fecha.actividad*/fecha.tipoActividad){
            case 1:
                return true;
            default:
                return false;
        }
    }

    $scope.noMostrar = function(fecha){
        switch(/*fecha.actividad*/fecha.tipoActividad){
            case /*"FECHA DE PAGO"*/3:
                return false;
            case /*"FECHA FACTURACIÓN"*/6:
                return false;
            case 1:
                return false;
            default:
                return true;
        }
    }

    $scope.fechasModal = function(fecha){
        return !$scope.noMostrar(fecha);
    }

    $scope.iconoRecordatorio = function(fecha){
        switch(fecha.tipoActividad){
            case /*"ENCUENTRO"*/1:
                return "ion-speakerphone";
            case /*"TOMA DE PEDIDO"*/5:
                return "icon ion-edit";
            case /*"FECHA CORRETEO"*/7:
                return "icon ion-monitor";
            case /*"REPARTO DE PEDIDO 1"*/2:
                return "icon ion-cube";
            default:
                return "icon ion-flag";
        }
    }

    $scope.seleccionarFecha = function(fecha){
        if(!$scope.esPedido(fecha)){
            return;
        }
        $scope.fechaSeleccionada = new Date(fecha.fecha);
        $scope.recordatorio = fecha;
        $scope.openModal();
    }

    $scope.formatoDia = function(fecha){
        return fecha.fecha.substring(8, 10);
    }

    $scope.textoMostrar=function(fecha){        
        $scope.fechaSeleccionada = new Date(fecha.fecha);
        switch(fecha.tipoActividad){
            case /*"ENCUENTRO"*/1:
                return "Tienes encuentro:";
            case /*"TOMA DE PEDIDO"*/5:
                return "Realiza tu pedido:";
            case /*"FECHA CORRETEO"*/7:
                return "Realiza tu pedido por la web máximo:";
            case /*"REPARTO DE PEDIDO 1"*/2:
                return "Posible entrega de pedido:";
            default:
                return fecha.actividad;
        }
    }

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.hoyPar = function(fecha){
        if(fecha.fecha == Utilidades.formatearFechaActual()){
            return "row item item-energized";    
        }else{
            return "row item alternate";
        }
    }

    $scope.hoyImpar = function(fecha){
        if(fecha.fecha == Utilidades.formatearFechaActual()){
            return "row item item-energized";    
        }else{
            return "row item";
        }
    }

    $scope.inicializar = function(){

        $rootScope.cargaDatos.ventanaInformacionFechas = true;

        //El calendario inicia en el mes actual
        $scope.fechaCalendario = new Date();

        $scope.fechaSeleccionada = $scope.fechaCalendario;

        //Fechas de la campana que se está visualizando
        $scope.fechas = $rootScope.fechas;

        $scope.campana = $rootScope.campana.numero;

        $scope.recordatorio;

        //$scope.semanasCalendario();
        $scope.recordatoriosCampanaActual();

        $scope.cargarCampanas();

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
        if(!$rootScope.cargaDatos.ventanaInformacionFechas){
            $scope.inicializar();
        }
    });

});