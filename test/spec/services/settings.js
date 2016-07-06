'use strict';

describe('Service: Settings', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Settings;
  beforeEach(inject(function (_Settings_) {
    Settings = _Settings_;
  }));

  it('should do something', function () {
    expect(!!Settings).toBe(true);
  });

  it('start date', function () {
    Settings.setEnd('2016-01-02');
    Settings.setLength(1,'year');
    expect(Settings.start()).toBe('2015-01-02');
    Settings.setLength(2,'year');
    expect(Settings.start()).toBe('2014-01-02');
  });

});
