(function(){
    "use strict";

    angular.module('vamosnessa',[
        'ngAnimate', 'toastr', "angucomplete-alt"
    ])

    .factory('Cliente', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/customer/search');   
            }
        };
    })

    .factory('Consignacao', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/consignment/search');
                
            },
            add:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/consignment/add', {
                        name:item.name,
                        initialDate:item.initialDate,
                        finalDate:item.finalDate,
                        consignmentItems:item.consignmentItems,
                        identifier:Date.now()
                });
            },
            update:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/consignment/update', {
                        name:item.name,
                        initialDate:item.initialDate,
                        finalDate:item.finalDate,
                        consignmentItems:item.consignmentItems,
                        identifier:item.identifier
                });
            },
            baixa:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/consignment/remove', {
                        name:item.name,
                        initialDate:item.initialDate,
                        finalDate:item.finalDate,
                        consignmentItems:item.consignmentItems,
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


	.controller('consignacaoController',function($scope, Consignacao, Cliente, Item, toastr){ 
        //consignação
        /*Consignacao.getAll().then(function(response) {
            $scope.consignacoes = response.data;
            console.log($scope.consignacoes);
        }, function(response) {
            console.log(response);
        });*/
        $scope.consignacoes = [ 
             {identifier:1,name:'Maria Hosé',finalDate:'14/04/2016'},
             {identifier:2,name:'Alejandra Gutierrez',finalDate:'15/04/2016'},
             {identifier:3,name:'Casemiro Brandão',finalDate:'20/05/2016'},
             {identifier:4,name:'Nicholas Bauza',finalDate:'16/05/2016'},
             {identifier:5,name:'Antonio Zago',finalDate:'30/05/2016'}
         ];

        $scope.estoques = [ 
             {identifier:1,titulo:'varejo'},
             {identifier:1,titulo:'atacado'},
         ];

        //Clientes
        /*Cliente.getAll().then(function(response) {
            $scope.clientes = response.data;
            console.log($scope.clientes);
        }, function(response) {
            console.log(response);
        });*/
         $scope.clientes = [ 
             {identifier:1,name:'José', documento: '000.000.000-00'},
             {identifier:2,name:'Raimundo', documento: '000.000.000-00'},
             {identifier:3,name:'Oliveira', documento: '000.000.000-00'},
             {identifier:4,name:'Maldonato', documento: '000.000.000-00'},
             {identifier:5,name:'Rosario', documento: '000.000.000-00'}
         ];

         $scope.items = [ 
             {identifier:1,name:'Camiseta Florida', price:'50'},
             {identifier:1,name:'Calça Jeans', price:'30'},
         ];
        //Itens
        // Item.getAll().then(function(response) {
        //     $scope.items = response.data;
        // }, function(response) {
        // });

        var filtroForm = function (str, arr, field) {
            var matches = [];

            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i][field].toLowerCase().indexOf(str.toLowerCase()) != -1) {
                      matches[matches.length] = arr[i];
                }
            }
            return matches;
        }

        $scope.filtroClientesForm = function (str) {
            return filtroForm(str, $scope.clientes, 'name');
        }

        $scope.filtroEstoquesForm = function (str) {
            return filtroForm(str, $scope.estoques, 'titulo');
        }

        $scope.filtroItensForm = function (str) {
            return filtroForm(str, $scope.items, 'name');
        }

        $scope.itensConsignados = [];
        $scope.valor_total = 0;
        $scope.addItem = function () {
            $scope.itensConsignados.push({
                item: $scope.itemSelecionado,
                quantidade: $scope.consignacao.quantidadeItem
            });
            console.log($scope.itemSelecionado.description.price);
            $scope.valor_total += ($scope.itemSelecionado.description.price* $scope.consignacao.quantidadeItem);
            $scope.itemSelecionado.description.title = '';
            $scope.consignacao.quantidadeItem='';

        }

        $scope.dar_baixa=false;
        $scope.showWindow = function(consignacao, form_baixa){ 
            $scope.consignacaoForm.$setPristine(); 
            $scope.consignacaoForm.$setUntouched();
            $scope.consignacao = consignacao;         
            //só para mudar o estilo do modal, de atualizar a inserir, para dar baixa
            if (form_baixa==1)
                $scope.dar_baixa=true;
            else
                $scope.dar_baixa=false;
            $('#consignacaoModal').modal('show');  
        }

        $scope.save = function(consignacao){
            if($scope.consignacaoForm.$valid){
                if(!consignacao.identifier){
                    Consignacao.add(consignacao).then(function(response) {
                        consignacao.identifier = response.data.identifier;
                        $scope.consignacoes.push(consignacao);
                        toastr.success('Consignação criada com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estão com erros', 'Erro');
                    });
                } else {
                    Consignacao.update(consignacao).then(function() {
                        $scope.consignacoes.push(consignacao);
                        toastr.success('Consignação salva com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estão com erros', 'Erro');
                    });
                }
                $('#estoqueModal').modal('hide');         
            } else {
                // Erro
            }
        }

        $scope.baixa = function(consignacao){
            Consignacao.update(consignacao).then(function() {
               toastr.success('Baixa efetuada com sucesso', 'Sucesso');
            },function() {
                toastr.error('Baixa está com erro', 'Erro');
            });
        }
    });
})();

