// DO NOT EDIT
//   Generated from javascripts/dashboard/base.coffee
//
(function() {
  var Dashboard, TabsView, _tabImagePathOf;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.userPicUrl = function(url) {
    if (OF.device.parentalControls) {
      return "images/icon.user.male." + OF.dpi + ".png";
    } else {
      return url;
    }
  };
  Dashboard = {};
  _tabImagePathOf = function(imageName) {
    return "" + (OF.platform === 'ios' ? 'cache:' : '') + "images/dashboard/tabs/" + imageName + "." + OF.dpi + ".png";
  };
  TabsView = (function() {
    TabsView.prototype.DefaultNativeTabsConfig = {
      activeBackground: _tabImagePathOf('tab_green'),
      inactiveBackground: _tabImagePathOf('tab_grey'),
      leftDivider: _tabImagePathOf('tab_divider_left'),
      rightDivider: _tabImagePathOf('tab_divider_right'),
      height: 37
    };
    TabsView.prototype.DefaultTabsConfig = [
      {
        name: "community",
        path: "dashboard/user",
        active: true
      }, {
        name: "profile",
        path: "dashboard/profile",
        options: {
          params: {
            variant: TabsView.variant
          }
        }
      }
    ];
    function TabsView(params, platform, variant) {
      this.params = params != null ? params : {};
      this.platform = platform;
      this.variant = variant;
      this.setupTabs();
      U.extend(OF, {
        variant: this.variant,
        tabController: this.tabController,
        nativeTabCallback: __bind(function(touchedTabIndex) {
          return this.tabController.setActiveTab(this.myTabs[touchedTabIndex].name);
        }, this)
      });
      this.hideWebuiHeader();
      this.redirected = false;
      this.setupRedirection(this.params);
      this.redirectOnce();
    }
    TabsView.prototype._setActiveTabByIndex = function(index) {
      var tab, _i, _len, _ref;
      _ref = this.myTabs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        delete tab.active;
      }
      return this.myTabs[index].active = true;
    };
    TabsView.prototype._getTabsConfig = function() {
      this.myTabs = this.DefaultTabsConfig;
      this.myTabs.map(function(tab) {
        tab.activeImage = _tabImagePathOf("tab_" + tab.name + "_white");
        tab.inactiveImage = _tabImagePathOf("tab_" + tab.name + "_grey");
        return tab.element = "" + tab.name + "_tab";
      });
      return this.myTabs;
    };
    TabsView.prototype._hasSpecificDestination = function() {
      return 'destination' in this.params;
    };
    TabsView.prototype.setupRedirection = function(params) {
      var destinationParamsOfDestination, destination_params, destination_tuple, destination_url;
      if (!this._hasSpecificDestination()) {
        return;
      }
      destinationParamsOfDestination = function() {
        var pageType, page_params;
        page_params = {};
        switch (params.destination) {
          case 'achievements':
            return ['dashboard/achievements', page_params];
          case 'leaderboards':
            if ('leaderboard_id' in params) {
              return [
                'dashboard/leaderboard', {
                  leaderboard_id: params.leaderboard_id
                }
              ];
            } else {
              return ['dashboard/leaderboards', page_params];
            }
            break;
          case 'developer_announcement_list':
            return ['dashboard/developer_announcement_list', page_params];
          case 'developer_announcement':
            if ('announcement_id' in params) {
              page_params = {
                id: params.announcement_id
              };
              return ['dashboard/developer_announcement', page_params];
            }
            break;
          case 'profile':
            if ('user_id' in params) {
              page_params = {
                user_id: params.user_id
              };
            }
            return ['dashboard/profile', page_params];
          case 'settings':
            pageType = OF.device.parentalControls ? 'disable' : 'enable';
            return ["settings/parental_controls_" + pageType, page_params];
        }
      };
      destination_tuple = destinationParamsOfDestination();
      if (destination_tuple) {
        destination_url = destination_tuple[0], destination_params = destination_tuple[1];
        return this.redirection = __bind(function() {
          if (!this.redirected) {
            this.redirected = true;
            return OF.push(destination_url, {
              params: destination_params
            });
          }
        }, this);
      }
    };
    TabsView.prototype.redirectOnce = function() {
      if (!this.redirected) {
        if (this.redirection) {
          return setTimeout(this.redirection, 1000);
        }
      }
    };
    TabsView.prototype.setupTabs = function() {
      return this.tabController = new OF.control.TabControl({
        "native": true,
        nativeConfig: this.DefaultNativeTabsConfig,
        tabs: this._getTabsConfig(),
        location: $('#dashboard_main_window')
      });
    };
    TabsView.prototype.hideWebuiHeader = function() {
      return $('#header').hide();
    };
    return TabsView;
  })();
  U.extend(Dashboard, {
    TabsView: TabsView
  });
  this.Dashboard = Dashboard;
}).call(this);
