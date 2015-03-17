var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
  $scope.formData = {};
  $scope.questionData = {};

  // $http.get('/api/todos')
  //   .success(function(data) {
  //     $scope.formData.level = 1;
  //     console.log(data);
  //   })
  //   .error(function(error){
  //     console.log('Error :: ' + error)
  //   });
  //
  $http.get('/api/questions')
    .success(function(data) {
      $scope.question = data;
      $scope.formData.level = data.level;
      console.log(data);
    })
    .error(function(error){
      console.log('Error :: ' + error)
    });

  $scope.checkAnswer = function() {
    $scope.answer = "";
    $http.post('/api/check_answer/', $scope.formData)
      .success(function(data) {
        if(data.result == "true"){
          $scope.formData = {};
          $scope.formData.level = data.next_question.level;
          $scope.question = data.next_question;
          console.log(data);
        }
        else
          $scope.answer = data.result;
      })
      .error(function(error){
        console.log('Error :: ' + error)
      });
  };

  $scope.createQuestion = function() {
    $scope.created_or_not = ""
    $http.post('/api/store_question', $scope.questionData)
      .success(function(data){
        $scope.questionData = {};
        $scope.created_or_not = data.result;
        console.log(data);
      })
      .error(function(error){
        console("Error ::" + error);
      });
  };

  $scope.showAlert = function() {
    if($scope.show == true){
      $scope.show = false;
    }
    else{
      $scope.show = true;
    }
  };

}
