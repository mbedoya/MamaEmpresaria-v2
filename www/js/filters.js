angular.module('novaventa.filters', []).filter('pascal', function() {
  return function(input) {
  
    var nombrePascal = input.split(' ');
    for	(index = 0; index < nombrePascal.length; index++) {  
        nombrePascal[index] = nombrePascal[index].substring(0,1).toUpperCase() + nombrePascal[index].substring(1, nombrePascal[index].length).toLowerCase();
    }
            
    return nombrePascal.join(' ');
  };
});