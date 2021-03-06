var CoffeeScript, Express, TIMEOUT_BASE, async, elementByCss, evalShouldEqual, executeCoffee, imageinfo, safeEvalShouldEqual, should, test, textShouldEqual, valueShouldEqual, wd;

CoffeeScript = require('coffee-script');

should = require('should');

async = require('async');

imageinfo = require('imageinfo');

Express = require('./express').Express;

wd = require('./wd-with-cov');

TIMEOUT_BASE = 1000;

if (process.env.GHOSTDRIVER_TEST) {
  TIMEOUT_BASE = 250;
}

evalShouldEqual = function(browser, formula, expected) {
  return function(done) {
    return browser["eval"](formula, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      return done(null);
    });
  };
};

safeEvalShouldEqual = function(browser, formula, expected) {
  return function(done) {
    return browser.safeEval(formula, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      return done(null);
    });
  };
};

executeCoffee = function(browser, script) {
  var scriptAsJs;
  scriptAsJs = CoffeeScript.compile(script, {
    bare: 'on'
  });
  return function(done) {
    return browser.execute(scriptAsJs, function(err) {
      should.not.exist(err);
      return done(null);
    });
  };
};

elementByCss = function(browser, env, css, name) {
  return function(done) {
    return browser.elementByCss(css, function(err, res) {
      should.not.exist(err);
      env[name] = res;
      return done(null);
    });
  };
};

textShouldEqual = function(browser, element, expected, done) {
  return browser.text(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    return done(null);
  });
};

valueShouldEqual = function(browser, element, expected, done) {
  return browser.getValue(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    return done(null);
  });
};

test = function(remoteWdConfig, desired) {
  var browser, elementFunctionTests, express;
  browser = null;
  express = new Express();
  before(function(done) {
    express.start();
    return done(null);
  });
  after(function(done) {
    express.stop();
    return done(null);
  });
  elementFunctionTests = function() {
    var _funcSuffix, _i, _len, _ref, _results;
    describe("element", function() {
      return it("should retrieve element", function(done) {
        return async.series([
          function(done) {
            return browser.element("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.element("name", "elementByName2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("elementOrNull", function() {
      return it("should retrieve element or return null", function(done) {
        return async.series([
          function(done) {
            return browser.elementOrNull("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementOrNull("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              (res === null).should.be.true;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("elementIfExists", function() {
      return it("should retrieve element or return undefined", function(done) {
        return async.series([
          function(done) {
            return browser.elementIfExists("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementIfExists("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              (res === undefined).should.be.true;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("hasElement", function() {
      return it("should check if element exist", function(done) {
        return async.series([
          function(done) {
            return browser.hasElement("name", "elementByName", function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              return done(null);
            });
          }, function(done) {
            return browser.hasElement("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("waitForElement", function() {
      return it("should wait for element", function(done) {
        this.timeout(10000);
        return async.series([
          executeCoffee(browser, "setTimeout ->\n  $('#waitForElement').append '<div class=\"child\">a waitForElement child</div>'\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
            return browser.elementByCss("#waitForElement .child", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }, function(done) {
            return browser.waitForElement("css selector", "#waitForElement .child", 2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              return done(err);
            });
          }, function(done) {
            return browser.waitForElement("css selector", "#wrongsel .child", 2 * TIMEOUT_BASE, function(err) {
              should.exist(err);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("waitForVisible", function() {
      return it("should wait until element is visible", function(done) {
        this.timeout(10000);
        return async.series([
          executeCoffee(browser, "$('#waitForVisible').append '<div class=\"child\">a waitForVisible child</div>'              \n$('#waitForVisible .child').hide()\nsetTimeout ->\n  $('#waitForVisible .child').show()\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
            return browser.elementByCss("#waitForVisible .child", function(err, res) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.waitForVisible("css selector", "#waitForVisible .child", 2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              return done(err);
            });
          }, function(done) {
            return browser.waitForVisible("css selector", "#wrongsel .child", 2 * TIMEOUT_BASE, function(err) {
              should.exist(err);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    describe("elements", function() {
      return it("should retrieve several elements", function(done) {
        return async.series([
          function(done) {
            return browser.elements("name", "elementsByName", function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              return done(null);
            });
          }, function(done) {
            return browser.elements("name", "elementsByName2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    _ref = ['ByClassName', 'ByCssSelector', 'ById', 'ByName', 'ByLinkText', 'ByPartialLinkText', 'ByTagName', 'ByXPath', 'ByCss'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _funcSuffix = _ref[_i];
      _results.push((function() {
        var elementFuncName, elementsFuncName, funcSuffix, hasElementFuncName, searchSeveralText, searchSeveralText2, searchText, searchText2, waitForElementFuncName, waitForVisibleFuncName;
        funcSuffix = _funcSuffix;
        elementFuncName = 'element' + funcSuffix;
        hasElementFuncName = 'hasElement' + funcSuffix;
        elementsFuncName = 'elements' + funcSuffix;
        waitForElementFuncName = 'waitForElement' + funcSuffix;
        waitForVisibleFuncName = 'waitForVisible' + funcSuffix;
        searchText = elementFuncName;
        if (searchText.match(/ByLinkText/)) {
          searchText = "click " + searchText;
        }
        if (searchText.match(/ByCss/)) {
          searchText = "." + searchText;
        }
        if (searchText.match(/ByXPath/)) {
          searchText = "//div[@id='elementByXPath']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText = "span";
        }
        searchText2 = searchText + '2';
        if (searchText.match(/ByXPath/)) {
          searchText2 = "//div[@id='elementByXPath2']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText2 = "span2";
        }
        searchSeveralText = searchText.replace('element', 'elements');
        searchSeveralText2 = searchText2.replace('element', 'elements');
        describe(elementFuncName, function() {
          return it("should retrieve element", function(done) {
            return async.series([
              function(done) {
                return browser[elementFuncName](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  return done(null);
                });
              }, function(done) {
                return browser[elementFuncName](searchText2, function(err, res) {
                  should.exist(err);
                  err.status.should.equal(7);
                  return done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        describe( elementFuncName + "OrNull", function() {
          return it("should retrieve element or null", function(done) {
            return async.series([
              function(done) {
                return browser[elementFuncName + 'OrNull'](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  return done(null);
                });
              }, function(done) {
                return browser[elementFuncName + 'OrNull'](searchText2, function(err, res) {
                  should.not.exist(err);
                  (res === null).should.be.true;
                  return done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        describe(elementFuncName + "IfExists", function() {
          return it("should retrieve element or undefined", function(done) {
            return async.series([
              function(done) {
                return browser[elementFuncName + 'IfExists'](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  return done(null);
                });
              }, function(done) {
                return browser[elementFuncName + 'IfExists'](searchText2, function(err, res) {
                  should.not.exist(err);
                  (res === undefined).should.be.true;
                  return done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        describe(hasElementFuncName, function() {
          return it("should check if element exists", function(done) {
            return async.series([
              function(done) {
                return browser[hasElementFuncName](searchText, function(err, res) {
                  should.not.exist(err);
                  res.should.be.true;
                  return done(null);
                });
              }, function(done) {
                return browser[hasElementFuncName](searchText2, function(err, res) {
                  should.not.exist(err);
                  res.should.be.false;
                  return done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        describe(waitForElementFuncName, function() {
          return it("should wait for element (" + funcSuffix + ")", function(done) {
            var childHtml, searchChild;
            this.timeout(10000);
            childHtml = "<div class='child child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            if (funcSuffix.match(/ById/)) {
              childHtml = "<div class='child' id='child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByName/)) {
              childHtml = "<div class='child' name='child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByLinkText/)) {
              childHtml = "<a class='child'>child_" + waitForElementFuncName + "</a>";
            }
            if (funcSuffix.match(/ByPartialLinkText/)) {
              childHtml = "<a class='child'>hello child_" + waitForElementFuncName + "</a>";
            }
            if (funcSuffix.match(/ByTagName/)) {
              childHtml = "<hr class='child'>";
            }
            searchChild = "child_" + waitForElementFuncName;
            if (funcSuffix.match(/ByCss/)) {
              searchChild = "." + searchChild;
            }
            if (funcSuffix.match(/ByTagName/)) {
              searchChild = "hr";
            }
            if (funcSuffix.match(/ByXPath/)) {
              searchChild = "//div[@class='child child_" + waitForElementFuncName + "']";
            }
            return async.series([
              executeCoffee(browser, "$('hr').remove()                \nsetTimeout ->\n  $('#" + waitForElementFuncName + "').append \"" + childHtml + "\"\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
                return browser[elementFuncName](searchChild, function(err, res) {
                  should.exist(err);
                  err.status.should.equal(7);
                  return done(null);
                });
              }, function(done) {
                return browser[waitForElementFuncName](searchChild, 2 * TIMEOUT_BASE, function(err) {
                  should.not.exist(err);
                  return done(err);
                });
              }, function(done) {
                if (funcSuffix === 'ByClassName') {
                  browser[waitForElementFuncName]("__wrongsel", 2 * TIMEOUT_BASE, function(err) {
                    should.exist(err);
                    return done(null);
                  });
                } else {
                  done(null);
                }
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        describe(waitForVisibleFuncName, function() {
          return it("should wait until element is visible", function(done) {
            var childHtml, searchChild;
            this.timeout(10000);
            childHtml = "<div class='child child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            if (funcSuffix.match(/ById/)) {
              childHtml = "<div class='child' id='child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByName/)) {
              childHtml = "<div class='child' name='child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByLinkText/)) {
              childHtml = "<a class='child'>child_" + waitForVisibleFuncName + "</a>";
            }
            if (funcSuffix.match(/ByPartialLinkText/)) {
              childHtml = "<a class='child'>hello child_" + waitForVisibleFuncName + "</a>";
            }
            if (funcSuffix.match(/ByTagName/)) {
              childHtml = "<hr class='child'>";
            }
            searchChild = "child_" + waitForVisibleFuncName;
            if (funcSuffix.match(/ByCss/)) {
              searchChild = "." + searchChild;
            }
            if (funcSuffix.match(/ByTagName/)) {
              searchChild = "hr";
            }
            if (funcSuffix.match(/ByXPath/)) {
              searchChild = "//div[@class='child child_" + waitForVisibleFuncName + "']";
            }
            return async.series([
              executeCoffee(browser, "$('hr').remove()\n$('#" + waitForVisibleFuncName + "').append \"" + childHtml + "\"\n$('#" + waitForVisibleFuncName + " .child').hide()\nsetTimeout ->\n  $('#" + waitForVisibleFuncName + " .child').show()\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
                if (funcSuffix !== 'ByLinkText' && funcSuffix !== 'ByPartialLinkText') {
                  browser[elementFuncName](searchChild, function(err, res) {
                    should.not.exist(err);
                    return done(null);
                  });
                } else {
                  done(null);
                }
              }, function(done) {
                return browser[waitForVisibleFuncName](searchChild, 2 * TIMEOUT_BASE, function(err) {
                  should.not.exist(err);
                  return done(err);
                });
              }, function(done) {
                if (funcSuffix === 'ByClassName') {
                  browser[waitForVisibleFuncName]("__wrongsel", 2 * TIMEOUT_BASE, function(err) {
                    should.exist(err);
                    return done(null);
                  });
                } else {
                  done(null);
                }
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
        return describe(elementsFuncName, function() {
          return it("should retrieve several elements", function(done) {
            return async.series([
              function(done) {
                return browser[elementsFuncName](searchSeveralText, function(err, res) {
                  should.not.exist(err);
                  if (elementsFuncName.match(/ById/)) {
                    res.should.have.length(1);
                  } else if (elementsFuncName.match(/ByTagName/)) {
                    (res.length > 1).should.be.true;
                  } else {
                    res.should.have.length(3);
                  }
                  return done(null);
                });
              }, function(done) {
                return browser[elementsFuncName](searchSeveralText2, function(err, res) {
                  should.not.exist(err);
                  res.should.eql([]);
                  return done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              return done(null);
            });
          });
        });
      })());
    }
    return _results;
  };
  describe("wd.remote<COMP>", function() {
    return it("should create browser object", function(done) {
      browser = wd.remote(remoteWdConfig);
      if (!process.env.WD_COV) {
        browser.on("status", function(info) {
          return console.log("\u001b[36m%s\u001b[0m", info);
        });
        browser.on("command", function(meth, path) {
          return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
      }
      return done(null);
    });
  });
  describe("status", function() {
    return it("should retrieve selenium server status", function(done) {
      return browser.status(function(err, status) {
        should.not.exist(err);
        should.exist(status);
        return done(null);
      });
    });
  });
  describe("sessions", function() {
    return it("should retrieve selenium server sessions", function(done) {
      return browser.sessions(function(err, sessions) {
        should.not.exist(err);
        should.exist(sessions);
        return done(null);
      });
    });
  });
  describe("init<COMP>", function() {
    return it("should initialize browser and open browser window", function(done) {
      this.timeout(20000);
      return browser.init(desired, function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("sessionCapabilities", function() {
    return it("should retrieve the session capabilities", function(done) {
      return browser.sessionCapabilities(function(err, capabilities) {
        should.not.exist(err);
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        should.exist(capabilities.platform);
        return done(null);
      });
    });
  });
  describe("altSessionCapabilities", function() {
    return it("should retrieve the session capabilities using alt method", function(done) {
      return browser.altSessionCapabilities(function(err, capabilities) {
        should.not.exist(err);
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        should.exist(capabilities.platform);
        return done(null);
      });
    });
  });
  describe("get<COMP>", function() {
    return it("should navigate to the test page", function(done) {
      this.timeout(20000);
      return browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  if ((desired? desired.browserName : undefined) !== 'chrome') {
    // would do with better test, but can't be bothered
    // not working on chrome
    describe("setPageLoadTimeout", function() {
      return it("should set the page load timeout, test get, and unset it", function(done) {
        this.timeout(10000);
        return async.series([
          function(done) {
            return browser.setPageLoadTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.setPageLoadTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            var defaultTimeout;
            defaultTimeout = (desired && (desired.browserName === 'firefox'))? -1 : 10000;
            return browser.setPageLoadTimeout(defaultTimeout, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  }
  describe("refresh", function() {
    return it("should refresh page", function(done) {
      this.timeout(10000);
      return browser.refresh(function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("back forward", function() {
    return it("urls should be correct when navigating back/forward", function(done) {
      this.timeout(45000);
      return async.series([
        function(done) {
          var _this = this;
          return setTimeout(function() {
            return browser.get("http://127.0.0.1:8181/test-page.html?p=2", function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, 1000);
        }, function(done) {
          return browser.url(function(err, url) {
            should.not.exist(err);
            url.should.include("?p=2");
            return done(null);
          });
        }, function(done) {
          return browser.back(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.url(function(err, url) {
            should.not.exist(err);
            url.should.not.include("?p=2");
            return done(null);
          });
        }, function(done) {
          return browser.forward(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.url(function(err, url) {
            should.not.exist(err);
            url.should.include("?p=2");
            return done(null);
          });
        }, function(done) {
          return browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
            should.not.exist(err);
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("eval", function() {
    it("should correctly evaluate various formulas", function(done) {
      return async.series([evalShouldEqual(browser, "1+2", 3), evalShouldEqual(browser, "document.title", "TEST PAGE"), evalShouldEqual(browser, "$('#eval').length", 1), evalShouldEqual(browser, "$('#eval li').length", 2)], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
    return describe("safeEval", function() {
      return it("should correctly evaluate (with safeEval) various formulas", function(done) {
        return async.series([
          safeEvalShouldEqual(browser, "1+2", 3), safeEvalShouldEqual(browser, "document.title", "TEST PAGE"), safeEvalShouldEqual(browser, "$('#eval').length", 1), safeEvalShouldEqual(browser, "$('#eval li').length", 2), function(done) {
            return browser.safeEval('wrong formula +', function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("execute (no args)", function() {
    return it("should execute script", function(done) {
      return async.series([
        function(done) {
          return browser.execute("window.wd_sync_execute_test = 'It worked!'", function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked!')
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("execute (with args)", function() {
    return it("should execute script", function(done) {
      var jsScript;
      jsScript = 'var a = arguments[0], b = arguments[1];\nwindow.wd_sync_execute_test = \'It worked! \' + (a+b)';
      return async.series([
        function(done) {
          return browser.execute(jsScript, [6, 4], function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked! 10')
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("safeExecute (no args)", function() {
    return it("should execute script (with safeExecute)", function(done) {
      return async.series([
        function(done) {
          return browser.safeExecute("window.wd_sync_execute_test = 'It worked!'", function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked!'), function(done) {
          return browser.safeExecute("invalid-code> here", function(err) {
            should.exist(err);
            (err instanceof Error).should.be.true;
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("safeExecute (with args)", function() {
    return it("should execute script (with safeExecute)", function(done) {
      var jsScript;
      jsScript = 'var a = arguments[0], b = arguments[1];\nwindow.wd_sync_execute_test = \'It worked! \' + (a+b)';
      return async.series([
        function(done) {
          return browser.safeExecute(jsScript, [6, 4], function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked! 10'), function(done) {
          return browser.safeExecute("invalid-code> here", [6, 4], function(err) {
            should.exist(err);
            (err instanceof Error).should.be.true;
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("executeAsync (no args)", function() {
    return it("should execute async script", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      return browser.executeAsync(scriptAsJs, function(err, res) {
        should.not.exist(err);
        res.should.equal("OK");
        return done(null);
      });
    });
  });
  describe("executeAsync (with args)", function() {
    it("should execute async script", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[a,b,done] = arguments\ndone(\"OK \" + (a+b))              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      return browser.executeAsync(scriptAsJs, [10, 5], function(err, res) {
        should.not.exist(err);
        res.should.equal("OK 15");
        return done(null);
      });
    });
    describe("safeExecuteAsync (no args)", function() {
      return it("should execute async script (using safeExecuteAsync)", function(done) {
        return async.series([
          function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            return browser.safeExecuteAsync(scriptAsJs, function(err, res) {
              should.not.exist(err);
              res.should.equal("OK");
              return done(null);
            });
          }, function(done) {
            return browser.safeExecuteAsync("123 invalid<script", function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
    return describe("safeExecuteAsync (with args)", function() {
      return it("should execute async script (using safeExecuteAsync)", function(done) {
        return async.series([
          function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[a,b,done] = arguments\ndone(\"OK \" + (a+b))              ";
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            return browser.safeExecuteAsync(scriptAsJs, [10, 5], function(err, res) {
              should.not.exist(err);
              res.should.equal("OK 15");
              return done(null);
            });
          }, function(done) {
            return browser.safeExecuteAsync("123 invalid<script", [10, 5], function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("setImplicitWaitTimeout", function() {
    it("should set the wait timeout and implicit wait timeout, " + "run scripts to check functionality, " + "and unset them", function(done) {
      this.timeout(5000);
      return async.series([
        function(done) {
          return browser.setImplicitWaitTimeout(0, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, executeCoffee(browser, "setTimeout ->\n  $('#setWaitTimeout').html '<div class=\"child\">a child</div>'\n, " + TIMEOUT_BASE), function(done) {
          return browser.elementByCss("#setWaitTimeout .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            return done(null);
          });
        }, function(done) {
          return browser.setImplicitWaitTimeout(2 * TIMEOUT_BASE, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.elementByCss("#setWaitTimeout .child", function(err, res) {
            should.not.exist(err);
            should.exist(res);
            return done(null);
          });
        }, function(done) {
          return browser.setImplicitWaitTimeout(0, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
    return describe("setAsyncScriptTimeout", function() {
      return it("should set the async script timeout, " + "run scripts to check functionality, " + "and unset it", function(done) {
        this.timeout(5000);
        return async.series([
          function(done) {
            return browser.setAsyncScriptTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, " + (2 * TIMEOUT_BASE);
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            return browser.executeAsync(scriptAsJs, function(err, res) {
              should.exist(err);
              err.status.should.equal(28);
              return done(null);
            });
          }, function(done) {
            return browser.setAsyncScriptTimeout(2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, " + (TIMEOUT_BASE / 2);
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            return browser.executeAsync(scriptAsJs, function(err, res) {
              should.not.exist(err);
              res.should.equal("OK");
              return done(null);
            });
          }, function(done) {
            return browser.setAsyncScriptTimeout(0, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  elementFunctionTests();
  describe("getAttribute", function() {
    return it("should get correct attribute value", function(done) {
      return browser.elementById("getAttribute", function(err, testDiv) {
        should.not.exist(err);
        should.exist(testDiv);
        return async.series([
          function(done) {
            return browser.getAttribute(testDiv, "weather", function(err, res) {
              should.not.exist(err);
              res.should.equal("sunny");
              return done(null);
            });
          }, function(done) {
            return browser.getAttribute(testDiv, "timezone", function(err, res) {
              should.not.exist(err);
              should.not.exist(res);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("getTagName", function() {
    return it("should get correct tag name", function(done) {
      return async.series([
        function(done) {
          return browser.elementByCss("#getTagName input", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.getTagName(field, function(err, res) {
              should.not.exist(err);
              res.should.equal("input");
              return done(null);
            });
          });
        }, function(done) {
          return browser.elementByCss("#getTagName a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.getTagName(field, function(err, res) {
              should.not.exist(err);
              res.should.equal("a");
              return done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("getValue (input)", function() {
    return it("should get correct value", function(done) {
      return browser.elementByCss("#getValue input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        return browser.getValue(inputField, function(err, res) {
          should.not.exist(err);
          res.should.equal("Hello getValueTest!");
          return done(null);
        });
      });
    });
  });
  describe("getValue (textarea)", function() {
    return it("should get correct value", function(done) {
      return browser.elementByCss("#getValue textarea", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        return browser.getValue(inputField, function(err, res) {
          should.not.exist(err);
          res.should.equal("Hello getValueTest2!");
          return done(null);
        });
      });
    });
  });
  describe("isDisplayed", function() {
    return it("should check if elemnt is displayed", function(done) {
      return async.series([
        function(done) {
          return browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.isDisplayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              return done(null);
            });
          });
        }, function(done) {
          return browser.elementByCss("#isDisplayed .hidden", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.isDisplayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              return done(null);
            });
          });
        }, function(done) {
          return browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.displayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              return done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("getComputedCss", function() {
    return it("should retrieve the element computed css", function(done) {
      return async.series([
        function(done) {
          return browser.elementByCss("#getComputedCss a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.getComputedCss(field, 'color', function(err, res) {
              should.not.exist(err);
              should.exist(res);
              res.length.should.be.above(0);
              return done(null);
            });
          });
        }, function(done) {
          return browser.elementByCss("#getComputedCss a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.getComputedCSS(field, 'color', function(err, res) {
              should.not.exist(err);
              should.exist(res);
              res.length.should.be.above(0);
              return done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("clickElement", function() {
    return it("element should be clicked", function(done) {
      return browser.elementByCss("#clickElement a", function(err, anchor) {
        should.not.exist(err);
        should.exist(anchor);
        return async.series([
          executeCoffee(browser, 'jQuery ->\n  a = $(\'#clickElement a\')\n  a.click ->\n    a.html \'clicked\'\n    false              '), function(done) {
            return textShouldEqual(browser, anchor, "not clicked", done);
          }, function(done) {
            return browser.clickElement(anchor, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, anchor, "clicked", done);
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("moveTo", function() {
    return it("should move to correct element", function(done) {
      var env, _textShouldEqual;
      env = {};
      _textShouldEqual = textShouldEqual;
      // hover does not trigger in phantomjs, so disabling test
      textShouldEqual = function(browser, element, expected, done) {
        if (!process.env.GHOSTDRIVER_TEST) {
          _textShouldEqual(browser, element, expected, done);
        } else {
          done(null);
        }
      };
      return async.series([
        elementByCss(browser, env, "#moveTo .a1", 'a1'), elementByCss(browser, env, "#moveTo .a2", 'a2'), elementByCss(browser, env, "#moveTo .current", 'current'), function(done) {
          return textShouldEqual(browser, env.current, '', done);
        }, executeCoffee(browser, 'jQuery ->\n  a1 = $(\'#moveTo .a1\')\n  a2 = $(\'#moveTo .a2\')\n  current = $(\'#moveTo .current\')\n  a1.hover ->\n    current.html \'a1\'\n  a2.hover ->\n    current.html \'a2\''), function(done) {
          return textShouldEqual(browser, env.current, '', done);
        }, function(done) {
          return browser.moveTo(env.a1, 5, 5, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.current, 'a1', done);
        }, function(done) {
          return done(null);
        }, function(done) {
          return browser.moveTo(env.a2, void 0, void 0, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.current, 'a2', done);
        }, function(done) {
          return browser.moveTo(env.a1, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.current, 'a1', done);
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("buttonDown / buttonUp", function() {
    return it("should press/unpress button", function(done) {
      var env;
      env = {};
      return async.series([
        elementByCss(browser, env, "#mouseButton a", 'a'), elementByCss(browser, env, "#mouseButton div", 'resDiv'), executeCoffee(browser, 'jQuery ->\n  a = $(\'#mouseButton a\')\n  resDiv = $(\'#mouseButton div\')\n  a.mousedown ->\n    resDiv.html \'button down\'\n  a.mouseup ->\n    resDiv.html \'button up\''), function(done) {
          return textShouldEqual(browser, env.resDiv, '', done);
        }, function(done) {
          return browser.moveTo(env.a, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.buttonDown(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.resDiv, 'button down', done);
        }, function(done) {
          return browser.buttonUp(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.resDiv, 'button up', done);
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("click", function() {
    return it("should move to then click element", function(done) {
      var env;
      env = {};
      return async.series([
        elementByCss(browser, env, "#click .numOfClicks", 'numOfClicksDiv'), elementByCss(browser, env, "#click .buttonNumber", 'buttonNumberDiv'), executeCoffee(browser, 'jQuery ->\n  window.numOfClick = 0\n  numOfClicksDiv = $(\'#click .numOfClicks\')\n  buttonNumberDiv = $(\'#click .buttonNumber\')\n  numOfClicksDiv.mousedown (eventObj) ->\n    button = eventObj.button\n    button = \'default\' unless button?\n    window.numOfClick = window.numOfClick + 1\n    numOfClicksDiv.html "clicked #{window.numOfClick}"\n    buttonNumberDiv.html "#{button}"    \n    false                                         '), function(done) {
          return textShouldEqual(browser, env.numOfClicksDiv, "not clicked", done);
        }, function(done) {
          return browser.moveTo(env.numOfClicksDiv, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.click(0, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.numOfClicksDiv, "clicked 1", done);
        }, function(done) {
          return textShouldEqual(browser, env.buttonNumberDiv, "0", done);
        }, function(done) {
          return browser.moveTo(env.numOfClicksDiv, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.click(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.numOfClicksDiv, "clicked 2", done);
        }, function(done) {
          return textShouldEqual(browser, env.buttonNumberDiv, "0", done);
        }
        // not testing right click, cause not sure how to dismiss the right
        // click menu in chrome and firefox
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("doubleclick", function() {
    return it("should move to then doubleclick element", function(done) {
      var env;
      env = {};
      return async.series([
        elementByCss(browser, env, "#doubleclick div", 'div'), executeCoffee(browser, 'jQuery ->\n  div = $(\'#doubleclick div\')\n  div.dblclick ->\n    div.html \'doubleclicked\'                                 '), function(done) {
          return textShouldEqual(browser, env.div, "not clicked", done);
        }, function(done) {
          return browser.moveTo(env.div, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.doubleclick(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return textShouldEqual(browser, env.div, "doubleclicked", done);
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("type", function() {
    return it("should correctly input text", function(done) {
      var altKey, nullKey;
      altKey = wd.SPECIAL_KEYS.Alt;
      nullKey = wd.SPECIAL_KEYS.NULL;
      return browser.elementByCss("#type input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        return async.series([
          function(done) {
            return valueShouldEqual(browser, inputField, "", done);
          }, function(done) {
            return browser.type(inputField, "Hello", function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello", done);
          }, function(done) {
            return browser.type(inputField, [altKey, nullKey, " World"], function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello World", done);
          }, function(done) {
            return browser.type(inputField, "\n", function(err) {
              // no effect
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello World", done);
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("keys", function() {
    return it("should press keys to input text", function(done) {
      var altKey, nullKey;
      altKey = wd.SPECIAL_KEYS.Alt;
      nullKey = wd.SPECIAL_KEYS.NULL;
      return browser.elementByCss("#keys input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        return async.series([
          function(done) {
            return valueShouldEqual(browser, inputField, "", done);
          }, function(done) {
            return browser.clickElement(inputField, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.keys("Hello", function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello", done);
          }, function(done) {
            return browser.keys([altKey, nullKey, " World"], function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello World", done);
          }, function(done) {
            return browser.keys("\n", function(err) {
              // no effect
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "Hello World", done);
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("clear", function() {
    return it("should clear input field", function(done) {
      return browser.elementByCss("#clear input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        return async.series([
          function(done) {
            return valueShouldEqual(browser, inputField, "not cleared", done);
          }, function(done) {
            return browser.clear(inputField, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return valueShouldEqual(browser, inputField, "", done);
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("title", function() {
    return it("should retrieve title", function(done) {
      return browser.title(function(err, title) {
        should.not.exist(err);
        title.should.equal("TEST PAGE");
        return done(null);
      });
    });
  });
  describe("text (passing element)", function() {
    return it("should retrieve text", function(done) {
      return browser.elementByCss("#text", function(err, textDiv) {
        should.not.exist(err);
        should.exist(textDiv);
        return browser.text(textDiv, function(err, res) {
          should.not.exist(err);
          res.should.include("text content");
          res.should.not.include("div");
          return done(null);
        });
      });
    });
  });
  describe("text (passing undefined)", function() {
    return it("should retrieve text", function(done) {
      return browser.text(undefined, function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        return done(null);
      });
    });
  });
  describe("text (passing body)", function() {
    return it("should retrieve text", function(done) {
      return browser.text('body', function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        return done(null);
      });
    });
  });
  describe("text (passing null)", function() {
    return it("should retrieve text", function(done) {
      return browser.text(null, function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        return done(null);
      });
    });
  });
  describe("textPresent", function() {
    return it("should check if text is present", function(done) {
      return browser.elementByCss("#textPresent", function(err, textDiv) {
        should.not.exist(err);
        should.exist(textDiv);
        return async.series([
          function(done) {
            return browser.textPresent('sunny', textDiv, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              return done(null);
            });
          }, function(done) {
            return browser.textPresent('raining', textDiv, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  });
  describe("getLocation (browser)", function() {
    return it("should retrieve x and y locations", function(done) {
      return browser.elementByCss("#elementLocation", function(err, locationDiv) {
        should.not.exist(err);
        should.exist(locationDiv);
        return browser.getLocation(locationDiv, function(err, location) {
          should.not.exist(err);
          should.exist(location.x);
          should.exist(location.y);
          return done(null);
        });
      });
    });
  });
  describe("getLocation (element)", function() {
    return it("should retrieve x and y locations", function(done) {
      return browser.elementByCss("#elementLocation", function(err, locationDiv) {
        should.not.exist(err);
        should.exist(locationDiv);
        return locationDiv.getLocation(function(err, location) {
          should.not.exist(err);
          should.exist(location.x);
          should.exist(location.y);
          return done(null);
        });
      });
    });
  });
  describe("getSize (element)", function() {
    return it("should retrieve height and width", function(done) {
      return browser.elementByCss("#elementSize", function(err, sizeDiv) {
        should.not.exist(err);
        should.exist(sizeDiv);
        return sizeDiv.getSize(function(err, size) {
          should.not.exist(err);
          should.exist(size.height);
          should.exist(size.height);
          return done(null);
        });
      });
    });
  });
  describe("getSize (browser)", function() {
    return it("should retrieve height and width", function(done) {
      return browser.elementByCss("#elementSize", function(err, sizeDiv) {
        should.not.exist(err);
        should.exist(sizeDiv);
        return browser.getSize(sizeDiv, function(err, size) {
          should.not.exist(err);
          should.exist(size.width);
          should.exist(size.height);
          return done(null);
        });
      });
    });
  });
  // not yet implemented in ghostdriver
  if (process.env.GHOSTDRIVER_TEST === null) {
    describe("acceptAlert", function() {
      return it("should accept alert", function(done) {
        return browser.elementByCss("#acceptAlert a", function(err, a) {
          should.not.exist(err);
          should.exist(a);
          return async.series([
            executeCoffee(browser, "jQuery ->            \n  a = $('#acceptAlert a')\n  a.click ->\n    alert \"coffee is running out\"\n    false"), function(done) {
              return browser.clickElement(a, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return browser.acceptAlert(function(err) {
                should.not.exist(err);
                return done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            return done(null);
          });
        });
      });
    });
  }
  // not yet implemented in ghostdriver
  if (!process.env.GHOSTDRIVER_TEST) {
    describe("dismissAlert", function() {
      return it("should dismiss alert", function(done) {
        return browser.elementByCss("#dismissAlert a", function(err, a) {
          var capabilities;
          should.not.exist(err);
          should.exist(a);
          capabilities = null;
          return async.series([
            function(done) {
              return browser.sessionCapabilities(function(err, res) {
                should.not.exist(err);
                capabilities = res;
                return done(null);
              });
            }, executeCoffee(browser, "jQuery ->                        \n  a = $('#dismissAlert a')\n  a.click ->\n    alert \"coffee is running out\"\n    false"), function(done) {
              return browser.clickElement(a, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              // known bug on chrome/mac, need to use acceptAlert instead
              if (!(capabilities.platform === 'MAC' && capabilities.browserName === 'chrome')) {
                browser.dismissAlert(function(err) {
                  should.not.exist(err);
                  return done(null);
                });
              } else {
                browser.acceptAlert(function(err) {
                  should.not.exist(err);
                  return done(null);
                });
              }
            }
          ], function(err) {
            should.not.exist(err);
            return done(null);
          });
        });
      });
    });
  }
  describe("active", function() {
    return it("should check if element is active", function(done) {
      var env;
      env = {};
      return async.series([
        elementByCss(browser, env, "#active .i1", 'i1'), elementByCss(browser, env, "#active .i2", 'i2'), function(done) {
          return browser.clickElement(env.i1, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.active(function(err, res) {
            var k, _i, _len;
            should.not.exist(err);
            for (_i = 0, _len = res.length; _i < _len; _i++) {
              k = res[_i];
              res.should.equal(env.i1[k]);
              env.i1.should.have.property(k);
            }
            return done(null);
          });
        }, function(done) {
          return browser.clickElement(env.i2, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.active(function(err, res) {
            var k, _i, _len;
            should.not.exist(err);
            for (_i = 0, _len = res.length; _i < _len; _i++) {
              k = res[_i];
              res.should.equal(env.i2[k]);
              env.i2.should.have.property(k);
            }
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("url", function() {
    return it("should retrieve url", function(done) {
      return browser.url(function(err, res) {
        res.should.include("test-page.html");
        res.should.include("http://");
        return done(null);
      });
    });
  });
  describe("takeScreenshot", function() {
    return it("should take a screenshot", function(done) {
      return browser.takeScreenshot(function(err, res) {
        var data, img;
        should.not.exist(err);
        data = new Buffer(res, 'base64');
        img = imageinfo(data);
        img.should.not.be.false;
        img.format.should.equal('PNG');
        img.width.should.not.equal(0);
        img.height.should.not.equal(0);
        return done(null);
      });
    });
  });
  describe("allCookies / setCookies / deleteAllCookies / deleteCookie", function() {
    return it("cookies should work", function(done) {
      return async.series([
        function(done) {
          return browser.deleteAllCookies(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.eql([]);
            return done(null);
          });
        }, function(done) {
          return browser.setCookie({
            name: 'fruit1',
            value: 'apple'
          }, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(1);
            (res.filter(function(c) {
              return c.name === 'fruit1' && c.value === 'apple';
            })).should.have.length(1);
            return done(null);
          });
        }, function(done) {
          return browser.setCookie({
            name: 'fruit2',
            value: 'pear'
          }, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(2);
            (res.filter(function(c) {
              return c.name === 'fruit2' && c.value === 'pear';
            })).should.have.length(1);
            return done(null);
          });
        }, function(done) {
          return browser.setCookie({
            name: 'fruit3',
            value: 'orange'
          }, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(3);
            return done(null);
          });
        }, function(done) {
          return browser.deleteCookie('fruit2', function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(2);
            (res.filter(function(c) {
              return c.name === 'fruit2' && c.value === 'pear';
            })).should.have.length(0);
            return done(null);
          });
        }, function(done) {
          return browser.deleteAllCookies(function(err) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.eql([]);
            return done(null);
          });
        }, function(done) {
          // not too sure how to test this case this one, so just making sure
          // that it does not throw
          return browser.setCookie({
            name: 'fruit3',
            value: 'orange',
            secure: true
          }, function(err) {
            should.not.exist(err);
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("isVisible", function() {
    return it("should check if element is visible", function(done) {
      return async.series([
        function(done) {
          return browser.elementByCss("#isVisible a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.isVisible(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              return done(null);
            });
          });
        }, function(done) {
          return browser.isVisible("css selector", "#isVisible a", function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(null);
          });
        }, function(done) {
          return browser.execute("$('#isVisible a').hide();", function(err, res) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.elementByCss("#isVisible a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            return browser.isVisible(field, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              return done(null);
            });
          });
        }, function(done) {
          return browser.isVisible("css selector", "#isVisible a", function(err, res) {
            should.not.exist(err);
            res.should.be.false;
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("waitForCondition", function() {
    return it("should wait for condition", function(done) {
      var exprCond;
      this.timeout(10000);
      exprCond = "$('#waitForCondition .child').length > 0";
      return async.series([
        executeCoffee(browser, "setTimeout ->\n  $('#waitForCondition').html '<div class=\"child\">a waitForCondition child</div>'\n, " + (1.5 * TIMEOUT_BASE)), function(done) {
          return browser.elementByCss("#waitForCondition .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            return done(null);
          });
        }, function(done) {
          return browser.waitForCondition(exprCond, 2 * TIMEOUT_BASE, 200, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForCondition(exprCond, 2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForCondition(exprCond, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForCondition('$wrong expr!!!', function(err, res) {
            should.exist(err);
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("waitForConditionInBrowser", function() {
    return it("should wait for condition within the browser", function(done) {
      var exprCond;
      this.timeout(10000);
      exprCond = "$('#waitForConditionInBrowser .child').length > 0";
      return async.series([
        executeCoffee(browser, "setTimeout ->\n  $('#waitForConditionInBrowser').html '<div class=\"child\">a waitForCondition child</div>'\n, " + (1.5 * TIMEOUT_BASE)), function(done) {
          return browser.elementByCss("#waitForConditionInBrowser .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            return done(null);
          });
        }, function(done) {
          return browser.setAsyncScriptTimeout(5 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.waitForConditionInBrowser(exprCond, 2 * TIMEOUT_BASE, 0.2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForConditionInBrowser(exprCond, 2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForConditionInBrowser(exprCond, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            return done(err);
          });
        }, function(done) {
          return browser.waitForConditionInBrowser("totally #} wrong == expr", function(err, res) {
            should.exist(err);
            return done(null);
          });
        }, function(done) {
          return browser.setAsyncScriptTimeout(0, function(err, res) {
            should.not.exist(err);
            return done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  if (!process.env.GHOSTDRIVER_TEST) {
    describe("err.inspect", function() {
      return it("error output should be clean", function(done) {
        return browser.safeExecute("invalid-code> here", function(err) {
          should.exist(err);
          (err instanceof Error).should.be.true;
          (err.inspect().length <= 510).should.be.true
          return done(null);
        });
      });
    });
  }
  return describe("quit<COMP>", function() {
    return it("should destroy browser", function(done) {
      return browser.quit(function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
};

exports.test = test;
