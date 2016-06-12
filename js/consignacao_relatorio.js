(function(){
    "use strict";

    angular.module('consig',[
        'ngAnimate', 'toastr'
    ])

   .factory('Consignacao', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/consignment/search');
            }
        };
    })

	.controller('consignacaoController',function($scope, Consignacao, toastr){ 
        //consignação
        /*Consignacao.getAll().then(function(response) {
            $scope.consignacoes = response.data;
            console.log($scope.consignacoes);
        }, function(response) {
            console.log(response);
        });*/
        $scope.consignacoes_itens = [ 
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'}
         ];

       $scope.gerar_relatorio = function(relatorio){ 
            $scope.relatorioForm.$setPristine(); 
            $scope.relatorioForm.$setUntouched();
            $scope.exibir_relatorio=1;
            console.log($scope.relatorio);         
        }
    });
})();

