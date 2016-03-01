# 2016-03-01
* add search controller/route and integrate with [yahoo-finance](https://www.npmjs.com/package/yahoo-finance) npm package
 * started a `testYF.js` node file
 * when browserified and included in the app, I get a CORS block
* add add button after finding a ticker on yahoo finance
* add fetch historical prices
* add calculate volatility based on historical prices
* add grunt task to publish the app to github-pages by copying to the gh-pages branch
* add links to github from main page and perhaps even a facebook page
* add settings page with an endpoint that returns an array of yahoo finance tickers
 * this will require a 'sync' button
