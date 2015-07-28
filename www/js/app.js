angular.module('novaventa', ['ionic', 'novaventa.controllers', 'novaventa.services'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, Campana) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    $rootScope.mostrarAyuda = function(titulo, mensaje) {
	   var alertPopup = $ionicPopup.alert({
		 title: "",
		 template: mensaje
	   });
	 };
	 
	 $rootScope.esAntesMedioDia = function(){
        return new Date().getHours() < 12;
     }
        
     $rootScope.hoyEsCorreteo = function(){
        return Campana.hoyEsCorreteo();
     }
        
     $rootScope.hoyEsEncuentro = function(){
        return Campana.hoyEsEncuentro();
     }

  });
})
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.navBar.alignTitle("left");
        $ionicConfigProvider.views.transition("none");
        $ionicConfigProvider.tabs.position('bottom'); //other values: top

    }])

    .config(function($stateProvider, $urlRouterProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/app.html"
            })

            .state('app.inicializacion', {
                url: "/inicializacion",
                views: {
                    'app-view': {
                        templateUrl: "templates/inicializacion.html",
                        controller: 'InicializacionCtrl'
                    }
                }
            })
            
            .state('app.bienvenida', {
                url: "/bienvenida",
                views: {
                    'app-view': {
                        templateUrl: "templates/bienvenida.html",
                        controller: 'BienvenidaCtrl'
                    }
                }
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'app-view': {
                        templateUrl: "templates/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })
            
            .state('app.clave', {
                url: "/clave",
                views: {
                    'app-view': {
                        templateUrl: "templates/clave.html",
                        controller: 'ClaveCtrl'
                    }
                }
            })

            .state('app.clave-nueva-clave-1', {
                url: "/clave-nueva-clave-1",
                views: {
                    'app-view': {
                        templateUrl: "templates/clave-nueva-clave-1.html",
                        controller: 'ClaveNuevaClave1Ctrl'
                    }
                }
            })

            .state('app.clave-nueva-clave-2', {
                url: "/clave-nueva-clave-2",
                views: {
                    'app-view': {
                        templateUrl: "templates/clave-nueva-clave-2.html",
                        controller: 'ClaveNuevaClave2Ctrl'
                    }
                }
            })

            .state('app.clave-pregunta-1', {
                url: "/clave-pregunta-1",
                views: {
                    'app-view': {
                        templateUrl: "templates/clave-pregunta-1.html",
                        controller: 'ClavePregunta1Ctrl'
                    }
                }
            })

            .state('app.clave-pregunta-2', {
                url: "/clave-pregunta-2",
                views: {
                    'app-view': {
                        templateUrl: "templates/clave-pregunta-2.html",
                        controller: 'ClavePregunta2Ctrl'
                    }
                }
            })

            .state('app.terminos-condiciones', {
                url: "/terminos-condiciones",
                views: {
                    'app-view': {
                        templateUrl: "templates/terminos-condiciones.html",
                        controller: 'TerminosCondicionesCtrl'
                    }
                }
            })

            .state('app.cambio-clave-actual', {
                url: "/cambio-clave-actual",
                views: {
                    'app-view': {
                        templateUrl: "templates/cambio-clave-actual.html",
                        controller: 'CambioClaveActualCtrl'
                    }
                }
            })

            .state('app.cambio-clave-nueva', {
                url: "/cambio-clave-nueva",
                views: {
                    'app-view': {
                        templateUrl: "templates/cambio-clave-nueva.html",
                        controller: 'CambioClaveNuevaCtrl'
                    }
                }
            })

            .state('app.menu', {
                url: "/menu",
                abstract: true,
                views: {
                    'app-view': {
                        templateUrl: "templates/menu.html",
                        controller: 'AppCtrl'
                    }
                }
            })

            .state('app.menu.tabs', {
                url: "/tabs",
                abstract: true,
                views: {
                    'menu-content': {
                        templateUrl: "templates/tabs.html",
                        controller: 'TabsCtrl'
                    }
                }
            })

            .state('app.menu.tabs.home', {
                url: "/home",
                views: {
                    'home-content': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.fechas', {
                url: "/fechas",
                views: {
                    'informacion-fechas-content': {
                        templateUrl: "templates/informacionfechas.html",
                        controller: 'InformacionFechasCtrl'
                    }
                }
            })            

            .state('app.menu.tabs.mipedido', {
                url: "/mipedido",
                views: {
                    'pedido-content': {
                        templateUrl: "templates/mipedido.html",
                        controller: 'MiPedidoCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mipedido-trazabilidad', {
                url: "/mipedido-trazabilidad",
                views: {
                    'pedido-content': {
                        templateUrl: "templates/mipedido-trazabilidad.html",
                        controller: 'MiPedidoTrazabilidadCtrl'
                    }
                }
            })

            .state('app.menu.tabs.mipedido-trazabilidad-anterior', {
                url: "/mipedido-trazabilidad-anterior",
                views: {
                    'pedido-content': {
                        templateUrl: "templates/mipedido-trazabilidad-anterior.html",
                        controller: 'MiPedidoTrazabilidadAnteriorCtrl'
                    }
                }
            })

            .state('app.menu.tabs.mispuntos', {
                url: "/mispuntos",
                abstract: true,
                views: {
                    'puntos-content': {
                        templateUrl: "templates/tabsmispuntos.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mispuntos.puntos', {
                url: "/puntos",
                views: {
                    'mis-puntos-puntos-content': {
                        templateUrl: "templates/mispuntos.html",
                        controller: 'MisPuntosCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mispuntos.mispremiosredimidos', {
                url: "/mispremiosredimidos",
                views: {
                    'mis-puntos-puntos-content': {
                        templateUrl: "templates/mispremiosredimidos.html",
                        controller: 'MisPuntosCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mispuntos.premiosredimir', {
                url: "/premiosredimir",
                views: {
                    'mis-puntos-premios-content': {
                        templateUrl: "templates/mispuntospremiosredimir.html"
                    }
                }
            })

            .state('app.menu.tabs.mispuntos.catalogopremios', {
                url: "/catalogopremios",
                views: {
                    'club-catalogopremios-content': {
                        templateUrl: "templates/catalogopremios.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mas', {
                url: "/mas",
                views: {
                    'mas-content': {
                        templateUrl: "templates/mas.html"
                    }
                }
            })

            .state('app.menu.tabs.puntospago', {
                url: "/puntospago",
                abstract: true,
                views: {
                    'puntospago-content': {
                        templateUrl: "templates/tabspuntosdepago.html",
                        controller: 'PuntosPagoCtrl'
                    }
                }
            })

            .state('app.menu.tabs.puntospago.puntospagolistado', {
                url: "/puntospagolistado",
                views: {
                    'puntospago-listado-content': {
                        templateUrl: "templates/puntosdepago.html",
                        controller: 'PuntosPagoCtrl'
                    }
                }
            })

            .state('app.menu.tabs.puntospago.puntospagomapa', {
                url: "/puntospagomapa",
                views: {
                    'puntospago-mapa-content': {
                        templateUrl: "templates/puntosdepagomapa.html",
                        controller: 'PuntosPagoMapaCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mas.contacto', {
                url: "/contacto",
                views: {
                    'mas-interna-content': {
                        templateUrl: "templates/contacto.html",
                        controller: 'ContactoCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mas.club', {
                url: "/club",
                abstract: true,
                views: {
                    'mas-interna-content': {
                        templateUrl: "templates/tabsclub.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mas.club.piedrapreciosa', {
                url: "/piedrapreciosa",
                views: {
                    'club-piedrapreciosa-content': {
                        templateUrl: "templates/piedrapreciosa.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mas.club.proyeccion', {
                url: "/proyeccion",
                views: {
                    'club-proyeccion-content': {
                        templateUrl: "templates/proyeccion.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mas.informacion', {
                url: "/informacion",
                abstract: true,
                views: {
                    'mas-interna-content': {
                        templateUrl: "templates/tabsinformacion.html"
                    }
                }
            })

            .state('app.menu.tabs.mas.agotados', {
                url: "/agotados",
                abstract: true,
                views: {
                    'mas-interna-content': {
                        templateUrl: "templates/tabsinformacion-agotados.html"
                    }
                }
            })

            .state('app.menu.tabs.mas.agotados.actual', {
                url: "/actual",
                views: {
                    'informacion-agotados-actual': {
                        templateUrl: "templates/informacionagotados.html",
                        controller: "AgotadosCampanaCtrl"
                    }
                }
            })

            .state('app.menu.tabs.mas.agotados.siguiente', {
                url: "/siguiente",
                views: {
                    'informacion-agotados-siguiente': {
                        templateUrl: "templates/informacionagotados.html",
                        controller: "AgotadosCampanaSiguienteCtrl"
                    }
                }
            })
            
            .state('app.menu.tabs.mas.minegocio', {
                url: "/minegocio",
                views: {
                    'mas-interna-content': {
                        templateUrl: "templates/minegocio.html",
                        controller: 'MiNegocioCtrl'
                    }
                }
            })
            
            .state('app.menu.tabs.mas.informacion.notificaciones', {
                url: "/notificaciones",
                views: {
                    'informacion-notificaciones-content': {
                        templateUrl: "templates/informacionnotificaciones.html"
                    }
                }
            })
            
            .state('app.menu.tabs.mas.informacion.noticias', {
                url: "/noticias",
                views: {
                    'informacion-noticias-content': {
                        templateUrl: "templates/informacionnoticias.html"
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/inicializacion');
    });

angular.module('novaventa.controllers');