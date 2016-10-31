'use strict';

describe('Service: varCalc', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  var hdl1 = [100, 200, 600, 2400, 12000, 72000, 504000, 4032000, 36288000, 362880000];

  // instantiate service
  var varCalc;
  beforeEach(inject(function (_varCalc_) {
    varCalc = _varCalc_;
  }));

  it('is', function () {
    expect(!!varCalc).toBe(true);
  });

  it('calculateVaR', function () {
    var p1 = { historyDateless: [1,1,1,1,1,1,1,1] };
    expect(varCalc.calculateVaR(p1,95,1)).toBe(0);
    var p2 = { historyDateless: [1,2,1,2,1,2,1,2,1] };
    expect(varCalc.calculateVaR(p2,95,1)).toBe(-0.5);
    expect(varCalc.calculateVaR(p2,15,1)).toBe(+1);
    var p3 = { historyDateless: [1,2,3,1,2,3,1,2,3,1,2,3,1] };
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
      'symbol1': { 'pct': 1, 'historyDateless': hdl1 },
      'symbol2': { 'pct': 1, 'historyDateless': hdl1 },
      'symbol3': { 'pct': 1, 'historyDateless': hdl1 },
    };
    var e1 = varCalc.portfolioVaR(95,p1,1);
    var r1 = varCalc.calculateVaR(p1.symbol1,95,1);
    expect(e1).toBe(r1);
  });

  it('portfolioVaR 3',function() {
    var p3 = {
      'symbol1': { 'pct': 1, 'pnls': [1   ,1   ,1   ,1   ,1   ] },
      'symbol2': { 'pct': 1, 'pnls': [0.5 ,0.5 ,0.5 ,0.5 ,0.5 ] },
      'symbol3': { 'pct': 1, 'pnls': [0.75,0.75,0.75,0.75,0.75] },
    };
    p3.symbol1.historyDateless=varCalc.pnls2prices(p3.symbol1.pnls);
    p3.symbol2.historyDateless=varCalc.pnls2prices(p3.symbol2.pnls);
    p3.symbol3.historyDateless=varCalc.pnls2prices(p3.symbol3.pnls);

    var e3 = varCalc.portfolioVaR(95,p3,1);
    var r3 = varCalc.calculateVaR(p3.symbol3,95,1);
    expect(e3).toBe(r3);
  });

  it('portfolioVaR 1-year',function() {
    var p3 = {
      'symbol1': { 'pct': 1, 'pnls': [1   ,1   ,1   ,1   ,1   ] },
      'symbol2': { 'pct': 1, 'pnls': [0.5 ,0.5 ,0.5 ,0.5 ,0.5 ] },
      'symbol3': { 'pct': 1, 'pnls': [0.75,0.75,0.75,0.75,0.75] },
    };
    p3.symbol1.historyDateless=varCalc.pnls2prices(p3.symbol1.pnls);
    p3.symbol2.historyDateless=varCalc.pnls2prices(p3.symbol2.pnls);
    p3.symbol3.historyDateless=varCalc.pnls2prices(p3.symbol3.pnls);

    var e3 = varCalc.portfolioVaR(95,p3,1);
    var r3 = varCalc.calculateVaR({historyDateless:varCalc.pnls2prices(p3.symbol3.pnls)},95,1);
    expect(e3).toBe(r3);
  });

  it('portfolioVaR single asset nday=5',function() {
    var p1 = { 'symbol1': { 'pct': 0.1 } };
    p1.symbol1.historyDateless = [100, 200, 600, 2400, 12000, 72000, 504000, 4032000, 36288000, 362880000];

    var nday = 1;

    // since normalizing percentages, and this is the only asset, then the portfolio var is equivalent to the asset var
    p1.symbol1.pct=0.1;
    var e1a = varCalc.portfolioVaR(95,p1,nday);
    var r1a = varCalc.calculateVaR(p1.symbol1,95,nday);
    expect(e1a).toBe(r1a);

    // since normalizing percentages, and this is the only asset, then the portfolio var is equivalent to the asset var
    p1.symbol1.pct=1;
    var e1b = varCalc.portfolioVaR(95,p1,nday);
    var r1b = varCalc.calculateVaR(p1.symbol1,95,nday);
    expect(e1b).toBe(r1b);

    // check that 5-day var of single asset = 5-day var of portfolio comprised of 1 asset
    //console.log(p1.symbol1.historyDateless);
    nday = 5;
    var e5 = varCalc.portfolioVaR(95,p1,nday);
    var r5 = varCalc.calculateVaR(p1.symbol1,95,nday);
    expect(e5).toBe(r5);
  });

  it('pnls2prices',function() {
    var p1 = [1,1,1,1];
    var r1 = varCalc.pnls2prices(p1);
    expect(r1.length).toBe(5);
    expect(r1).toEqual([100,200,400,800,1600]);
  });

  it('prices2pnls, nday 1',function() {
    var p1 = [1,2,1,1];
    var r1 = varCalc.prices2pnls(p1,1);
    expect(r1.length).toBe(3);
    expect(r1).toEqual([1,-0.5,0]);
  });

  it('pnls to prices to pnls, nday 1',function() {
    var p1 = [1,1,1,1];
    var r1 = varCalc.pnls2prices(p1);
    var p2 = varCalc.prices2pnls(r1,1);
    expect(p2).toEqual(p1);
  });

  it('prices2pnls, nday 2',function() {
    var p1 = [1,2,1,1,2];
    var r1 = varCalc.prices2pnls(p1,2);
    expect(r1.length).toBe(2);
    expect(r1).toEqual([0,1]);
  });

});
