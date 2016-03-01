// Still testing. Build with:
//   sudo npm install -g browserify
//   browserify testYF.js -o app/scripts/myYF2.js
// and then include a script tag in app/index.html referencing myYF2.js

var yahooFinance = require('yahoo-finance');

console.log("A");
  yahooFinance.snapshot({
    symbol: 'AAPL',
    fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
  }, function (err, snapshot) {
console.log("B");
    console.log(snapshot);
console.log("C");
    /*
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      lastTradeDate: '11/15/2013',
      lastTradePriceOnly: '524.88',
      dividendYield: '2.23',
      peRatio: '13.29'
    }
    */
  });
