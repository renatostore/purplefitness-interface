(function(){
    "use strict";

    angular.module('consig',[
        'ngAnimate', 'toastr'
    ])

    .config( [
    '$compileProvider',
        function( $compileProvider )
        {   
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|mailto):/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    ])

   .factory('Consignacao', function($http) {
        return {
            filter: function (dataInicio, dataFim) {
              return $http.post('https://177.220.85.239:8443/purplefitness/rest/consignment/searchfinalizedconsignemnt', {
                initialDate: dataInicio,
                finalDate: dataFim
              });  
            }
        };
    })

	.controller('consignacaoController',function($scope, Consignacao, toastr){ 
        //consignação
        $scope.consignacoes_itens = [ 
             {customerName:'Maria Hosé',date:'2016-06-10T12:00:00.000Z', nameProduct:'Nome', ordered:'10', sold:'10', unityPrice:'15'},
             {customerName:'Maria Hosé',date:'2016-06-10T12:00:00.000Z', nameProduct:'Nome', ordered:'10', sold:'10', unityPrice:'15'},
             {customerName:'Maria Hosé',date:'2016-06-10T12:00:00.000Z', nameProduct:'Nome', ordered:'10', sold:'10', unityPrice:'15'},
             {customerName:'Maria Hosé',date:'2016-06-10T12:00:00.000Z', nameProduct:'Nome', ordered:'10', sold:'10', unityPrice:'15'},
             {customerName:'Maria Hosé',date:'2016-06-10T12:00:00.000Z', nameProduct:'Nome', ordered:'10', sold:'10', unityPrice:'15'}
         ];

         $scope.relatorio = {};
         var now = new Date();
         $scope.relatorio.dataFinal = ('00' + now.getDate()).substr(-2) + '/' + ('00' + (now.getMonth() + 1)).substr(-2) + '/' + now.getFullYear();

         now.setMonth(now.getMonth() - 1);
         $scope.relatorio.dataInicial = ('00' + now.getDate()).substr(-2) + '/' + ('00' + (now.getMonth() + 1)).substr(-2) + '/' + now.getFullYear();

        $scope.export = function () {
            var csv = 'cliente;data;produto;pedido;vendido;preco\r\n';

            for (var i = $scope.consignacoes_itens.length - 1; i >= 0; i--) {
                csv += $scope.consignacoes_itens[i].customerName + ';' +
                        $scope.consignacoes_itens[i].date + ';' +
                        $scope.consignacoes_itens[i].nameProduct + ';' +
                        $scope.consignacoes_itens[i].ordered + ';' +
                        $scope.consignacoes_itens[i].sold + ';' +
                        $scope.consignacoes_itens[i].unityPrice + '\r\n';
            }

            $scope.data = encodeURIComponent(csv);
        }

        $scope.success = function () {
            toastr.success('Relatório exportado com sucesso', 'Sucesso');
        };

       $scope.gerar_relatorio = function(relatorio){ 
            $scope.relatorioForm.$setPristine(); 
            $scope.relatorioForm.$setUntouched();
            
            var dataInicial = new Date($scope.relatorio.dataInicial.replace(/([0-9]+)\/([0-9]+)\/([0-9]+)/, '$2/$1/$3'));
            var dataFinal = new Date($scope.relatorio.dataFinal.replace(/([0-9]+)\/([0-9]+)\/([0-9]+)/, '$2/$1/$3'));

            // Consignacao.filter(dataInicial, dataFinal).then(function(response) {
                //$scope.consignacoes_itens = response.data;

                for (var i = $scope.consignacoes_itens.length - 1; i >= 0; i--) {
                    var date = new Date($scope.consignacoes_itens[i].date);
                    $scope.consignacoes_itens[i].date = ('00' + date.getDate()).substr(-2) + '/' + ('00' + (date.getMonth() + 1)).substr(-2) + '/' + date.getFullYear();
                }

                $scope.export();

                $scope.exibir_relatorio = 1;
                //console.log($scope.consignacoes);
            // }, function(response) {
               // console.log(response);
            // });
        }
    });
})();

