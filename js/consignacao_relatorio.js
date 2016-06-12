(function(){
    "use strict";

    angular.module('consig',[
        'ngAnimate', 'toastr'
    ])

   .factory('Consignacao', function($http) {
        return {
            filter: function (dataInicio, dataFim) {
              return $http.get('https://localhost:8443/purplefitness/rest/consignment/searchfinalizedconsignemnt?di=' + dataInicio + 'df=' + dataFim);  
            }
        };
    })

	.controller('consignacaoController',function($scope, Consignacao, toastr){ 
        //consignação
        /*$scope.consignacoes_itens = [ 
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'},
             {nameCustomer:'Maria Hosé',finalDate:'14/04/2016', nameProduct:'Nome', quantity_consig:'10', quantity_used:'10', price:'15'}
         ];*/

         $scope.relatorio = {};
         var now = new Date();
         $scope.relatorio.dataInicial = ('00' + now.getDate()).substr(-2) + '/' + ('00' + (now.getMonth() + 1)).substr(-2) + '/' + now.getFullYear();

         now.setMonth(now.getMonth() - 1);
         $scope.relatorio.dataFinal = ('00' + now.getDate()).substr(-2) + '/' + ('00' + (now.getMonth() + 1)).substr(-2) + '/' + now.getFullYear();

       $scope.gerar_relatorio = function(relatorio){ 
            $scope.relatorioForm.$setPristine(); 
            $scope.relatorioForm.$setUntouched();
            
            var dataInicial = new Date($scope.relatorio.dataInicial.replace(/([0-9]+)\/([0-9]+)\/([0-9]+)/, '$2/$1/$3'));
            var dataFinal = new Date($scope.relatorio.dataInicial.replace(/([0-9]+)\/([0-9]+)\/([0-9]+)/, '$2/$1/$3'));

            Consignacao.filter(dataInicial, dataFinal).then(function(response) {
               $scope.consignacoes = response.data;
                $scope.exibir_relatorio=1;
                //console.log($scope.consignacoes);
            }, function(response) {
               // console.log(response);
            });
        }
    });
})();

