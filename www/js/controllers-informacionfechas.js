moduloControlador.controller('InformacionFechasCtrl', function($scope, $rootScope, $ionicLoading, $state, $ionicPopup, $ionicModal, $http, $document, GA, Mama, Campana, Utilidades) {

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
        return fecha.tipoActividad==7;
    }

    $scope.aumentarCampana=function(){
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
                    $scope.mostrarAyuda("Falta campaña","Lo sentimos, aún no tenemos información disponible para las próximas campañas");  
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
                return "ion-android-people";
            case /*"TOMA DE PEDIDO"*/5:
                return "icon ion-speakerphone";
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
        $scope.fechaSeleccionada=new Date($scope.formatoFecha(fecha.fecha));
        if(fecha.tipoActividad == 7){                
            $scope.fechaClick=$scope.fechaSeleccionada;
        }
        $scope.recordatorio = fecha;
        $scope.openModal();
    }

    /*$scope.formatoDia = function(fecha){
        
        var diaGenerado=parseInt(fecha.fecha.substring(8, 10));
        var mesGenerado=parseInt(fecha.fecha.substring(5, 7));
        var anoGenerado=parseInt(fecha.fecha.substring(0, 4));
        var fechaEntrada = new Date(anoGenerado+"/"+mesGenerado+"/"+diaGenerado);
        var diaEntrada=fechaEntrada.getDate();
        if(diaGenerado>diaEntrada){
            var mes=(fechaEntrada.getMonth()+1).toString();
            mes=mes.length==2?mes:0+mes;
            var fechaGenerada=fechaEntrada.getFullYear()+"-"+mes+"-"+(diaGenerado+1);
            $scope.fechaSeleccionada=new Date(fechaGenerada);
        }else{
            $scope.fechaSeleccionada=fechaEntrada;   
        }        
        return $scope.fechaSeleccionada.getDate();
    }*/

    $scope.textoMostrar=function(fecha){        
        $scope.fechaSeleccionada=new Date($scope.formatoFecha(fecha.fecha));
        switch(fecha.tipoActividad){
            case /*"ENCUENTRO"*/1:
                return "Tienes encuentro el:";
            case /*"TOMA DE PEDIDO"*/5:
                return "Realiza tu pedido el:";
            case /*"FECHA CORRETEO"*/7:
                return "Haz tu pedido por la web máximo el:";
            case /*"REPARTO DE PEDIDO 1"*/2:
                return "Posible entrega de pedido el:";
            default:
                return fecha.actividad;
        }
    }
    
    $scope.formatoFecha = function(fecha){
        var fechaFormateada=Utilidades.reemplazarTodos(fecha, '-', '/');
        var pruebaFecha=new Date(fechaFormateada);
        var diaOriginal=parseInt(fecha.substring(8, 10));
        if(diaOriginal!=pruebaFecha.getDate()){
            return fecha.fecha;    
        }
        return fechaFormateada;
    }    

    $scope.diasFaltantes=function(fecha){
        var diaCalendario=new Date(fecha.fecha);
        if(diaCalendario<$scope.fechaCalendario)return 0;
        var diferenciaTiempo=Math.abs($scope.fechaCalendario - diaCalendario);
        var diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        return diferenciaDias;
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

    /*
    $scope.padStr = function(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

    $scope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
    }

    $scope.esAntesMedioDia = function(){
        return new Date().getHours() < 12;
    }

    $scope.estiloTexto = function(fecha){
        var fechaActual = $scope.fechaCalendario;

        var dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
            $scope.padStr(1 + fechaActual.getMonth()) + "-" +
            fechaActual.getDate();

        if(fecha == dateStr){
            return "assertive";
        }else{
            return "";
        }
    }

    $scope.fechaVisibleCalendario = function(){
        return $scope.fechaCalendario;
    }

    $scope.mostrarAtras = function(){

        return false;

        //return $scope.campana > $rootScope.campana.numero;
    }

    $scope.mostrarAdelante = function(){
        return $scope.campana < $rootScope.numeroCampanasAno;
    }

    $scope.mesAnterior = function(){

        //Establecer la fecha al día 1 del mes actual
        var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
            $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';

        //Devolverse 1 mes
        $scope.fechaCalendario = new Date(cadenaFecha);
        $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() - 2);

        //Establecer la fecha al día 1 del mes siguiente
        //La fecha se está retornando 1 día al hacer el new Date()
        //, no se sabe la razón, por esto se pone 02
        cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
            $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';

        if(new Date(cadenaFecha).getDate() == 2) {
            cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';
        }

        return new Date(cadenaFecha);
    }

    $scope.disminuirMes = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        $scope.fechaCalendario = $scope.mesAnterior();

        //Disminuir la campana
        var ano = $scope.fechaCalendario.getFullYear();

        if($scope.campana == 1){
            $scope.campana = $rootScope.numeroCampanasAno;
            ano = ano - 1;
        }else{
            $scope.campana = $scope.campana - 1;
        }

        Campana.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechas = data.listaRecordatorios;

                //Generar el calendario nuevamente
                $scope.semanasCalendario();

                $ionicLoading.hide();

            }else{
                $ionicLoading.hide();
                $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
            }
        });
    }

    $scope.aumentarMes = function(){

        $scope.loading =  $ionicLoading.show({
            template: Utilidades.getPlantillaEspera('Cargando información de campaña')
        });

        //Establecer la fecha al día 1 del mes actual
        var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
            $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';

        //Moverse 1 mes
        $scope.fechaCalendario = new Date(cadenaFecha);
        $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() + 32);

        //Establecer la fecha al día 1 del mes siguiente
        //La fecha se está retornando 1 día al hacer el new Date()
        //, no se sabe la razón, por esto se pone 02
        cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
            $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';

        if(new Date(cadenaFecha).getDate() == 2) {
            cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01';
        }

        $scope.fechaCalendario = new Date(cadenaFecha);

        var ano = $scope.fechaCalendario.getFullYear();

        //Aumentar la campana
        if($scope.campana == $rootScope.numeroCampanasAno){
            $scope.campana = 1;
            ano = ano + 1;
        }else{
            $scope.campana = $scope.campana + 1;
        }

        Campana.getRecordatorios(ano, $scope.campana, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechas = data.listaRecordatorios;

                console.log("Recordatorios aumentar mes", data);

                //Generar el calendario nuevamente
                $scope.semanasCalendario();

                $ionicLoading.hide();

            }else{
                $ionicLoading.hide();

                $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
            }
        });
    }

    $scope.numeroCampana = function(){
        return $scope.campana;
    }

    $scope.fechaEsCampanaVisible = function(fecha){

        if($scope.cadenaFechaSeleccionada == fecha){
            return false;
        }

        encontrado = false;

        var fechaCalendario = new Date(fecha);
        var fechaMinimaCampana;

        var cadenaFechaCorreteo = '';
        //Buscar la fecha de correteo
        for (i = 0; i < $scope.fechas.length; i++){
            if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                cadenaFechaCorreteo = $scope.fechas[i].fecha;
                break;
            }
        }

        var fechaCorreteo = new Date(cadenaFechaCorreteo);

        //Si no se conocen las fechas anteriores entonces devolverse 21 días
        if(!$scope.fechasCampanaAnterior){

            //Buscar la fecha de inicio de la campaña
            fechaMinimaCampana = new Date(cadenaFechaCorreteo);
            fechaMinimaCampana.setDate(fechaMinimaCampana.getDate()-21);
        }else{

            //Buscar el Correteo Anterior
            var cadenaFechaCorreteoAnterior = '';
            //Buscar la fecha de encuentro
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == 'fecha correteo'){
                    cadenaFechaCorreteoAnterior = $scope.fechasCampanaAnterior[i].fecha;
                    break;
                }
            }
            fechaMinimaCampana = new Date(cadenaFechaCorreteoAnterior);
            fechaMinimaCampana.setDate(fechaMinimaCampana.getDate()+1);
        }

        for (i = 0; i < $scope.fechas.length; i++){
            if(fechaCalendario <= fechaCorreteo &&
               fechaCalendario >= fechaMinimaCampana){
                encontrado = true;
                break;
            }
        }
        return encontrado;

    }

    $scope.fechaEsCorreteo = function(fecha){
        encontrado = false;
        if($scope.fechas==null || $scope.fechasSiguienteCampana==null || $scope.fechasCampanaAnterior==null)return false;
        for (i = 0; i < $scope.fechas.length; i++){
            if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo' &&
               $scope.fechas[i].fecha == fecha ){
                encontrado = true;
                break;
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasSiguienteCampana){
            for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'fecha correteo' &&
                   $scope.fechasSiguienteCampana[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasCampanaAnterior){
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == 'fecha correteo' &&
                   $scope.fechasCampanaAnterior[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        return encontrado;
    }

    $scope.fechaEsEncuentro = function(fecha){
        encontrado = false;
        if($scope.fechas==null || $scope.fechasSiguienteCampana==null || $scope.fechasCampanaAnterior==null)return false;
        for (i = 0; i < $scope.fechas.length; i++){
            if($scope.fechas[i].actividad.toLowerCase() == 'encuentro' &&
               $scope.fechas[i].fecha == fecha ){
                encontrado = true;
                break;
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasSiguienteCampana){
            for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'encuentro' &&
                   $scope.fechasSiguienteCampana[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasCampanaAnterior){
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == 'encuentro' &&
                   $scope.fechasCampanaAnterior[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        return encontrado;
    }

    $scope.fechaEsTomaPedido = function(fecha){

        if($scope.fechaEsEncuentro(fecha)){
            return false;
        }
        if($scope.fechas==null || $scope.fechasSiguienteCampana==null || $scope.fechasCampanaAnterior==null)return false;
        encontrado = false;
        for (i = 0; i < $scope.fechas.length; i++){
            if($scope.fechas[i].actividad.toLowerCase() == 'toma de pedido' &&
               $scope.fechas[i].fecha == fecha ){
                encontrado = true;
                break;
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasSiguienteCampana){
            for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'toma de pedido' &&
                   $scope.fechasSiguienteCampana[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasCampanaAnterior){
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == 'toma de pedido' &&
                   $scope.fechasCampanaAnterior[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        return encontrado;
    }

    $scope.fechaEsRepartoPedido = function(fecha){
        encontrado = false;
        if($scope.fechas==null || $scope.fechasSiguienteCampana==null || $scope.fechasCampanaAnterior==null)return false;
        for (i = 0; i < $scope.fechas.length; i++){
            if($scope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1' &&
               $scope.fechas[i].fecha == fecha ){
                encontrado = true;
                break;
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasSiguienteCampana){
            for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == 'reparto de pedido 1' &&
                   $scope.fechasSiguienteCampana[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        //Si no se ha encontrado buscar en la siguiente campana
        if(!encontrado && $scope.fechasCampanaAnterior){
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == 'reparto de pedido 1' &&
                   $scope.fechasCampanaAnterior[i].fecha == fecha ){
                    encontrado = true;
                    break;
                }
            }
        }

        return encontrado;
    }
    $scope.seleccionarFecha = function(fecha, mostrarDetalle){

        try{
            if($scope.cadenaFechaSeleccionada != ''){
                $("#" + $scope.cadenaFechaSeleccionada).removeClass("positive");
                $("#" + $scope.cadenaFechaSeleccionada).removeClass("hoy");
            }

            $scope.cadenaFechaSeleccionada = fecha;
            if(mostrarDetalle){
                $("#" + $scope.cadenaFechaSeleccionada).addClass("positive");
            }else{

                if(fecha == Utilidades.formatearFechaActual() && $scope.fechaEsCampanaVisible(fecha)){
                    $("#" + $scope.cadenaFechaSeleccionada).addClass("hoy-campana");
                }else{
                    $("#" + $scope.cadenaFechaSeleccionada).addClass("hoy");
                }
            }

            var fechaEsCorreteo = false;
            var fechaEsRepartoPedido = false;

            var listaEventos = new Array();

            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].fecha == fecha){
                    listaEventos.push($scope.fechas[i]);
                    if($scope.fechas[i].actividad.toLowerCase() == "fecha correteo"){
                        fechaEsCorreteo = true;
                    }
                    if($scope.fechas[i].actividad.toLowerCase() == "reparto de pedido 1"){
                        fechaEsRepartoPedido = true;
                    }
                }
            }

            if($scope.fechasSiguienteCampana && $scope.fechasSiguienteCampana.length > 0 ){
                for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                    if($scope.fechasSiguienteCampana[i].fecha == fecha){
                        listaEventos.push($scope.fechasSiguienteCampana[i]);
                        if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "fecha correteo"){
                            fechaEsCorreteo = true;
                        }
                        if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "reparto de pedido 1"){
                            fechaEsRepartoPedido = true;
                        }
                    }
                }
            }

            if($scope.fechasCampanaAnterior && $scope.fechasCampanaAnterior.length > 0 ){
                for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                    if($scope.fechasCampanaAnterior[i].fecha == fecha){
                        listaEventos.push($scope.fechasCampanaAnterior[i]);
                        if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == "fecha correteo"){
                            fechaEsCorreteo = true;
                        }
                        if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == "reparto de pedido 1"){
                            fechaEsRepartoPedido = true;
                        }
                    }
                }
            }

            $scope.fechaSeleccionada = new Date(fecha);
            //Esto se hace por bug en manejo de fechas
            $scope.fechaSeleccionada.setDate($scope.fechaSeleccionada.getDate() + 1);

            //Si la fecha es correteo mostramos una información diferente
            if(fechaEsCorreteo){
                listaEventos = [];

                //El día de correteo luego de las 12 se debe decir que
                //ya no se puede montar pedido
                if($scope.hoyEsCorreteo() && !$scope.esAntesMedioDia() && Utilidades.formatearFechaActual == Utilidades.formatearFecha($scope.fechaSeleccionada)){
                    listaEventos.push({ "actividad": "Ya no puedes montar pedido." });
                }else{
                    listaEventos.push({ "actividad": "Monta tu pedido este día, por la Página web, antes de las 12 del medio día." });
                }
                listaEventos.push({ "actividad": "Cancela tu pedido anterior máximo este día antes de las 4 de la tarde." });
            }

            if(fechaEsRepartoPedido){
                listaEventos = [];
                listaEventos.push({ "actividad": "Posible entrega de pedido." });
            }

            $scope.detalleFecha = listaEventos;

        }catch(err){
            console.log(err.message);
        }

        try{
            if(mostrarDetalle){
                $scope.openModal();
            }
        }catch(err){
            console.log(err.message);
        }
    }


    $scope.fondoDia = function(fecha){

        //Buscar en la campaña que se encuentra la fecha para conocer el color
        //Se inicia por la campaña del medio
        var correteo = "";

        //Buscar correteo anterior
        for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
            if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == "fecha correteo"){
                correteo = $scope.fechasCampanaAnterior[i].fecha;
            }
        }*/

    /*
        if($scope.campana == 1)
        alert(correteo);
        */
    /*
        //Campaña anterior?
                console.log("fondoDia - Campaña anterior?")
                console.log("fondoDia - fecha", fecha)
                console.log("fondoDia - correteo", correteo)
        if(new Date(fecha) <= new Date(correteo)){*/
    /*
            if($scope.campana == 1)
            alert("Anterior " + $scope.corregirNumeroCampana($scope.campana-1));
            *//*
            return $scope.estiloCampana($scope.corregirNumeroCampana($scope.campana-1));
        }else{
            //Buscar correteo actual
            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].actividad.toLowerCase() == "fecha correteo"){
                    correteo = $scope.fechas[i].fecha;
                }
            }

            //Campaña actual?
            console.log("fondoDia - Campaña actual?")
                console.log("fondoDia - fecha", fecha)
                console.log("fondoDia - correteo", correteo)
            if(new Date(fecha) <= new Date(correteo)){*/
    /*
                if($scope.campana == 1)
                alert("Actual " + $scope.campana);
                *//*
                return $scope.estiloCampana($scope.campana);
            }else{
                //Buscar correteo siguiente
                for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                    if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "fecha correteo"){
                        correteo = $scope.fechasSiguienteCampana[i].fecha;
                    }else{
                        correteo="";   
                    }
                }
                */
    /*
                if($scope.campana == 1)
                alert("Otro Correteo " + correteo);
                *//*
                console.log("fondoDia - Campaña siguiente?")
                console.log("fondoDia - fecha", fecha)
                console.log("fondoDia - correteo", correteo)
                if(new Date(fecha) <= new Date(correteo) || correteo==""){
                    /*
                    if($scope.campana == 1)
                    alert("Menor igual " + $scope.corregirNumeroCampana($scope.campana+1));
                    *//*
                    return $scope.estiloCampana($scope.corregirNumeroCampana($scope.campana+1));
                }else{
                    /*
                    if($scope.campana == 1)
                    alert("Mayor " + $scope.corregirNumeroCampana($scope.campana+2));
                    *//*
                    return $scope.estiloCampana($scope.corregirNumeroCampana($scope.campana+2));
                }

            }
        }
    }

    $scope.estiloCampana = function(campana){
        if((campana)%3 == 0){
            return "#33CCCC";   
        }else{
            if((campana)%3 == 1){
                return "#FFAD33";
            }else{
                return "#99D6EB";
            }
        }
    }

    $scope.corregirNumeroCampana = function(numero){
        if(numero > $rootScope.numeroCampanasAno){
            return 1;
        }else{
            if(numero == 0){
                return $rootScope.numeroCampanasAno;
            }
        }
        return numero;
    }

    $scope.actualizarCampanasMes = function(){

        $scope.misCampanas.length = 0;

        var correteo = "";

        if($scope.fechasCampanaAnterior){
            //Campana anterior
            for (i = 0; i < $scope.fechasCampanaAnterior.length; i++){
                if($scope.fechasCampanaAnterior[i].actividad.toLowerCase() == "fecha correteo"){
                    correteo = $scope.fechasCampanaAnterior[i].fecha;
                }else{
                    correteo = null;
                }
            }

            console.log("InformacionFechas - CAMPANA ANTERIOR");
            console.log("InformacionFechas - correteo", new Date(correteo));
            console.log("InformacionFechas - fechaCalendario", new Date($scope.fechaCalendario));
            if(correteo!=null && new Date(correteo).getMonth() == new Date($scope.fechaCalendario).getMonth()){
                $scope.misCampanas.push({numero: $scope.corregirNumeroCampana($scope.campana-1), color: $scope.estiloCampana($scope.campana-1)});
            }
        }

        //Campana actual
        $scope.misCampanas.push({numero: $scope.corregirNumeroCampana($scope.campana), color: $scope.estiloCampana($scope.campana)});
        console.log("camp actual: " + Number($scope.campana));

        var campSiguienteAdicionada = false;
        //Campana siguiente
        if($scope.fechas){
            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].actividad.toLowerCase() == "fecha correteo"){
                    correteo = $scope.fechas[i].fecha;
                }else{
                    correteo = null;
                }
            }

            console.log("InformacionFechas - CAMPANA SIGUIENTE");
            console.log("InformacionFechas - correteo", new Date(correteo));
            console.log("InformacionFechas - fechaCalendario", new Date($scope.fechaCalendario));

            if(correteo!=null && new Date(correteo).getMonth() == new Date($scope.fechaCalendario).getMonth()){
                $scope.misCampanas.push({numero: $scope.corregirNumeroCampana($scope.campana+1), color: $scope.estiloCampana($scope.campana+1)});
                campSiguienteAdicionada = true;
            }
        }

        //Campana siguiente a la siguiente
        if($scope.fechasSiguienteCampana){
            for (i = 0; i < $scope.fechasSiguienteCampana.length; i++){
                if($scope.fechasSiguienteCampana[i].actividad.toLowerCase() == "fecha correteo"){
                    correteo = $scope.fechasSiguienteCampana[i].fecha;
                }else{
                    correteo = null;
                }
            }

            console.log("InformacionFechas - CAMPANA SIGUIENTE SIGUIENTE");
            console.log("InformacionFechas - correteo", new Date(correteo));
            console.log("InformacionFechas - fechaCalendario", new Date($scope.fechaCalendario));

            if(correteo!=null && new Date(correteo).getMonth() == new Date($scope.fechaCalendario).getMonth()){
                if(!campSiguienteAdicionada){
                    $scope.misCampanas.push({numero: $scope.corregirNumeroCampana($scope.campana+1), color: $scope.estiloCampana($scope.campana+1)});
                }
                $scope.misCampanas.push({numero: $scope.corregirNumeroCampana($scope.campana+2), color: $scope.estiloCampana($scope.campana+2)});
            }
        }

        console.log($scope.misCampanas);
    }

    $scope.fechaCorreteoCampanaActual = function(){

        var correteo = '';

        //Campana actual
        if($scope.fechas) {
            for (i = 0; i < $scope.fechas.length; i++) {
                if ($scope.fechas[i].actividad.toLowerCase() == "fecha correteo") {
                    correteo = $scope.fechas[i].fecha;
                }
            }
        }

        if(correteo){
            return new Date(correteo).getFullYear();
        }else{
            $scope.fechaCalendario.getFullYear();
        }
    }

    $scope.fechaCampanaAnterior = function(){

        var correteo = '';

        //Campana actual
        if($scope.fechas) {
            for (i = 0; i < $scope.fechas.length; i++) {
                if ($scope.fechas[i].actividad.toLowerCase() == "fecha correteo") {
                    correteo = $scope.fechas[i].fecha;
                }
            }
        }

        if(correteo){

            fecha = new Date(correteo);
            fecha.setDate(fecha - 21);

            return fecha.getFullYear();
        }else{
            $scope.fechaCalendario.getFullYear();
        }
    }


    $scope.semanasCalendario = function(){

        console.log("campaña activa: " + $scope.campana);

        //Obtener los recordatorios de la siguiente campana
        var anoSiguiente = $scope.fechaCalendario.getFullYear();
        var campanaSiguiente;
        if($scope.campana == $rootScope.numeroCampanasAno){
            campanaSiguiente = 1;            
            anoSiguiente = anoSiguiente + 1;
        }else{

            anoSiguiente = $scope.fechaCorreteoCampanaActual();
            campanaSiguiente = $scope.campana + 1;
        }
        Campana.getRecordatorios(anoSiguiente, campanaSiguiente, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasSiguienteCampana = data.listaRecordatorios;
                console.log("informacionFechas - datos enviados", anoSiguiente, campanaSiguiente)
                console.log("informacionFechas - fechasSiguienteCampana", data.listaRecordatorios)
                $scope.actualizarCampanasMes();
            }else{

            }
        });

        var anoAnterior = $scope.fechaCalendario.getFullYear();
        console.log("informacionFechas - anoAnterior1", anoAnterior);
        var campanaAnterior;
        console.log("informacionFechas - campana", $scope.campana);
        if($scope.campana == 1){
            campanaAnterior = $rootScope.numeroCampanasAno;
            console.log("informacionFechas - getMonth", new Date().getMonth());
            if(new Date().getMonth() == 0){

                anoAnterior = anoAnterior - 1;
                console.log("informacionFechas - anoAnterior2", anoAnterior);
            }
        }else{

            //anoAnterior = $scope.fechaCampanaAnterior();
            campanaAnterior = $scope.campana - 1;
        }
        //Obtener los recordatorios de la campana anterior
        Campana.getRecordatorios(anoAnterior, campanaAnterior, $rootScope.zona, function (success, data){
            if(success){
                $scope.fechasCampanaAnterior = data.listaRecordatorios;
                console.log("informacionFechas - datos enviados", anoAnterior, campanaAnterior)
                console.log("informacionFechas - fechasCampanaAnterior", data.listaRecordatorios)
                $scope.actualizarCampanasMes();
            }else{

            }
        });

        var fechaActual = $scope.fechaCalendario;

        var dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
            $scope.padStr(1 + fechaActual.getMonth()) + "-" + "02";

        if(new Date(dateStr).getDate() == 2) {
            dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
                $scope.padStr(1 + fechaActual.getMonth()) + "-" + "01";
        }

        var primerDiaMes = new Date(dateStr).getDay();
        console.log("primer dia mes: " + primerDiaMes);
        var inicioMes = new Date(dateStr);

        //Objeto con todas las semanas
        var semanas = new Array();

        var finMes = false;
        var diaMes = 0;
        var indiceDias = 0;
        var mesActual = fechaActual.getMonth();
        var reiniciarDia = true;

        while(!finMes){

            //Objeto con cada semana
            var semana = new Array();
            //Si no hay registros entonces adicionar a la primera semana los registros necesarios del mes anterior

            if(semanas.length == 0){
                for(j=primerDiaMes; j>0; j--){
                    var fechaAnterior = new Date(dateStr);
                    fechaAnterior.setDate(-j+1);
                    semana.push({ "dia": fechaAnterior.getDate(),
                                 "fechaCompleta":  $scope.padStr(fechaAnterior.getFullYear()) + "-" +
                                 $scope.padStr(1 + fechaAnterior.getMonth()) + "-" +
                                 $scope.padStr(fechaAnterior.getDate())
                                });
                }
                for(i=0; i<7-primerDiaMes; i++){

                    var nuevaFecha = new Date();
                    nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                    if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                        diaMes = 0;
                        reiniciarDia = false;
                    }
                    semana.push({ "dia": diaMes + 1,
                                 "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                 $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                 $scope.padStr(nuevaFecha.getDate())
                                });
                    indiceDias++;
                    diaMes++;
                }
            }else{
                for(i=0; i<7; i++){

                    var nuevaFecha = new Date();
                    nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                    if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                        diaMes = 0;
                        finMes = true;
                        reiniciarDia = false;
                    }
                    semana.push({ "dia": diaMes + 1,
                                 "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                 $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                 $scope.padStr(nuevaFecha.getDate())
                                });
                    indiceDias++;
                    diaMes++;
                }
            }

            //al terminar la semana verificar nuevamente si el inicio de la semana entrante no corresponde a
            //otro mes
            var nuevaFecha = new Date();
            nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

            if(nuevaFecha.getMonth() != mesActual){
                finMes = true;
            }

            semanas.push(semana);
        }

        console.log("Semanas:" + semanas.length);
        console.log(semanas);
        $scope.semanas = semanas;
    }

    $scope.mostrarConectorActividad=function(actividad){

        if(actividad == "TOMA DE PEDIDO"){
            return false;
        }
    }*/

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