'use strict';

describe('Controller: AssetshowCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetshowCtrl, scope, AssetsM, http, location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Assets, $httpBackend, $location) {
    scope = $rootScope.$new();
    AssetshowCtrl = $controller('AssetshowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    AssetsM=Assets;
    var aaa = {
      "mod": {
        "symbol1": 123,
        "symbol2": 456
      },
      "source2": {
        "symbol3": 789,
        "symbol4": 101112
      }
    };
    AssetsM.setAAA(aaa);
    http=$httpBackend;
    location=$location;
  }));

  it('set => pendingStock not false', function (done) {
    http.expectJSONP(/.*markitondemand.*Lookup.*symbol1.*/).respond([
      { "Symbol":"symbol1",
        "lookup":{
          "Symbol":"symbol1",
          "Exchange": "bla",
          "Name": "bli"
        }
      }]);
    http.expectJSONP(/.*markitondemand.*InteractiveChart.*symbol1.*/).respond({"Dates": ["2015-01-01","2015-01-02","2015-01-03"],
    "Elements": [
        { "DataSeries": {
            "close": { "values": [1,2,3] }
          }
        }
      ]
    });

    var x=scope.set("symbol1","mod");
    if(x) {
      x.then(function(y) {
        expect(scope.pendingStock.hasOwnProperty("history")).toBe(true);
        expect(scope.pendingStock.history.length).toBe(3);

        expect(AssetsM.list()["mod"]["symbol1"].hasOwnProperty("history")).toBe(true);
        scope.add2("123");
        expect(decodeURIComponent(location.url())).toBe("#/portfolioShow/123");
        done();
      });
    }
    expect(scope.pendingStock).toBe(123);
    http.flush();
  });
});
