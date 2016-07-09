# 2016-07-06
* varcalc has no concept of dates
 * the `nday` it does is actually an `npoints`
* for short positions, varcalc should use the right tail as VaR instead of the left tail
* check currencies (currently hardcoded USD)

# 2016-07-02
* set up travis CI
 * http://stackoverflow.com/questions/19255976/how-to-make-travis-execute-angular-tests-on-chrome-please-set-env-variable-chr#19416096
* integrate tarek list of feedback in email
 * add tab sandbox
 * average cost in security details
 * portfolio list: add prev eoy, eom, avg cost (in % and usd)
 * portfolio list: date of last price update
 * refresh all prices
 * portfolio show: hide illiquid asset: illiquidity = extracted prices / total existing prices
 * export to excel
 * add asset from bbg
 * tab for documentation

# 2016-04-19
* Desirable features todo
 * 20% drop since inception
 * 10% of portfolio value as var limit
 * 20% of bank capital as var limit
 * display inception to date
 * add asset class (pie chart distribution)
 * FFA120
* how to add returns of unequal lengths?

# 2016-04-13
* get pct from mf for retrieve ffa portfolios

# 2016-03-14
* add pct0 field from mf and initialize pct = pct0
 * pct0 is non-editable, whereas pct is editable (like the manual)
* changing VaR calculation method
 * method 1 (deprecating): sort asset returns in a portfolio to get the portfolio VaR
 * method 2: consider the dates at which returns happen and align their additions and weighting
  * this would give a lower VaR instead of just a weighted average of VaRs
  * due to unalignment of price drops between uncorrelated stocks
 * method 3: calculate standard deviation and instead of empirical distribution, use normal distribution + account for covariances
* nday var: portfolio of single stock having var different than the stock var

# 2016-03-07
* fix 'abort' for ffa retrieval

# 2016-03-06
* how to show in portfolioshow that dates of the security prices used
* add "clear all localstorage" somewhere
* assetadd show json format result
* refresh prices from portfolioshow
* GE listed on NYSE and BATS ... how to pass exchange to assetshow?

# 2016-03-03
* add NAV button for portfolios
* automatic refresh of prices
* simplify postprocessing after getting interactive chart data
* work on unit tests
* add ability to upload data to a server 
 * similar to dis-man upload to repo
* add link to list of securities?

