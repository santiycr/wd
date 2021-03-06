var configHelper, remoteWdConfig, should, wd;

wd = require('../common/wd-with-cov');

should = require('should');

configHelper = require('./config-helper');

var TIMEOUT = 30000;

remoteWdConfig = configHelper.getRemoteWdConfig();

describe("wd", function() {
  return describe("saucelabs", function() {
    return describe("browser init tests", function() {
      describe("default init", function() {
        var browser;
        after(function(done) {
          configHelper.jobPassed(browser.sessionID, done);
        });
        return it("should open a XP firefox browser", function(done) {
          this.timeout(TIMEOUT);
          browser = wd.remote(remoteWdConfig);
          browser.defaultCapabilities.should.eql({
            browserName: 'firefox',
            version: '',
            javascriptEnabled: true,
            platform: 'VISTA'
          });
          return browser.init(function(err) {
            should.not.exist(err);
            return browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal('firefox');
              capabilities.platform.should.equal('XP');
              return browser.quit(function(err) {
                should.not.exist(err);
                return done(null);
              });
            });
          });
        });
      });
      describe("browser.defaultCapabilities", function() {
        var browser;
        after(function(done) {
          configHelper.jobPassed(browser.sessionID, done);
        });
        return it("should open a LINUX chrome browser", function(done) {
          this.timeout(TIMEOUT);
          browser = wd.remote(remoteWdConfig);
          browser.defaultCapabilities.browserName = 'chrome';
          browser.defaultCapabilities.platform = 'LINUX';
          browser.defaultCapabilities.javascriptEnabled = false;
          browser.defaultCapabilities.name = 'browser init using defaultCapabilities';
          browser.defaultCapabilities.tags = ['wd', 'test'];
          browser.defaultCapabilities.should.eql({
            browserName: 'chrome',
            version: '',
            javascriptEnabled: false,
            platform: 'LINUX',
            name: 'browser init using defaultCapabilities',
            tags: ['wd', 'test']
          });
          return browser.init(function(err) {
            should.not.exist(err);
            return browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal('chrome');
              capabilities.platform.should.equal('LINUX');
              return browser.quit(function(err) {
                should.not.exist(err);
                return done(null);
              });
            });
          });
        });
      });
      describe("desired only", function() {
        var browser;
        after(function(done) {
          configHelper.jobPassed(browser.sessionID, done);
        });
        return it("should open a WINDOWS explorer browser", function(done) {
          this.timeout(TIMEOUT);
          browser = wd.remote(remoteWdConfig);
          browser.defaultCapabilities.should.eql({
            browserName: 'firefox',
            version: '',
            javascriptEnabled: true,
            platform: 'VISTA'
          });
          var desired = {
            browserName: 'iexplore',
            platform: 'Windows 2008',
            name: 'browser init using desired',
            tags: ['wd', 'test']
          };
          return browser.init(desired, function(err) {
            should.not.exist(err);
            return browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.include('explorer');
              capabilities.platform.should.equal('WINDOWS');
              return browser.quit(function(err) {
                should.not.exist(err);
                return done(null);
              });
            });
          });
        });
      });
      return describe("desired overiding defaultCapabilities", function() {
        var browser;
        after(function(done) {
          configHelper.jobPassed(browser.sessionID, done);
        });
        return it("should open a firefox browser", function(done) {
          this.timeout(TIMEOUT);
          browser = wd.remote(remoteWdConfig);
          browser.defaultCapabilities.browserName = 'chrome';
          browser.defaultCapabilities.name = 'browser init overide';
          browser.defaultCapabilities.tags = ['wd', 'test'];
          browser.defaultCapabilities.should.eql({
            browserName: 'chrome',
            version: '',
            javascriptEnabled: true,
            platform: 'VISTA',
            name: 'browser init overide',
            tags: ['wd', 'test']
          });
          return browser.init({
            browserName: 'firefox'
          }, function(err) {
            should.not.exist(err);
            return browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal('firefox');
              return browser.quit(function(err) {
                should.not.exist(err);
                return done(null);
              });
            });
          });
        });
      });
    });
  });
});
