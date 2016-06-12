(function(){
    "use strict";

    angular.module('consig',[
        'ngAnimate', 'toastr', 'datetime'
    ])

    .factory('Cliente', function($http) {
        return {
            getAll:function() {
                return $http.get('https://177.220.85.239:8443/purplefitness/rest/customer/search');   
            }
        };
    })

    .factory('Estoque', function($http) {
        return {
            getAll:function() {
                return $http.get('https://177.220.85.239:8443/purplefitness/rest/stockproduct/search');
            }
        };
    })

    .factory('Consignacao', function($http) {
        return {
            getAll:function() {
                return $http.get('https://177.220.85.239:8443/purplefitness/rest/consignment/search');
                
            },
            add:function(item) {
                delete item.quantidadeItem;
                item.initialDate = new Date();
                item.identifier = Date.now();
                item.finalized = false;
                item.finalizing = false;
                item.name = '' + Date.now();
                return $http.post('https://177.220.85.239:8443/purplefitness/rest/consignment/add', item);
            },
            update:function(item) {
                delete item.quantidadeItem;
                return $http.post('https://177.220.85.239:8443/purplefitness/rest/consignment/update', item);
            },
            baixa:function(item) {
                return $http.post('https://177.220.85.239:8443/purplefitness/rest/consignment/remove', {
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
                return $http.get('https://177.220.85.239:8443/purplefitness/rest/stockitem/search');
                
            }
        };
    })


	.controller('consignacaoController',function($scope, Consignacao, Cliente, Estoque, Item, toastr){ 
        //consignação
        Consignacao.getAll().then(function(response) {
            $scope.consignacoes = response.data;
            console.log($scope.consignacoes);
        }, function(response) {
            console.log(response);
        });


        /*$scope.consignacoes = [ 
             {identifier:1,identifierCustomer:'1',nameCustomer:'Maria Hosé',finalDate:'14/04/2016',finalizing:'1', finalized:'0', stockItemConsignmentsTO:[{identifier:'1', identifierStock:'1', identifierProduct:'1',nameProduct:'Nome', nameStock:'varejo', quantity:'10', price:'15'}]},
             {identifier:2,identifierCustomer:'2',nameCustomer:'Alejandra Gutierrez',finalDate:'15/04/2016',finalizing:'1', finalized:'0', stockItemConsignmentsTO:[{identifier:'1', identifierStock:'1', identifierProduct:'1',nameProduct:'Nome', nameStock:'atacado', quantity:'10', price:'15'}]},
             {identifier:3,identifierCustomer:'3',nameCustomer:'Casemiro Brandão',finalDate:'20/05/2016',finalizing:'0', finalized:'1', stockItemConsignmentsTO:[{identifier:'1', identifierStock:'1', identifierProduct:'1',nameProduct:'Nome', nameStock:'varejo', quantity:'10', price:'15'}]},
             {identifier:4,identifierCustomer:'4',nameCustomer:'Nicholas Bauza',finalDate:'16/05/2016',finalizing:'0', finalized:'1', stockItemConsignmentsTO:[{identifier:'1', identifierStock:'1', identifierProduct:'1',nameProduct:'Nome', nameStock:'atacado', quantity:'10', price:'15'}]},
             {identifier:5,identifierCustomer:'5',nameCustomer:'Antonio Zago',finalDate:'30/05/2016',finalizing:'0', finalized:'0', stockItemConsignmentsTO:[{identifier:'1', identifierStock:'1', identifierProduct:'1',nameProduct:'Nome', nameStock:'varejo', quantity:'10', price:'15'}]}
         ];*/

        // $scope.estoques = [ 
        //      {identifier:1,title:'varejo'},
        //      {identifier:1,title:'atacado'},
        //  ];

        Estoque.getAll().then(function(response) {
            $scope.estoques = response.data;
            console.log($scope.clientes);
        }, function(response) {
            console.log(response);
        });

        //Clientes
        Cliente.getAll().then(function(response) {
            $scope.clientes = response.data;
            console.log($scope.clientes);
        }, function(response) {
            console.log(response);
        });
         /**$scope.clientes = [ 
             {identifier:1,name:'Maria Hosé', documento: '000.000.000-00'},
             {identifier:2,name:'Alejandra Gutierrez', documento: '000.000.000-00'},
             {identifier:3,name:'Casemiro Brandão', documento: '000.000.000-00'},
             {identifier:4,name:'Nicholas Bauza', documento: '000.000.000-00'},
             {identifier:5,name:'Antonio Zago', documento: '000.000.000-00'}
         ];

         $scope.items = [ 
             {identifier:1,name:'Camiseta Florida', price:'50'},
             {identifier:1,name:'Calça Jeans', price:'30'},
         ];*/
        //Itens
        Item.getAll().then(function(response) {
             $scope.items = response.data;
         }, function(response) {
         });

        $scope.itensConsignados = [];
        $scope.valor_total = 0;
        $scope.addItem = function () {
            $scope.consignacao.consignmentItemsTO.push({
                "identifier": Date.now(),
                "productTO":  $scope.itemSelecionado,
                "quantity": $scope.consignacao.quantidadeItem
            });

            $scope.valor_total += ($scope.itemSelecionado.price * $scope.consignacao.quantidadeItem);
            $scope.itemSelecionado = '';
            $scope.consignacao.quantidadeItem = '';

        }

        $scope.getTotalBaixa = function(){
            var total = 0;
            if ($scope.consignacao.stockItemConsignmentsTO){
                for(var i = 0; i < $scope.consignacao.stockItemConsignmentsTO.length; i++){
                    var item = $scope.consignacao.stockItemConsignmentsTO[i];
                    total += (item.price * item.quantity);
                }
            }
            return total;
        }
        $scope.dar_baixa=false;
        $scope.showWindow = function(consignacao, form_baixa){ 
            $scope.consignacaoForm.$setPristine(); 
            $scope.consignacaoForm.$setUntouched();
            $scope.consignacao = consignacao || {};

            if (typeof $scope.consignacao.finalDate !== 'object') {
                $scope.consignacao.finalDate = new Date($scope.consignacao.finalDate);
            }

            if (typeof $scope.consignacao.initialDate !== 'object') {
                $scope.consignacao.initialDate = new Date($scope.consignacao.initialDate);
            }

            $scope.valor_total = 0;

            if ($scope.consignacao.consignmentItemsTO) {
                for (var i = $scope.consignacao.consignmentItemsTO.length - 1; i >= 0; i--) {
                    $scope.valor_total += $scope.consignacao.consignmentItemsTO[i].quantity * $scope.consignacao.consignmentItemsTO[i].productTO.price;
                }
            } else {
                $scope.consignacao.consignmentItemsTO = [];
                $scope.consignacao.finalDate = new Date();
                $scope.consignacao.finalDate.setMonth($scope.consignacao.finalDate.getMonth() + 1);
            }
            
            //só para mudar o estilo do modal, de atualizar a inserir, para dar baixa
            $scope.dar_baixa = form_baixa==1;
            $('#consignacaoModal').modal('show');  
        }

        $scope.save = function(consignacao){
            if($scope.consignacaoForm.$valid){
                if(!consignacao.identifier){
                    Consignacao.add(consignacao).then(function(response) {
                        consignacao.identifier = response.data.identifier;
                        $scope.consignacoes.push(consignacao);
                        toastr.success('Consignação criada com sucesso', 'Sucesso');
                        $('#consignacaoModal').modal('hide');
                    },function() {
                        toastr.error('Alguns campos estão com erros', 'Erro');
                    });
                } else {
                    Consignacao.update(consignacao).then(function() {
                        $scope.consignacoes.push(consignacao);
                        toastr.success('Consignação salva com sucesso', 'Sucesso');
                        $('#consignacaoModal').modal('hide');
                    },function() {
                        toastr.error('Alguns campos estão com erros', 'Erro');
                    });
                }
            } else {
                toastr.error('Alguns campos estão com erros', 'Erro');
            }
        }

        $scope.baixa = function(consignacao){
            console.log(consignacao);
            Consignacao.update(consignacao).then(function() {
               toastr.success('Baixa efetuada com sucesso', 'Sucesso');
            },function() {
                toastr.error('Baixa está com erro', 'Erro');
            });
        }
    });
})();

