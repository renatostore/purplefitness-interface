(function(){
    "use strict";

    angular.module('items',[
        'ngAnimate', 'toastr'
    ])

    .factory('Item', function($http) {
        return {
            getAll:function() {
                return $http.get('https://177.220.84.127:8443/purplefitness/rest/product/search');
                
            },
            add:function(item) {
                return $http.post('https://177.220.84.127:8443/purplefitness/rest/product/add', {
                        name:item.name,
                        unity:item.unity,
                        price:item.price,
                        identifier:Date.now()
                });
            },
            update:function(item) {
                return $http.post('https://177.220.84.127:8443/purplefitness/rest/product/update', {
                        name:item.name,
                        unity:item.unity,
                        price:item.price,
                        identifier:item.identifier
                });
            },
            remove:function(item) {
                return $http.post('https://177.220.84.127:8443/purplefitness/rest/product/remove', {
                        name:item.name,
                        unity:item.unity,
                        price:item.price,
                        identifier:item.identifier
                });
            }
        };
    })

    .controller('MainController',function($scope, Item, toastr){ 
        //$scope.categories = ['Vestido','Camisa','Camiseta','Saia'];
        Item.getAll().then(function(response) {
            $scope.items = response.data;
            console.log($scope.items);
        }, function(response) {
            console.log(response);
        });
        $scope.currentCategory = '';    
        $scope.currentPesquisa = '';
        $scope.setCurrentCategory = function(category){ 
            if (category==null)
                 $scope.currentCategory = '';          
            else
                $scope.currentCategory = category;          
        }
        $scope.setCurrentPesquisa = function(pesquisa){ 
            $scope.currentPesquisa = pesquisa;          
        }
        $scope.showWindow = function(item){ 
            $scope.itemForm.$setPristine(); 
            $scope.itemForm.$setUntouched();
            // {category:$scope.currentCategory,'':''} ||
            item = item || {nome:$scope.currentPesquisa,'':''}; 
            $scope.item = item;         
            $('#itemModal').modal('show');  
        }
        $scope.save = function(item){
            if($scope.itemForm.$valid){   
                if(!item.identifier){                          
                    Item.add(item).then(function(response) {
                        item.identifier = response.data.identifier;
                        $scope.items.push(item);
                        toastr.success('Item criado com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                } else {
                    Item.update(item).then(function() {
                        $scope.items.push(item);
                        toastr.success('Item salvo com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                }
                $('#itemModal').modal('hide');         
            } else {
                // Erro
            }
        }
        $scope.remove = function(item, index){
            Item.remove(item).then(function() {
                $scope.items.splice(index,1);
                $scope.items.push();
                toastr.success('Item excluido com sucesso', 'Sucesso');
            },function() {
                toastr.error('Erro ao excluir o item', 'Erro');
            });
        }
    });
})();