# the-var

This project allows a user to build a portfolio and calculate its VaR.

It will be published at http://shadiakiki1986.github.io/the-var/

The data comes from [markit on demand Apis v2](http://dev.markitondemand.com/MODApis/)

# Features

* unlimited portfolios
* unlimited assets
* asset VaR and portfolio VaR


# Similar apps
Similar applications/documentation exist online, but they had some limits:
* http://www.varcalculator.com/ : single stock, not portfolio
* http://www.investspy.com/calculator : limited to 3 securities
* https://gist.github.com/deenar/f97d517d3188fc7b5302 : just source code
* http://financetrain.com/value-at-risk-of-a-portfolio/ : just documentation
* https://www.portfolioscience.com/value-at-risk-calculation : excel api

# Logo
The logo is the VaR diagram posted on [wikipedia](https://en.wikipedia.org/wiki/File:VaR_diagram.JPG)

# Development
## Under the hood
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Publish to gh-pages
Commit and push, then `grunt build`, and finally run `grunt gh-pages`
