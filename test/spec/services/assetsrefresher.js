'use strict';

describe('Service: AssetsRefresher', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var AssetsRefresher,scope;
  var aaa = {
    src1: {
      symbol1: { price: 0 },
      symbol2: { price: 0 }
    },
    src2: {
      symbol3: { price: 0 },
      symbol4: { price: 0 }
    }
  };

  // mock other services: http://stackoverflow.com/a/23705585/4126114
  beforeEach(inject(function (_AssetsRefresher_, _Assets_, _ffa_, $q, $rootScope) {
    scope = $rootScope.$new();
    AssetsRefresher = _AssetsRefresher_;

    spyOn(_Assets_, 'list').and.callFake(function() {
      return aaa;
    });

    spyOn(_ffa_, 'ffaConfig1').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('fake ffa config');
      return deferred.promise;
    });

    spyOn(_Assets_, 'getChartAndUpdate').and.callFake(function(newA) {
      newA.price=1;
      var deferred = $q.defer();
      deferred.resolve('update price');
      return deferred.promise;
    });

  }));

  it('should do something', function () {
    expect(!!AssetsRefresher).toBe(true);
  });

  it('run updates all prices', function (done) {
    AssetsRefresher.run().then(function() {
      for(var src in aaa) {
        for(var symbol in aaa[src]) {
          //console.log('aaa',src,symbol,aaa[src][symbol]);
          expect(aaa[src][symbol].price).toBe(1);
        }
      }
      done();
    });
    scope.$digest();
  });


});
