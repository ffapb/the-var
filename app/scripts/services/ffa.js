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
    var pst = {i:0,n:Number.POSITIVE_INFINITY,r:0,l:0}; // status variable
    var abort = false;
    var al; // temp variable for looping
    var newP;

    return {
      np: function() { return Object.keys(fff).length; },
      ffaConfig1: function() {
        return $http.get('/the-var-config.json').then(function(response) {
          console.log('fc11',response.data);
          config = response.data;
          return config;
        }, function(response) {
          console.error('fc12',response);
        });
      },
      getStatus: function() { return pst; },
      portfolios: function() {
        pst.r = 1;
        var self=this;
        if(!config) {
          this.ffaConfig1()
            .then(function() {
              self.portfolios();
            });
          return;
        }

        if(config.accounts.length===0) { return; }

        this.pstart(0);
      },

      setAbort: function() { abort=true; },

      pstart: function(a1) {
        var self=this;
        if(abort) { pst.r=2; return; }

        console.log('pst',a1);
        var nac = config.accounts.length;
        if(a1>=nac) { return; }

        var a = config.accounts[a1];
        console.log('ca',config.accounts,a);
        var url = config.endPoints.portfolios+'?base='+a.base+'&account='+a.a;
        console.log('URL',url);
        $http.get(url).then(function(response) {
            if(abort) { pst.r=2; return; }

            console.log('fc13',response);
            fff[a.base+'-'+a.a]={acc: a, port: response.data }; // .slice(1,20) // slice only for testing purposes
            console.log('abc',self.np(),Object.keys(fff).length,fff,nac);
            if(self.np()===nac) {
              // prepare some variables to track status
              pst.i=0;
              pst.n=Object.keys(fff)
                .map(function(x) { return fff[x].port.length; })
                .reduce(function(a,b) {
                  if(!b) { return a; } else { return a+b; }
                  }, 0);

              // run core
              self.mergeWithPortfolios();
            } else {
              self.pstart(a1+1);
            }
          }, function(response) {
            console.error('fc14',response);
            pst.r=2;
          });
    },

    mwpPost: function() {
        if(pst.i===pst.n) {
          pst.r=0;
        } else {
          pst.i++;
        }
    },

    mwpSingle: function(ki,self) {
      console.log('mwpsingle',fff,ki);
      if(abort) { pst.r=2; return; }
      var k = Object.keys(fff)[ki];

      newP = {
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
        newP.id = pl[found[0]].id;
      } else {
        Portfolios.add(newP);
      }

      // move status by number of skipped 
      pst.i+=fff[k].port.filter(function(a) {
        return !a.TIT_ISIN_BBG;
      }).length;
      // continue
      al = fff[k].port.filter(function(a) {
        return a.TIT_ISIN_BBG;
      });
      if(al.length>0) {
        self.mwpSingle2(ki,0,self);
      } else {
        self.mwpPost();
      }

    },

    mwpSingle2: function(ki,ali,self) {
      console.log('fdasfdsafdas',fff,ki,Object.keys(fff)[ki]);
      var k = Object.keys(fff)[ki];
      console.log('fsdafdsa234234',k,al,ali);

          var a = al[ali];
          console.log('Doing',k,a.TIT_ISIN_BBG);

          var newA = {
            src: 'FFA MF',
            lookup: {
              Exchange: '-',
              Symbol: a.TIT_ISIN_BBG,
              Name: a.TIT_NOM
            }
          };

          Assets.getChart(newA.src,newA.lookup.Symbol,config)
            .then(function(ps) {
              console.log('res',ps,fff);

              // Append new fields
              // http://stackoverflow.com/a/171256/4126114
              for(var attrname in ps) {
                newA[attrname] = ps[attrname];
              }
              pst.l = newA.history.length;

              if(Assets.exists(newA.src,newA.lookup.Symbol)) {
                console.error('Assets already contain ',newA);
                Assets.update(newA);
              } else {
                Assets.add(newA);
                Portfolios.addAsset(newP.id, newA);
              }

              self.mwpS2Post(ki,ali,self);
            }, function(err) {
              console.error('Error',err);
              self.mwpS2Post(ki,ali,self);
            });
    },

    mwpS2Post: function(ki,ali,self) {
      console.log('fffffff',fff);
      self.mwpPost();

      if(ali+1<al.length) {
        self.mwpSingle2(ki,ali+1,self);
      } else {
        console.log('moving to next',ki,fff);
        if(ki+1<Object.keys(fff).length) {
          self.mwpSingle(ki+1,self);
        } else {
          self.mwpPost();
        }
      }
    },

    mergeWithPortfolios: function() {
        this.mwpSingle(0,this);
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
