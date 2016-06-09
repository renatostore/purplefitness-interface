(function(){
    "use strict";

    angular.module('materiasPrimas',[
        'ngAnimate', 'toastr'
    ])

    .factory('MateriaPrima', function($http) {
        return {
            getAll:function() {
                return $http.get('https://177.220.84.212:8443/purplefitness/rest/rawmaterial/search');    
            },
            add:function(item) {
                return $http.post('https://177.220.84.212:8443/purplefitness/rest/rawmaterial/add', {
                        name:item.name,
                        description:item.description,
                        unity:item.unity,
                        identifier:Date.now()
                });
            },
            update:function(item) {
                return $http.post('https://177.220.84.212:8443/purplefitness/rest/rawmaterial/update', {
                        name:item.name,
                        description:item.description,
                        unity:item.unity,
                        identifier:item.identifier
                });
            },
            remove:function(item) {
                return $http.post('https://177.220.84.212:8443/purplefitness/rest/rawmaterial/remove', {
                        name:item.name,
                        description:item.description,
                        unity:item.unity,
                        identifier:item.identifier
                });
            }
        };
    })


    .controller('MateriaPrimaController',function($scope, MateriaPrima, toastr){ 
        MateriaPrima.getAll().then(function(response) {
            $scope.materiasPrimas = response.data;
            console.log($scope.materiasPrimas);
        }, function(response) {  
             console.log($scope.materiasPrimas);          
        });      
        $scope.currentPesquisa = '';
        $scope.setCurrentPesquisa = function(pesquisa){ 
            $scope.currentPesquisa = pesquisa;          
        }
        $scope.showWindow = function(materiaPrima){ 
            $scope.materiaPrimaForm.$setPristine(); 
            $scope.materiaPrimaForm.$setUntouched();
            materiaPrima = materiaPrima || {name:$scope.currentPesquisa,'':''}; 
            $scope.materiaPrima = materiaPrima;         
            $('#materiaPrimaModal').modal('show');  
        }
        
        $scope.save = function(materiaPrima){
            if($scope.materiaPrimaForm.$valid){   
                if(!materiaPrima.identifier){          
                    MateriaPrima.add(materiaPrima).then(function(response) {
                        materiaPrima.identifier = response.data.identifier;
                        $scope.materiasPrimas.push(materiaPrima);
                        toastr.success('Cliente criado com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                } else {
                    //update
                    MateriaPrima.update(materiaPrima).then(function() {
                        $scope.materiasPrimas.push(materiaPrima);
                        toastr.success('Cliente salvo com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                }
                $('#materiaPrimaModal').modal('hide');         
            } else {
                // Erro
            }
        }
        $scope.remove = function(materiaPrima, index){
            MateriaPrima.remove(materiaPrima).then(function() {
                $scope.materiasPrimas.splice(index,1);
                $scope.materiaPrima.push();
                toastr.success('Cliente excluido com sucesso', 'Sucesso');
            },function() {
                toastr.error('Erro ao excluir o cliente', 'Erro');
            });
        }
    });
})();

