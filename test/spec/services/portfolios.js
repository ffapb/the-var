'use strict';

describe('Service: Portfolios', function () {

  // fixtures
  var ppp = {
    '1': {
      'id': '1',
      'src': 'mod',
      'name': 'portfolio 1',
      'assets': [
        { 'src': 'src1',
          'symbol': 'symbol1'
        },
        { 'src': 'src1',
          'symbol': 'symbol2'
        }
      ]
    }
  };

  var aaa = {
    mod: {
      symbol1: { historyMeta:{ lastprice:  5 } },
      symbol2: { historyMeta:{ lastprice: 10 } }
    },
    src2: {
      symbol3: { price: 0 },
      symbol4: { price: 0 }
    }
  };

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Portfolios;
  beforeEach(inject(function (_Portfolios_, _Assets_) {
    Portfolios = _Portfolios_;

    // for the listAssets function used from the 'unallocated' test
    spyOn(_Assets_, 'list').and.callFake(function() {
      return aaa;
    });

  }));

  it('set list np', function () {
    Portfolios.clear();
    expect(!!Portfolios).toBe(true);
    expect(Portfolios.np()).toBe(0);
    Portfolios.set(ppp);
    expect(Portfolios.np()).toBe(1);
  });

  it('add del portfolio', function () {
    Portfolios.clear();
    // add new portfolio
    var n0 = Portfolios.np();
    var pid1=Portfolios.add('portfolio 2','mod',[]);
    expect(Portfolios.np()).toBe(n0+1);
    // add existing
    console.log('expect error: portfolio already contains');
    var pid2 = Portfolios.add('portfolio 2','mod',[]);
    expect(pid1).toBe(pid2);
    expect(Portfolios.np()).toBe(n0+1);
    // del
    Portfolios.del(pid1);
    expect(Portfolios.np()).toBe(n0);
  });

  it('add rm asset', function () {
    Portfolios.clear();

    var aaa1={src:'mod',lookup:{Symbol:'symbol1'}};

    // no portfolio holding asset
    var actual;
    actual = Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,false);
    expect(actual.length).toBe(0);
    actual = Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,true);
    expect(actual.length).toBe(Portfolios.np());

    // add new portfolio with asset
    console.log('Expect error: no portfolio value set');
    var pid=Portfolios.add('portfolio 2','mod',[]);
    Portfolios.addAsset(pid,aaa1);

    // expect found 1
    actual = Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,true);
    expect(actual.length).toBe(0);
    actual = Portfolios.holdingAsset(aaa1.src,aaa1.lookup.Symbol,false);
    expect(actual.length).toBe(1);

    // focus on found has only 1 asset
    actual=actual[0];
    expect(actual.assets.length).toBe(1);

    // since qty was undefined, expect pct = 0
    expect(actual.assets[0].pct).toBe(0);

    // after setting qty, expect pct to be set properly
    aaa1.qty=10;
    Portfolios.updateAsset(pid,aaa1);
    expect(actual.assets[0].pct).toBe(100);
  });

  it('update name', function () {
    Portfolios.clear();

    var pid=Portfolios.add('mod','portfolio 2',[]);
    var p1=Portfolios.list()[pid];
    expect(p1.name).toBe('portfolio 2');
    Portfolios.updateName(pid,'portfolio 3');
    expect(p1.name).toBe('portfolio 3');
  });
 
  it('unallocated', function () {
    expect(Portfolios.unallocated()).toBe(false);
    // start portfolio
    var pid=Portfolios.add('manual 2','portfolio 2',[]);
    // before setting cash, should be 100
    expect(Portfolios.unallocated(pid)).toBe(100);
    expect(Portfolios.list()[pid].value).toBe(0);
    // set cash
    Portfolios.updateCash(pid,200);
    expect(Portfolios.list()[pid].value).toBe(200);
    // add asset
    var a1 = {src:'mod',lookup:{Symbol:'symbol1'},qty:10};
    Portfolios.addAsset(pid,a1);
    // check unallocated
    expect(Portfolios.unallocated(pid)).toBe(80);
    expect(Portfolios.list()[pid].value).toBe(250);

    // add another asset and update cash
    var a2 = {src:'mod',lookup:{Symbol:'symbol2'},qty:10};
    Portfolios.addAsset(pid,a2);
    Portfolios.updateCash(pid,100);
    expect(Portfolios.unallocated(pid)).toBe(40);
    expect(Portfolios.list()[pid].value).toBe(250);

    // update qty and cash
    a2.qty=15;
    Portfolios.updateAsset(pid,a2);
    Portfolios.updateCash(pid,50);
    expect(Portfolios.unallocated(pid)).toBe(20);
    expect(Portfolios.list()[pid].value).toBe(250);
  });

});
