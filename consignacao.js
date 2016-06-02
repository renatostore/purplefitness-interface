/**
 * { client: { name: 'José', document: 'dasa', identifier: 1235534 }, stock: {
 * titulo: 'varejo' identifier: 12421432 }, items: [ { identifier:2314243,
 * quantidade:2 },{ identifier:2341234, quantidade:3 } ], date: 24134213434 }
 *  { clientId: 231442341, stockId: 1243243, items: [], date: 23414234321 }
 */

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
				for (var i = 0; i < item.consignmentItemsTO.length; i++) {
					if (item.consignmentItemsTO[i].productTO)
						delete item.consignmentItemsTO[i].productTO.title;
				}

				var data = {
					customerTO : item.customerTO,
					stockProductTO : item.stockProductTO,
					finalDate : item.finalDate,
					consignmentItemsTO : item.consignmentItemsTO
				};
				if (data.customerTO.originalObject)
					data.customerTO = data.customerTO.originalObject;
				if (data.stockProductTO.originalObject)
					data.stockProductTO = data.stockProductTO.originalObject;
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
			getAll : function() {
				return $http.get('https://localhost:8443/purplefitness/rest/product/search');

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
				sum += items[i].productTO.price * items[i].quantity;
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
		 * $scope.estoques = [ {identifier:1,title:'varejo'},
		 * {identifier:1,title:'atacado'}, ];
		 * 
		 * $scope.clientes = [ {identifier:1,corporateName:'José', cnpj:
		 * '000.000.000-00'}, {identifier:2,corporateName:'Raimundo', cnpj:
		 * '000.000.000-00'}, {identifier:3,corporateName:'Oliveira', cnpj:
		 * '000.000.000-00'}, {identifier:4,corporateName:'Maldonato', cnpj:
		 * '000.000.000-00'}, {identifier:5,corporateName:'Rosario', cnpj:
		 * '000.000.000-00'} ];
		 * 
		 * $scope.items = [ {identifier:1,name:'Camiseta Florida', price:'50'},
		 * {identifier:1,name:'Calça Jeans', price:'30'}, ];
		 * 
		 * $scope.consignacoes = [ { "name":"ZXCVB", "identifier":"ASDF",
		 * "initialDate":"20/01/2010", "finalDate":"01/01/2010",
		 * "stockProductTO":{ "title":"Atacado", "identifier":"1464711363409" },
		 * "consignmentItemsTO":[ { "identifier":"QWERT", "productTO":{
		 * "name":"teste1", "identifier":"1464558313428", "price":"15",
		 * "unity":"UN" }, "quantity":"20" } ], "customerTO":{
		 * "identifier":"1464721432724", "corporateName":"jose",
		 * "cnpj":"123123213", "address":"rua x", "phone":"19111111111",
		 * "bairro":"sao joao", "city":"campinas", "uf":"SP",
		 * "email":"jose@gmail.com" } } ];
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
			if (!$scope.consignacao.consignmentItemsTO) {
				$scope.consignacao.consignmentItemsTO = [];
			}
			$scope.consignacao.consignmentItemsTO.push({
				identifier : Date.now(),
				productTO : $scope.itemSelecionado.originalObject,
				quantity : $scope.consignacao.quantidadeItem
			});
			$scope.$broadcast('angucomplete-alt:clearInput', 'angucomplete-item');
			$scope.itemSelecionado.description.title = '';
			$scope.consignacao.quantidadeItem = '';
		}

		$scope.dar_baixa = false;
		$scope.showWindow = function(consignacao, form_baixa) {
			$scope.consignacaoForm.$setPristine();
			$scope.consignacaoForm.$setUntouched();
			$scope.consignacao = consignacao || {
				consignmentItemsTO : [],
				stockProductTO : {},
				customerTO : {},
			} && $scope.$broadcast('angucomplete-alt:clearInput');

			$scope.dar_baixa = form_baixa == 1;
			$('#consignacaoModal').modal('show');

			$scope.$broadcast('angucomplete-alt:changeInput', 'angucomplete-estoque', $scope.consignacao.stockProductTO);
			$scope.$broadcast('angucomplete-alt:changeInput', 'angucomplete-cliente', $scope.consignacao.customerTO);
		}

		$scope.consignacao = {};
		$scope.save = function(consignacao) {
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
