(function(){
    "use strict";

    angular.module('estoques',[
        'ngAnimate', 'toastr'
    ])

    .factory('Estoque', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/stockproduct/search');
                
            },
            add:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/stockproduct/add', {
                        title:item.title,
                        identifier:Date.now()
                });
            },
            update:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/stockproduct/update', {
                        title:item.title,
                        identifier:item.identifier
                });
            },
            remove:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/stockproduct/remove', {
                        title:item.title,
                        identifier:item.identifier
                });
            }
        };
    })

    .factory('Estoque_ES', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/stockitem/search');
                
            },
            add:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/stockitem/add', {
                        identifierStock:item.identifierStock,
                        identifierProduct:item.identifierProduct,
                        quantity:item.quantity,
                        identifier:Date.now()
                });
            },
            remove:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/stockitem/remove', {
                        identifierStock:item.identifierStock,
                        identifierProduct:item.identifierProduct,
                        quantity:item.quantity,
                        identifier:item.identifier
                });
            }
        };
    })

    .factory('Item', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/product/search');
                
            }
        };
    })


	.controller('estoquesController',function($scope, Estoque, Estoque_ES, toastr, Item){ 
		Estoque.getAll().then(function(response) {
            $scope.estoques = response.data;
            console.log($scope.estoques);
        }, function(response) {
            console.log(response);
        });
        Estoque_ES.getAll().then(function(response) {
            $scope.estoques_es = response.data;
            console.log('esse', $scope.estoques_es);
        }, function(response) {
            console.log(response);
        });
         Item.getAll().then(function(response) {
            $scope.items = response.data;
            console.log($scope.items);
        }, function(response) {
            console.log(response);
        });
        $scope.currentPesquisa = '';
        $scope.tela_estoque = true;
        $scope.tela_entrada_saida = false;
        $scope.gerenciar_estoque = function(tipo_estoque, identificador){ 
            $scope.tela_estoque = false;
            $scope.tela_entrada_saida = true;
            $scope.currentEstoque = tipo_estoque; 
            $scope.currentEstoqueIdentifier = identificador;
            for(var i=0; i < $scope.estoques_es.length; i++) {
                if($scope.estoques_es[i].identifierStock === $scope.currentEstoqueIdentifier) {
                    $scope.estoques_es[i].show = true;
                }
            }
        }
        $scope.voltar_estoque = function(){ 
            $scope.tela_estoque = true;
            $scope.tela_entrada_saida = false;
            $scope.currentEstoque = '';          
        }        
        $scope.setCurrentPesquisa = function(pesquisa){ 
            $scope.currentPesquisa = pesquisa;          
        }
        $scope.showWindow = function(estoque){ 
            $scope.estoqueForm.$setPristine(); 
            $scope.estoqueForm.$setUntouched();
            estoque = estoque || {title:$scope.currentPesquisa,'':''}; 
            $scope.estoque = estoque;         
            $('#estoqueModal').modal('show');  
        }
        $scope.showWindowES = function(estoque_es){ 
            //verifica se o estoque_es (obj) está vazio..., se estiver é porque vem do nova entrada           
           if (estoque_es==null){
               $scope.nova_entrada=true;
            } else {
                $scope.nova_entrada=false;
            }
            $scope.estoqueESForm.$setPristine(); 
            $scope.estoqueESForm.$setUntouched();
            estoque_es = estoque_es || {nome:$scope.currentPesquisa,'':''}; 
            $scope.estoque_es = estoque_es;         
            $('#estoqueESModal').modal('show');  
        }

        $scope.save = function(estoque){
            if($scope.estoqueForm.$valid){
                if(!estoque.identifier){
                    Estoque.add(estoque).then(function(response) {
                        estoque.identifier = response.data.identifier;
                        $scope.estoques.push(estoque);
                        toastr.success('Estoque criado com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                } else {
                    Estoque.update(estoque).then(function() {
                        $scope.estoques.push(estoque);
                        toastr.success('Estoque salvo com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                }
                $('#estoqueModal').modal('hide');         
            } else {
                // Erro
            }
        }
        $scope.remove = function(estoque, index){
            Estoque.remove(estoque).then(function() {
                toastr.error('Erro ao excluir o estoque', 'Erro');
            },function() {
                $scope.estoques.splice(index,1);
                toastr.success('Estoque excluido com sucesso', 'Sucesso');
                $scope.estoques.push();
            });
        }

        $scope.estoques_es = [];
        $scope.atualiza_entrada = function(estoque_es){
            if($scope.estoqueESForm.$valid){
                if(!estoque_es.identifier)
                    estoque_es.identifier = Date.now(); //não sei se dará certo!
                    $scope.estoque_es.identifierStock=$scope.currentEstoqueIdentifier;
                    
                Estoque_ES.add(estoque_es).then(function(response) {
                    estoque_es.identifier = response.data.identifier;
                    estoque_es.show = true;
                    estoque_es.nameProduct = response.data.productName;
                    $scope.estoques_es.push(estoque_es);
                    toastr.success('Item adicionado com sucesso', 'Sucesso');
                },function() {
                        toastr.error('Erro ao adicionar item', 'Erro');
                    });
                $('#estoqueESModal').modal('hide');         
            } else {
                // Erro
            }
        }
         $scope.atualiza_saida = function(estoque_es){
            if($scope.estoqueESForm.$valid){
                Estoque_ES.remove(estoque_es).then(function(response) {
                    $scope.estoques_es.push(estoque_es);
                    toastr.success('Item removido com sucesso', 'Sucesso');
                },function() {
                        toastr.error('Erro ao remover item', 'Erro');

                    });
                $('#estoqueESModal').modal('hide');         
            } else {
                // Erro
            }
        }

    });
})();

