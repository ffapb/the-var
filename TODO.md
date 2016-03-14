# 2016-03-14
* add pct0 field from mf and initialize pct = pct0
 * pct0 is non-editable, whereas pct is editable (like the manual)
* change VaR calculation method
 * I currently only sort asset returns in a portfolio to get the portfolio VaR
 * I should consider the dates at which returns happen and align their additions and weighting
  * this would give a lower VaR

# 2016-03-07
* fix 'abort' for ffa retrieval

# 2016-03-06
* how to show in portfolioshow that dates of the security prices used
* add "clear all localstorage" somewhere
* assetadd show json format result
* add asset percentage of portfolio
* add edit portfolio name
* refresh prices from portfolioshow
* GE listed on NYSE and BATS ... how to pass exchange to assetshow?

# 2016-03-03
* add NAV button for portfolios
* automatic refresh of prices
* simplify postprocessing after getting interactive chart data
* work on unit tests
* add 95% var setting to user
* add 1-day or 7-day var setting to user
* add ability to upload data to a server 
 * similar to dis-man upload to repo
* add link to list of securities?

# 2016-03-01
* add grunt task to publish the app to github-pages by copying to the gh-pages branch
* add link to a facebook page
* add settings page with an endpoint for linked portfolios
 * this will require a 'sync' button
 * also add automatic detection that app is open in ffa and search for endpoint