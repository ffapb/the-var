# the-var

[![Build Status](https://travis-ci.org/shadiakiki1986/the-var.svg?branch=master)](https://travis-ci.org/shadiakiki1986/the-var)

This project allows a user to build a portfolio and calculate its VaR.

It will be published at http://shadiakiki1986.github.io/the-var/

The data comes from [markit on demand Apis v2](http://dev.markitondemand.com/MODApis/)

# Features
Also check the [TODO list](TODO.md)
* unlimited portfolios
* unlimited assets
* asset VaR and portfolio VaR
* asset percentage of portfolio
* get portfolios from FFA backend if available
* VaR: 95%, 99%, 1-day, 1-week, 1-year
* set dates in settings and clear local data
* portfolio USD value
* refresh all prices button
* detailed prices/p&l plots or summary plot

# Similar apps
Similar applications/documentation exist online, but they had some limits:
* http://www.varcalculator.com/ : single stock, not portfolio
* http://www.investspy.com/calculator : limited to 3 securities
* https://gist.github.com/deenar/f97d517d3188fc7b5302 : just source code
* http://financetrain.com/value-at-risk-of-a-portfolio/ : just documentation
* https://www.portfolioscience.com/value-at-risk-calculation : excel api

# Logo
The logo is the VaR diagram posted on [wikipedia](https://en.wikipedia.org/wiki/File:VaR_diagram.JPG)

# Linking to custom endpoints
Place a file called `the-var-config.json` in the `app` folder.
Its structure should be as follows:
```json
{
  "endPoints": {
    "portfolios": "url/to/accounts/endpoint",
    "prices": "url/to/prices/endpoint"
  },
  "accounts": [
    { "base": "Lebanon", "a": "FFAI00" }
  ]
}
```

To test, copy the file in `app/test/the-var-config.json` to `app` and run `grunt serve`.
This will allow the `Fetch FFA portfolios/prices` buttons to be enabled and get the corresponding json data

# Development
## Under the hood
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

To add services/controllers/routes:
```bash
npm install -g grunt-cli bower yo generator-karma generator-angular
yo angular:service Settings
```

## Build

First, install grunt locally, as well as the npm dependencies and bower dependencies

    # update npm
    # http://blog.npmjs.org/post/85484771375/how-to-install-npm
    sudo npm install npm -g
    # http://stackoverflow.com/a/18114868/4126114
    sudo npm install grunt karma -g # --save-dev
    sudo npm install
    bower install

Then run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Publish to gh-pages
Commit and push, then `grunt build`, and finally run `grunt gh-pages`

## Add dependencies
Add a new package

```bower install angular-ui-chart --save```

or

```bower install angular-ui-chart#master --save```

If it is not automatically loaded into the app,
add it to the `overrides` section in `bower.json`,
then run `bower update`

# fixtures
to beautify html fixtures, run `npm -g install js-beautify` and `js-beautify file.html --type html`
