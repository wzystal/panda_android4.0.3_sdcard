
(function(){var Flow,FlowControl,MenuControl,MenuItem,NavigationControl,Page,PageStack,PageStackController,WildcardFlow;var __bind=function(fn,me){return function(){return fn.apply(me,arguments);};},__hasProp=Object.prototype.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key))child[key]=parent[key];}
function ctor(){this.constructor=child;}
ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child;},__slice=Array.prototype.slice;PageStackController=(function(){PageStackController.prototype.legacyPush=function(path,options){return this.activeStack.push(path,options);};PageStackController.prototype.legacyReady=function(pageJSON){var loadingStack;if(!(pageJSON!=null)){this.legacyLoadQueue[this.legacyLoadQueue.length-1].loadingPage.ajaxLoad();return;}
loadingStack=this.legacyLoadQueue.pop();this.activate(loadingStack);return loadingStack.ready(pageJSON);};PageStackController.prototype.legacyGoBack=function(options){var waitForTransitionAnimation;if(options==null){options={};}
if(this.activeStack.pages.length<=1){if(options.root){return;}else{return OF.action('dismiss');}}
OF.touch.cancel();OF.action('back',options,function(){});waitForTransitionAnimation=OF.platform==='ios'?350:0;return setTimeout(__bind(function(){return this.activeStack.back(options);},this),waitForTransitionAnimation);};PageStackController.prototype.legacyRefresh=function(){return this.activeStack.activePage.load();};PageStackController.prototype.legacyIPushed=function(stack){OF.init.isLoaded=false;return this.legacyLoadQueue.push(stack);};function PageStackController(){this.legacyLoadQueue=[];this.stacks=[];this.loadedFlows={};this.activeStack=null;}
PageStackController.prototype.createDefaultStack=function(){OF.pageStackController.addStack('#page');return this.activate(this.stacks[0]);};PageStackController.prototype.addStack=function(element,stackId){var newStack;newStack=new PageStack(element,this,stackId);this.stacks.push(newStack);return newStack;};PageStackController.prototype.getStack=function(index){return this.stacks[index];};PageStackController.prototype.getStackByElement=function(element){var foundstack,stack,_i,_len,_ref;_ref=this.stacks;for(_i=0,_len=_ref.length;_i<_len;_i++){stack=_ref[_i];if(stack.element===element){foundstack=stack;}}
return foundstack;};PageStackController.prototype.activate=function(stack){var _ref;this.activeStack=stack;OF.pages=this.activeStack.pages;OF.page=this.activeStack.topPage();if((_ref=this.activeStack.topPage())!=null){_ref.updateTitle();}
return OF.pages.replace=__bind(function(url,options){return this.activeStack.replace(url,options);},this);};PageStackController.prototype.isFlowLoaded=function(flow){return this.loadedFlows[flow]!=null;};PageStackController.prototype.markFlowAsLoaded=function(flow){return this.loadedFlows[flow]=true;};PageStackController.prototype.browser=function(){if(OF.isBrowser&&$('#browser_toolbar').length===0){$.loadCss('browser_toolbar',false);return $.get('browser_toolbar.html',function(data){return $(document.body).append(data);});}};PageStackController.prototype.registerAsGlobal=function(name){return this.globalName=name;};PageStackController.prototype.getGlobalName=function(){return this.globalName;};return PageStackController;})();PageStack=(function(){function PageStack(element,controller,stackId){this.element=element;this.controller=controller;this.stackId=stackId;this.pages=[];this.loadingPage=null;this.activePage=null;}
PageStack.prototype.push=function(url,options){var _ref;if(options==null){options={};}
if(this.loadingPage!=null){return;}
this.controller.legacyIPushed(this);url=$.jsonifyUrl(url);options.path=url;OF.debug("Loading content: "+url);this.loadingPage=new Page(url,options,this);this.pages.push(this.loadingPage);this.loadingPage.startLoading();OF.loader.show();if((_ref=this.activePage)!=null){_ref.scrollPosition=window.scrollY;}
if(options.complete){options.complete();}
return OF.specs.load(url);};PageStack.prototype.replace=function(url,options){this.pages=[];return this.push(url,options);};PageStack.prototype.back=function(options){if(options==null){options={};}
if(this.pages.length>1){this.detach();if(options.root){this.pages.splice(1,this.pages.length-1);}else{this.pages.pop();}
this.activePage=this.pages[this.pages.length-1];this.updateLegacyPage();this.show();if($.isFunction(options.callback)){return options.callback();}}else{if(!options.root){return OF.action('dismiss');}}};PageStack.prototype.ready=function(pageJSON){if(!this.loadingPage){throw new Error("Can't find loadingPage to be ready() on current page stack ("+this.rootContainerSelector+").");}
this.updateLegacyPage();this.loadingPage.ready(pageJSON);OF.GA.init();this.detach();this.activePage=this.loadingPage;this.loadingPage=null;return this.show();};PageStack.prototype.updateLegacyPage=function(){if(this===this.controller.activeStack){return OF.page=this.loadingPage||this.activePage;}};PageStack.prototype.loadPage=function(url,data,params,onComplete){var page,_ref;if(this.init.isLoaded){return;}
if((_ref=this.page)!=null){_ref.detach();}
page=new Page(data,url,params);this.pages.push(page);this.loadTopPage(onComplete);return OF.GA.init();};PageStack.prototype.detach=function(){if(this.activePage!=null){this.activePage.deactivate();}
return $(this.element).contents().detach();};PageStack.prototype.show=function(){if(this.activePage==null){return;}
$(this.element).append(this.activePage.nodes);this.activePage.activate();OF.init.isLoaded=true;if(window.runSpecs){OF.specs.run();}
return window.scroll(0,this.activePage.scrollPosition);};PageStack.prototype.literalReferenceString=function(){return""+(this.controller.getGlobalName())+".getStackByElement('"+this.element+"')";};PageStack.prototype.contains=function(page){return this.pages.indexOf(page)>-1;};PageStack.prototype.topPage=function(){return this.pages[this.pages.length-1];};PageStack.prototype.activate=function(){return this.controller.activate(this);};PageStack.prototype.size=function(){return this.pages.length;};PageStack.prototype.onRootPage=function(){return this.size()<=1;};return PageStack;})();Page=(function(){Page.State={initialising:{order:0,toString:function(){return"Page is initialising, and has not yet requested its data";}},awaitingJSON:{order:1,toString:function(){return"Page is waiting for the JSON from the native code / ajax request.";}},loaded:{order:2,toString:function(){return"The page has received the JSON data and is finalising its setup.";}},active:{order:3,toString:function(){return"Page is currently active (visible.)";}},popped:{order:4,toString:function(){return"Page is not active, and has had its contents popped off of the document.";}}};__extends(Page,OF.EventEmitter);function Page(url,options,stack){var normalized_path;this.url=url;this.stack=stack;this.state=Page.State.initialising;this.onComplete=options.complete;this.setParams(options.params||{});this.flow=(/^(.*)\//.exec(this.url))[1];normalized_path=this.url.replace(/^(\/)/,'').replace(/\W+/g,'-');this.id="page_"+normalized_path+"_"+(new Date().getTime());this.scrollPosition=0;this.loadingDeferred=$.Deferred().resolve().promise();}
Page.prototype.startLoading=function(){this.startedLoadingAt=Date.now();this.state=Page.State.awaitingJSON;OF.debug('sending startloading action');if(OF.isBrowser){return this.ajaxLoad();}else{return OF.action('startLoading',{path:this.url,stackId:this.stack.stackId});}};Page.prototype.ajaxLoad=function(){return $.ajax({url:this.url,dataType:'json',success:__bind(function(pageJSON){return OF.push.ready(pageJSON);},this),error:__bind(function(xhr){return this.loadFailed(xhr);},this)});};Page.prototype.loadFailed=function(xhr){if(runSpecs){OF.push.ready({});}else{OF.alert("Error","Screen loading failed:\n"+xhr.status+" "+xhr.statusText);}
return OF.loader.hide();};Page.prototype.ready=function(pageJSON){var functionBlock,_i,_len,_ref;this.scrolling=pageJSON.scrolling,this.title=pageJSON.title,this.html=pageJSON.html;_ref=['init','appear','resume','loadflow','setup'];for(_i=0,_len=_ref.length;_i<_len;_i++){functionBlock=_ref[_i];if(pageJSON[functionBlock]!=null){this.on(functionBlock,$.functionize(pageJSON[functionBlock],this.url,functionBlock));}}
this.loadHtml();this.state=Page.State.loaded;return this.emit('setup',this.sub$);};Page.prototype.loadHtml=function(){var pageRoot;this.nodes=$('<div class="event_context"></div>');this.nodes.html(this.html);this.eventHandleElement=$('<div class="eventHandle"></div>');this.nodes.append(this.eventHandleElement);this.eventContext=this.nodes[0];this.sub$=jQuery.sub();pageRoot=this.eventContext;this.sub$.fn.init=function(selector,context,root){if(context==null){context=pageRoot;}
return new jQuery.fn.init(selector,context,root);};return this.navigationControl=new NavigationControl(OF.platform,pageRoot);};Page.prototype.eventHandle=function(){return this.eventHandleElement;};Page.prototype.activate=function(){try{if(!this.stack.controller.isFlowLoaded(this.flow)){this.emit('loadflow',this.sub$);this.stack.controller.markFlowAsLoaded(this.flow);}
if(this.state===Page.State.loaded){this.emit('init',this.sub$);}
this.emit('appear',this.sub$);if(this.state===Page.State.popped){this.emit('resume',this.sub$);}}catch(error){console.error("an error occurred in the page script: "+error);OF.debug("an error occurred in the page script: "+error);}
OF.debug('activating page');document.title=this.title;this.updateTitle();this.pageViewTracking();return this.loadingDeferred.done(__bind(function(){this.contentLoaded({pageStackSize:this.stack.pages.length,stackId:this.stack.stackId});OF.flowControl.trigger('load');return this.state=Page.State.active;},this));};Page.prototype.delayContentLoaded=function(){var deferred;deferred=$.Deferred();this.loadingDeferred=$.when(this.loadingDeferred,deferred.promise());return deferred;};Page.prototype.updateTitle=function(){var _ref;return(_ref=this.navigationControl)!=null?_ref.renderTitle(this.title):void 0;};Page.prototype.deactivate=function(){return this.state=Page.State.popped;};Page.prototype.push=function(url,options){return this.stack.push(url,options);};Page.prototype.replace=function(url,options){return this.stack.replace(url,options);};Page.prototype.back=function(options){return this.stack.back(options);};Page.prototype.load=function(){this.stack.detach();this.state=Page.State.loaded;this.loadHtml();return this.stack.show();};Page.prototype.isCurrent=function(){return this.stack.topPage()===this;};Page.prototype.contentLoaded=function(options){var _ref;if(options==null){options={};}
if((_ref=options.title)!=null){_ref;}else{options.title=this.title||document.title;};if(this.titleImage){options.titleImage=this.titleImage;}
if(this.barButton){options.barButton=this.barButton;}
if(this.barButtonImage){options.barButtonImage=this.barButtonImage;}
OF.loader.hide();OF.action('contentLoaded',options);return this.emit('contentLoaded');};Page.prototype.pageViewTracking=function(){if(this.stack.topPage()){return OF.GA.page("/webui/"+(this.stack.topPage().url));}};Page.prototype.trackLoadTime=function(){if(!this.startedLoadingAt){return;}
OF.GA.event('loading',this.url,'milliseconds',Date.now()-this.startedLoadingAt);return this.startedLoadingAt=null;};Page.prototype.params=function(){var hasQuery,page,query,_ref;page=this.stack.topPage();if((_ref=page.params)!=null){_ref;}else{page.params={};};hasQuery=page.url.match(/\?/);if(hasQuery){query=page.url.split('?')[1];return $.extend(page.params,$.urlDecode(query));}};Page.prototype.exists=function(){return this.stack.contains(this);};Page.prototype.loadCss=function(path){var deferred;deferred=$.loadCss(path,true);this.loadingDeferred=$.when(this.loadingDeferred,deferred);return deferred;};Page.prototype.requireCss=function(path,dependentStyles,async){var deferred;if(async==null){async=true;}
deferred=$.requireCss(path,dependentStyles,async);this.loadingDeferred=$.when(this.loadingDeferred,deferred);return deferred;};Page.prototype.setParams=function(params){var hasQuery,query;this.params=U.extend({},params);hasQuery=this.url.match(/\?/);if(hasQuery){query=this.url.split('?')[1];return $.extend(this.params,$.urlDecode(query));}};Page.prototype.timeout=function(delay,fn){var self;self=this;return setTimeout(function(){if(self.exists()){return fn();}},delay);};Page.prototype.isCurrent=function(){return this.stack.topPage()===this;};Page.prototype.detach=function(){return this.nodes=this.stack.detach();};Page.prototype.attach=function(){return this.stack.attach(this.nodes);};Page.prototype.inPath=function(){var path,paths,_i,_len;paths=1<=arguments.length?__slice.call(arguments,0):[];for(_i=0,_len=paths.length;_i<_len;_i++){path=paths[_i];if(this.url.indexOf(path)===0){return true;}}
return false;};Page.prototype.loadScript=function(path){return $.ajax({url:"javascripts/"+path+".js?"+(new Date().getTime()),dataType:'text',async:false,success:__bind(function(text){var fnc;fnc=$.functionize(text,path,'loadScript');return fnc(this.sub$);},this)});};return Page;})();OF.pageStackController=new PageStackController();OF.pageStackController.registerAsGlobal('OF.pageStackController');OF.pageStackController.createDefaultStack();$(function(){return OF.pageStackController.browser();});OF.push=function(){return OF.pageStackController.legacyPush.apply(OF.pageStackController,arguments);};OF.push.ready=function(){return OF.pageStackController.legacyReady.apply(OF.pageStackController,arguments);};OF.goBack=function(){return OF.pageStackController.legacyGoBack.apply(OF.pageStackController,arguments);};OF.refresh=function(){return OF.pageStackController.legacyRefresh.apply(OF.pageStackController,arguments);};OF.navigationStack=OF.pages;OF.navigateToUrlCallback=OF.push.ready;OF.topNavigationItem=$.deprecate(OF.topPage,'OF.topNavigationItem()','OF.topPage()');OF.navigateToUrl=$.deprecate(OF.push,'OF.navigateToUrl()','OF.push()');Flow=(function(){function Flow(path){this.path=path;this.callbacks={};}
Flow.prototype.load=function(callback){return this.when('load',callback);};Flow.prototype.when=function(eventName,callback){this.callbacks[eventName]=callback;return this;};Flow.prototype.trigger=function(eventName){var callback;if(eventName in this.callbacks){callback=this.callbacks[eventName];this.forget(eventName);callback();}
return this;};Flow.prototype.forget=function(eventName){if(eventName in this.callbacks){delete this.callbacks[eventName];}
return this;};Flow.prototype.clearAll=function(){var callback,eventName,_ref;_ref=this.callbacks;for(eventName in _ref){if(!__hasProp.call(_ref,eventName))continue;callback=_ref[eventName];delete this.callbacks[eventName];}
this.callbacks={};return this;};return Flow;})();WildcardFlow=(function(){WildcardFlow.isWildcardPath=function(path){return/\*/g.test(path);};__extends(WildcardFlow,Flow);function WildcardFlow(path){this.path=path;this.pattern=new RegExp(this.path.replace('*','.*'));WildcardFlow.__super__.constructor.call(this,this.path);}
WildcardFlow.prototype.match=function(path){return this.pattern.test(path);};return WildcardFlow;})();FlowControl=(function(){function FlowControl(){this.flows={};this.wildcardFlows=[];}
FlowControl.prototype.observe=function(path){var flow;flow=this.flowOf(path);if(!flow){if(!WildcardFlow.isWildcardPath(path)){flow=new Flow(path);this.flows[path]=flow;}else{flow=new WildcardFlow(path);this.wildcardFlows.push(flow);}}
return flow;};FlowControl.prototype.flowOf=function(path){if(path in this.flows){return this.flows[path];}
if(WildcardFlow.isWildcardPath(path)){return this.wildcardFlowMatching(path);}};FlowControl.prototype.wildcardFlowMatching=function(path){var flow,_i,_len,_ref;_ref=this.wildcardFlows;for(_i=0,_len=_ref.length;_i<_len;_i++){flow=_ref[_i];if(flow.match(path)){return flow;}}};FlowControl.prototype.forget=function(path,eventName){var flow;if(eventName==null){eventName=null;}
flow=this.flowOf(path);if(flow){if(eventName===null){return flow.clearAll();}else{return flow.forget(eventName);}}};FlowControl.prototype.trigger=function(eventName,currentPageUrl){var flow,path;if(eventName==null){eventName='load';}
if(currentPageUrl==null){currentPageUrl=OF.topPage().url;}
if(currentPageUrl){path=currentPageUrl.replace('.json','');if(path in this.flows){return this.flows[path].trigger(eventName);}else{flow=this.wildcardFlowMatching(path);if(flow){return flow.trigger(eventName);}}}};return FlowControl;})();OF.flowControl=new FlowControl();OF.flowControl.Flow=Flow;OF.flowControl.WildcardFlow=WildcardFlow;OF.flowControl.FlowControl=FlowControl;MenuItem=(function(){function MenuItem(name){this.name=name;this.locked=false;}
MenuItem.prototype.setCallback=function(callback){if(!this.locked){return this.callback=callback;}};MenuItem.prototype.lock=function(){return this.locked=true;};MenuItem.prototype.unlock=function(){return this.locked=false;};MenuItem.prototype.click=function(){if(this.callback&&typeof this.callback==='function'){return this.callback();}};return MenuItem;})();MenuControl=(function(){function MenuControl(){this.menus={};this.initialized=false;}
MenuControl.prototype.initialize=function(){if(!this.initialized){return OF.menu=__bind(function(menuName){var menuItem;menuItem=this.getMenuItem(menuName);if(menuItem){return menuItem.click();}else{return OF.debug("Unknown menu button hit: "+menuName);}},this);}};MenuControl.prototype.enableMenuItems=function(){var items;items=1<=arguments.length?__slice.call(arguments,0):[];if(OF.action.isSupported('enableMenuItems')){return OF.action('enableMenuItems',{items:items});}};MenuControl.prototype.getMenuItem=function(menuName){if(menuName in this.menus){return this.menus[menuName];}};MenuControl.prototype.setup=function(menuName,callback){var menuItem;menuItem=this.getMenuItem(menuName);if(!menuItem){menuItem=new MenuItem(menuName);this.menus[menuName]=menuItem;}
return menuItem.setCallback(callback);};MenuControl.prototype.delegate=function(){var func,menuItem,menuName,params;menuName=arguments[0],func=arguments[1],params=3<=arguments.length?__slice.call(arguments,2):[];menuItem=this.getMenuItem(menuName);if(menuItem){return menuItem[func](params);}};MenuControl.prototype.lock=function(menuName){return this.delegate(menuName,'lock');};MenuControl.prototype.unlock=function(menuName){return this.delegate(menuName,'unlock');};return MenuControl;})();OF.menuControl=new MenuControl();NavigationControl=(function(){function NavigationControl(platform,pageRoot){this.platform=platform!=null?platform:OF.platform;this.pageRoot=pageRoot;this.fixTabsContainerId();this.pageRoot=$(this.pageRoot);}
NavigationControl.prototype.isTabsEnvironment=function(){return $('.event_context').size()>1;};NavigationControl.prototype.fixTabsContainerId=function(){var rootContainers;if(this.isTabsEnvironment()){rootContainers=$('.event_context > div[id]');return $(rootContainers[0]).attr('id',""+rootContainers[0].id+"_tabs_container");}};NavigationControl.prototype.atRootPageOfATab=function(){return this.isTabsEnvironment()&&(OF.page.stack.size()===1);};NavigationControl.prototype.renderTitle=function(title){if(title==null){title=OF.page.title;}
if(this.platform==='android'&&OF.variant==='ofsdk'){return this._renderHeader(title);}};NavigationControl.prototype._renderHeader=function(title){var html,oldHeaders;html=this.atRootPageOfATab()?this._htmlOfRootPageHeader():this._htmlOfNormalHeader(title);oldHeaders=$('#header');while(oldHeaders.size()!==0){oldHeaders.remove();oldHeaders=$('#header');}
return this.pageRoot.prepend(html);};NavigationControl.prototype._htmlOfNormalHeader=function(title){return"<div id=\"header\" class=\"nav\">\n  <span class=\"loading hidden\"><span class=\"spinner\"></span></span>\n  <div id=\"home_button\" class=\"title\">"+title+"</div>\n</div>";};NavigationControl.prototype._htmlOfRootPageHeader=function(){return"<div id=\"header\" class=\"root nav\">\n  <div id=\"home_button\">\n  <span class=\"loading hidden\">\n    <span class=\"spinner\"></span>\n    <span class=\"text\">Loading...</span>\n  </span>\n</div>";};return NavigationControl;})();}).call(this);