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
    var available = 0;
    var self;

    return {
      np: function() { return Object.keys(fff).length; },

      getAvailable: function() {
        return available;
      },
      checkAvailable: function() {
        available=1;
        $http.get('/the-var-config.json')
          .then(function() {
            available = 2;
          }, function() {
            available = 0;
          });
      },
      ffaConfig1: function() {
        if(!available) { return false; }
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

      setAbort: function() { abort=true; console.error("Will abort"); },

      pstart: function(a1) {
        self=this;
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
      if(!config) return false;
      var nac = config.accounts.length;
      console.log('abc',self.np(),Object.keys(fff).length,fff,nac);
      return(self.np()===nac);
    },

    portfolioPrices: function() {
      var nac = config.accounts.length;
      if(!this.readyForPrices()) {
        console.error("Not yet ready for prices");
        return;
      }
      // prepare some variables to track status
      pst.i=0;
      pst.n=Object.keys(fff)
        .map(function(x) { return fff[x].port.length; })
        .reduce(function(a,b) {
          if(!b) { return a; } else { return a+b; }
          }, 0);

      // run core
      self.mergeWithPortfolios();
    },

    mwpPost: function(x) {
      if(!x) x=1;
      if(pst.i===pst.n) {
        pst.r=0;
      } else {
        pst.i+=x;
      }
    },

    mwpSingle: function(ki,self) {
      console.log('mwpsingle',fff,ki,abort);
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
      self.mwpSingle2(ki,self);
      self.mwpPost();
    },

    mwpSingle2: function(ki,self) {
      console.log('fdasfdsafdas',fff,ki,Object.keys(fff)[ki]);

      var k = Object.keys(fff)[ki];
      al = fff[k].port.filter(function(a) {
        return a.TIT_ISIN_BBG;
      });
      if(al.length==0) { return; }

      console.log('fsdafdsa234234',k,al);
      self.getChart(0,self,ki);
    },

    getChart: function(al2i,self,ki) {
      var al2=al.map(function(x) { return x.TIT_ISIN_BBG; });

      // iterate in steps of N
      var N=50;
      if(al2i>Math.floor(al2.length/N)) {
        console.error("Should not have gotten here",al2i,al2.length,N,Math.floor(al2.length/N));
        return;
      }
      var al2s=al2.slice(al2i*N,al2i*N+N); // if al2i=0 and N=10, this will be 0,10 but will return the items from index 0 to index 9 inclusive
      console.log("subset",al2i,al2s,self);

      Assets.getChart("FFA MF",al2s,config)
        .then(function(psa) {
          console.log('res',psa,fff,al2s,self);
          // count failed codes
          pst.i+=al2s.length - Object.keys(psa).length;
          for(var psk in psa) {
            var ps=psa[psk];
            var al3=al.filter(function(x) { return x.TIT_ISIN_BBG==psk; });
            if(al3.length==0) { console.error("Did not find the code "+psk+" ... what?"); return; }
            if(al3.length >1) { console.error("Found more than one code "+psk+" ... what?"); return; }
            var a=al3[0];

            console.log('Doing',a.TIT_ISIN_BBG);

            var newA = {
              src: 'FFA MF',
              lookup: {
                Exchange: '-',
                Symbol: a.TIT_ISIN_BBG,
                Name: a.TIT_NOM
              },
              pct: 1
            };

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
            self.mwpPost();
          }

          console.log("recurse",al2i,al2.length,N,Math.floor(al2.length/N));
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
      console.log('fffffff',fff);

      console.log('moving to next',ki,fff);
      if(ki+1<Object.keys(fff).length) {
        self.mwpSingle(ki+1,self);
      } else {
        console.log("finished looping");
        self.mwpPost();
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
