'use strict';

describe('Service: Portfolios', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Portfolios;
  beforeEach(inject(function (_Portfolios_) {
    Portfolios = _Portfolios_;
  }));

  var ppp = {
    '1': {
      'id': '1',
      'src': 'mod',
      'name': 'portfolio 1',
      'assets': [
        { 'src': 'mod',
          'symbol': 'symbol 1'
        },
        { 'src': 'mod',
          'symbol': 'symbol 2'
        }
      ]
    }
  };

  it('set list np', function () {
    expect(!!Portfolios).toBe(true);
    expect(Portfolios.np()===0);
    Portfolios.set(ppp);
    expect(Portfolios.np()===1);
  });

  it('add del portfolio', function () {
    // add new portfolio
    var n0 = Portfolios.np();
    var pid1=Portfolios.add('portfolio 2','mod',[]);
    expect(Portfolios.np()===n0+1);
    // add existing
    var pid2 = Portfolios.add('portfolio 2','mod',[]);
    expect(pid1===pid2);
    expect(Portfolios.np()===n0+1);
    // del
    Portfolios.del(pid1);
    expect(Portfolios.np()===n0);
  });

  it('add rm asset', function () {
    var aaa1={src:'mod',lookup:{Symbol:'symbol1'}};
    // add new portfolio
    expect(Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,false).length===0);
    expect(Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,true).length===Portfolios.np());
    var pid=Portfolios.add('portfolio 2','mod',[]);
    Portfolios.addAsset(pid,aaa1);
    var p1 = Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,false);
    expect(p1.length===1);
    p1=p1[0];
    expect(Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,true).length===0);
    expect(p1.assets.length===1);
    expect(p1.assets[0].pct===undefined);
    aaa1.pct=10;
    Portfolios.assetPct(pid,aaa1);
    expect(p1.assets[0].pct===10);
  });

  it('update name', function () {
    var pid=Portfolios.add('portfolio 2','mod',[]);
    var p1=Portfolios.list()[pid];
    expect(p1.name==='portfolio 2');
    Portfolios.updateName(pid,'portfolio 3');
    expect(p1.name==='portfolio 3');
  });
 
});
