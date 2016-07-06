# the-var

This project allows a user to build a portfolio and calculate its VaR.

It will be published at http://shadiakiki1986.github.io/the-var/

The data comes from [markit on demand Apis v2](http://dev.markitondemand.com/MODApis/)

# Features

* unlimited portfolios
* unlimited assets
* asset VaR and portfolio VaR
* asset percentage of portfolio
* get portfolios from FFA backend if available
* edit portfolio name
* VaR: 95%, 99%, 1-day, 7-day

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

If it is not automatically loaded into the app,
add it to the `overrides` section in `bower.json`,
then run `bower update`
