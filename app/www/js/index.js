angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', function($scope, $http, $ionicPopup) {

  $scope.user = {};
  $scope.waitingResponse = false;

  $scope.gustos = [
    { text: "Aire libre", value: "airelibre" },
    { text: "Espacio cerrado", value: "cerrado" },
    { text: "Mix entre ambos", value: "mix" }];

  $scope.intereses = [
    { text: "Comer", value: 'false', tranquilidad: 1 },
    { text: "Tomar alcohol", value: 'false', tranquilidad: 8 },
    { text: "Escuchar música", value: 'false', tranquilidad: 5},
    { text: "Bailar", value: 'false', tranquilidad: 9 },
    { text: "Pasear", value: 'false', tranquilidad: 2 }
  ];

  $scope.user.intereses = angular.copy($scope.intereses);

  $scope.sexualidades = [
    { text: "Heterosexual", value: "hetero" },
    { text: "Homosexual", value: "homo" }
  ];

  $scope.comida = [
    { text: "Celíaca", value: "celiaco" },
    { text: "Vegetariana", value: "vegetariano" },
    { text: "Minutas", value: "minutas" },
    { text: "Al plato", value: "plato" },
  ];

  $scope.generosMusicales = [
    { text: "Electrónica", value: "electro" },
    { text: "Cumbia", value: "cumbia" },
    { text: "Rock", value: "rock" },
    { text: "Pop", value: "pop" }
  ];

  // An alert dialog
   $scope.showRecommendation = function() {
    $scope.waitingResponse = true;

    

 //   $http.post('https://sysianode.herokuapp.com/fuzzy', { user: $scope.user }).then(function(message){
    $http.post('http://localhost:3001/fuzzy', { user: $scope.user }).then(function(message){
      var preMessage = message.data == 'Quedate en tu casa' ? '' : 'Deberías ir a ';
      var alertPopup = $ionicPopup.alert({
       title: 'Nuestra recomendación',
       template: preMessage + JSON.stringify(message.data) + '!'
     });
      
      $scope.waitingResponse = false;

      alertPopup.then(function() {
        $scope.user = {};
        $scope.user.intereses = angular.copy($scope.intereses);
     });
    })
   };

  
});