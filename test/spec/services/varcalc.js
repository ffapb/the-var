'use strict';

describe('Service: varCalc', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var varCalc;
  beforeEach(inject(function (_varCalc_) {
    varCalc = _varCalc_;
  }));

  it('is', function () {
    expect(!!varCalc).toBe(true);
  });

  it('calculateVaR', function () {
    var p1 = { history2: [1,1,1,1,1,1,1,1] };
    expect(varCalc.calculateVaR(p1,95,1)).toBe(0);
    var p2 = { history2: [1,2,1,2,1,2,1,2,1] };
    expect(varCalc.calculateVaR(p2,95,1)).toBe(-0.5);
    expect(varCalc.calculateVaR(p2,15,1)).toBe(+1);
    var p3 = { history2: [1,2,3,1,2,3,1,2,3,1,2,3,1] };
    expect(varCalc.calculateVaR(p3,95,1)).toBeCloseTo(-2/3,5);
    expect(varCalc.calculateVaR(p3,55,1)).toBe(+0.5);
  });

  it('edf', function () {
    var p1 = [1,1,1,1,1,1,1,1];
    var e1 = varCalc.edf(p1,1);
    expect(e1.length).toBe(1);
    expect(e1[0]).toBe(100);
    var p2 = [1,0,1,0,1,0,1,0];
    var e21 = varCalc.edf(p2,1);
    expect(e21.length).toBe(2);
    expect(e21[0]).toBe(50);
    expect(e21[1]).toBe(50);
    var e22 = varCalc.edf(p2,2);
    expect(e22.length).toBe(1);
    expect(e22[0]).toBe(100);
    var p3 = [1,2,0,1,2,0,1,2,0,1,2,0];
    var e31 = varCalc.edf(p3,1);
    expect(e31.length).toBe(3);
    expect(e31[0]).toBeCloseTo(100/3,5);
    expect(e31[1]).toBeCloseTo(100/3,5);
    expect(e31[2]).toBeCloseTo(100/3,5);
    var e32 = varCalc.edf(p3,2);
    expect(e32.length).toBe(2);
    expect(e32[0]).toBeCloseTo(200/3);
    expect(e32[1]).toBeCloseTo(100/3);
  });

  it('portfolioVaR 1',function() {
    var p1 = {
      'symbol1': { 'pct': 1, 'pnls': [1,2,3,4,5,6,7,8,9] },
      'symbol2': { 'pct': 1, 'pnls': [1,2,3,4,5,6,7,8,9] },
      'symbol3': { 'pct': 1, 'pnls': [1,2,3,4,5,6,7,8,9] },
    };
    var e1 = varCalc.portfolioVaR(95,p1,1);
    var r1 = varCalc.calculateVaR({history2:varCalc.pnls2prices(p1.symbol1.pnls)},95,1);
    expect(e1).toBe(r1);
  });

  it('portfolioVaR 3',function() {
    var p3 = {
      'symbol1': { 'pct': 1, 'pnls': [1   ,1   ,1   ,1   ,1   ] },
      'symbol2': { 'pct': 1, 'pnls': [0.5 ,0.5 ,0.5 ,0.5 ,0.5 ] },
      'symbol3': { 'pct': 1, 'pnls': [0.75,0.75,0.75,0.75,0.75] },
    };
    var e3 = varCalc.portfolioVaR(95,p3,1);
    var r3 = varCalc.calculateVaR({history2:varCalc.pnls2prices(p3.symbol3.pnls)},95,1);
    expect(e3).toBe(r3);
  });

  it('portfolioVaR 1-year',function() {
    var p3 = {
      'symbol1': { 'pct': 1, 'pnls': [1   ,1   ,1   ,1   ,1   ] },
      'symbol2': { 'pct': 1, 'pnls': [0.5 ,0.5 ,0.5 ,0.5 ,0.5 ] },
      'symbol3': { 'pct': 1, 'pnls': [0.75,0.75,0.75,0.75,0.75] },
    };
    var e3 = varCalc.portfolioVaR(95,p3,1);
    var r3 = varCalc.calculateVaR({history2:varCalc.pnls2prices(p3.symbol3.pnls)},95,1);
    expect(e3).toBe(r3);
  });

  it('pnls2prices',function() {
    var p1 = [1,1,1,1];
    var r1 = varCalc.pnls2prices(p1);
    expect(r1.length).toBe(5);
    expect(r1[0]).toBe(100);
    expect(r1[1]).toBe(200);
    expect(r1[2]).toBe(400);
    expect(r1[3]).toBe(800);
    expect(r1[4]).toBe(1600);
  });


});
