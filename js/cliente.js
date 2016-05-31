(function(){
    "use strict";

    angular.module('clientes',[
        'ngAnimate', 'toastr'
    ])

    .factory('Cliente', function($http) {
        return {
            getAll:function() {
                return $http.get('https://localhost:8443/purplefitness/rest/customer/search');
                
            },
            add:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/customer/add', {
                        cnpj:item.cnpj,
                        corporateName:item.corporateName,
                        address:item.address,
                        phone:item.phone,
                        identifier:Date.now(),
                        email:item.email,
                        uf:item.uf,
                        city:item.city,
                        bairro:item.bairro
                });
            },
            update:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/customer/update', {
                     cnpj:item.cnpj,
                        corporateName:item.corporateName,
                        address:item.address,
                        phone:item.phone,
                        identifier:item.identifier,
                        email:item.email,
                        uf:item.uf,
                        city:item.city,
                        bairro:item.bairro
                });
            },
            remove:function(item) {
                return $http.post('https://localhost:8443/purplefitness/rest/customer/remove', {
                        cnpj:item.cnpj,
                        corporateName:item.corporateName,
                        address:item.address,
                        phone:item.phone,
                        identifier:item.identifier,
                        email:item.email,
                        uf:item.uf,
                        city:item.city,
                        bairro:item.bairro
                });
            }
        };
    })


    .controller('ClientesController',function($scope, Cliente, toastr){ 
        Cliente.getAll().then(function(response) {
            $scope.clientes = response.data;
            console.log($scope.clientes);
        }, function(response) {
            console.log(response);
        });      
        $scope.currentPesquisa = '';
        $scope.setCurrentPesquisa = function(pesquisa){ 
            $scope.currentPesquisa = pesquisa;          
        }
        $scope.showWindow = function(cliente){ 
            $scope.clienteForm.$setPristine(); 
            $scope.clienteForm.$setUntouched();
            cliente = cliente || {razao_social:$scope.currentPesquisa,'':''}; 
            $scope.cliente = cliente;         
            $('#clienteModal').modal('show');  
        }
        
        $scope.save = function(cliente){
            if($scope.clienteForm.$valid){   
                if(!cliente.identifier){          
                    Cliente.add(cliente).then(function(response) {
                        cliente.identifier = response.data.identifier;
                        $scope.clientes.push(cliente);
                        toastr.success('Cliente criado com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                } else {
                    //update
                    Cliente.update(cliente).then(function() {
                        $scope.clientes.push(cliente);
                        toastr.success('Cliente salvo com sucesso', 'Sucesso');
                    },function() {
                        toastr.error('Alguns campos estao com erros', 'Erro');
                    });
                }
                $('#clienteModal').modal('hide');         
            } else {
                // Erro
            }
        }
        $scope.remove = function(cliente, index){
            Cliente.remove(cliente).then(function() {
                $scope.clientes.splice(index,1);
                $scope.clientes.push();
                toastr.success('Cliente excluido com sucesso', 'Sucesso');
            },function() {
                toastr.error('Erro ao excluir o cliente', 'Erro');
            });
        }
    });
})();

