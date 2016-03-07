'use strict';

/**
 * @ngdoc service
 * @name theVarApp.ffa
 * @description
 * # ffa
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('ffa', function ($http,$base64,Portfolios,Assets) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var fff={};
    var config = null;

    return {
      np: function() { return Object.keys(fff).length; },
      ffaConfig1: function(cb) {
        $http.get('/the-var-config.json').then(function(response) {
          console.log('fc11',response.data);
          config = response.data;
          if(cb) { cb(); }
        }, function(response) {
          console.error('fc12',response);
        });
      },
      portfolios: function() {
        var self = this;
        if(!config) {
          this.ffaConfig1(this.portfolios);
          return;
        }

          var nac = config.accounts.length;
          config.accounts.map(function(a) {
            var url = config.endPoints.portfolios+'?base='+a.base+'&account='+a.a;
            console.log('URL',url);
            $http.get(url).then(function(response) {
                console.log('fc13',response);
                fff[a.base+'-'+a.a]={acc: a, port: response.data};
                if(self.np()===nac) {
                  self.mergeWithPortfolios();
                }
              }, function(response) {
                console.error('fc14',response);
              });
          });
    },
    mergeWithPortfolios: function() {
      Object.keys(fff).map(function(k) {
        var newP = {
          src: 'FFA MF',
          name: k,
          assets: []
        };
        var pl = Portfolios.list();
        var found = Object.keys(pl).filter(function(k) {
          return pl[k].src===newP.src && pl[k].name===newP.name;
        });
        if(found.length>0) {
          console.error('Portfolios already contain ',fff[k]);
        } else {
          fff[k].port.filter(function(a) {
            return a.TIT_ISIN_BBG;
          }).map(function(a) {
            var newA = {
              src: 'FFA MF',
              lookup: {
                Exchange: '-',
                Symbol: a.TIT_ISIN_BBG,
                Name: a.TIT_NOM
              }
            };
            if(Assets.exists(newA.src,newA.lookup.Symbol)) {
              console.error('Assets already contain ',newA);
            } else {
              Assets.add(newA);
              newP.assets.push({
                src: 'FFA MF',
                symbol: a.TIT_ISIN_BBG
              });
            }
          });
          Portfolios.add(newP);
        }

      });
    }
  };

/*    $scope.ffaConfig2 = function() {
      console.log('ffa config');
      var un = window.prompt('Username');
      if(un) {
        var pw = window.prompt('Password');
        if(pw) {
          var credentials = $base64.encode(un + ':' + pw);
          $scope.ffaConfig1(
          $http.get(
            '/ffa-mfe/the-var-config.json',
            {
              withCredentials: true,
              headers: { 'Authorization': 'Basic ' + credentials }
            }
            ).then(function(response) {
            if(response.status!==200) {
              console.error('FFA the-var config not found');
              return;
            }

            console.log('portfoliosEndPoint',response.data);
          }, function(response) {
            console.error('Search for FFA the-var failed. '+angular.toJson(response));
          });
        }
      }
    };
*/
  //  $scope.ffaConfig();

  });
