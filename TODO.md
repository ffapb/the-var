# 2016-03-03
* was unable to use "angular-local-storage" from service
 * reverting to explicitly making calls to localStorage
* ng-messages not working as expected
* split service Assets out of Portfolios
* add back buttons
* add NAV button for portfolios
* split out assetShow and simplify portfolioShow
* use assetShow in assetAdd
* automatic refresh of prices
* after async asset add, convert tr into rows
* in assetShow, add can assign asset to multiple portfolios?
* simplify postprocessing after getting interactive chart data
* work on unit tests
* add 95% var setting to user
* add 1-day or 7-day var setting to user
* add ability to upload data to a server 
 * similar to dis-man upload to repo
* add link to list of securities?

# 2016-03-01
* add grunt task to publish the app to github-pages by copying to the gh-pages branch
* add links to github from main page and perhaps even a facebook page
* add settings page with an endpoint for linked portfolios
 * this will require a 'sync' button
 * also add automatic detection that app is open in ffa and search for endpoint
