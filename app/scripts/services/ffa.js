'use strict';

/**
 * @ngdoc service
 * @name theVarApp.ffa
 * @description
 * # ffa
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('ffa', ['$http','$base64','Portfolios','Assets','$q','$timeout', 'moment', '$log', function ($http,$base64,Portfolios,Assets,$q,$timeout,moment,$log) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    var fff={};
    var config = null;
    var pst = {i:0,n:Number.POSITIVE_INFINITY,r:0,l:0}; // status variable
    var abort = false;
    var al; // temp variable for looping
    var available = 0;
    var self;
    var configUrl = '/the-var-config.json?ts='+moment().format('x');  // append unix timestamp to avoid cache

    return {
      np: function() { return Object.keys(fff).length; },

      getAvailable: function() {
        return available;
      },
      checkAvailable: function() {
        available=1;
        return $http.get(configUrl)
          .then(function() {
            available = 2;
          }, function() {
            available = 0;
          });
      },
      ffaConfig1: function() {
        if(!config) {
          return this.checkAvailable().then(function() {
            if(!available) { return false; }
            return $http.get(configUrl).then(function(response) {
              $log.debug('fc11',response.data);
              config = response.data;
              return config;
            }, function(response) {
              console.error('fc12',response);
            });
          });
        } else {
          // http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(config);
          }, 100);
          return deferred.promise;
        }
      },
      getStatus: function() { return pst; },
      portfolios: function() {
        pst.r = 1;
        self=this;
        if(!config) {
          this.ffaConfig1()
            .then(function() {
              self.portfolios();
            });
          return;
        }

        if(config.accounts.length===0) { return; }

        fff={}; // reset before retrieval
        this.pstart(0);
      },

      setAbort: function() { abort=true; console.error('Will abort'); },

      pstart: function(a1) {
        self=this;
        if(abort) { pst.r=2; return; }

        $log.debug('pst',a1);
        var nac = config.accounts.length;
        if(a1>=nac) { return; }

        var a = config.accounts[a1];
        $log.debug('ca',config.accounts,a);
        var url = config.endPoints.portfolios+'?base='+a.base+'&account='+a.a;
        $http.get(url)
          // set portfolio
          .then(function(response) {
            if(abort) { pst.r=2; return; }

            $log.debug('fc13',response);
            var k=a.base+'-'+a.a;
            fff[k]={acc: a, port: response.data }; // .slice(1,20) // slice only for testing purposes

            // add symbolMain and symbol2
            var re=/[a-zA-Z0-9]+ [a-zA-Z]{2} (Equity|Corp)/i;
            fff[k].port.map(function(a) {
              a.symbolMain=a.TIT_ISIN_BBG;
              if(re.test(a.TIT_REU_COD)) {
                a.symbolMain=a.TIT_REU_COD;
              } else {
                if(a.TIT_ISIN_BBG==='') { // && a.TIT_REU_COD=='') {
                  a.symbolMain=a.TIT_COD;
                } 
              }
              a.symbAlt=[a.TIT_ISIN_BBG,a.TIT_REU_COD,a.TIT_COD];
              a.symbAlt=a.symbAlt.filter(function(x) { return x!==a.symbolMain && !!x; });
              if(!a.symbolMain) { console.error('Failed to identify symbol for',a); }
              return a;
            });
 
            var assets = fff[k].port.map(function(x) {
              return {src: 'FFA MF', symbol:x.symbolMain, pct: 1};
            });

            Portfolios.add('FFA MF',k,assets);
            fff[k].port.map(function(a) {
              var newA = {
                src: 'FFA MF',
                lookup: {
                  Exchange: '-',
                  Symbol: a.symbolMain,
                  SymbAlt: a.symbAlt,
                  Name: a.TIT_NOM
                }
              };
              Assets.add(newA);
            });

            if(self.np()<nac) {
              self.pstart(a1+1);
            } else {
              pst.r=0;
            }
          }, function(response) {
            console.error('fc14',response);
            pst.r=2;
          });
    },

    readyForPrices: function() {
      var self=this;
      if(!config) { return false; }
      var nac = config.accounts.length;
      $log.debug('abc',self.np(),Object.keys(fff).length,fff,nac);
      return(self.np()===nac);
    },

    portfolioPrices: function() {
      if(!this.readyForPrices()) {
        console.error('Not yet ready for prices');
        return;
      }
      // prepare some variables to track status
      pst.r = 1;
      pst.i=0;
      pst.n=Object.keys(fff)
        .map(function(x) { return fff[x].port.length; })
        .reduce(function(a,b) {
          if(!b) { return a; } else { return a+b; }
          }, 0);

      // run core
      this.mwpSingle(0,this);
    },

    mwpPost: function(x) {
      if(!x) { x=1; }
      if(pst.i===pst.n) {
        pst.r=0;
      } else {
        pst.i+=x;
      }
    },

    mwpSingle: function(ki,self) {
      $log.debug('mwpsingle',fff,ki,abort);
      if(abort) { pst.r=2; return; }
      var k = Object.keys(fff)[ki];

      // move status by number of skipped 
      pst.i+=fff[k].port.filter(function(a) {
        return !a.symbolMain;
      }).length;
      // continue
      self.mwpSingle2(ki,self);
      self.mwpPost();
    },

    mwpSingle2: function(ki,self) {
      $log.debug('fdasfdsafdas',fff,ki,Object.keys(fff)[ki]);

      var k = Object.keys(fff)[ki];
      al = fff[k].port.filter(function(a) {
        return a.symbolMain;
      });
      if(al.length===0) { return; }

      $log.debug('fsdafdsa234234',k,al);
      self.getChart(0,self,ki);
    },

    getChart: function(al2i,self,ki) {
      var al2=al.map(function(x) { return x.symbolMain; });

      // iterate in steps of N
      var N=60;
      if(al2i>Math.floor(al2.length/N)) {
        console.error('Should not have gotten here',al2i,al2.length,N,Math.floor(al2.length/N));
        return;
      }
      var al2s=al2.slice(al2i*N,al2i*N+N); // if al2i=0 and N=10, this will be 0,10 but will return the items from index 0 to index 9 inclusive
      $log.debug('subset',al2i,al2s,self);

      Assets.getChart('FFA MF',al2s,config)
        .then(function(psa) {
          $log.debug('res',psa,fff,al2s,self);
          // count failed codes
          pst.i+=al2s.length - Object.keys(psa).length;
          var myfilter=function(x) { return x.symbolMain===psk; };
          for(var psk in psa) {
            var ps=psa[psk];
            var al3=al.filter(myfilter);
            if(al3.length===0) { console.error('Did not find the code '+psk+' ... what?'); return; }
            if(al3.length >1) { console.error('Found more than one code '+psk+' ... what?'); return; }
            var a=al3[0];

            $log.debug('Doing',a.symbolMain);

            var newA = {
              src: 'FFA MF',
              lookup: {
                Exchange: '-',
                Symbol: a.symbolMain,
                SymbAlt: a.symbAlt,
                Name: a.TIT_NOM
              }
            };

            // Append new fields
            // http://stackoverflow.com/a/171256/4126114
            for(var attrname in ps) {
              newA[attrname] = ps[attrname];
            }
            pst.l = newA.history.length;

            if(Assets.exists(newA.src,newA.lookup.Symbol)) {
              //console.error('Assets already contain ',newA);
              Assets.update(newA);
            } else {
              console.error('How was this asset not yet added?',newA);
            }
            self.mwpPost();
          }

          $log.debug('recurse',al2i,al2.length,N,Math.floor(al2.length/N));
          if(al2i+1>Math.floor(al2.length/N)) {
            self.mwpS2Post(ki,self);
          } else {
            self.getChart(al2i+1,self,ki);
          }

        }, function(err) {
          console.error('Error',err);
          self.mwpPost(al2s.length);
          self.mwpS2Post(ki,self);
        });
    },

    mwpS2Post: function(ki,self) {
      $log.debug('fffffff',fff);

      $log.debug('moving to next',ki,fff);
      if(ki+1<Object.keys(fff).length) {
        self.mwpSingle(ki+1,self);
      } else {
        $log.debug('finished looping');
        self.mwpPost();
      }
    },

/*    getNav: function(account) {
      // TODO WORK IN PROGRESS
      return $http.get(url).then(
        function(response) {
          $log.debug('res ass',url,response);
          gcs=0;
          var x={};
          for(var i in response.data) {
            $log.debug('_____',i,response.data[i]);
            x[i]=self.treatChart(response.data[i]);
          }

          return(x);
        },
        function() { gcs=2; }
      );

    }
*/
  };

/*    $scope.ffaConfig2 = function() {
      $log.debug('ffa config');
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

            $log.debug('portfoliosEndPoint',response.data);
          }, function(response) {
            console.error('Search for FFA the-var failed. '+angular.toJson(response));
          });
        }
      }
    };
*/
  //  $scope.ffaConfig();

  }]);
