(function() {
	"use strict";

	angular.module('vamosnessa', [ 'ngAnimate', 'toastr', "angucomplete-alt" ])

	.factory('Cliente', function($http) {
		return {
			getAll : function() {
				return $http.get('https://localhost:8443/purplefitness/rest/customer/search');
			}
		};
	})

	.factory('Consignacao', function($http) {
		return {
			clear : function(item) {
				var data = {
					customerTO : item.customerTO,
					stockItemConsignmentsTO : item.stockItemConsignmentsTO,
					finalDate : item.finalDate,
					customerTO : item.customerTO
				};
				
				if (data.customerTO.originalObject)
					data.customerTO = data.customerTO.originalObject;
					
				return data;
			},
			getAll : function() {
				return $http.get('https://localhost:8443/purplefitness/rest/consignment/search');
			},
			add : function(item) {
				var data = this.clear(item);
				data.identifier = Date.now();
				data.name = '';
				data.initialDate = (new Date()).toLocaleDateString();
				return $http.post('https://localhost:8443/purplefitness/rest/consignment/add', data);
			},
			update : function(item) {
				return $http.post('https://localhost:8443/purplefitness/rest/consignment/update', this.clear(item));
			},

			remove : function(item) {
				return $http.post('https://localhost:8443/purplefitness/rest/consignment/remove', this.clear(item));
			},
			baixa : function(item) {
				return $http.post('https://localhost:8443/purplefitness/rest/consignment/remove', this.clear(item));
			}
		};
	})

	.factory('Item', function($http) {
		return {
			getAll : function(estoqueId) {
				var items = $http.get('https://localhost:8443/purplefitness/rest/stockitem/search');
								
				if(estoqueId) {
					for(var i=0; i<items.length; i++) {
						if(items[i].identifierStock != estoqueId) {
						    delete items[i];
						}
					}
				}
				
				return items;
			}
		};
	})

	.factory('Estoque', function($http) {
		return {
			getAll : function() {
				return $http.get('https://localhost:8443/purplefitness/rest/stockproduct/search');

			}
		};

	})

	.controller('consignacaoController', function($scope, Consignacao, Cliente, Item, toastr, Estoque) {
		$scope.getTotal = function(items) {
			if (!items)
				return 0;

			var sum = 0;
			for (var i = 0; i < items.length; i++) {
				sum += items[i].price * items[i].quantity;
			}

			return sum;
		}

		Cliente.getAll().then(function(response) {
			$scope.clientes = response.data;
		});

		Estoque.getAll().then(function(response) {
			$scope.estoques = response.data;
		});

		Item.getAll().then(function(response) {
			$scope.items = response.data;
		});

		Consignacao.getAll().then(function(response) {
			$scope.consignacoes = response.data;
			console.log($scope.consignacoes);
		}, function(response) {
			console.log(response);
		});

		/*
		 $scope.estoques = [ 
		    {identifier:1,title:'varejo'},
    		{identifier:2,title:'atacado'} 
		 ];
		 
		 $scope.items = [ {identifier:1, name:'Camiseta Florida', price:'50'}, {identifier:1,name:'Calça Jeans', price:'30'} ];
          
          $scope.clientes = [ 
            {identifier:1,corporateName:'José', cnpj: '000.000.000-00'}, 
            {identifier:2,corporateName:'Raimundo', cnpj: '000.000.000-00'},
            {identifier:3,corporateName:'Oliveira', cnpj: '000.000.000-00'}, 
            {identifier:4,corporateName:'Maldonato', cnpj: '000.000.000-00'}, 
            {identifier:5,corporateName:'Rosario', cnpj: '000.000.000-00'} 
           ];
		 
		 $scope.consignacoes = [  
           {  
              "name":"ZXCVB",
              "identifier":"ASDF",
              "initialDate":"20/01/2010",
              "finalDate":"01/01/2010",
              "stockItemConsignmentsTO":[  
                 {  
                    "identifier":"QWERT",
                    "identifierStock":"2",
                    "identifierProduct":"QWERT",
                    "nameProduct":"AAA",
                    "price":"12",
                    "quantity":"20"
                 }
              ],
              "customerTO":{  
                 "identifier":"1464721432724",
                 "corporateName":"jose",
                 "cnpj":"123123213",
                 "address":"rua x",
                 "phone":"19111111111",
                 "bairro":"sao joao",
                 "city":"campinas",
                 "uf":"SP",
                 "email":"jose@gmail.com"
              }
           }
        ];
		 */

		var filtroForm = function(str, arr, field) {
			var matches = [];

			for (var i = arr.length - 1; i >= 0; i--) {
				if (arr[i][field].toLowerCase().indexOf(str.toLowerCase()) != -1) {
					matches[matches.length] = arr[i];
				}
			}
			return matches;
		}

		$scope.filtroClientesForm = function(str) {
			return filtroForm(str, $scope.clientes, 'corporateName');
		}

		$scope.filtroEstoquesForm = function(str) {
			return filtroForm(str, $scope.estoques, 'title');
		}

		$scope.filtroItensForm = function(str) {
			return filtroForm(str, $scope.items, 'name');
		}

		$scope.consignacao = {
			consignmentItemsTO : []
		};
		
		$scope.valor_total = 0;
		$scope.addItem = function() {
			if (!$scope.consignacao.stockItemConsignmentsTO) {
				$scope.consignacao.stockItemConsignmentsTO = [];
			}
			
			$scope.consignacao.stockItemConsignmentsTO.push({  
                "identifier": Date.now(),
                "identifierStock": $scope.estoqueSelecionado.originalObject.identifier,
                "identifierProduct":  $scope.itemSelecionado.originalObject.identifier,
                "nameProduct": $scope.itemSelecionado.originalObject.name,
                "price": $scope.itemSelecionado.originalObject.price,
                "quantity": $scope.consignacao.quantidadeItem
             });
             
			$scope.$broadcast('angucomplete-alt:clearInput', 'angucomplete-item');
			$scope.itemSelecionado.description.title = '';
			$scope.consignacao.quantidadeItem = '';
		}
		
		$scope.getStock = function (items) {
		    if(items.length) {
		        var stockId = items[0].identifierStock;
		        for(var i=0; i<$scope.estoques.length; i++) {
		            if($scope.estoques[i].identifier == stockId)
		                return $scope.estoques[i];
		        }
		    }
		    
		    return null;
		};

		$scope.dar_baixa = false;
		$scope.showWindow = function(consignacao, form_baixa) {
			$scope.consignacaoForm.$setPristine();
			$scope.consignacaoForm.$setUntouched();
			$scope.consignacao = consignacao || {
				consignmentItemsTO : [],
				customerTO : {},
			} && $scope.$broadcast('angucomplete-alt:clearInput');
			
			if($scope.consignacao.stockItemConsignmentsTO) {
			    var estoque = $scope.getStock(consignacao.stockItemConsignmentsTO);
				$scope.estoqueSelected = estoque;
			}

			$scope.dar_baixa = form_baixa == 1;
			$('#consignacaoModal').modal('show');

			$scope.$broadcast('angucomplete-alt:changeInput', 'angucomplete-estoque', $scope.estoqueSelected);
			$scope.$broadcast('angucomplete-alt:changeInput', 'angucomplete-cliente', $scope.consignacao.customerTO);
		}

		$scope.consignacao = {};
		$scope.save = function(consignacao) {
		    consignacao.customerTO = $scope.selectedClient.originalObject;
			if ($scope.consignacaoForm.$valid) {
				if (!consignacao.identifier) {
					Consignacao.add(consignacao).then(function(response) {
						consignacao.identifier = response.data.identifier;
						$scope.consignacoes.push(consignacao);
						toastr.success('Consignação criada com sucesso', 'Sucesso');
					}, function() {
						toastr.error('Alguns campos estão com erros', 'Erro');
					});
				} else {
					Consignacao.update(consignacao).then(function() {
						// $scope.consignacoes.push(consignacao);
						toastr.success('Consignação salva com sucesso', 'Sucesso');
					}, function() {
						toastr.error('Alguns campos estão com erros', 'Erro');
					});
				}
				$('#consignacaoModal').modal('hide');
			} else {
				toastr.error('Alguns campos estão com erros', 'Erro');
			}
		}

		$scope.baixa = function(consignacao) {
			Consignacao.remove(consignacao).then(function() {
				toastr.success('Baixa efetuada com sucesso', 'Sucesso');

				for (var i = 0; i < $scope.consignacoes.length; i++) {
					if (consignacao.identifier == $scope.consignacoes[i].identifier) {
						$scope.consignacoes.splice(i, 1);
					}
				}

				$('#estoqueModal').modal('hide');
			}, function() {
				toastr.error('Baixa está com erro', 'Erro');
			});
		}
	});
})();
