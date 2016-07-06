'use strict';

describe('Service: Assets', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Assets,http;
  beforeEach(inject(function (_Assets_,$httpBackend) {
    Assets = _Assets_;
    http=$httpBackend;
  }));

  var aaa = {
    'source1': {
      'symbol1': 123,
      'symbol2': 456
    },
    'source2': {
      'symbol3': 123,
      'symbol4': 456
    }
  };

  it('set list na', function () {
    expect(!!Assets).toBe(true);
    expect(Assets.na()===0);
    Assets.setAAA(aaa);
    expect(Assets.na()===1);
  });

  it('add del asset', function () {
    // add new portfolio
    var n0 = Assets.na();
    var a1={src:'mod',lookup:{Symbol:'symbol5'}};
    expect(Assets.exists(a1.src,a1.lookup.Symbol)).toBe(false);
    expect(Assets.na()===n0+1);
    Assets.add(a1); // var pid1 = ...
    expect(Assets.exists(a1.src,a1.lookup.Symbol)).toBe(true);
    // add existing
    Assets.add(a1);
    expect(Assets.na()===n0+1);
    // del
    Assets.del('mod','symbol5');
    expect(Assets.na()===n0);
    expect(Assets.exists(a1.src,a1.lookup.Symbol)).toBe(false);
  });

  it('getChart mod',function(done) {
    http.expectJSONP(/.*markitondemand.*InteractiveChart.*symbol1.*/).respond({'Dates': ['2015-01-01','2015-01-02','2015-01-03'],
    'Elements': [
        { 'DataSeries': {
            'close': { 'values': [1,2,3] }
          }
        }
      ]
    });

    Assets.getChart('mod','symbol1',false).then(function(response) {
      expect(response.hasOwnProperty('history')).toBe(true);
      done();
    });

    http.flush();
  });

  it('getChart ffa',function(done) {
    var config={endPoints:{prices:'http://bla.com'}};
    http.expectGET(/.*bla.*symbol1.*/).respond(
    { 'symbol1':
      { 'Dates': ['2015-01-01','2015-01-02','2015-01-03'],
        'Elements': [
          { 'DataSeries': {
            'close': { 'values': [1,2,3] }
            }
          }
        ]
      }
    });

    Assets.getChart('FFA MF','symbol1',config).then(function(response) {
      expect(response.hasOwnProperty('symbol1')).toBe(true);
      expect(response.symbol1.hasOwnProperty('history')).toBe(true);
      done();
    });

    http.flush();
  });

  it('find prev eom',function() {
    var dates = ['2015-01-01','2015-01-15','2015-01-30','2015-02-01','2015-02-15'];
    expect(Assets.findPrevEom(dates,'month')).toBe(2);
    dates = ['2015-01-01','2015-01-15','2015-01-29','2015-02-01','2015-02-15'];
    expect(Assets.findPrevEom(dates,'month')).toBe(2);
    dates = ['2015-01-01','2015-01-15','2015-01-29'];
    expect(Assets.findPrevEom(dates,'month')).toBe(-1);
    dates = ['2015-01-01','2015-01-15','2015-01-29'];
    expect(Assets.findPrevEom(dates,'year')).toBe(-1);
    dates = ['2014-10-10','2014-12-30','2015-01-01','2015-01-15','2015-01-29','2015-02-01','2015-02-15'];
    expect(Assets.findPrevEom(dates,'year')).toBe(1);
  });
 
  it('downsample',function() {
    var x = [0,1,2,3,4,5,6,7,8,9];
    var y = Assets.downsample(x,3);
    expect(y.length).toBe(4);
    expect(y[0]).toBe(0);
    expect(y[1]).toBe(3);
    expect(y[2]).toBe(6);
    expect(y[3]).toBe(9);
  });

});
