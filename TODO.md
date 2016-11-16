# HIGH PRIORITY
2016-11-15
* bug asset name/exchange not showing in portfolioshow

2016-10-31
* Interactive Chart API does not return any elements
 * https://github.com/markitondemand/DataApis/issues/45
* `$log.debug` and `$logProvider...` in `app/scripts/app.js` dont seem to work with enabled debug
* continue tests of getNav in `app/scripts/service/ffa.js` and `test/.../ffa.js`

2016-04-19
* how to add returns of unequal lengths?

2016-04-13
* get pct from mf for retrieve ffa portfolios
 * add pct0 field from mf and initialize pct = pct0
 * pct0 is non-editable, whereas pct is editable (like the manual)

# MEDIUM Priority
2016-07-11
* here are some R packages that calculate VaR
 * PerformanceAnalytics
  * https://cran.r-project.org/web/packages/PerformanceAnalytics/
  * http://rinfinance.com/RinFinance2009/presentations/PA%20Workshop%20Chi%20RFinance%202009-04.pdf
  * is a package for portfolio analysis in R
  * includes VaR as one of the functions
 * VaRes
  * https://cran.r-project.org/web/packages/VaRES/index.html
  * package specialized in lots of different calculations of VaR
  * very advanced mathematically
  * doesnt look like it calculates VaR for a portfolio
* fabric engine seems to have published a javascript library for VaR
 * [blog post](http://fabricengine.com/benchmark-node-js-value-at-risk-web-service/) referencing it
 * the gitub link to the web service is broken
 * I sent them an email asking how I can reach the code

2016-07-06
* varcalc has no concept of dates
 * the `nday` it does is actually an `npoints`
* for short positions, varcalc should use the right tail as VaR instead of the left tail
* check currencies (currently hardcoded USD)

2016-03-14
* changing VaR calculation method
 * method 1 (deprecating): sort asset returns in a portfolio to get the portfolio VaR
 * method 2: consider the dates at which returns happen and align their additions and weighting
  * this would give a lower VaR instead of just a weighted average of VaRs
  * due to unalignment of price drops between uncorrelated stocks
 * method 3: calculate standard deviation and instead of empirical distribution, use normal distribution + account for covariances

# Low Priority
2016-07-02
* set up travis CI
 * http://stackoverflow.com/questions/19255976/how-to-make-travis-execute-angular-tests-on-chrome-please-set-env-variable-chr#19416096
* integrate tarek list of feedback in email
 * add tab sandbox
 * average cost in security details
 * portfolio list: add prev eoy, eom, avg cost (in % and usd)
 * portfolio list: date of last price update
 * portfolio show: hide illiquid asset: illiquidity = extracted prices / total existing prices
 * export to excel
 * add asset from bbg
 * tab for documentation

2016-04-19
* Desirable features todo
 * 20% drop since inception
 * 10% of portfolio value as var limit
 * 20% of bank capital as var limit
 * display inception to date
 * add asset class (pie chart distribution)
 * FFA120

2016-03-07
* fix 'abort' for ffa retrieval

2016-03-06
* how to show in portfolioshow that dates of the security prices used
* assetadd show json format result
* GE listed on NYSE and BATS ... how to pass exchange to assetshow?

2016-03-03
* add NAV button for portfolios
* simplify postprocessing (function `treatChart`) after getting interactive chart data
* work on unit tests
* add ability to upload data to a server 
 * similar to dis-man upload to repo
* add link to list of securities?

