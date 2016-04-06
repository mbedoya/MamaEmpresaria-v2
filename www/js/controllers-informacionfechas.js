moduloControlador.controller('InformacionFechasCtrl', function($scope, $rootScope, $ionicLoading, $state, $ionicPopup, $ionicModal, $http, $document, GA, Mama, Campana, Utilidades, Internet) {

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
                if(data.listaRecordatorios && data.listaRecordatorios.length>0){
                    $scope.fechasCampana = data.listaRecordatorios;
                }else{
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para la campaña");  
                    $state.go('app.menu.tabs.home');
                }
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

    $scope.informacionAdicional=function(fecha){
        switch(fecha.codigoActividad){
            case /*"TOMA DE PEDIDO 1"*/"05":
                return true;
            case /*"TOMA DE PEDIDO 2"*/"07":
                return true;
            case /*"REPARTO DE PEDIDO 1"*/"02":
                return true;
            case /*"REPARTO DE PEDIDO 2"*/"04":
                return true;
            case /*"TOMA DE PEDIDO BUZON"*/"08":
                return true;
            case /*"REPARTO DE PEDIDO BUZON"*/"09":
                return true;
            default:
                break;
        }
    }

    $scope.aumentarCampana=function(){
        if(!Internet.get()){
            $scope.mostrarAyuda("Amentar campaña","Por favor verifica tu conexión a internet");  
            return;
        }
        
        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        if($scope.campana == $rootScope.numeroCampanasAno){
            $scope.campana = 1;
            $scope.ano = $scope.ano + 1;           
        }else{
            $scope.campana = $scope.campana + 1;
        }

        Campana.getRecordatorios($scope.ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                if(data.listaRecordatorios && data.listaRecordatorios.length>0){
                    $scope.fechasCampana = data.listaRecordatorios;
                }else{
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para la campaña");  
                    $scope.disminuirCampana();
                }
                console.log("informacionFechas.aumentarMes - datos enviados", $scope.ano, $scope.campana);
                console.log("informacionFechas.aumentarMes - datos recibidos", data);
                $ionicLoading.hide();
            }else{
                console.log("Fallo");
            }
        });

    }

    $scope.disminuirCampana=function(){
        
        if(!Internet.get()){
            $scope.mostrarAyuda("Disminuir campaña","Por favor verifica tu conexión a internet");    
            return;
        }

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });        
        
        if($scope.campana == 1){
            $scope.campana = $rootScope.numeroCampanasAno;
            $scope.ano = $scope.ano - 1;
        }else{
            $scope.campana = $scope.campana - 1;
        }

        Campana.getRecordatorios($scope.ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                if(data.listaRecordatorios && data.listaRecordatorios.length>0){
                    $scope.fechasCampana = data.listaRecordatorios;
                }else{
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para la campaña");  
                    $scope.aumentarCampana();
                }
                $scope.fechasCampana = data.listaRecordatorios;
                console.log("informacionFechas.disminuirMes - datos enviados", $scope.ano, $scope.campana);
                console.log("informacionFechas.disminuirMes - datos recibidos", data);
                $ionicLoading.hide();
            }else{
                console.log("Fallo");
            }
        });
    }

    $scope.mostrarAtras = function(){
        return $scope.campana > $rootScope.campana.numero;
    }

    $scope.noMostrar = function(fecha){
        switch(/*fecha.actividad*/fecha.codigoActividad){
            case /*"FECHA DE PAGO"*/"03":
                return false;
            case /*"FECHA FACTURACIÓN"*/"06":
                return false;
            default:
                return true;
        }
    }

    $scope.fechasModal = function(fecha){
        return !$scope.noMostrar(fecha);
    }

    $scope.iconoRecordatorio = function(fecha){
        var clase="";
        switch(fecha.codigoActividad){
            case /*"TOMA DE PEDIDO 1"*/"05":
                clase = "icon ion-monitor fecha-icono-rosa";
                break;
            case /*"TOMA DE PEDIDO 2"*/"07":
                clase = "icon ion-monitor fecha-icono-amarillo";
                break;
            case /*"REPARTO DE PEDIDO 1"*/"02":
                clase = "icon ion-cube fecha-icono-rosa";
                break;
            case /*"REPARTO DE PEDIDO 2"*/"04":
                clase = "icon ion-cube fecha-icono-amarillo";
                break;
            case /*"TOMA DE PEDIDO BUZON"*/"08":
                clase = "icon ion-compose fecha-icono-verde";
                break;
            case /*"REPARTO DE PEDIDO BUZON"*/"09":
                clase = "icon ion-bag fecha-icono-verde";
                break;
            default:
                clase = "icon ion-flag";
                break;
        }
        /*if($scope.esHoy(fecha.fecha)){
            clase=clase+" icono-fecha-hoy"
        }*/
        return clase;
    }

    $scope.iconoDetalle = function(fecha){
        var clase="";
        switch(fecha.codigoActividad){
            case /*"TOMA DE PEDIDO 1"*/"05":
                clase = "icon ion-plus-circled item-chevron";
                break;
            case /*"TOMA DE PEDIDO 2"*/"07":
                clase = "icon ion-plus-circled item-chevron";
                break;
            case /*"REPARTO DE PEDIDO 1"*/"02":
                clase = "icon ion-plus-circled item-chevron";
                break;
            case /*"REPARTO DE PEDIDO 2"*/"04":
                clase = "icon ion-plus-circled item-chevron";
                break;
            case /*"TOMA DE PEDIDO BUZON"*/"08":
                clase = "icon ion-plus-circled item-chevron";
                break;
            case /*"REPARTO DE PEDIDO BUZON"*/"09":
                clase = "icon ion-plus-circled item-chevron";
                break;
            default:
                clase = "icon ion-plus-circled item-chevron";
                break;
        }
        /*if($scope.esHoy(fecha.fecha)){
            clase=clase+" icono-fecha-hoy"
        }*/
        return clase;
    }

    $scope.detalleTexto = function(){
        var detalleModal="";
        switch($scope.recordatorioClick.codigoActividad){
            case "02":
                detalleModal = "Recibirás tu pedido en esta fecha, si lo montaste en la toma de pedido 1 y pagaste este mismo día antes de las 12 de la noche.";
                break;
            case "05":
                detalleModal = "Monta tu pedido este día únicamente por la página web, tienes plazo hasta las 12 de la noche.";
                break;
            case "07":
                detalleModal = "Monta tu pedido este día únicamente por la página web, tienes plazo hasta las 12 de la noche.";
                break;
            case "04":
                detalleModal = "Recibirás tu pedido en esta fecha, si lo montaste en la toma de pedido 2 y pagasta este mismo día antes de las 12 de la noche.";
                break;
            case "08":
                detalleModal = "Lleva tu pedido al buzón antes de la 1 de la tarde de este día.";   
                break;
            case "09":
                detalleModal = "Recibirás tu pedido en esta fecha, si lo realizaste por este medio en la fecha establecida.";   
                break;
            default:
                detalleModal = fecha.actividad;
                break;
        }
        return detalleModal;
    }

    $scope.seleccionarFecha = function(fecha){
        $scope.fechaSeleccionada=new Date($scope.formatoFecha(fecha.fecha));
        if($scope.informacionAdicional){                
            $scope.fechaClick=$scope.fechaSeleccionada;
            $scope.recordatorioClick=fecha;
        }
        $scope.recordatorio = fecha;
        $scope.openModal();
    }

    $scope.textoMostrarCodigo = function(codigo){
        switch(codigo){
            case "02":
                return "Entrega de pedido 1:";
            case "05":
                return "Toma de pedido 1:";
            case "07":
                return "Toma de pedido 2:";
            case "04":
                return "Entrega de pedido 2:";
            case "08":
                return "Toma de pedidos<br> por buzón:";
            case "09":
                return "Entrega de pedidos<br> por buzón:";
            default:
                return "";
        }
    }

    $scope.textoRecordatorio = function(codigo){
        switch(codigo){
            case "02":
                return "entrega de pedido 1";
            case "05":
                return "toma de pedido 1";
            case "07":
                return "toma de pedido 2";
            case "04":
                return "entrega de pedido 2";
            case "08":
                return "toma de pedidos por buzón";
            case "09":
                return "entrega de pedidos por buzón";
            default:
                return "";
        }
    }

    $scope.textoMostrar=function(fecha){        
        $scope.fechaSeleccionada=new Date($scope.formatoFecha(fecha.fecha));
        return $scope.textoMostrarCodigo(fecha.codigoActividad);
    }

    $scope.formatoFecha = function(fecha){
        return Utilidades.validarFormatoFecha(fecha);
    }    

    $scope.diasFaltantes=function(fecha){
        var multiplicador=0;
        var diaCalendario=new Date($scope.formatoFecha(fecha.fecha));
        multiplicador=diaCalendario<$scope.fechaCalendario?-1:1;
        var diferenciaTiempo=Math.abs($scope.fechaCalendario - diaCalendario);
        var diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        return diferenciaDias*multiplicador;
    }

    $scope.ordenamiento = function(fecha){
        switch(fecha.codigoActividad){
            case "02":
                return 2;
            case "05":
                return 1;
            case "07":
                return 3;
            case "04":
                return 4;
            case "08":
                return 5;
            case "09":
                return 6;  
            default:
                return fecha.actividad;
        }
    }

    $scope.relacionFechas = function(codigo){
        switch(codigo){
            case "05":
                return "02";
            case "02":
                return "05";
            case "07":
                return "04";
            case "04":
                return "07";
            case "08":
                return "09";
            case "09":
                return "08";
            default:
                return "";
        }
    }

    $scope.esEntrega = function(codigo){
        switch(codigo){
            case "02":
                return true;
            case "04":
                return true;
            case "09":
                return true; 
        }
        return false;
    }

    $scope.mostrarAyuda = function(titulo, mensaje) {
        var alertPopup = $ionicPopup.alert({
            title: "",
            template: mensaje
        });
    };

    $scope.esHoy=function(fecha){
        if(Utilidades.validarFormatoFecha(fecha) === Utilidades.validarFormatoFecha(Utilidades.formatearFechaActual()))return true;
        else return false;
    }

    $scope.hoyPar = function(fecha){
        var clase="";
        if($scope.esHoy(fecha.fecha)){
            clase = "row item item-hoy-dia";    
        }else{
            clase = "row item alternate";
        }
        /*switch(fecha.codigoActividad){
            case "05":
            case "02":
                clase=clase+" fecha-row-relacion-aqua"
                break;
            case "07":
            case "04":
                clase=clase+" fecha-row-relacion-aquamarine"
                break;
        }*/
        return clase;
    }

    $scope.hoyImpar = function(fecha){
        var clase="";
        if($scope.esHoy(fecha.fecha)){
            clase = "row item item-hoy-dia";    
        }else{
            clase = "row item";
        }
        /*switch(fecha.codigoActividad){
            case "05":
            case "02":
                clase=clase+" fecha-row-relacion-aqua"
                break;
            case "07":
            case "04":
                clase=clase+" fecha-row-relacion-aquamarine"
                break;
        }*/
        return clase;
    }

    $scope.inicializar = function(){

        //$rootScope.cargaDatos.ventanaInformacionFechas = true;

        //El calendario inicia en el mes actual
        $scope.fechaCalendario = new Date();

        $scope.fechaSeleccionada = $scope.fechaCalendario;

        //Fechas de la campana que se está visualizando
        $scope.fechas = $rootScope.fechas;

        $scope.campana = $rootScope.campana.numero;

        $scope.recordatorio;

        //$scope.semanasCalendario();
        $scope.recordatoriosCampanaActual();

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