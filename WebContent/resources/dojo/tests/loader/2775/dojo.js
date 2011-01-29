/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(typeof dojo=="undefined"){
var dj_global=this;
var dj_currentContext=this;
function dj_undef(_1,_2){
return (typeof (_2||dj_currentContext)[_1]=="undefined");
}
if(dj_undef("djConfig",this)){
var djConfig={};
}
if(dj_undef("dojo",this)){
var dojo={};
}
dojo.global=function(){
return dj_currentContext;
};
dojo.locale=djConfig.locale;
dojo.version={major:0,minor:0,patch:0,flag:"dev",revision:Number("$Rev: 7480 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalProp=function(_3,_4,_5){
if((!_4)||(!_3)){
return undefined;
}
if(!dj_undef(_3,_4)){
return _4[_3];
}
return (_5?(_4[_3]={}):undefined);
};
dojo.parseObjPath=function(_6,_7,_8){
var _9=(_7||dojo.global());
var _a=_6.split(".");
var _b=_a.pop();
for(var i=0,l=_a.length;i<l&&_9;i++){
_9=dojo.evalProp(_a[i],_9,_8);
}
return {obj:_9,prop:_b};
};
dojo.evalObjPath=function(_e,_f){
if(typeof _e!="string"){
return dojo.global();
}
if(_e.indexOf(".")==-1){
return dojo.evalProp(_e,dojo.global(),_f);
}
var ref=dojo.parseObjPath(_e,dojo.global(),_f);
if(ref){
return dojo.evalProp(ref.prop,ref.obj,_f);
}
return null;
};
dojo.errorToString=function(_11){
if(!dj_undef("message",_11)){
return _11.message;
}else{
if(!dj_undef("description",_11)){
return _11.description;
}else{
return _11;
}
}
};
dojo.raise=function(_12,_13){
if(_13){
_12=_12+": "+dojo.errorToString(_13);
}else{
_12=dojo.errorToString(_12);
}
try{
if(djConfig.isDebug){
dojo.hostenv.println("FATAL exception raised: "+_12);
}
}
catch(e){
}
throw _13||Error(_12);
};
dojo.debug=function(){
};
dojo.debugShallow=function(obj){
};
dojo.profile={start:function(){
},end:function(){
},stop:function(){
},dump:function(){
}};
function dj_eval(_15){
return dj_global.eval?dj_global.eval(_15):eval(_15);
}
dojo.unimplemented=function(_16,_17){
var _18="'"+_16+"' not implemented";
if(_17!=null){
_18+=" "+_17;
}
dojo.raise(_18);
};
dojo.deprecated=function(_19,_1a,_1b){
var _1c="DEPRECATED: "+_19;
if(_1a){
_1c+=" "+_1a;
}
if(_1b){
_1c+=" -- will be removed in version: "+_1b;
}
dojo.debug(_1c);
};
dojo.render=(function(){
function vscaffold(_1d,_1e){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_1d};
for(var i=0;i<_1e.length;i++){
tmp[_1e[i]]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _21={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,delayMozLoadingFix:false,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_21;
}else{
for(var _22 in _21){
if(typeof djConfig[_22]=="undefined"){
djConfig[_22]=_21[_22];
}
}
}
return {name_:"(unset)",version_:"(unset)",getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _25=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
(function(){
var _26={pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_27,_28){
this.modulePrefixes_[_27]={name:_27,value:_28};
},moduleHasPrefix:function(_29){
var mp=this.modulePrefixes_;
return Boolean(mp[_29]&&mp[_29].value);
},getModulePrefix:function(_2b){
if(this.moduleHasPrefix(_2b)){
return this.modulePrefixes_[_2b].value;
}
return _2b;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],unloadListeners:[],loadNotifying:false};
for(var _2c in _26){
dojo.hostenv[_2c]=_26[_2c];
}
})();
dojo.hostenv.loadPath=function(_2d,_2e,cb){
var uri;
if(_2d.charAt(0)=="/"||_2d.match(/^\w+:/)){
uri=_2d;
}else{
uri=this.getBaseScriptUri()+_2d;
}
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return !_2e?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_2e,cb);
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return true;
}
var _33=this.getText(uri,null,true);
if(!_33){
return false;
}
this.loadedUris[uri]=true;
if(cb){
_33="("+_33+")";
}
var _34=dj_eval(_33);
if(cb){
cb(_34);
}
return true;
};
dojo.hostenv.loadUriAndCheck=function(uri,_36,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return Boolean(ok&&this.findModule(_36,false));
};
dojo.loaded=function(){
};
dojo.unloaded=function(){
};
dojo.hostenv.loaded=function(){
this.loadNotifying=true;
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
this.modulesLoadedListeners=[];
this.loadNotifying=false;
dojo.loaded();
};
dojo.hostenv.unloaded=function(){
var mll=this.unloadListeners;
while(mll.length){
(mll.pop())();
}
dojo.unloaded();
};
dojo.addOnLoad=function(obj,_3d){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dh.modulesLoadedListeners.push(function(){
obj[_3d]();
});
}
}
if(dh.post_load_&&dh.inFlightCount==0&&!dh.loadNotifying){
dh.callLoaded();
}
};
dojo.addOnUnload=function(obj,_40){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.unloadListeners.push(obj);
}else{
if(arguments.length>1){
dh.unloadListeners.push(function(){
obj[_40]();
});
}
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if(this.loadUriStack.length==0&&this.getTextStack.length==0){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
dojo.hostenv.callLoaded();
}
};
dojo.hostenv.callLoaded=function(){
if(typeof setTimeout=="object"||(djConfig["useXDomain"]&&dojo.render.html.opera)){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
};
dojo.hostenv.getModuleSymbols=function(_42){
var _43=_42.split(".");
for(var i=_43.length;i>0;i--){
var _45=_43.slice(0,i).join(".");
if((i==1)&&!this.moduleHasPrefix(_45)){
_43[0]="../"+_43[0];
}else{
var _46=this.getModulePrefix(_45);
if(_46!=_45){
_43.splice(0,i,_46);
break;
}
}
}
return _43;
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_47,_48,_49){
if(!_47){
return;
}
_49=this._global_omit_module_check||_49;
var _4a=this.findModule(_47,false);
if(_4a){
return _4a;
}
if(dj_undef(_47,this.loading_modules_)){
this.addedToLoadingCount.push(_47);
}
this.loading_modules_[_47]=1;
var _4b=_47.replace(/\./g,"/")+".js";
var _4c=_47.split(".");
var _4d=this.getModuleSymbols(_47);
var _4e=((_4d[0].charAt(0)!="/")&&!_4d[0].match(/^\w+:/));
var _4f=_4d[_4d.length-1];
var ok;
if(_4f=="*"){
_47=_4c.slice(0,-1).join(".");
while(_4d.length){
_4d.pop();
_4d.push(this.pkgFileName);
_4b=_4d.join("/")+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,!_49?_47:null);
if(ok){
break;
}
_4d.pop();
}
}else{
_4b=_4d.join("/")+".js";
_47=_4c.join(".");
var _51=!_49?_47:null;
ok=this.loadPath(_4b,_51);
if(!ok&&!_48){
_4d.pop();
while(_4d.length){
_4b=_4d.join("/")+".js";
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
_4d.pop();
_4b=_4d.join("/")+"/"+this.pkgFileName+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
}
}
if(!ok&&!_49){
dojo.raise("Could not load '"+_47+"'; last tried '"+_4b+"'");
}
}
if(!_49&&!this["isXDomain"]){
_4a=this.findModule(_47,false);
if(!_4a){
dojo.raise("symbol '"+_47+"' is not defined after loading '"+_4b+"'");
}
}
return _4a;
};
dojo.hostenv.startPackage=function(_52){
var _53=String(_52);
var _54=_53;
var _55=_52.split(/\./);
if(_55[_55.length-1]=="*"){
_55.pop();
_54=_55.join(".");
}
var _56=dojo.evalObjPath(_54,true);
this.loaded_modules_[_53]=_56;
this.loaded_modules_[_54]=_56;
return _56;
};
dojo.hostenv.findModule=function(_57,_58){
var lmn=String(_57);
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
if(_58){
dojo.raise("no loaded module named '"+_57+"'");
}
return null;
};
dojo.kwCompoundRequire=function(_5a){
var _5b=_5a["common"]||[];
var _5c=_5a[dojo.hostenv.name_]?_5b.concat(_5a[dojo.hostenv.name_]||[]):_5b.concat(_5a["default"]||[]);
for(var x=0;x<_5c.length;x++){
var _5e=_5c[x];
if(_5e.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_5e);
}else{
dojo.hostenv.loadModule(_5e);
}
}
};
dojo.require=function(_5f){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(_60,_61){
var _62=arguments[0];
if((_62===true)||(_62=="common")||(_62&&dojo.render[_62].capable)){
var _63=[];
for(var i=1;i<arguments.length;i++){
_63.push(arguments[i]);
}
dojo.require.apply(dojo,_63);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.provide=function(_65){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.registerModulePath=function(_66,_67){
return dojo.hostenv.setModulePrefix(_66,_67);
};
if(typeof djConfig["useXDomain"] == "undefined"){djConfig.useXDomain = true;};
dojo.registerModulePath("dojo", "http://o.aolcdn.com/dojo/0.4.2/src");

if(djConfig["modulePaths"]){
for(var param in djConfig["modulePaths"]){
dojo.registerModulePath(param,djConfig["modulePaths"][param]);
}
}
dojo.setModulePrefix=function(_68,_69){
dojo.deprecated("dojo.setModulePrefix(\""+_68+"\", \""+_69+"\")","replaced by dojo.registerModulePath","0.5");
return dojo.registerModulePath(_68,_69);
};
dojo.exists=function(obj,_6b){
var p=_6b.split(".");
for(var i=0;i<p.length;i++){
if(!obj[p[i]]){
return false;
}
obj=obj[p[i]];
}
return true;
};
dojo.hostenv.normalizeLocale=function(_6e){
var _6f=_6e?_6e.toLowerCase():dojo.locale;
if(_6f=="root"){
_6f="ROOT";
}
return _6f;
};
dojo.hostenv.searchLocalePath=function(_70,_71,_72){
_70=dojo.hostenv.normalizeLocale(_70);
var _73=_70.split("-");
var _74=[];
for(var i=_73.length;i>0;i--){
_74.push(_73.slice(0,i).join("-"));
}
_74.push(false);
if(_71){
_74.reverse();
}
for(var j=_74.length-1;j>=0;j--){
var loc=_74[j]||"ROOT";
var _78=_72(loc);
if(_78){
break;
}
}
};
dojo.hostenv.localesGenerated;
dojo.hostenv.registerNlsPrefix=function(){
dojo.registerModulePath("nls","nls");
};
dojo.hostenv.preloadLocalizations=function(){
if(dojo.hostenv.localesGenerated){
dojo.hostenv.registerNlsPrefix();
function preload(_79){
_79=dojo.hostenv.normalizeLocale(_79);
dojo.hostenv.searchLocalePath(_79,true,function(loc){
for(var i=0;i<dojo.hostenv.localesGenerated.length;i++){
if(dojo.hostenv.localesGenerated[i]==loc){
dojo["require"]("nls.dojo_"+loc);
return true;
}
}
return false;
});
}
preload();
var _7c=djConfig.extraLocale||[];
for(var i=0;i<_7c.length;i++){
preload(_7c[i]);
}
}
dojo.hostenv.preloadLocalizations=function(){
};
};
dojo.requireLocalization=function(_7e,_7f,_80,_81){
dojo.hostenv.preloadLocalizations();
var _82=dojo.hostenv.normalizeLocale(_80);
var _83=[_7e,"nls",_7f].join(".");
var _84="";
if(_81){
var _85=_81.split(",");
for(var i=0;i<_85.length;i++){
if(_82.indexOf(_85[i])==0){
if(_85[i].length>_84.length){
_84=_85[i];
}
}
}
if(!_84){
_84="ROOT";
}
}
var _87=_81?_84:_82;
var _88=dojo.hostenv.findModule(_83);
var _89=null;
if(_88){
if(djConfig.localizationComplete&&_88._built){
return;
}
var _8a=_87.replace("-","_");
var _8b=_83+"."+_8a;
_89=dojo.hostenv.findModule(_8b);
}
if(!_89){
_88=dojo.hostenv.startPackage(_83);
var _8c=dojo.hostenv.getModuleSymbols(_7e);
var _8d=_8c.concat("nls").join("/");
var _8e;
dojo.hostenv.searchLocalePath(_87,_81,function(loc){
var _90=loc.replace("-","_");
var _91=_83+"."+_90;
var _92=false;
if(!dojo.hostenv.findModule(_91)){
dojo.hostenv.startPackage(_91);
var _93=[_8d];
if(loc!="ROOT"){
_93.push(loc);
}
_93.push(_7f);
var _94=_93.join("/")+".js";
_92=dojo.hostenv.loadPath(_94,null,function(_95){
var _96=function(){
};
_96.prototype=_8e;
_88[_90]=new _96();
for(var j in _95){
_88[_90][j]=_95[j];
}
});
}else{
_92=true;
}
if(_92&&_88[_90]){
_8e=_88[_90];
}else{
_88[_90]=_8e;
}
if(_81){
return true;
}
});
}
if(_81&&_82!=_84){
_88[_82.replace("-","_")]=_88[_84.replace("-","_")];
}
};
(function(){
var _98=djConfig.extraLocale;
if(_98){
if(!_98 instanceof Array){
_98=[_98];
}
var req=dojo.requireLocalization;
dojo.requireLocalization=function(m,b,_9c,_9d){
req(m,b,_9c,_9d);
if(_9c){
return;
}
for(var i=0;i<_98.length;i++){
req(m,b,_98[i],_9d);
}
};
}
})();
dojo.hostenv.resetXd=function(){
this.isXDomain=djConfig.useXDomain||false;
this.xdTimer=0;
this.xdInFlight={};
this.xdOrderedReqs=[];
this.xdDepMap={};
this.xdContents=[];
this.xdDefList=[];
};
dojo.hostenv.resetXd();
dojo.hostenv.createXdPackage=function(_9f,_a0,_a1){
var _a2=[];
var _a3=/dojo.(requireLocalization|require|requireIf|requireAll|provide|requireAfterIf|requireAfter|kwCompoundRequire|conditionalRequire|hostenv\.conditionalLoadModule|.hostenv\.loadModule|hostenv\.moduleLoaded)\(([\w\W]*?)\)/mg;
var _a4;
while((_a4=_a3.exec(_9f))!=null){
if(_a4[1]=="requireLocalization"){
eval(_a4[0]);
}else{
_a2.push("\""+_a4[1]+"\", "+_a4[2]);
}
}
var _a5=[];
_a5.push("dojo.hostenv.packageLoaded({\n");
if(_a2.length>0){
_a5.push("depends: [");
for(var i=0;i<_a2.length;i++){
if(i>0){
_a5.push(",\n");
}
_a5.push("["+_a2[i]+"]");
}
_a5.push("],");
}
_a5.push("\ndefinePackage: function(dojo){");
_a5.push(_9f);
_a5.push("\n}, resourceName: '"+_a0+"', resourcePath: '"+_a1+"'});");
return _a5.join("");
};
dojo.hostenv.loadPath=function(_a7,_a8,cb){
var _aa=_a7.indexOf(":");
var _ab=_a7.indexOf("/");
var uri;
var _ad=false;
if(_aa>0&&_aa<_ab){
uri=_a7;
this.isXDomain=_ad=true;
}else{
uri=this.getBaseScriptUri()+_a7;
_aa=uri.indexOf(":");
_ab=uri.indexOf("/");
if(_aa>0&&_aa<_ab&&(!location.host||uri.indexOf("http://"+location.host)!=0)){
this.isXDomain=_ad=true;
}
}
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return ((!_a8||this.isXDomain)?this.loadUri(uri,cb,_ad,_a8):this.loadUriAndCheck(uri,_a8,cb));
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb,_b0,_b1){
if(this.loadedUris[uri]){
return 1;
}
if(this.isXDomain&&_b1){
if(uri.indexOf("__package__")!=-1){
_b1+=".*";
}
this.xdOrderedReqs.push(_b1);
if(_b0||uri.indexOf("/nls/")==-1){
this.xdInFlight[_b1]=true;
this.inFlightCount++;
}
if(!this.xdTimer){
this.xdTimer=setInterval("dojo.hostenv.watchInFlightXDomain();",100);
}
this.xdStartTime=(new Date()).getTime();
}
if(_b0){
var _b2=uri.lastIndexOf(".");
if(_b2<=0){
_b2=uri.length-1;
}
var _b3=uri.substring(0,_b2)+".xd";
if(_b2!=uri.length-1){
_b3+=uri.substring(_b2,uri.length);
}
var _b4=document.createElement("script");
_b4.type="text/javascript";
_b4.src=_b3;
if(!this.headElement){
this.headElement=document.getElementsByTagName("head")[0];
if(!this.headElement){
this.headElement=document.getElementsByTagName("html")[0];
}
}
this.headElement.appendChild(_b4);
}else{
var _b5=this.getText(uri,null,true);
if(_b5==null){
return 0;
}
if(this.isXDomain&&uri.indexOf("/nls/")==-1){
var pkg=this.createXdPackage(_b5,_b1,uri);
dj_eval(pkg);
}else{
if(cb){
_b5="("+_b5+")";
}
var _b7=dj_eval(_b5);
if(cb){
cb(_b7);
}
}
}
this.loadedUris[uri]=true;
return 1;
};
dojo.hostenv.packageLoaded=function(pkg){
var _b9=pkg.depends;
var _ba=null;
var _bb=null;
var _bc=[];
if(_b9&&_b9.length>0){
var dep=null;
var _be=0;
var _bf=false;
for(var i=0;i<_b9.length;i++){
dep=_b9[i];
if(dep[0]=="provide"||dep[0]=="hostenv.moduleLoaded"){
_bc.push(dep[1]);
}else{
if(!_ba){
_ba=[];
}
if(!_bb){
_bb=[];
}
var _c1=this.unpackXdDependency(dep);
if(_c1.requires){
_ba=_ba.concat(_c1.requires);
}
if(_c1.requiresAfter){
_bb=_bb.concat(_c1.requiresAfter);
}
}
var _c2=dep[0];
var _c3=_c2.split(".");
if(_c3.length==2){
dojo[_c3[0]][_c3[1]].apply(dojo[_c3[0]],dep.slice(1));
}else{
dojo[_c2].apply(dojo,dep.slice(1));
}
}
var _c4=this.xdContents.push({content:pkg.definePackage,resourceName:pkg["resourceName"],resourcePath:pkg["resourcePath"],isDefined:false})-1;
for(var i=0;i<_bc.length;i++){
this.xdDepMap[_bc[i]]={requires:_ba,requiresAfter:_bb,contentIndex:_c4};
}
for(var i=0;i<_bc.length;i++){
this.xdInFlight[_bc[i]]=false;
}
}
};
dojo.hostenv.xdLoadFlattenedBundle=function(_c5,_c6,_c7,_c8){
_c7=_c7||"root";
var _c9=dojo.hostenv.normalizeLocale(_c7).replace("-","_");
var _ca=[_c5,"nls",_c6].join(".");
var _cb=dojo.hostenv.startPackage(_ca);
_cb[_c9]=_c8;
var _cc=[_c5,_c9,_c6].join(".");
var _cd=dojo.hostenv.xdBundleMap[_cc];
if(_cd){
for(var _ce in _cd){
_cb[_ce]=_c8;
}
}
};
dojo.hostenv.xdBundleMap={};
dojo.xdRequireLocalization=function(_cf,_d0,_d1,_d2){
var _d3=_d2.split(",");
var _d4=dojo.hostenv.normalizeLocale(_d1);
var _d5="";
for(var i=0;i<_d3.length;i++){
if(_d4.indexOf(_d3[i])==0){
if(_d3[i].length>_d5.length){
_d5=_d3[i];
}
}
}
var _d7=_d5.replace("-","_");
var _d8=dojo.evalObjPath([_cf,"nls",_d0].join("."));
if(_d8&&_d8[_d7]){
bundle[_d4.replace("-","_")]=_d8[_d7];
}else{
var _d9=[_cf,(_d7||"root"),_d0].join(".");
var _da=dojo.hostenv.xdBundleMap[_d9];
if(!_da){
_da=dojo.hostenv.xdBundleMap[_d9]={};
}
_da[_d4.replace("-","_")]=true;
dojo.require(_cf+".nls"+(_d5?"."+_d5:"")+"."+_d0);
}
};
(function(){
var _db=djConfig.extraLocale;
if(_db){
if(!_db instanceof Array){
_db=[_db];
}
dojo._xdReqLoc=dojo.xdRequireLocalization;
dojo.xdRequireLocalization=function(m,b,_de,_df){
dojo._xdReqLoc(m,b,_de,_df);
if(_de){
return;
}
for(var i=0;i<_db.length;i++){
dojo._xdReqLoc(m,b,_db[i],_df);
}
};
}
})();
dojo.hostenv.unpackXdDependency=function(dep){
var _e2=null;
var _e3=null;
switch(dep[0]){
case "requireIf":
case "requireAfterIf":
case "conditionalRequire":
if((dep[1]===true)||(dep[1]=="common")||(dep[1]&&dojo.render[dep[1]].capable)){
_e2=[{name:dep[2],content:null}];
}
break;
case "requireAll":
dep.shift();
_e2=dep;
dojo.hostenv.flattenRequireArray(_e2);
break;
case "kwCompoundRequire":
case "hostenv.conditionalLoadModule":
var _e4=dep[1];
var _e5=_e4["common"]||[];
var _e2=(_e4[dojo.hostenv.name_])?_e5.concat(_e4[dojo.hostenv.name_]||[]):_e5.concat(_e4["default"]||[]);
dojo.hostenv.flattenRequireArray(_e2);
break;
case "require":
case "requireAfter":
case "hostenv.loadModule":
_e2=[{name:dep[1],content:null}];
break;
}
if(dep[0]=="requireAfterIf"||dep[0]=="requireIf"){
_e3=_e2;
_e2=null;
}
return {requires:_e2,requiresAfter:_e3};
};
dojo.hostenv.xdWalkReqs=function(){
var _e6=null;
var req;
for(var i=0;i<this.xdOrderedReqs.length;i++){
req=this.xdOrderedReqs[i];
if(this.xdDepMap[req]){
_e6=[req];
_e6[req]=true;
this.xdEvalReqs(_e6);
}
}
};
dojo.hostenv.xdEvalReqs=function(_e9){
while(_e9.length>0){
var req=_e9[_e9.length-1];
var pkg=this.xdDepMap[req];
if(pkg){
var _ec=pkg.requires;
if(_ec&&_ec.length>0){
var _ed;
for(var i=0;i<_ec.length;i++){
_ed=_ec[i].name;
if(_ed&&!_e9[_ed]){
_e9.push(_ed);
_e9[_ed]=true;
this.xdEvalReqs(_e9);
}
}
}
var _ef=this.xdContents[pkg.contentIndex];
if(!_ef.isDefined){
var _f0=_ef.content;
_f0["resourceName"]=_ef["resourceName"];
_f0["resourcePath"]=_ef["resourcePath"];
this.xdDefList.push(_f0);
_ef.isDefined=true;
}
this.xdDepMap[req]=null;
var _ec=pkg.requiresAfter;
if(_ec&&_ec.length>0){
var _ed;
for(var i=0;i<_ec.length;i++){
_ed=_ec[i].name;
if(_ed&&!_e9[_ed]){
_e9.push(_ed);
_e9[_ed]=true;
this.xdEvalReqs(_e9);
}
}
}
}
_e9.pop();
}
};
dojo.hostenv.clearXdInterval=function(){
clearInterval(this.xdTimer);
this.xdTimer=0;
};
dojo.hostenv.watchInFlightXDomain=function(){
var _f1=(djConfig.xdWaitSeconds||15)*1000;
if(this.xdStartTime+_f1<(new Date()).getTime()){
this.clearXdInterval();
var _f2="";
for(var _f3 in this.xdInFlight){
if(this.xdInFlight[_f3]){
_f2+=_f3+" ";
}
}
dojo.raise("Could not load cross-domain packages: "+_f2);
}
for(var _f3 in this.xdInFlight){
if(this.xdInFlight[_f3]){
return;
}
}
this.clearXdInterval();
this.xdWalkReqs();
var _f4=this.xdDefList.length;
for(var i=0;i<_f4;i++){
var _f6=dojo.hostenv.xdDefList[i];
if(djConfig["debugAtAllCosts"]&&_f6["resourceName"]){
if(!this["xdDebugQueue"]){
this.xdDebugQueue=[];
}
this.xdDebugQueue.push({resourceName:_f6.resourceName,resourcePath:_f6.resourcePath});
}else{
_f6(dojo);
}
}
for(var i=0;i<this.xdContents.length;i++){
var _f7=this.xdContents[i];
if(_f7.content&&!_f7.isDefined){
_f7.content(dojo);
}
}
this.resetXd();
if(this["xdDebugQueue"]&&this.xdDebugQueue.length>0){
this.xdDebugFileLoaded();
}else{
this.xdNotifyLoaded();
}
};
dojo.hostenv.xdNotifyLoaded=function(){
this.inFlightCount=0;
if(this._djInitFired&&!this.loadNotifying){
this.callLoaded();
}
};
dojo.hostenv.flattenRequireArray=function(_f8){
if(_f8){
for(var i=0;i<_f8.length;i++){
if(_f8[i] instanceof Array){
_f8[i]={name:_f8[i][0],content:null};
}else{
_f8[i]={name:_f8[i],content:null};
}
}
}
};
dojo.hostenv.xdHasCalledPreload=false;
dojo.hostenv.xdRealCallLoaded=dojo.hostenv.callLoaded;
dojo.hostenv.callLoaded=function(){
if(this.xdHasCalledPreload||dojo.hostenv.getModulePrefix("dojo")=="src"||!this.localesGenerated){
this.xdRealCallLoaded();
}else{
if(this.localesGenerated){
this.registerNlsPrefix=function(){
dojo.registerModulePath("nls",dojo.hostenv.getModulePrefix("dojo")+"/../nls");
};
this.preloadLocalizations();
}
}
this.xdHasCalledPreload=true;
};
}
if(typeof window!="undefined"){
(function(){
if(djConfig.allowQueryConfig){
var _fa=document.location.toString();
var _fb=_fa.split("?",2);
if(_fb.length>1){
var _fc=_fb[1];
var _fd=_fc.split("&");
for(var x in _fd){
var sp=_fd[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _101=document.getElementsByTagName("script");
var _102=/(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
for(var i=0;i<_101.length;i++){
var src=_101[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_102);
if(m){
var root=src.substring(0,m.index);
if(src.indexOf("bootstrap1")>-1){
root+="../";
}
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=root;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=root;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var drs=dojo.render.svg;
var dua=(drh.UA=navigator.userAgent);
var dav=(drh.AV=navigator.appVersion);
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _10e=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_10e>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_10e+6,_10e+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
drh.ie70=drh.ie&&dav.indexOf("MSIE 7.0")>=0;
var cm=document["compatMode"];
drh.quirks=(cm=="BackCompat")||(cm=="QuirksMode")||drh.ie55||drh.ie50;
dojo.locale=dojo.locale||(drh.ie?navigator.userLanguage:navigator.language).toLowerCase();
dr.vml.capable=drh.ie;
drs.capable=f;
drs.support.plugin=f;
drs.support.builtin=f;
var tdoc=window["document"];
var tdi=tdoc["implementation"];
if((tdi)&&(tdi["hasFeature"])&&(tdi.hasFeature("org.w3c.dom.svg","1.0"))){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
if(drh.safari){
var tmp=dua.split("AppleWebKit/")[1];
var ver=parseFloat(tmp.split(" ")[0]);
if(ver>=420){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
}else{
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.render.name=dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
dojo.hostenv._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var http=null;
var _115=null;
try{
http=new XMLHttpRequest();
}
catch(e){
}
if(!http){
for(var i=0;i<3;++i){
var _117=dojo.hostenv._XMLHTTP_PROGIDS[i];
try{
http=new ActiveXObject(_117);
}
catch(e){
_115=e;
}
if(http){
dojo.hostenv._XMLHTTP_PROGIDS=[_117];
break;
}
}
}
if(!http){
return dojo.raise("XMLHTTP not available",_115);
}
return http;
};
dojo.hostenv._blockAsync=false;
dojo.hostenv.getText=function(uri,_119,_11a){
if(!_119){
this._blockAsync=true;
}
var http=this.getXmlhttpObject();
function isDocumentOk(http){
var stat=http["status"];
return Boolean((!stat)||((200<=stat)&&(300>stat))||(stat==304));
}
if(_119){
var _11e=this,_11f=null,gbl=dojo.global();
var xhr=dojo.evalObjPath("dojo.io.XMLHTTPTransport");
http.onreadystatechange=function(){
if(_11f){
gbl.clearTimeout(_11f);
_11f=null;
}
if(_11e._blockAsync||(xhr&&xhr._blockAsync)){
_11f=gbl.setTimeout(function(){
http.onreadystatechange.apply(this);
},10);
}else{
if(4==http.readyState){
if(isDocumentOk(http)){
_119(http.responseText);
}
}
}
};
}
http.open("GET",uri,_119?true:false);
try{
http.send(null);
if(_119){
return null;
}
if(!isDocumentOk(http)){
var err=Error("Unable to load "+uri+" status:"+http.status);
err.status=http.status;
err.responseText=http.responseText;
throw err;
}
}
catch(e){
this._blockAsync=false;
if((_11a)&&(!_119)){
return null;
}else{
throw e;
}
}
this._blockAsync=false;
return http.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(line){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(line);
}else{
try{
var _124=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_124){
_124=dojo.body();
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(line));
_124.appendChild(div);
}
catch(e){
try{
document.write("<div>"+line+"</div>");
}
catch(e2){
window.status=line;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(node,_127,fp){
var _129=node["on"+_127]||function(){
};
node["on"+_127]=function(){
fp.apply(node,arguments);
_129.apply(node,arguments);
};
return true;
}
dojo.hostenv._djInitFired=false;
function dj_load_init(e){
dojo.hostenv._djInitFired=true;
var type=(e&&e.type)?e.type.toLowerCase():"load";
if(arguments.callee.initialized||(type!="domcontentloaded"&&type!="load")){
return;
}
arguments.callee.initialized=true;
if(typeof (_timer)!="undefined"){
clearInterval(_timer);
delete _timer;
}
var _12c=function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
};
if(dojo.hostenv.inFlightCount==0){
_12c();
dojo.hostenv.modulesLoaded();
}else{
dojo.hostenv.modulesLoadedListeners.unshift(_12c);
}
}
if(document.addEventListener){
if(dojo.render.html.opera||(dojo.render.html.moz&&(djConfig["enableMozDomContentLoaded"]===true))){
document.addEventListener("DOMContentLoaded",dj_load_init,null);
}
window.addEventListener("load",dj_load_init,null);
}
if(dojo.render.html.ie&&dojo.render.os.win){
document.attachEvent("onreadystatechange",function(e){
if(document.readyState=="complete"){
dj_load_init();
}
});
}
if(/(WebKit|khtml)/i.test(navigator.userAgent)){
var _timer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
dj_load_init();
}
},10);
}
if(dojo.render.html.ie){
dj_addNodeEvtHdlr(window,"beforeunload",function(){
dojo.hostenv._unloading=true;
window.setTimeout(function(){
dojo.hostenv._unloading=false;
},0);
});
}
dj_addNodeEvtHdlr(window,"unload",function(){
dojo.hostenv.unloaded();
if((!dojo.render.html.ie)||(dojo.render.html.ie&&dojo.hostenv._unloading)){
dojo.hostenv.unloaded();
}
});
dojo.hostenv.makeWidgets=function(){
var sids=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
sids=sids.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
sids=sids.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(sids.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
var _12f=new dojo.xml.Parse();
if(sids.length>0){
for(var x=0;x<sids.length;x++){
var _131=document.getElementById(sids[x]);
if(!_131){
continue;
}
var frag=_12f.parseElement(_131,null,true);
dojo.widget.getParser().createComponents(frag);
}
}else{
if(djConfig.parseWidgets){
var frag=_12f.parseElement(dojo.body(),null,true);
dojo.widget.getParser().createComponents(frag);
}
}
}
}
};
dojo.addOnLoad(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
if(!dj_undef("document",this)){
dj_currentDocument=this.document;
}
dojo.doc=function(){
return dj_currentDocument;
};
dojo.body=function(){
return dojo.doc().body||dojo.doc().getElementsByTagName("body")[0];
};
dojo.byId=function(id,doc){
if((id)&&((typeof id=="string")||(id instanceof String))){
if(!doc){
doc=dj_currentDocument;
}
var ele=doc.getElementById(id);
if(ele&&(ele.id!=id)&&doc.all){
ele=null;
eles=doc.all[id];
if(eles){
if(eles.length){
for(var i=0;i<eles.length;i++){
if(eles[i].id==id){
ele=eles[i];
break;
}
}
}else{
ele=eles;
}
}
}
return ele;
}
return id;
};
dojo.setContext=function(_137,_138){
dj_currentContext=_137;
dj_currentDocument=_138;
};
dojo._fireCallback=function(_139,_13a,_13b){
if((_13a)&&((typeof _139=="string")||(_139 instanceof String))){
_139=_13a[_139];
}
return (_13a?_139.apply(_13a,_13b||[]):_139());
};
dojo.withGlobal=function(_13c,_13d,_13e,_13f){
var rval;
var _141=dj_currentContext;
var _142=dj_currentDocument;
try{
dojo.setContext(_13c,_13c.document);
rval=dojo._fireCallback(_13d,_13e,_13f);
}
finally{
dojo.setContext(_141,_142);
}
return rval;
};
dojo.withDoc=function(_143,_144,_145,_146){
var rval;
var _148=dj_currentDocument;
try{
dj_currentDocument=_143;
rval=dojo._fireCallback(_144,_145,_146);
}
finally{
dj_currentDocument=_148;
}
return rval;
};
}
dojo.requireIf((djConfig["isDebug"]||djConfig["debugAtAllCosts"]),"dojo.debug");
dojo.requireIf(djConfig["debugAtAllCosts"]&&!window.widget&&!djConfig["useXDomain"],"dojo.browser_debug");
dojo.requireIf(djConfig["debugAtAllCosts"]&&!window.widget&&djConfig["useXDomain"],"dojo.browser_debug_xd");
dojo.provide("dojo.string.common");
dojo.string.trim=function(str,wh){
if(!str.replace){
return str;
}
if(!str.length){
return str;
}
var re=(wh>0)?(/^\s+/):(wh<0)?(/\s+$/):(/^\s+|\s+$/g);
return str.replace(re,"");
};
dojo.string.trimStart=function(str){
return dojo.string.trim(str,1);
};
dojo.string.trimEnd=function(str){
return dojo.string.trim(str,-1);
};
dojo.string.repeat=function(str,_14f,_150){
var out="";
for(var i=0;i<_14f;i++){
out+=str;
if(_150&&i<_14f-1){
out+=_150;
}
}
return out;
};
dojo.string.pad=function(str,len,c,dir){
var out=String(str);
if(!c){
c="0";
}
if(!dir){
dir=1;
}
while(out.length<len){
if(dir>0){
out=c+out;
}else{
out+=c;
}
}
return out;
};
dojo.string.padLeft=function(str,len,c){
return dojo.string.pad(str,len,c,1);
};
dojo.string.padRight=function(str,len,c){
return dojo.string.pad(str,len,c,-1);
};
dojo.provide("dojo.string");
dojo.provide("dojo.lang.common");
dojo.lang.inherits=function(_15e,_15f){
if(!dojo.lang.isFunction(_15f)){
dojo.raise("dojo.inherits: superclass argument ["+_15f+"] must be a function (subclass: ["+_15e+"']");
}
_15e.prototype=new _15f();
_15e.prototype.constructor=_15e;
_15e.superclass=_15f.prototype;
_15e["super"]=_15f.prototype;
};
dojo.lang._mixin=function(obj,_161){
var tobj={};
for(var x in _161){
if((typeof tobj[x]=="undefined")||(tobj[x]!=_161[x])){
obj[x]=_161[x];
}
}
if(dojo.render.html.ie&&(typeof (_161["toString"])=="function")&&(_161["toString"]!=obj["toString"])&&(_161["toString"]!=tobj["toString"])){
obj.toString=_161.toString;
}
return obj;
};
dojo.lang.mixin=function(obj,_165){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(obj,arguments[i]);
}
return obj;
};
dojo.lang.extend=function(_168,_169){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(_168.prototype,arguments[i]);
}
return _168;
};
dojo.inherits=dojo.lang.inherits;
dojo.mixin=dojo.lang.mixin;
dojo.extend=dojo.lang.extend;
dojo.lang.find=function(_16c,_16d,_16e,_16f){
if(!dojo.lang.isArrayLike(_16c)&&dojo.lang.isArrayLike(_16d)){
dojo.deprecated("dojo.lang.find(value, array)","use dojo.lang.find(array, value) instead","0.5");
var temp=_16c;
_16c=_16d;
_16d=temp;
}
var _171=dojo.lang.isString(_16c);
if(_171){
_16c=_16c.split("");
}
if(_16f){
var step=-1;
var i=_16c.length-1;
var end=-1;
}else{
var step=1;
var i=0;
var end=_16c.length;
}
if(_16e){
while(i!=end){
if(_16c[i]===_16d){
return i;
}
i+=step;
}
}else{
while(i!=end){
if(_16c[i]==_16d){
return i;
}
i+=step;
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(_175,_176,_177){
return dojo.lang.find(_175,_176,_177,true);
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(_178,_179){
return dojo.lang.find(_178,_179)>-1;
};
dojo.lang.isObject=function(it){
if(typeof it=="undefined"){
return false;
}
return (typeof it=="object"||it===null||dojo.lang.isArray(it)||dojo.lang.isFunction(it));
};
dojo.lang.isArray=function(it){
return (it&&it instanceof Array||typeof it=="array");
};
dojo.lang.isArrayLike=function(it){
if((!it)||(dojo.lang.isUndefined(it))){
return false;
}
if(dojo.lang.isString(it)){
return false;
}
if(dojo.lang.isFunction(it)){
return false;
}
if(dojo.lang.isArray(it)){
return true;
}
if((it.tagName)&&(it.tagName.toLowerCase()=="form")){
return false;
}
if(dojo.lang.isNumber(it.length)&&isFinite(it.length)){
return true;
}
return false;
};
dojo.lang.isFunction=function(it){
return (it instanceof Function||typeof it=="function");
};
(function(){
if((dojo.render.html.capable)&&(dojo.render.html["safari"])){
dojo.lang.isFunction=function(it){
if((typeof (it)=="function")&&(it=="[object NodeList]")){
return false;
}
return (it instanceof Function||typeof it=="function");
};
}
})();
dojo.lang.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.lang.isAlien=function(it){
if(!it){
return false;
}
return !dojo.lang.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.lang.isBoolean=function(it){
return (it instanceof Boolean||typeof it=="boolean");
};
dojo.lang.isNumber=function(it){
return (it instanceof Number||typeof it=="number");
};
dojo.lang.isUndefined=function(it){
return ((typeof (it)=="undefined")&&(it==undefined));
};
dojo.provide("dojo.lang.extras");
dojo.lang.setTimeout=function(func,_185){
var _186=window,_187=2;
if(!dojo.lang.isFunction(func)){
_186=func;
func=_185;
_185=arguments[2];
_187++;
}
if(dojo.lang.isString(func)){
func=_186[func];
}
var args=[];
for(var i=_187;i<arguments.length;i++){
args.push(arguments[i]);
}
return dojo.global().setTimeout(function(){
func.apply(_186,args);
},_185);
};
dojo.lang.clearTimeout=function(_18a){
dojo.global().clearTimeout(_18a);
};
dojo.lang.getNameInObj=function(ns,item){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===item){
return new String(x);
}
}
return null;
};
dojo.lang.shallowCopy=function(obj,deep){
var i,ret;
if(obj===null){
return null;
}
if(dojo.lang.isObject(obj)){
ret=new obj.constructor();
for(i in obj){
if(dojo.lang.isUndefined(ret[i])){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}
}else{
if(dojo.lang.isArray(obj)){
ret=[];
for(i=0;i<obj.length;i++){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}else{
ret=obj;
}
}
return ret;
};
dojo.lang.firstValued=function(){
for(var i=0;i<arguments.length;i++){
if(typeof arguments[i]!="undefined"){
return arguments[i];
}
}
return undefined;
};
dojo.lang.getObjPathValue=function(_193,_194,_195){
with(dojo.parseObjPath(_193,_194,_195)){
return dojo.evalProp(prop,obj,_195);
}
};
dojo.lang.setObjPathValue=function(_196,_197,_198,_199){
dojo.deprecated("dojo.lang.setObjPathValue","use dojo.parseObjPath and the '=' operator","0.6");
if(arguments.length<4){
_199=true;
}
with(dojo.parseObjPath(_196,_198,_199)){
if(obj&&(_199||(prop in obj))){
obj[prop]=_197;
}
}
};
dojo.provide("dojo.io.common");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error","timeout"];
dojo.io.Request=function(url,_19b,_19c,_19d){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(_19b){
this.mimetype=_19b;
}
if(_19c){
this.transport=_19c;
}
if(arguments.length>=4){
this.changeUrl=_19d;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,preventCache:false,load:function(type,data,_1a0,_1a1){
},error:function(type,_1a3,_1a4,_1a5){
},timeout:function(type,_1a7,_1a8,_1a9){
},handle:function(type,data,_1ac,_1ad){
},timeoutSeconds:0,abort:function(){
},fromKwArgs:function(_1ae){
if(_1ae["url"]){
_1ae.url=_1ae.url.toString();
}
if(_1ae["formNode"]){
_1ae.formNode=dojo.byId(_1ae.formNode);
}
if(!_1ae["method"]&&_1ae["formNode"]&&_1ae["formNode"].method){
_1ae.method=_1ae["formNode"].method;
}
if(!_1ae["handle"]&&_1ae["handler"]){
_1ae.handle=_1ae.handler;
}
if(!_1ae["load"]&&_1ae["loaded"]){
_1ae.load=_1ae.loaded;
}
if(!_1ae["changeUrl"]&&_1ae["changeURL"]){
_1ae.changeUrl=_1ae.changeURL;
}
_1ae.encoding=dojo.lang.firstValued(_1ae["encoding"],djConfig["bindEncoding"],"");
_1ae.sendTransport=dojo.lang.firstValued(_1ae["sendTransport"],djConfig["ioSendTransport"],false);
var _1af=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_1ae[fn]&&_1af(_1ae[fn])){
continue;
}
if(_1ae["handle"]&&_1af(_1ae["handle"])){
_1ae[fn]=_1ae.handle;
}
}
dojo.lang.mixin(this,_1ae);
}});
dojo.io.Error=function(msg,type,num){
this.message=msg;
this.type=type||"unknown";
this.number=num||0;
};
dojo.io.transports.addTransport=function(name){
this.push(name);
this[name]=dojo.io[name];
};
dojo.io.bind=function(_1b6){
if(!(_1b6 instanceof dojo.io.Request)){
try{
_1b6=new dojo.io.Request(_1b6);
}
catch(e){
dojo.debug(e);
}
}
var _1b7="";
if(_1b6["transport"]){
_1b7=_1b6["transport"];
if(!this[_1b7]){
dojo.io.sendBindError(_1b6,"No dojo.io.bind() transport with name '"+_1b6["transport"]+"'.");
return _1b6;
}
if(!this[_1b7].canHandle(_1b6)){
dojo.io.sendBindError(_1b6,"dojo.io.bind() transport with name '"+_1b6["transport"]+"' cannot handle this type of request.");
return _1b6;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_1b6))){
_1b7=tmp;
break;
}
}
if(_1b7==""){
dojo.io.sendBindError(_1b6,"None of the loaded transports for dojo.io.bind()"+" can handle the request.");
return _1b6;
}
}
this[_1b7].bind(_1b6);
_1b6.bindSuccess=true;
return _1b6;
};
dojo.io.sendBindError=function(_1ba,_1bb){
if((typeof _1ba.error=="function"||typeof _1ba.handle=="function")&&(typeof setTimeout=="function"||typeof setTimeout=="object")){
var _1bc=new dojo.io.Error(_1bb);
setTimeout(function(){
_1ba[(typeof _1ba.error=="function")?"error":"handle"]("error",_1bc,null,_1ba);
},50);
}else{
dojo.raise(_1bb);
}
};
dojo.io.queueBind=function(_1bd){
if(!(_1bd instanceof dojo.io.Request)){
try{
_1bd=new dojo.io.Request(_1bd);
}
catch(e){
dojo.debug(e);
}
}
var _1be=_1bd.load;
_1bd.load=function(){
dojo.io._queueBindInFlight=false;
var ret=_1be.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
var _1c0=_1bd.error;
_1bd.error=function(){
dojo.io._queueBindInFlight=false;
var ret=_1c0.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
dojo.io._bindQueue.push(_1bd);
dojo.io._dispatchNextQueueBind();
return _1bd;
};
dojo.io._dispatchNextQueueBind=function(){
if(!dojo.io._queueBindInFlight){
dojo.io._queueBindInFlight=true;
if(dojo.io._bindQueue.length>0){
dojo.io.bind(dojo.io._bindQueue.shift());
}else{
dojo.io._queueBindInFlight=false;
}
}
};
dojo.io._bindQueue=[];
dojo.io._queueBindInFlight=false;
dojo.io.argsFromMap=function(map,_1c3,last){
var enc=/utf/i.test(_1c3||"")?encodeURIComponent:dojo.string.encodeAscii;
var _1c6=[];
var _1c7=new Object();
for(var name in map){
var _1c9=function(elt){
var val=enc(name)+"="+enc(elt);
_1c6[(last==name)?"push":"unshift"](val);
};
if(!_1c7[name]){
var _1cc=map[name];
if(dojo.lang.isArray(_1cc)){
dojo.lang.forEach(_1cc,_1c9);
}else{
_1c9(_1cc);
}
}
}
return _1c6.join("&");
};
dojo.io.setIFrameSrc=function(_1cd,src,_1cf){
try{
var r=dojo.render.html;
if(!_1cf){
if(r.safari){
_1cd.location=src;
}else{
frames[_1cd.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_1cd.contentWindow.document;
}else{
if(r.safari){
idoc=_1cd.document;
}else{
idoc=_1cd.contentWindow;
}
}
if(!idoc){
_1cd.location=src;
return;
}else{
idoc.location.replace(src);
}
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.provide("dojo.lang.array");
dojo.lang.mixin(dojo.lang,{has:function(obj,name){
try{
return typeof obj[name]!="undefined";
}
catch(e){
return false;
}
},isEmpty:function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _1d6=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_1d6++;
break;
}
}
return _1d6==0;
}else{
if(dojo.lang.isArrayLike(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
},map:function(arr,obj,_1da){
var _1db=dojo.lang.isString(arr);
if(_1db){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_1da)){
_1da=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_1da){
var _1dc=obj;
obj=_1da;
_1da=_1dc;
}
}
if(Array.map){
var _1dd=Array.map(arr,_1da,obj);
}else{
var _1dd=[];
for(var i=0;i<arr.length;++i){
_1dd.push(_1da.call(obj,arr[i]));
}
}
if(_1db){
return _1dd.join("");
}else{
return _1dd;
}
},reduce:function(arr,_1e0,obj,_1e2){
var _1e3=_1e0;
if(arguments.length==2){
_1e2=_1e0;
_1e3=arr[0];
arr=arr.slice(1);
}else{
if(arguments.length==3){
if(dojo.lang.isFunction(obj)){
_1e2=obj;
obj=null;
}
}else{
if(dojo.lang.isFunction(obj)){
var tmp=_1e2;
_1e2=obj;
obj=tmp;
}
}
}
var ob=obj||dj_global;
dojo.lang.map(arr,function(val){
_1e3=_1e2.call(ob,_1e3,val);
});
return _1e3;
},forEach:function(_1e7,_1e8,_1e9){
if(dojo.lang.isString(_1e7)){
_1e7=_1e7.split("");
}
if(Array.forEach){
Array.forEach(_1e7,_1e8,_1e9);
}else{
if(!_1e9){
_1e9=dj_global;
}
for(var i=0,l=_1e7.length;i<l;i++){
_1e8.call(_1e9,_1e7[i],i,_1e7);
}
}
},_everyOrSome:function(_1ec,arr,_1ee,_1ef){
if(dojo.lang.isString(arr)){
arr=arr.split("");
}
if(Array.every){
return Array[_1ec?"every":"some"](arr,_1ee,_1ef);
}else{
if(!_1ef){
_1ef=dj_global;
}
for(var i=0,l=arr.length;i<l;i++){
var _1f2=_1ee.call(_1ef,arr[i],i,arr);
if(_1ec&&!_1f2){
return false;
}else{
if((!_1ec)&&(_1f2)){
return true;
}
}
}
return Boolean(_1ec);
}
},every:function(arr,_1f4,_1f5){
return this._everyOrSome(true,arr,_1f4,_1f5);
},some:function(arr,_1f7,_1f8){
return this._everyOrSome(false,arr,_1f7,_1f8);
},filter:function(arr,_1fa,_1fb){
var _1fc=dojo.lang.isString(arr);
if(_1fc){
arr=arr.split("");
}
var _1fd;
if(Array.filter){
_1fd=Array.filter(arr,_1fa,_1fb);
}else{
if(!_1fb){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_1fb=dj_global;
}
_1fd=[];
for(var i=0;i<arr.length;i++){
if(_1fa.call(_1fb,arr[i],i,arr)){
_1fd.push(arr[i]);
}
}
}
if(_1fc){
return _1fd.join("");
}else{
return _1fd;
}
},unnest:function(){
var out=[];
for(var i=0;i<arguments.length;i++){
if(dojo.lang.isArrayLike(arguments[i])){
var add=dojo.lang.unnest.apply(this,arguments[i]);
out=out.concat(add);
}else{
out.push(arguments[i]);
}
}
return out;
},toArray:function(_202,_203){
var _204=[];
for(var i=_203||0;i<_202.length;i++){
_204.push(_202[i]);
}
return _204;
}});
dojo.provide("dojo.lang.func");
dojo.lang.hitch=function(_206,_207){
var args=[];
for(var x=2;x<arguments.length;x++){
args.push(arguments[x]);
}
var fcn=(dojo.lang.isString(_207)?_206[_207]:_207)||function(){
};
return function(){
var ta=args.concat([]);
for(var x=0;x<arguments.length;x++){
ta.push(arguments[x]);
}
return fcn.apply(_206,ta);
};
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_20d,_20e,_20f){
var nso=(_20e||dojo.lang.anon);
if((_20f)||((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true))){
for(var x in nso){
try{
if(nso[x]===_20d){
return x;
}
}
catch(e){
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_20d;
return ret;
};
dojo.lang.forward=function(_213){
return function(){
return this[_213].apply(this,arguments);
};
};
dojo.lang.curry=function(_214,func){
var _216=[];
_214=_214||dj_global;
if(dojo.lang.isString(func)){
func=_214[func];
}
for(var x=2;x<arguments.length;x++){
_216.push(arguments[x]);
}
var _218=(func["__preJoinArity"]||func.length)-_216.length;
function gather(_219,_21a,_21b){
var _21c=_21b;
var _21d=_21a.slice(0);
for(var x=0;x<_219.length;x++){
_21d.push(_219[x]);
}
_21b=_21b-_219.length;
if(_21b<=0){
var res=func.apply(_214,_21d);
_21b=_21c;
return res;
}else{
return function(){
return gather(arguments,_21d,_21b);
};
}
}
return gather([],_216,_218);
};
dojo.lang.curryArguments=function(_220,func,args,_223){
var _224=[];
var x=_223||0;
for(x=_223;x<args.length;x++){
_224.push(args[x]);
}
return dojo.lang.curry.apply(dojo.lang,[_220,func].concat(_224));
};
dojo.lang.tryThese=function(){
for(var x=0;x<arguments.length;x++){
try{
if(typeof arguments[x]=="function"){
var ret=(arguments[x]());
if(ret){
return ret;
}
}
}
catch(e){
dojo.debug(e);
}
}
};
dojo.lang.delayThese=function(farr,cb,_22a,_22b){
if(!farr.length){
if(typeof _22b=="function"){
_22b();
}
return;
}
if((typeof _22a=="undefined")&&(typeof cb=="number")){
_22a=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_22a){
_22a=0;
}
}
}
setTimeout(function(){
(farr.shift())();
cb();
dojo.lang.delayThese(farr,cb,_22a,_22b);
},_22a);
};
dojo.provide("dojo.string.extras");
dojo.string.substituteParams=function(_22c,hash){
var map=(typeof hash=="object")?hash:dojo.lang.toArray(arguments,1);
return _22c.replace(/\%\{(\w+)\}/g,function(_22f,key){
if(typeof (map[key])!="undefined"&&map[key]!=null){
return map[key];
}
dojo.raise("Substitution not found: "+key);
});
};
dojo.string.capitalize=function(str){
if(!dojo.lang.isString(str)){
return "";
}
if(arguments.length==0){
str=this;
}
var _232=str.split(" ");
for(var i=0;i<_232.length;i++){
_232[i]=_232[i].charAt(0).toUpperCase()+_232[i].substring(1);
}
return _232.join(" ");
};
dojo.string.isBlank=function(str){
if(!dojo.lang.isString(str)){
return true;
}
return (dojo.string.trim(str).length==0);
};
dojo.string.encodeAscii=function(str){
if(!dojo.lang.isString(str)){
return str;
}
var ret="";
var _237=escape(str);
var _238,re=/%u([0-9A-F]{4})/i;
while((_238=_237.match(re))){
var num=Number("0x"+_238[1]);
var _23b=escape("&#"+num+";");
ret+=_237.substring(0,_238.index)+_23b;
_237=_237.substring(_238.index+_238[0].length);
}
ret+=_237.replace(/\+/g,"%2B");
return ret;
};
dojo.string.escape=function(type,str){
var args=dojo.lang.toArray(arguments,1);
switch(type.toLowerCase()){
case "xml":
case "html":
case "xhtml":
return dojo.string.escapeXml.apply(this,args);
case "sql":
return dojo.string.escapeSql.apply(this,args);
case "regexp":
case "regex":
return dojo.string.escapeRegExp.apply(this,args);
case "javascript":
case "jscript":
case "js":
return dojo.string.escapeJavaScript.apply(this,args);
case "ascii":
return dojo.string.encodeAscii.apply(this,args);
default:
return str;
}
};
dojo.string.escapeXml=function(str,_240){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_240){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}
return str.substring(0,len).replace(/\.+$/,"")+"...";
};
dojo.string.endsWith=function(str,end,_249){
if(_249){
str=str.toLowerCase();
end=end.toLowerCase();
}
if((str.length-end.length)<0){
return false;
}
return str.lastIndexOf(end)==str.length-end.length;
};
dojo.string.endsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.endsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.startsWith=function(str,_24d,_24e){
if(_24e){
str=str.toLowerCase();
_24d=_24d.toLowerCase();
}
return str.indexOf(_24d)==0;
};
dojo.string.startsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.startsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.has=function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i])>-1){
return true;
}
}
return false;
};
dojo.string.normalizeNewlines=function(text,_254){
if(_254=="\n"){
text=text.replace(/\r\n/g,"\n");
text=text.replace(/\r/g,"\n");
}else{
if(_254=="\r"){
text=text.replace(/\r\n/g,"\r");
text=text.replace(/\n/g,"\r");
}else{
text=text.replace(/([^\r])\n/g,"$1\r\n").replace(/\r([^\n])/g,"\r\n$1");
}
}
return text;
};
dojo.string.splitEscaped=function(str,_256){
var _257=[];
for(var i=0,_259=0;i<str.length;i++){
if(str.charAt(i)=="\\"){
i++;
continue;
}
if(str.charAt(i)==_256){
_257.push(str.substring(_259,i));
_259=i+1;
}
}
_257.push(str.substr(_259));
return _257;
};
dojo.provide("dojo.dom");
dojo.dom.ELEMENT_NODE=1;
dojo.dom.ATTRIBUTE_NODE=2;
dojo.dom.TEXT_NODE=3;
dojo.dom.CDATA_SECTION_NODE=4;
dojo.dom.ENTITY_REFERENCE_NODE=5;
dojo.dom.ENTITY_NODE=6;
dojo.dom.PROCESSING_INSTRUCTION_NODE=7;
dojo.dom.COMMENT_NODE=8;
dojo.dom.DOCUMENT_NODE=9;
dojo.dom.DOCUMENT_TYPE_NODE=10;
dojo.dom.DOCUMENT_FRAGMENT_NODE=11;
dojo.dom.NOTATION_NODE=12;
dojo.dom.dojoml="http://www.dojotoolkit.org/2004/dojoml";
dojo.dom.xmlns={svg:"http://www.w3.org/2000/svg",smil:"http://www.w3.org/2001/SMIL20/",mml:"http://www.w3.org/1998/Math/MathML",cml:"http://www.xml-cml.org",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml",xul:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",xbl:"http://www.mozilla.org/xbl",fo:"http://www.w3.org/1999/XSL/Format",xsl:"http://www.w3.org/1999/XSL/Transform",xslt:"http://www.w3.org/1999/XSL/Transform",xi:"http://www.w3.org/2001/XInclude",xforms:"http://www.w3.org/2002/01/xforms",saxon:"http://icl.com/saxon",xalan:"http://xml.apache.org/xslt",xsd:"http://www.w3.org/2001/XMLSchema",dt:"http://www.w3.org/2001/XMLSchema-datatypes",xsi:"http://www.w3.org/2001/XMLSchema-instance",rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",dc:"http://purl.org/dc/elements/1.1/",dcq:"http://purl.org/dc/qualifiers/1.0","soap-env":"http://schemas.xmlsoap.org/soap/envelope/",wsdl:"http://schemas.xmlsoap.org/wsdl/",AdobeExtensions:"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"};
dojo.dom.isNode=function(wh){
if(typeof Element=="function"){
try{
return wh instanceof Element;
}
catch(e){
}
}else{
return wh&&!isNaN(wh.nodeType);
}
};
dojo.dom.getUniqueId=function(){
var _25b=dojo.doc();
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(_25b.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_25d,_25e){
var node=_25d.firstChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.nextSibling;
}
if(_25e&&node&&node.tagName&&node.tagName.toLowerCase()!=_25e.toLowerCase()){
node=dojo.dom.nextElement(node,_25e);
}
return node;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_260,_261){
var node=_260.lastChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.previousSibling;
}
if(_261&&node&&node.tagName&&node.tagName.toLowerCase()!=_261.toLowerCase()){
node=dojo.dom.prevElement(node,_261);
}
return node;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(node,_264){
if(!node){
return null;
}
do{
node=node.nextSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_264&&_264.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.nextElement(node,_264);
}
return node;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(node,_266){
if(!node){
return null;
}
if(_266){
_266=_266.toLowerCase();
}
do{
node=node.previousSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_266&&_266.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.prevElement(node,_266);
}
return node;
};
dojo.dom.moveChildren=function(_267,_268,trim){
var _26a=0;
if(trim){
while(_267.hasChildNodes()&&_267.firstChild.nodeType==dojo.dom.TEXT_NODE){
_267.removeChild(_267.firstChild);
}
while(_267.hasChildNodes()&&_267.lastChild.nodeType==dojo.dom.TEXT_NODE){
_267.removeChild(_267.lastChild);
}
}
while(_267.hasChildNodes()){
_268.appendChild(_267.firstChild);
_26a++;
}
return _26a;
};
dojo.dom.copyChildren=function(_26b,_26c,trim){
var _26e=_26b.cloneNode(true);
return this.moveChildren(_26e,_26c,trim);
};
dojo.dom.replaceChildren=function(node,_270){
var _271=[];
if(dojo.render.html.ie){
for(var i=0;i<node.childNodes.length;i++){
_271.push(node.childNodes[i]);
}
}
dojo.dom.removeChildren(node);
node.appendChild(_270);
for(var i=0;i<_271.length;i++){
dojo.dom.destroyNode(_271[i]);
}
};
dojo.dom.removeChildren=function(node){
var _274=node.childNodes.length;
while(node.hasChildNodes()){
dojo.dom.removeNode(node.firstChild);
}
return _274;
};
dojo.dom.replaceNode=function(node,_276){
return node.parentNode.replaceChild(_276,node);
};
dojo.dom.destroyNode=function(node){
if(node.parentNode){
node=dojo.dom.removeNode(node);
}
if(node.nodeType!=3){
if(dojo.evalObjPath("dojo.event.browser.clean",false)){
dojo.event.browser.clean(node);
}
if(dojo.render.html.ie){
node.outerHTML="";
}
}
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_27a,_27b){
var _27c=[];
var _27d=(_27a&&(_27a instanceof Function||typeof _27a=="function"));
while(node){
if(!_27d||_27a(node)){
_27c.push(node);
}
if(_27b&&_27c.length>0){
return _27c[0];
}
node=node.parentNode;
}
if(_27b){
return null;
}
return _27c;
};
dojo.dom.getAncestorsByTag=function(node,tag,_280){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_280);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_285,_286){
if(_286&&node){
node=node.parentNode;
}
while(node){
if(node==_285){
return true;
}
node=node.parentNode;
}
return false;
};
dojo.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(node.xml){
return node.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
}
};
dojo.dom.createDocument=function(){
var doc=null;
var _289=dojo.doc();
if(!dj_undef("ActiveXObject")){
var _28a=["MSXML2","Microsoft","MSXML","MSXML3"];
for(var i=0;i<_28a.length;i++){
try{
doc=new ActiveXObject(_28a[i]+".XMLDOM");
}
catch(e){
}
if(doc){
break;
}
}
}else{
if((_289.implementation)&&(_289.implementation.createDocument)){
doc=_289.implementation.createDocument("","",null);
}
}
return doc;
};
dojo.dom.createDocumentFromText=function(str,_28d){
if(!_28d){
_28d="text/xml";
}
if(!dj_undef("DOMParser")){
var _28e=new DOMParser();
return _28e.parseFromString(str,_28d);
}else{
if(!dj_undef("ActiveXObject")){
var _28f=dojo.dom.createDocument();
if(_28f){
_28f.async=false;
_28f.loadXML(str);
return _28f;
}else{
dojo.debug("toXml didn't work?");
}
}else{
var _290=dojo.doc();
if(_290.createElement){
var tmp=_290.createElement("xml");
tmp.innerHTML=str;
if(_290.implementation&&_290.implementation.createDocument){
var _292=_290.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_292.importNode(tmp.childNodes.item(i),true);
}
return _292;
}
return ((tmp.document)&&(tmp.document.firstChild?tmp.document.firstChild:tmp));
}
}
}
return null;
};
dojo.dom.prependChild=function(node,_295){
if(_295.firstChild){
_295.insertBefore(node,_295.firstChild);
}else{
_295.appendChild(node);
}
return true;
};
dojo.dom.insertBefore=function(node,ref,_298){
if((_298!=true)&&(node===ref||node.nextSibling===ref)){
return false;
}
var _299=ref.parentNode;
_299.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_29c){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_29c!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_29c);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_2a0){
if((!node)||(!ref)||(!_2a0)){
return false;
}
switch(_2a0.toLowerCase()){
case "before":
return dojo.dom.insertBefore(node,ref);
case "after":
return dojo.dom.insertAfter(node,ref);
case "first":
if(ref.firstChild){
return dojo.dom.insertBefore(node,ref.firstChild);
}else{
ref.appendChild(node);
return true;
}
break;
default:
ref.appendChild(node);
return true;
}
};
dojo.dom.insertAtIndex=function(node,_2a2,_2a3){
var _2a4=_2a2.childNodes;
if(!_2a4.length||_2a4.length==_2a3){
_2a2.appendChild(node);
return true;
}
if(_2a3==0){
return dojo.dom.prependChild(node,_2a2);
}
return dojo.dom.insertAfter(node,_2a4[_2a3-1]);
};
dojo.dom.textContent=function(node,text){
if(arguments.length>1){
var _2a7=dojo.doc();
dojo.dom.replaceChildren(node,_2a7.createTextNode(text));
return text;
}else{
if(node.textContent!=undefined){
return node.textContent;
}
var _2a8="";
if(node==null){
return _2a8;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_2a8+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_2a8+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _2a8;
}
};
dojo.dom.hasParent=function(node){
return Boolean(node&&node.parentNode&&dojo.dom.isNode(node.parentNode));
};
dojo.dom.isTag=function(node){
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName==String(arguments[i])){
return String(arguments[i]);
}
}
}
return "";
};
dojo.dom.setAttributeNS=function(elem,_2ae,_2af,_2b0){
if(elem==null||((elem==undefined)&&(typeof elem=="undefined"))){
dojo.raise("No element given to dojo.dom.setAttributeNS");
}
if(!((elem.setAttributeNS==undefined)&&(typeof elem.setAttributeNS=="undefined"))){
elem.setAttributeNS(_2ae,_2af,_2b0);
}else{
var _2b1=elem.ownerDocument;
var _2b2=_2b1.createNode(2,_2af,_2ae);
_2b2.nodeValue=_2b0;
elem.setAttributeNode(_2b2);
}
};
dojo.provide("dojo.undo.browser");
try{
if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(djConfig["dojoIframeHistoryUrl"]||dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
if(dojo.render.html.opera){
dojo.debug("Opera is not supported with dojo.undo.browser, so back/forward detection will not work.");
}
dojo.undo.browser={initialHref:(!dj_undef("window"))?window.location.href:"",initialHash:(!dj_undef("window"))?window.location.hash:"",moveForward:false,historyStack:[],forwardStack:[],historyIframe:null,bookmarkAnchor:null,locationTimer:null,setInitialState:function(args){
this.initialState=this._createState(this.initialHref,args,this.initialHash);
},addToHistory:function(args){
this.forwardStack=[];
var hash=null;
var url=null;
if(!this.historyIframe){
if(djConfig["useXDomain"]&&!djConfig["dojoIframeHistoryUrl"]){
dojo.debug("dojo.undo.browser: When using cross-domain Dojo builds,"+" please save iframe_history.html to your domain and set djConfig.dojoIframeHistoryUrl"+" to the path on your domain to iframe_history.html");
}
this.historyIframe=window.frames["djhistory"];
}
if(!this.bookmarkAnchor){
this.bookmarkAnchor=document.createElement("a");
dojo.body().appendChild(this.bookmarkAnchor);
this.bookmarkAnchor.style.display="none";
}
if(args["changeUrl"]){
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
if(this.historyStack.length==0&&this.initialState.urlHash==hash){
this.initialState=this._createState(url,args,hash);
return;
}else{
if(this.historyStack.length>0&&this.historyStack[this.historyStack.length-1].urlHash==hash){
this.historyStack[this.historyStack.length-1]=this._createState(url,args,hash);
return;
}
}
this.changingUrl=true;
setTimeout("window.location.href = '"+hash+"'; dojo.undo.browser.changingUrl = false;",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
url=this._loadIframeHistory();
var _2b7=args["back"]||args["backButton"]||args["handle"];
var tcb=function(_2b9){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+hash+"';",1);
}
_2b7.apply(this,[_2b9]);
};
if(args["back"]){
args.back=tcb;
}else{
if(args["backButton"]){
args.backButton=tcb;
}else{
if(args["handle"]){
args.handle=tcb;
}
}
}
var _2ba=args["forward"]||args["forwardButton"]||args["handle"];
var tfw=function(_2bc){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_2ba){
_2ba.apply(this,[_2bc]);
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}else{
if(args["handle"]){
args.handle=tfw;
}
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.undo.browser.checkLocation();",200);
}
}
}
}else{
url=this._loadIframeHistory();
}
this.historyStack.push(this._createState(url,args,hash));
},checkLocation:function(){
if(!this.changingUrl){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash||window.location.href==this.initialHref)&&(hsl==1)){
this.handleBackButton();
return;
}
if(this.forwardStack.length>0){
if(this.forwardStack[this.forwardStack.length-1].urlHash==window.location.hash){
this.handleForwardButton();
return;
}
}
if((hsl>=2)&&(this.historyStack[hsl-2])){
if(this.historyStack[hsl-2].urlHash==window.location.hash){
this.handleBackButton();
return;
}
}
}
},iframeLoaded:function(evt,_2bf){
if(!dojo.render.html.opera){
var _2c0=this._getUrlQuery(_2bf.href);
if(_2c0==null){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
if(this.moveForward){
this.moveForward=false;
return;
}
if(this.historyStack.length>=2&&_2c0==this._getUrlQuery(this.historyStack[this.historyStack.length-2].url)){
this.handleBackButton();
}else{
if(this.forwardStack.length>0&&_2c0==this._getUrlQuery(this.forwardStack[this.forwardStack.length-1].url)){
this.handleForwardButton();
}
}
}
},handleBackButton:function(){
var _2c1=this.historyStack.pop();
if(!_2c1){
return;
}
var last=this.historyStack[this.historyStack.length-1];
if(!last&&this.historyStack.length==0){
last=this.initialState;
}
if(last){
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(_2c1);
},handleForwardButton:function(){
var last=this.forwardStack.pop();
if(!last){
return;
}
if(last.kwArgs["forward"]){
last.kwArgs.forward();
}else{
if(last.kwArgs["forwardButton"]){
last.kwArgs.forwardButton();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("forward");
}
}
}
this.historyStack.push(last);
},_createState:function(url,args,hash){
return {"url":url,"kwArgs":args,"urlHash":hash};
},_getUrlQuery:function(url){
var _2c8=url.split("?");
if(_2c8.length<2){
return null;
}else{
return _2c8[1];
}
},_loadIframeHistory:function(){
var url=(djConfig["dojoIframeHistoryUrl"]||dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"?"+(new Date()).getTime();
this.moveForward=true;
dojo.io.setIFrameSrc(this.historyIframe,url,false);
return url;
}};
dojo.provide("dojo.io.BrowserIO");
if(!dj_undef("window")){
dojo.io.checkChildrenForFile=function(node){
var _2cb=false;
var _2cc=node.getElementsByTagName("input");
dojo.lang.forEach(_2cc,function(_2cd){
if(_2cb){
return;
}
if(_2cd.getAttribute("type")=="file"){
_2cb=true;
}
});
return _2cb;
};
dojo.io.formHasFile=function(_2ce){
return dojo.io.checkChildrenForFile(_2ce);
};
dojo.io.updateNode=function(node,_2d0){
node=dojo.byId(node);
var args=_2d0;
if(dojo.lang.isString(_2d0)){
args={url:_2d0};
}
args.mimetype="text/html";
args.load=function(t,d,e){
while(node.firstChild){
dojo.dom.destroyNode(node.firstChild);
}
node.innerHTML=d;
};
dojo.io.bind(args);
};
dojo.io.formFilter=function(node){
var type=(node.type||"").toLowerCase();
return !node.disabled&&node.name&&!dojo.lang.inArray(["file","submit","image","reset","button"],type);
};
dojo.io.encodeForm=function(_2d7,_2d8,_2d9){
if((!_2d7)||(!_2d7.tagName)||(!_2d7.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
if(!_2d9){
_2d9=dojo.io.formFilter;
}
var enc=/utf/i.test(_2d8||"")?encodeURIComponent:dojo.string.encodeAscii;
var _2db=[];
for(var i=0;i<_2d7.elements.length;i++){
var elm=_2d7.elements[i];
if(!elm||elm.tagName.toLowerCase()=="fieldset"||!_2d9(elm)){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_2db.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(["radio","checkbox"],type)){
if(elm.checked){
_2db.push(name+"="+enc(elm.value));
}
}else{
_2db.push(name+"="+enc(elm.value));
}
}
}
var _2e1=_2d7.getElementsByTagName("input");
for(var i=0;i<_2e1.length;i++){
var _2e2=_2e1[i];
if(_2e2.type.toLowerCase()=="image"&&_2e2.form==_2d7&&_2d9(_2e2)){
var name=enc(_2e2.name);
_2db.push(name+"="+enc(_2e2.value));
_2db.push(name+".x=0");
_2db.push(name+".y=0");
}
}
return _2db.join("&")+"&";
};
dojo.io.FormBind=function(args){
this.bindArgs={};
if(args&&args.formNode){
this.init(args);
}else{
if(args){
this.init({formNode:args});
}
}
};
dojo.lang.extend(dojo.io.FormBind,{form:null,bindArgs:null,clickedButton:null,init:function(args){
var form=dojo.byId(args.formNode);
if(!form||!form.tagName||form.tagName.toLowerCase()!="form"){
throw new Error("FormBind: Couldn't apply, invalid form");
}else{
if(this.form==form){
return;
}else{
if(this.form){
throw new Error("FormBind: Already applied to a form");
}
}
}
dojo.lang.mixin(this.bindArgs,args);
this.form=form;
this.connect(form,"onsubmit","submit");
for(var i=0;i<form.elements.length;i++){
var node=form.elements[i];
if(node&&node.type&&dojo.lang.inArray(["submit","button"],node.type.toLowerCase())){
this.connect(node,"onclick","click");
}
}
var _2e8=form.getElementsByTagName("input");
for(var i=0;i<_2e8.length;i++){
var _2e9=_2e8[i];
if(_2e9.type.toLowerCase()=="image"&&_2e9.form==form){
this.connect(_2e9,"onclick","click");
}
}
},onSubmit:function(form){
return true;
},submit:function(e){
e.preventDefault();
if(this.onSubmit(this.form)){
dojo.io.bind(dojo.lang.mixin(this.bindArgs,{formFilter:dojo.lang.hitch(this,"formFilter")}));
}
},click:function(e){
var node=e.currentTarget;
if(node.disabled){
return;
}
this.clickedButton=node;
},formFilter:function(node){
var type=(node.type||"").toLowerCase();
var _2f0=false;
if(node.disabled||!node.name){
_2f0=false;
}else{
if(dojo.lang.inArray(["submit","button","image"],type)){
if(!this.clickedButton){
this.clickedButton=node;
}
_2f0=node==this.clickedButton;
}else{
_2f0=!dojo.lang.inArray(["file","submit","reset","button"],type);
}
}
return _2f0;
},connect:function(_2f1,_2f2,_2f3){
if(dojo.evalObjPath("dojo.event.connect")){
dojo.event.connect(_2f1,_2f2,this,_2f3);
}else{
var fcn=dojo.lang.hitch(this,_2f3);
_2f1[_2f2]=function(e){
if(!e){
e=window.event;
}
if(!e.currentTarget){
e.currentTarget=e.srcElement;
}
if(!e.preventDefault){
e.preventDefault=function(){
window.event.returnValue=false;
};
}
fcn(e);
};
}
}});
dojo.io.XMLHTTPTransport=new function(){
var _2f6=this;
var _2f7={};
this.useCache=false;
this.preventCache=false;
function getCacheKey(url,_2f9,_2fa){
return url+"|"+_2f9+"|"+_2fa.toLowerCase();
}
function addToCache(url,_2fc,_2fd,http){
_2f7[getCacheKey(url,_2fc,_2fd)]=http;
}
function getFromCache(url,_300,_301){
return _2f7[getCacheKey(url,_300,_301)];
}
this.clearCache=function(){
_2f7={};
};
function doLoad(_302,http,url,_305,_306){
if(((http.status>=200)&&(http.status<300))||(http.status==304)||(http.status==1223)||(location.protocol=="file:"&&(http.status==0||http.status==undefined))||(location.protocol=="chrome:"&&(http.status==0||http.status==undefined))){
var ret;
if(_302.method.toLowerCase()=="head"){
var _308=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _308;
};
var _309=_308.split(/[\r\n]+/g);
for(var i=0;i<_309.length;i++){
var pair=_309[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_302.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=null;
}
}else{
if(_302.mimetype=="text/json"||_302.mimetype=="application/json"){
try{
ret=dj_eval("("+http.responseText+")");
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=false;
}
}else{
if((_302.mimetype=="application/xml")||(_302.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"||!http.getResponseHeader("Content-Type")){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
}
if(_306){
addToCache(url,_305,_302.method,http);
}
_302[(typeof _302.load=="function")?"load":"handle"]("load",ret,http,_302);
}else{
var _30c=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
_302[(typeof _302.error=="function")?"error":"handle"]("error",_30c,http,_302);
}
}
function setHeaders(http,_30e){
if(_30e["headers"]){
for(var _30f in _30e["headers"]){
if(_30f.toLowerCase()=="content-type"&&!_30e["contentType"]){
_30e["contentType"]=_30e["headers"][_30f];
}else{
http.setRequestHeader(_30f,_30e["headers"][_30f]);
}
}
}
}
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
var now=null;
if(!dojo.hostenv._blockAsync&&!_2f6._blockAsync){
for(var x=this.inFlight.length-1;x>=0;x--){
try{
var tif=this.inFlight[x];
if(!tif||tif.http._aborted||!tif.http.readyState){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
}else{
if(tif.startTime){
if(!now){
now=(new Date()).getTime();
}
if(tif.startTime+(tif.req.timeoutSeconds*1000)<now){
if(typeof tif.http.abort=="function"){
tif.http.abort();
}
this.inFlight.splice(x,1);
tif.req[(typeof tif.req.timeout=="function")?"timeout":"handle"]("timeout",null,tif.http,tif.req);
}
}
}
}
catch(e){
try{
var _313=new dojo.io.Error("XMLHttpTransport.watchInFlight Error: "+e);
tif.req[(typeof tif.req.error=="function")?"error":"handle"]("error",_313,tif.http,tif.req);
}
catch(e2){
dojo.debug("XMLHttpTransport error callback failed: "+e2);
}
}
}
}
clearTimeout(this.inFlightTimer);
if(this.inFlight.length==0){
this.inFlightTimer=null;
return;
}
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
};
var _314=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_315){
return _314&&dojo.lang.inArray(["text/plain","text/html","application/xml","text/xml","text/javascript","text/json","application/json"],(_315["mimetype"].toLowerCase()||""))&&!(_315["formNode"]&&dojo.io.formHasFile(_315["formNode"]));
};
this.multipartBoundary="45309FFF-BD65-4d50-99C9-36986896A96F";
this.bind=function(_316){
if(!_316["url"]){
if(!_316["formNode"]&&(_316["backButton"]||_316["back"]||_316["changeUrl"]||_316["watchForURL"])&&(!djConfig.preventBackButtonFix)){
dojo.deprecated("Using dojo.io.XMLHTTPTransport.bind() to add to browser history without doing an IO request","Use dojo.undo.browser.addToHistory() instead.","0.4");
dojo.undo.browser.addToHistory(_316);
return true;
}
}
var url=_316.url;
var _318="";
if(_316["formNode"]){
var ta=_316.formNode.getAttribute("action");
if((ta)&&(!_316["url"])){
url=ta;
}
var tp=_316.formNode.getAttribute("method");
if((tp)&&(!_316["method"])){
_316.method=tp;
}
_318+=dojo.io.encodeForm(_316.formNode,_316.encoding,_316["formFilter"]);
}
if(url.indexOf("#")>-1){
dojo.debug("Warning: dojo.io.bind: stripping hash values from url:",url);
url=url.split("#")[0];
}
if(_316["file"]){
_316.method="post";
}
if(!_316["method"]){
_316.method="get";
}
if(_316.method.toLowerCase()=="get"){
_316.multipart=false;
}else{
if(_316["file"]){
_316.multipart=true;
}else{
if(!_316["multipart"]){
_316.multipart=false;
}
}
}
if(_316["backButton"]||_316["back"]||_316["changeUrl"]){
dojo.undo.browser.addToHistory(_316);
}
var _31b=_316["content"]||{};
if(_316.sendTransport){
_31b["dojo.transport"]="xmlhttp";
}
do{
if(_316.postContent){
_318=_316.postContent;
break;
}
if(_31b){
_318+=dojo.io.argsFromMap(_31b,_316.encoding);
}
if(_316.method.toLowerCase()=="get"||!_316.multipart){
break;
}
var t=[];
if(_318.length){
var q=_318.split("&");
for(var i=0;i<q.length;++i){
if(q[i].length){
var p=q[i].split("=");
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+p[0]+"\"","",p[1]);
}
}
}
if(_316.file){
if(dojo.lang.isArray(_316.file)){
for(var i=0;i<_316.file.length;++i){
var o=_316.file[i];
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}else{
var o=_316.file;
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}
if(t.length){
t.push("--"+this.multipartBoundary+"--","");
_318=t.join("\r\n");
}
}while(false);
var _321=_316["sync"]?false:true;
var _322=_316["preventCache"]||(this.preventCache==true&&_316["preventCache"]!=false);
var _323=_316["useCache"]==true||(this.useCache==true&&_316["useCache"]!=false);
if(!_322&&_323){
var _324=getFromCache(url,_318,_316.method);
if(_324){
doLoad(_316,_324,url,_318,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject(_316);
var _326=false;
if(_321){
var _327=this.inFlight.push({"req":_316,"http":http,"url":url,"query":_318,"useCache":_323,"startTime":_316.timeoutSeconds?(new Date()).getTime():0});
this.startWatchingInFlight();
}else{
_2f6._blockAsync=true;
}
if(_316.method.toLowerCase()=="post"){
if(!_316.user){
http.open("POST",url,_321);
}else{
http.open("POST",url,_321,_316.user,_316.password);
}
setHeaders(http,_316);
http.setRequestHeader("Content-Type",_316.multipart?("multipart/form-data; boundary="+this.multipartBoundary):(_316.contentType||"application/x-www-form-urlencoded"));
try{
http.send(_318);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_316,{status:404},url,_318,_323);
}
}else{
var _328=url;
if(_318!=""){
_328+=(_328.indexOf("?")>-1?"&":"?")+_318;
}
if(_322){
_328+=(dojo.string.endsWithAny(_328,"?","&")?"":(_328.indexOf("?")>-1?"&":"?"))+"dojo.preventCache="+new Date().valueOf();
}
if(!_316.user){
http.open(_316.method.toUpperCase(),_328,_321);
}else{
http.open(_316.method.toUpperCase(),_328,_321,_316.user,_316.password);
}
setHeaders(http,_316);
try{
http.send(null);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_316,{status:404},url,_318,_323);
}
}
if(!_321){
doLoad(_316,http,url,_318,_323);
_2f6._blockAsync=false;
}
_316.abort=function(){
try{
http._aborted=true;
}
catch(e){
}
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
}
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_32a,days,path,_32d,_32e){
var _32f=-1;
if((typeof days=="number")&&(days>=0)){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_32f=d.toGMTString();
}
_32a=escape(_32a);
document.cookie=name+"="+_32a+";"+(_32f!=-1?" expires="+_32f+";":"")+(path?"path="+path:"")+(_32d?"; domain="+_32d:"")+(_32e?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.lastIndexOf(name+"=");
if(idx==-1){
return null;
}
var _333=document.cookie.substring(idx+name.length+1);
var end=_333.indexOf(";");
if(end==-1){
end=_333.length;
}
_333=_333.substring(0,end);
_333=unescape(_333);
return _333;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_33a,_33b,_33c){
if(arguments.length==5){
_33c=_33a;
_33a=null;
_33b=null;
}
var _33d=[],_33e,_33f="";
if(!_33c){
_33e=dojo.io.cookie.getObjectCookie(name);
}
if(days>=0){
if(!_33e){
_33e={};
}
for(var prop in obj){
if(obj[prop]==null){
delete _33e[prop];
}else{
if((typeof obj[prop]=="string")||(typeof obj[prop]=="number")){
_33e[prop]=obj[prop];
}
}
}
prop=null;
for(var prop in _33e){
_33d.push(escape(prop)+"="+escape(_33e[prop]));
}
_33f=_33d.join("&");
}
dojo.io.cookie.setCookie(name,_33f,days,path,_33a,_33b);
};
dojo.io.cookie.getObjectCookie=function(name){
var _342=null,_343=dojo.io.cookie.getCookie(name);
if(_343){
_342={};
var _344=_343.split("&");
for(var i=0;i<_344.length;i++){
var pair=_344[i].split("=");
var _347=pair[1];
if(isNaN(_347)){
_347=unescape(pair[1]);
}
_342[unescape(pair[0])]=_347;
}
}
return _342;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _348=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_348=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.kwCompoundRequire({common:["dojo.io.common"],rhino:["dojo.io.RhinoIO"],browser:["dojo.io.BrowserIO","dojo.io.cookie"],dashboard:["dojo.io.BrowserIO","dojo.io.cookie"]});
dojo.provide("dojo.io.*");
dojo.provide("dojo.event.common");
dojo.event=new function(){
this._canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
function interpolateArgs(args,_34a){
var dl=dojo.lang;
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(args.length>2)?args[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false,maxCalls:-1};
switch(args.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=args[0];
ao.adviceFunc=args[1];
break;
case 3:
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
var _34d=dl.nameAnonFunc(args[2],ao.adviceObj,_34a);
ao.adviceFunc=_34d;
}else{
if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=dj_global;
var _34d=dl.nameAnonFunc(args[0],ao.srcObj,_34a);
ao.srcFunc=_34d;
ao.adviceObj=args[1];
ao.adviceFunc=args[2];
}
}
}
}
break;
case 4:
if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
var _34d=dl.nameAnonFunc(args[1],dj_global,_34a);
ao.srcFunc=_34d;
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
ao.srcObj=args[1];
ao.srcFunc=args[2];
var _34d=dl.nameAnonFunc(args[3],dj_global,_34a);
ao.adviceObj=dj_global;
ao.adviceFunc=_34d;
}else{
if(dl.isObject(args[1])){
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=dj_global;
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[2])){
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
ao.aroundFunc=args[3];
}
}
}
}
}
}
break;
case 6:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundFunc=args[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundObj=args[5];
ao.aroundFunc=args[6];
ao.once=args[7];
ao.delay=args[8];
ao.rate=args[9];
ao.adviceMsg=args[10];
ao.maxCalls=(!isNaN(parseInt(args[11])))?args[11]:-1;
break;
}
if(dl.isFunction(ao.aroundFunc)){
var _34d=dl.nameAnonFunc(ao.aroundFunc,ao.aroundObj,_34a);
ao.aroundFunc=_34d;
}
if(dl.isFunction(ao.srcFunc)){
ao.srcFunc=dl.getNameInObj(ao.srcObj,ao.srcFunc);
}
if(dl.isFunction(ao.adviceFunc)){
ao.adviceFunc=dl.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
ao.aroundFunc=dl.getNameInObj(ao.aroundObj,ao.aroundFunc);
}
if(!ao.srcObj){
dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
}
if(!ao.adviceObj){
dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
}
if(!ao.adviceFunc){
dojo.debug("bad adviceFunc for srcFunc: "+ao.srcFunc);
dojo.debugShallow(ao);
}
return ao;
}
this.connect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(dojo.lang.isArray(ao.srcObj)&&ao.srcObj!=""){
var _34f={};
for(var x in ao){
_34f[x]=ao[x];
}
var mjps=[];
dojo.lang.forEach(ao.srcObj,function(src){
if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
src=dojo.byId(src);
}
_34f.srcObj=src;
mjps.push(dojo.event.connect.call(dojo.event,_34f));
});
return mjps;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var mjp2=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.log=function(a1,a2){
var _357;
if((arguments.length==1)&&(typeof a1=="object")){
_357=a1;
}else{
_357={srcObj:a1,srcFunc:a2};
}
_357.adviceFunc=function(){
var _358=[];
for(var x=0;x<arguments.length;x++){
_358.push(arguments[x]);
}
dojo.debug("("+_357.srcObj+")."+_357.srcFunc,":",_358.join(", "));
};
this.kwConnect(_357);
};
this.connectBefore=function(){
var args=["before"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectAround=function(){
var args=["around"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.once=true;
return this.connect(ao);
};
this.connectRunOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.maxCalls=1;
return this.connect(ao);
};
this._kwConnectImpl=function(_360,_361){
var fn=(_361)?"disconnect":"connect";
if(typeof _360["srcFunc"]=="function"){
_360.srcObj=_360["srcObj"]||dj_global;
var _363=dojo.lang.nameAnonFunc(_360.srcFunc,_360.srcObj,true);
_360.srcFunc=_363;
}
if(typeof _360["adviceFunc"]=="function"){
_360.adviceObj=_360["adviceObj"]||dj_global;
var _363=dojo.lang.nameAnonFunc(_360.adviceFunc,_360.adviceObj,true);
_360.adviceFunc=_363;
}
_360.srcObj=_360["srcObj"]||dj_global;
_360.adviceObj=_360["adviceObj"]||_360["targetObj"]||dj_global;
_360.adviceFunc=_360["adviceFunc"]||_360["targetFunc"];
return dojo.event[fn](_360);
};
this.kwConnect=function(_364){
return this._kwConnectImpl(_364,false);
};
this.disconnect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(!ao.adviceFunc){
return;
}
if(dojo.lang.isString(ao.srcFunc)&&(ao.srcFunc.toLowerCase()=="onkey")){
if(dojo.render.html.ie){
ao.srcFunc="onkeydown";
this.disconnect(ao);
}
ao.srcFunc="onkeypress";
}
if(!ao.srcObj[ao.srcFunc]){
return null;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc,true);
mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
return mjp;
};
this.kwDisconnect=function(_367){
return this._kwConnectImpl(_367,true);
};
};
dojo.event.MethodInvocation=function(_368,obj,args){
this.jp_=_368;
this.object=obj;
this.args=[];
for(var x=0;x<args.length;x++){
this.args[x]=args[x];
}
this.around_index=-1;
};
dojo.event.MethodInvocation.prototype.proceed=function(){
this.around_index++;
if(this.around_index>=this.jp_.around.length){
return this.jp_.object[this.jp_.methodname].apply(this.jp_.object,this.args);
}else{
var ti=this.jp_.around[this.around_index];
var mobj=ti[0]||dj_global;
var meth=ti[1];
return mobj[meth].call(mobj,this);
}
};
dojo.event.MethodJoinPoint=function(obj,_370){
this.object=obj||dj_global;
this.methodname=_370;
this.methodfunc=this.object[_370];
this.squelch=false;
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_372){
if(!obj){
obj=dj_global;
}
var ofn=obj[_372];
if(!ofn){
ofn=obj[_372]=function(){
};
if(!obj[_372]){
dojo.raise("Cannot set do-nothing method on that object "+_372);
}
}else{
if((typeof ofn!="function")&&(!dojo.lang.isFunction(ofn))&&(!dojo.lang.isAlien(ofn))){
return null;
}
}
var _374=_372+"$joinpoint";
var _375=_372+"$joinpoint$method";
var _376=obj[_374];
if(!_376){
var _377=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_377=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_374,_375,_372]);
}
}
var _378=ofn.length;
obj[_375]=ofn;
_376=obj[_374]=new dojo.event.MethodJoinPoint(obj,_375);
if(!_377){
obj[_372]=function(){
return _376.run.apply(_376,arguments);
};
}else{
obj[_372]=function(){
var args=[];
if(!arguments.length){
var evt=null;
try{
if(obj.ownerDocument){
evt=obj.ownerDocument.parentWindow.event;
}else{
if(obj.documentElement){
evt=obj.documentElement.ownerDocument.parentWindow.event;
}else{
if(obj.event){
evt=obj.event;
}else{
evt=window.event;
}
}
}
}
catch(e){
evt=window.event;
}
if(evt){
args.push(dojo.event.browser.fixEvent(evt,this));
}
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x],this));
}else{
args.push(arguments[x]);
}
}
}
return _376.run.apply(_376,args);
};
}
obj[_372].__preJoinArity=_378;
}
return _376;
};
dojo.lang.extend(dojo.event.MethodJoinPoint,{squelch:false,unintercept:function(){
this.object[this.methodname]=this.methodfunc;
this.before=[];
this.after=[];
this.around=[];
},disconnect:dojo.lang.forward("unintercept"),run:function(){
var obj=this.object||dj_global;
var args=arguments;
var _37e=[];
for(var x=0;x<args.length;x++){
_37e[x]=args[x];
}
var _380=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _382=marr[0]||dj_global;
var _383=marr[1];
if(!_382[_383]){
dojo.raise("function \""+_383+"\" does not exist on \""+_382+"\"");
}
var _384=marr[2]||dj_global;
var _385=marr[3];
var msg=marr[6];
var _387=marr[7];
if(_387>-1){
if(_387==0){
return;
}
marr[7]--;
}
var _388;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _382[_383].apply(_382,to.args);
}};
to.args=_37e;
var _38a=parseInt(marr[4]);
var _38b=((!isNaN(_38a))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _38e=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event._canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_380(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_385){
_384[_385].call(_384,to);
}else{
if((_38b)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_382[_383].call(_382,to);
}else{
_382[_383].apply(_382,args);
}
},_38a);
}else{
if(msg){
_382[_383].call(_382,to);
}else{
_382[_383].apply(_382,args);
}
}
}
};
var _391=function(){
if(this.squelch){
try{
return _380.apply(this,arguments);
}
catch(e){
dojo.debug(e);
}
}else{
return _380.apply(this,arguments);
}
};
if((this["before"])&&(this.before.length>0)){
dojo.lang.forEach(this.before.concat(new Array()),_391);
}
var _392;
try{
if((this["around"])&&(this.around.length>0)){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_392=mi.proceed();
}else{
if(this.methodfunc){
_392=this.object[this.methodname].apply(this.object,args);
}
}
}
catch(e){
if(!this.squelch){
dojo.debug(e,"when calling",this.methodname,"on",this.object,"with arguments",args);
dojo.raise(e);
}
}
if((this["after"])&&(this.after.length>0)){
dojo.lang.forEach(this.after.concat(new Array()),_391);
}
return (this.methodfunc)?_392:null;
},getArr:function(kind){
var type="after";
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
type="before";
}else{
if(kind=="around"){
type="around";
}
}
if(!this[type]){
this[type]=[];
}
return this[type];
},kwAddAdvice:function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"],args["maxCalls"]);
},addAdvice:function(_397,_398,_399,_39a,_39b,_39c,once,_39e,rate,_3a0,_3a1){
var arr=this.getArr(_39b);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_397,_398,_399,_39a,_39e,rate,_3a0,_3a1];
if(once){
if(this.hasAdvice(_397,_398,_39b,arr)>=0){
return;
}
}
if(_39c=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
},hasAdvice:function(_3a4,_3a5,_3a6,arr){
if(!arr){
arr=this.getArr(_3a6);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
var aao=(typeof _3a5=="object")?(new String(_3a5)).toString():_3a5;
var a1o=(typeof arr[x][1]=="object")?(new String(arr[x][1])).toString():arr[x][1];
if((arr[x][0]==_3a4)&&(a1o==aao)){
ind=x;
}
}
return ind;
},removeAdvice:function(_3ac,_3ad,_3ae,once){
var arr=this.getArr(_3ae);
var ind=this.hasAdvice(_3ac,_3ad,_3ae,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_3ac,_3ad,_3ae,arr);
}
return true;
}});
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_3b2){
if(!this.topics[_3b2]){
this.topics[_3b2]=new this.TopicImpl(_3b2);
}
return this.topics[_3b2];
};
this.registerPublisher=function(_3b3,obj,_3b5){
var _3b3=this.getTopic(_3b3);
_3b3.registerPublisher(obj,_3b5);
};
this.subscribe=function(_3b6,obj,_3b8){
var _3b6=this.getTopic(_3b6);
_3b6.subscribe(obj,_3b8);
};
this.unsubscribe=function(_3b9,obj,_3bb){
var _3b9=this.getTopic(_3b9);
_3b9.unsubscribe(obj,_3bb);
};
this.destroy=function(_3bc){
this.getTopic(_3bc).destroy();
delete this.topics[_3bc];
};
this.publishApply=function(_3bd,args){
var _3bd=this.getTopic(_3bd);
_3bd.sendMessage.apply(_3bd,args);
};
this.publish=function(_3bf,_3c0){
var _3bf=this.getTopic(_3bf);
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
_3bf.sendMessage.apply(_3bf,args);
};
};
dojo.event.topic.TopicImpl=function(_3c3){
this.topicName=_3c3;
this.subscribe=function(_3c4,_3c5){
var tf=_3c5||_3c4;
var to=(!_3c5)?dj_global:_3c4;
return dojo.event.kwConnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this.unsubscribe=function(_3c8,_3c9){
var tf=(!_3c9)?_3c8:_3c9;
var to=(!_3c9)?null:_3c8;
return dojo.event.kwDisconnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this._getJoinPoint=function(){
return dojo.event.MethodJoinPoint.getForMethod(this,"sendMessage");
};
this.setSquelch=function(_3cc){
this._getJoinPoint().squelch=_3cc;
};
this.destroy=function(){
this._getJoinPoint().disconnect();
};
this.registerPublisher=function(_3cd,_3ce){
dojo.event.connect(_3cd,_3ce,this,"sendMessage");
};
this.sendMessage=function(_3cf){
};
};
dojo.provide("dojo.event.browser");
dojo._ie_clobber=new function(){
this.clobberNodes=[];
function nukeProp(node,prop){
try{
node[prop]=null;
}
catch(e){
}
try{
delete node[prop];
}
catch(e){
}
try{
node.removeAttribute(prop);
}
catch(e){
}
}
this.clobber=function(_3d2){
var na;
var tna;
if(_3d2){
tna=_3d2.all||_3d2.getElementsByTagName("*");
na=[_3d2];
for(var x=0;x<tna.length;x++){
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
}
}
}else{
try{
window.onload=null;
}
catch(e){
}
na=(this.clobberNodes.length)?this.clobberNodes:document.all;
}
tna=null;
var _3d6={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
try{
if(el&&el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}
catch(e){
}
}
na=null;
};
};
if(dojo.render.html.ie){
dojo.addOnUnload(function(){
dojo._ie_clobber.clobber();
try{
if((dojo["widget"])&&(dojo.widget["manager"])){
dojo.widget.manager.destroyAll();
}
}
catch(e){
}
if(dojo.widget){
for(var name in dojo.widget._templateCache){
if(dojo.widget._templateCache[name].node){
dojo.dom.destroyNode(dojo.widget._templateCache[name].node);
dojo.widget._templateCache[name].node=null;
delete dojo.widget._templateCache[name].node;
}
}
}
try{
window.onload=null;
}
catch(e){
}
try{
window.onunload=null;
}
catch(e){
}
dojo._ie_clobber.clobberNodes=[];
});
}
dojo.event.browser=new function(){
var _3db=0;
this.normalizedEventName=function(_3dc){
switch(_3dc){
case "CheckboxStateChange":
case "DOMAttrModified":
case "DOMMenuItemActive":
case "DOMMenuItemInactive":
case "DOMMouseScroll":
case "DOMNodeInserted":
case "DOMNodeRemoved":
case "RadioStateChange":
return _3dc;
break;
default:
var lcn=_3dc.toLowerCase();
return (lcn.indexOf("on")==0)?lcn.substr(2):lcn;
break;
}
};
this.clean=function(node){
if(dojo.render.html.ie){
dojo._ie_clobber.clobber(node);
}
};
this.addClobberNode=function(node){
if(!dojo.render.html.ie){
return;
}
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo._ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
};
this.addClobberNodeAttrs=function(node,_3e1){
if(!dojo.render.html.ie){
return;
}
this.addClobberNode(node);
for(var x=0;x<_3e1.length;x++){
node.__clobberAttrs__.push(_3e1[x]);
}
};
this.removeListener=function(node,_3e4,fp,_3e6){
if(!_3e6){
var _3e6=false;
}
_3e4=dojo.event.browser.normalizedEventName(_3e4);
if(_3e4=="key"){
if(dojo.render.html.ie){
this.removeListener(node,"onkeydown",fp,_3e6);
}
_3e4="keypress";
}
if(node.removeEventListener){
node.removeEventListener(_3e4,fp,_3e6);
}
};
this.addListener=function(node,_3e8,fp,_3ea,_3eb){
if(!node){
return;
}
if(!_3ea){
var _3ea=false;
}
_3e8=dojo.event.browser.normalizedEventName(_3e8);
if(_3e8=="key"){
if(dojo.render.html.ie){
this.addListener(node,"onkeydown",fp,_3ea,_3eb);
}
_3e8="keypress";
}
if(!_3eb){
var _3ec=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt,this));
if(_3ea){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_3ec=fp;
}
if(node.addEventListener){
node.addEventListener(_3e8,_3ec,_3ea);
return _3ec;
}else{
_3e8="on"+_3e8;
if(typeof node[_3e8]=="function"){
var _3ef=node[_3e8];
node[_3e8]=function(e){
_3ef(e);
return _3ec(e);
};
}else{
node[_3e8]=_3ec;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_3e8]);
}
return _3ec;
}
};
this.isEvent=function(obj){
return (typeof obj!="undefined")&&(obj)&&(typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_3f2,_3f3){
if(typeof _3f2!="function"){
dojo.raise("listener not a function: "+_3f2);
}
dojo.event.browser.currentEvent.currentTarget=_3f3;
return _3f2.call(_3f3,dojo.event.browser.currentEvent);
};
this._stopPropagation=function(){
dojo.event.browser.currentEvent.cancelBubble=true;
};
this._preventDefault=function(){
dojo.event.browser.currentEvent.returnValue=false;
};
this.keys={KEY_BACKSPACE:8,KEY_TAB:9,KEY_CLEAR:12,KEY_ENTER:13,KEY_SHIFT:16,KEY_CTRL:17,KEY_ALT:18,KEY_PAUSE:19,KEY_CAPS_LOCK:20,KEY_ESCAPE:27,KEY_SPACE:32,KEY_PAGE_UP:33,KEY_PAGE_DOWN:34,KEY_END:35,KEY_HOME:36,KEY_LEFT_ARROW:37,KEY_UP_ARROW:38,KEY_RIGHT_ARROW:39,KEY_DOWN_ARROW:40,KEY_INSERT:45,KEY_DELETE:46,KEY_HELP:47,KEY_LEFT_WINDOW:91,KEY_RIGHT_WINDOW:92,KEY_SELECT:93,KEY_NUMPAD_0:96,KEY_NUMPAD_1:97,KEY_NUMPAD_2:98,KEY_NUMPAD_3:99,KEY_NUMPAD_4:100,KEY_NUMPAD_5:101,KEY_NUMPAD_6:102,KEY_NUMPAD_7:103,KEY_NUMPAD_8:104,KEY_NUMPAD_9:105,KEY_NUMPAD_MULTIPLY:106,KEY_NUMPAD_PLUS:107,KEY_NUMPAD_ENTER:108,KEY_NUMPAD_MINUS:109,KEY_NUMPAD_PERIOD:110,KEY_NUMPAD_DIVIDE:111,KEY_F1:112,KEY_F2:113,KEY_F3:114,KEY_F4:115,KEY_F5:116,KEY_F6:117,KEY_F7:118,KEY_F8:119,KEY_F9:120,KEY_F10:121,KEY_F11:122,KEY_F12:123,KEY_F13:124,KEY_F14:125,KEY_F15:126,KEY_NUM_LOCK:144,KEY_SCROLL_LOCK:145};
this.revKeys=[];
for(var key in this.keys){
this.revKeys[this.keys[key]]=key;
}
this.fixEvent=function(evt,_3f6){
if(!evt){
if(window["event"]){
evt=window.event;
}
}
if((evt["type"])&&(evt["type"].indexOf("key")==0)){
evt.keys=this.revKeys;
for(var key in this.keys){
evt[key]=this.keys[key];
}
if(evt["type"]=="keydown"&&dojo.render.html.ie){
switch(evt.keyCode){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_LEFT_WINDOW:
case evt.KEY_RIGHT_WINDOW:
case evt.KEY_SELECT:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
case evt.KEY_NUMPAD_0:
case evt.KEY_NUMPAD_1:
case evt.KEY_NUMPAD_2:
case evt.KEY_NUMPAD_3:
case evt.KEY_NUMPAD_4:
case evt.KEY_NUMPAD_5:
case evt.KEY_NUMPAD_6:
case evt.KEY_NUMPAD_7:
case evt.KEY_NUMPAD_8:
case evt.KEY_NUMPAD_9:
case evt.KEY_NUMPAD_PERIOD:
break;
case evt.KEY_NUMPAD_MULTIPLY:
case evt.KEY_NUMPAD_PLUS:
case evt.KEY_NUMPAD_ENTER:
case evt.KEY_NUMPAD_MINUS:
case evt.KEY_NUMPAD_DIVIDE:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
case evt.KEY_PAGE_UP:
case evt.KEY_PAGE_DOWN:
case evt.KEY_END:
case evt.KEY_HOME:
case evt.KEY_LEFT_ARROW:
case evt.KEY_UP_ARROW:
case evt.KEY_RIGHT_ARROW:
case evt.KEY_DOWN_ARROW:
case evt.KEY_INSERT:
case evt.KEY_DELETE:
case evt.KEY_F1:
case evt.KEY_F2:
case evt.KEY_F3:
case evt.KEY_F4:
case evt.KEY_F5:
case evt.KEY_F6:
case evt.KEY_F7:
case evt.KEY_F8:
case evt.KEY_F9:
case evt.KEY_F10:
case evt.KEY_F11:
case evt.KEY_F12:
case evt.KEY_F12:
case evt.KEY_F13:
case evt.KEY_F14:
case evt.KEY_F15:
case evt.KEY_CLEAR:
case evt.KEY_HELP:
evt.key=evt.keyCode;
break;
default:
if(evt.ctrlKey||evt.altKey){
var _3f8=evt.keyCode;
if(_3f8>=65&&_3f8<=90&&evt.shiftKey==false){
_3f8+=32;
}
if(_3f8>=1&&_3f8<=26&&evt.ctrlKey){
_3f8+=96;
}
evt.key=String.fromCharCode(_3f8);
}
}
}else{
if(evt["type"]=="keypress"){
if(dojo.render.html.opera){
if(evt.which==0){
evt.key=evt.keyCode;
}else{
if(evt.which>0){
switch(evt.which){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
evt.key=evt.which;
break;
default:
var _3f8=evt.which;
if((evt.ctrlKey||evt.altKey||evt.metaKey)&&(evt.which>=65&&evt.which<=90&&evt.shiftKey==false)){
_3f8+=32;
}
evt.key=String.fromCharCode(_3f8);
}
}
}
}else{
if(dojo.render.html.ie){
if(!evt.ctrlKey&&!evt.altKey&&evt.keyCode>=evt.KEY_SPACE){
evt.key=String.fromCharCode(evt.keyCode);
}
}else{
if(dojo.render.html.safari){
switch(evt.keyCode){
case 25:
evt.key=evt.KEY_TAB;
evt.shift=true;
break;
case 63232:
evt.key=evt.KEY_UP_ARROW;
break;
case 63233:
evt.key=evt.KEY_DOWN_ARROW;
break;
case 63234:
evt.key=evt.KEY_LEFT_ARROW;
break;
case 63235:
evt.key=evt.KEY_RIGHT_ARROW;
break;
case 63236:
evt.key=evt.KEY_F1;
break;
case 63237:
evt.key=evt.KEY_F2;
break;
case 63238:
evt.key=evt.KEY_F3;
break;
case 63239:
evt.key=evt.KEY_F4;
break;
case 63240:
evt.key=evt.KEY_F5;
break;
case 63241:
evt.key=evt.KEY_F6;
break;
case 63242:
evt.key=evt.KEY_F7;
break;
case 63243:
evt.key=evt.KEY_F8;
break;
case 63244:
evt.key=evt.KEY_F9;
break;
case 63245:
evt.key=evt.KEY_F10;
break;
case 63246:
evt.key=evt.KEY_F11;
break;
case 63247:
evt.key=evt.KEY_F12;
break;
case 63250:
evt.key=evt.KEY_PAUSE;
break;
case 63272:
evt.key=evt.KEY_DELETE;
break;
case 63273:
evt.key=evt.KEY_HOME;
break;
case 63275:
evt.key=evt.KEY_END;
break;
case 63276:
evt.key=evt.KEY_PAGE_UP;
break;
case 63277:
evt.key=evt.KEY_PAGE_DOWN;
break;
case 63302:
evt.key=evt.KEY_INSERT;
break;
case 63248:
case 63249:
case 63289:
break;
default:
evt.key=evt.charCode>=evt.KEY_SPACE?String.fromCharCode(evt.charCode):evt.keyCode;
}
}else{
evt.key=evt.charCode>0?String.fromCharCode(evt.charCode):evt.keyCode;
}
}
}
}
}
}
if(dojo.render.html.ie){
if(!evt.target){
evt.target=evt.srcElement;
}
if(!evt.currentTarget){
evt.currentTarget=(_3f6?_3f6:evt.srcElement);
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
var doc=(evt.srcElement&&evt.srcElement.ownerDocument)?evt.srcElement.ownerDocument:document;
var _3fa=((dojo.render.html.ie55)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
if(!evt.pageX){
evt.pageX=evt.clientX+(_3fa.scrollLeft||0);
}
if(!evt.pageY){
evt.pageY=evt.clientY+(_3fa.scrollTop||0);
}
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
this.currentEvent=evt;
evt.callListener=this.callListener;
evt.stopPropagation=this._stopPropagation;
evt.preventDefault=this._preventDefault;
}
return evt;
};
this.stopEvent=function(evt){
if(window.event){
evt.cancelBubble=true;
evt.returnValue=false;
}else{
evt.preventDefault();
evt.stopPropagation();
}
};
};
dojo.kwCompoundRequire({common:["dojo.event.common","dojo.event.topic"],browser:["dojo.event.browser"],dashboard:["dojo.event.browser"]});
dojo.provide("dojo.event.*");
dojo.provide("dojo.gfx.color");
dojo.gfx.color.Color=function(r,g,b,a){
if(dojo.lang.isArray(r)){
this.r=r[0];
this.g=r[1];
this.b=r[2];
this.a=r[3]||1;
}else{
if(dojo.lang.isString(r)){
var rgb=dojo.gfx.color.extractRGB(r);
this.r=rgb[0];
this.g=rgb[1];
this.b=rgb[2];
this.a=g||1;
}else{
if(r instanceof dojo.gfx.color.Color){
this.r=r.r;
this.b=r.b;
this.g=r.g;
this.a=r.a;
}else{
this.r=r;
this.g=g;
this.b=b;
this.a=a;
}
}
}
};
dojo.gfx.color.Color.fromArray=function(arr){
return new dojo.gfx.color.Color(arr[0],arr[1],arr[2],arr[3]);
};
dojo.extend(dojo.gfx.color.Color,{toRgb:function(_402){
if(_402){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
},toRgba:function(){
return [this.r,this.g,this.b,this.a];
},toHex:function(){
return dojo.gfx.color.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join()+")";
},toString:function(){
return this.toHex();
},blend:function(_403,_404){
var rgb=null;
if(dojo.lang.isArray(_403)){
rgb=_403;
}else{
if(_403 instanceof dojo.gfx.color.Color){
rgb=_403.toRgb();
}else{
rgb=new dojo.gfx.color.Color(_403).toRgb();
}
}
return dojo.gfx.color.blend(this.toRgb(),rgb,_404);
}});
dojo.gfx.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],lime:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.gfx.color.blend=function(a,b,_408){
if(typeof a=="string"){
return dojo.gfx.color.blendHex(a,b,_408);
}
if(!_408){
_408=0;
}
_408=Math.min(Math.max(-1,_408),1);
_408=((_408+1)/2);
var c=[];
for(var x=0;x<3;x++){
c[x]=parseInt(b[x]+((a[x]-b[x])*_408));
}
return c;
};
dojo.gfx.color.blendHex=function(a,b,_40d){
return dojo.gfx.color.rgb2hex(dojo.gfx.color.blend(dojo.gfx.color.hex2rgb(a),dojo.gfx.color.hex2rgb(b),_40d));
};
dojo.gfx.color.extractRGB=function(_40e){
var hex="0123456789abcdef";
_40e=_40e.toLowerCase();
if(_40e.indexOf("rgb")==0){
var _410=_40e.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_410.splice(1,3);
return ret;
}else{
var _412=dojo.gfx.color.hex2rgb(_40e);
if(_412){
return _412;
}else{
return dojo.gfx.color.named[_40e]||[255,255,255];
}
}
};
dojo.gfx.color.hex2rgb=function(hex){
var _414="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_414+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substring(0,2);
rgb[1]=hex.substring(2,4);
rgb[2]=hex.substring(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_414.indexOf(rgb[i].charAt(0))*16+_414.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.gfx.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||0;
b=r[2]||0;
r=r[0]||0;
}
var ret=dojo.lang.map([r,g,b],function(x){
x=new Number(x);
var s=x.toString(16);
while(s.length<2){
s="0"+s;
}
return s;
});
ret.unshift("#");
return ret.join("");
};
dojo.provide("dojo.lfx.Animation");
dojo.lfx.Line=function(_41d,end){
this.start=_41d;
this.end=end;
if(dojo.lang.isArray(_41d)){
var diff=[];
dojo.lang.forEach(this.start,function(s,i){
diff[i]=this.end[i]-s;
},this);
this.getValue=function(n){
var res=[];
dojo.lang.forEach(this.start,function(s,i){
res[i]=(diff[i]*n)+s;
},this);
return res;
};
}else{
var diff=end-_41d;
this.getValue=function(n){
return (diff*n)+this.start;
};
}
};
if((dojo.render.html.khtml)&&(!dojo.render.html.safari)){
dojo.lfx.easeDefault=function(n){
return (parseFloat("0.5")+((Math.sin((n+parseFloat("1.5"))*Math.PI))/2));
};
}else{
dojo.lfx.easeDefault=function(n){
return (0.5+((Math.sin((n+1.5)*Math.PI))/2));
};
}
dojo.lfx.easeIn=function(n){
return Math.pow(n,3);
};
dojo.lfx.easeOut=function(n){
return (1-Math.pow(1-n,3));
};
dojo.lfx.easeInOut=function(n){
return ((3*Math.pow(n,2))-(2*Math.pow(n,3)));
};
dojo.lfx.IAnimation=function(){
};
dojo.lang.extend(dojo.lfx.IAnimation,{curve:null,duration:1000,easing:null,repeatCount:0,rate:10,handler:null,beforeBegin:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,play:null,pause:null,stop:null,connect:function(evt,_42d,_42e){
if(!_42e){
_42e=_42d;
_42d=this;
}
_42e=dojo.lang.hitch(_42d,_42e);
var _42f=this[evt]||function(){
};
this[evt]=function(){
var ret=_42f.apply(this,arguments);
_42e.apply(this,arguments);
return ret;
};
return this;
},fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,(args||[]));
}
return this;
},repeat:function(_433){
this.repeatCount=_433;
return this;
},_active:false,_paused:false});
dojo.lfx.Animation=function(_434,_435,_436,_437,_438,rate){
dojo.lfx.IAnimation.call(this);
if(dojo.lang.isNumber(_434)||(!_434&&_435.getValue)){
rate=_438;
_438=_437;
_437=_436;
_436=_435;
_435=_434;
_434=null;
}else{
if(_434.getValue||dojo.lang.isArray(_434)){
rate=_437;
_438=_436;
_437=_435;
_436=_434;
_435=null;
_434=null;
}
}
if(dojo.lang.isArray(_436)){
this.curve=new dojo.lfx.Line(_436[0],_436[1]);
}else{
this.curve=_436;
}
if(_435!=null&&_435>0){
this.duration=_435;
}
if(_438){
this.repeatCount=_438;
}
if(rate){
this.rate=rate;
}
if(_434){
dojo.lang.forEach(["handler","beforeBegin","onBegin","onEnd","onPlay","onStop","onAnimate"],function(item){
if(_434[item]){
this.connect(item,_434[item]);
}
},this);
}
if(_437&&dojo.lang.isFunction(_437)){
this.easing=_437;
}
};
dojo.inherits(dojo.lfx.Animation,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Animation,{_startTime:null,_endTime:null,_timer:null,_percent:0,_startRepeatCount:0,play:function(_43b,_43c){
if(_43c){
clearTimeout(this._timer);
this._active=false;
this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return this;
}
}
this.fire("handler",["beforeBegin"]);
this.fire("beforeBegin");
if(_43b>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_43c);
}),_43b);
return this;
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=(this.duration*this._percent/100);
}
this._endTime=this._startTime+this.duration;
this._active=true;
this._paused=false;
var step=this._percent/100;
var _43e=this.curve.getValue(step);
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeatCount;
}
this.fire("handler",["begin",_43e]);
this.fire("onBegin",[_43e]);
}
this.fire("handler",["play",_43e]);
this.fire("onPlay",[_43e]);
this._cycle();
return this;
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return this;
}
this._paused=true;
var _43f=this.curve.getValue(this._percent/100);
this.fire("handler",["pause",_43f]);
this.fire("onPause",[_43f]);
return this;
},gotoPercent:function(pct,_441){
clearTimeout(this._timer);
this._active=true;
this._paused=true;
this._percent=pct;
if(_441){
this.play();
}
return this;
},stop:function(_442){
clearTimeout(this._timer);
var step=this._percent/100;
if(_442){
step=1;
}
var _444=this.curve.getValue(step);
this.fire("handler",["stop",_444]);
this.fire("onStop",[_444]);
this._active=false;
this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}else{
return "stopped";
}
return this;
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
if(step>=1){
step=1;
this._percent=100;
}else{
this._percent=step*100;
}
if((this.easing)&&(dojo.lang.isFunction(this.easing))){
step=this.easing(step);
}
var _447=this.curve.getValue(step);
this.fire("handler",["animate",_447]);
this.fire("onAnimate",[_447]);
if(step<1){
this._timer=setTimeout(dojo.lang.hitch(this,"_cycle"),this.rate);
}else{
this._active=false;
this.fire("handler",["end"]);
this.fire("onEnd");
if(this.repeatCount>0){
this.repeatCount--;
this.play(null,true);
}else{
if(this.repeatCount==-1){
this.play(null,true);
}else{
if(this._startRepeatCount){
this.repeatCount=this._startRepeatCount;
this._startRepeatCount=0;
}
}
}
}
}
return this;
}});
dojo.lfx.Combine=function(_448){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._animsEnded=0;
var _449=arguments;
if(_449.length==1&&(dojo.lang.isArray(_449[0])||dojo.lang.isArrayLike(_449[0]))){
_449=_449[0];
}
dojo.lang.forEach(_449,function(anim){
this._anims.push(anim);
anim.connect("onEnd",dojo.lang.hitch(this,"_onAnimsEnded"));
},this);
};
dojo.inherits(dojo.lfx.Combine,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Combine,{_animsEnded:0,play:function(_44b,_44c){
if(!this._anims.length){
return this;
}
this.fire("beforeBegin");
if(_44b>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_44c);
}),_44b);
return this;
}
if(_44c||this._anims[0].percent==0){
this.fire("onBegin");
}
this.fire("onPlay");
this._animsCall("play",null,_44c);
return this;
},pause:function(){
this.fire("onPause");
this._animsCall("pause");
return this;
},stop:function(_44d){
this.fire("onStop");
this._animsCall("stop",_44d);
return this;
},_onAnimsEnded:function(){
this._animsEnded++;
if(this._animsEnded>=this._anims.length){
this.fire("onEnd");
}
return this;
},_animsCall:function(_44e){
var args=[];
if(arguments.length>1){
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
}
var _451=this;
dojo.lang.forEach(this._anims,function(anim){
anim[_44e](args);
},_451);
return this;
}});
dojo.lfx.Chain=function(_453){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._currAnim=-1;
var _454=arguments;
if(_454.length==1&&(dojo.lang.isArray(_454[0])||dojo.lang.isArrayLike(_454[0]))){
_454=_454[0];
}
var _455=this;
dojo.lang.forEach(_454,function(anim,i,_458){
this._anims.push(anim);
if(i<_458.length-1){
anim.connect("onEnd",dojo.lang.hitch(this,"_playNext"));
}else{
anim.connect("onEnd",dojo.lang.hitch(this,function(){
this.fire("onEnd");
}));
}
},this);
};
dojo.inherits(dojo.lfx.Chain,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Chain,{_currAnim:-1,play:function(_459,_45a){
if(!this._anims.length){
return this;
}
if(_45a||!this._anims[this._currAnim]){
this._currAnim=0;
}
var _45b=this._anims[this._currAnim];
this.fire("beforeBegin");
if(_459>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_45a);
}),_459);
return this;
}
if(_45b){
if(this._currAnim==0){
this.fire("handler",["begin",this._currAnim]);
this.fire("onBegin",[this._currAnim]);
}
this.fire("onPlay",[this._currAnim]);
_45b.play(null,_45a);
}
return this;
},pause:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].pause();
this.fire("onPause",[this._currAnim]);
}
return this;
},playPause:function(){
if(this._anims.length==0){
return this;
}
if(this._currAnim==-1){
this._currAnim=0;
}
var _45c=this._anims[this._currAnim];
if(_45c){
if(!_45c._active||_45c._paused){
this.play();
}else{
this.pause();
}
}
return this;
},stop:function(){
var _45d=this._anims[this._currAnim];
if(_45d){
_45d.stop();
this.fire("onStop",[this._currAnim]);
}
return _45d;
},_playNext:function(){
if(this._currAnim==-1||this._anims.length==0){
return this;
}
this._currAnim++;
if(this._anims[this._currAnim]){
this._anims[this._currAnim].play(null,true);
}
return this;
}});
dojo.lfx.combine=function(_45e){
var _45f=arguments;
if(dojo.lang.isArray(arguments[0])){
_45f=arguments[0];
}
if(_45f.length==1){
return _45f[0];
}
return new dojo.lfx.Combine(_45f);
};
dojo.lfx.chain=function(_460){
var _461=arguments;
if(dojo.lang.isArray(arguments[0])){
_461=arguments[0];
}
if(_461.length==1){
return _461[0];
}
return new dojo.lfx.Chain(_461);
};
dojo.provide("dojo.html.common");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.html.body=function(){
dojo.deprecated("dojo.html.body() moved to dojo.body()","0.5");
return dojo.body();
};
dojo.html.getEventTarget=function(evt){
if(!evt){
evt=dojo.global().event||{};
}
var t=(evt.srcElement?evt.srcElement:(evt.target?evt.target:null));
while((t)&&(t.nodeType!=1)){
t=t.parentNode;
}
return t;
};
dojo.html.getViewport=function(){
var _464=dojo.global();
var _465=dojo.doc();
var w=0;
var h=0;
if(dojo.render.html.mozilla){
w=_465.documentElement.clientWidth;
h=_464.innerHeight;
}else{
if(!dojo.render.html.opera&&_464.innerWidth){
w=_464.innerWidth;
h=_464.innerHeight;
}else{
if(!dojo.render.html.opera&&dojo.exists(_465,"documentElement.clientWidth")){
var w2=_465.documentElement.clientWidth;
if(!w||w2&&w2<w){
w=w2;
}
h=_465.documentElement.clientHeight;
}else{
if(dojo.body().clientWidth){
w=dojo.body().clientWidth;
h=dojo.body().clientHeight;
}
}
}
}
return {width:w,height:h};
};
dojo.html.getScroll=function(){
var _469=dojo.global();
var _46a=dojo.doc();
var top=_469.pageYOffset||_46a.documentElement.scrollTop||dojo.body().scrollTop||0;
var left=_469.pageXOffset||_46a.documentElement.scrollLeft||dojo.body().scrollLeft||0;
return {top:top,left:left,offset:{x:left,y:top}};
};
dojo.html.getParentByType=function(node,type){
var _46f=dojo.doc();
var _470=dojo.byId(node);
type=type.toLowerCase();
while((_470)&&(_470.nodeName.toLowerCase()!=type)){
if(_470==(_46f["body"]||_46f["documentElement"])){
return null;
}
_470=_470.parentNode;
}
return _470;
};
dojo.html.getAttribute=function(node,attr){
node=dojo.byId(node);
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&v.value){
return v.value;
}
if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
return (node.getAttributeNode(ta)).value;
}else{
if(node.getAttribute(ta)){
return node.getAttribute(ta);
}else{
if(node.getAttribute(ta.toLowerCase())){
return node.getAttribute(ta.toLowerCase());
}
}
}
return null;
};
dojo.html.hasAttribute=function(node,attr){
return dojo.html.getAttribute(dojo.byId(node),attr)?true:false;
};
dojo.html.getCursorPosition=function(e){
e=e||dojo.global().event;
var _478={x:0,y:0};
if(e.pageX||e.pageY){
_478.x=e.pageX;
_478.y=e.pageY;
}else{
var de=dojo.doc().documentElement;
var db=dojo.body();
_478.x=e.clientX+((de||db)["scrollLeft"])-((de||db)["clientLeft"]);
_478.y=e.clientY+((de||db)["scrollTop"])-((de||db)["clientTop"]);
}
return _478;
};
dojo.html.isTag=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName.toLowerCase()==String(arguments[i]).toLowerCase()){
return String(arguments[i]).toLowerCase();
}
}
}
return "";
};
if(dojo.render.html.ie&&!dojo.render.html.ie70){
if(window.location.href.substr(0,6).toLowerCase()!="https:"){
(function(){
var _47d=dojo.doc().createElement("script");
_47d.src="javascript:'dojo.html.createExternalElement=function(doc, tag){ return doc.createElement(tag); }'";
dojo.doc().getElementsByTagName("head")[0].appendChild(_47d);
})();
}
}else{
dojo.html.createExternalElement=function(doc,tag){
return doc.createElement(tag);
};
}
dojo.html._callDeprecated=function(_480,_481,args,_483,_484){
dojo.deprecated("dojo.html."+_480,"replaced by dojo.html."+_481+"("+(_483?"node, {"+_483+": "+_483+"}":"")+")"+(_484?"."+_484:""),"0.5");
var _485=[];
if(_483){
var _486={};
_486[_483]=args[1];
_485.push(args[0]);
_485.push(_486);
}else{
_485=args;
}
var ret=dojo.html[_481].apply(dojo.html,args);
if(_484){
return ret[_484];
}else{
return ret;
}
};
dojo.html.getViewportWidth=function(){
return dojo.html._callDeprecated("getViewportWidth","getViewport",arguments,null,"width");
};
dojo.html.getViewportHeight=function(){
return dojo.html._callDeprecated("getViewportHeight","getViewport",arguments,null,"height");
};
dojo.html.getViewportSize=function(){
return dojo.html._callDeprecated("getViewportSize","getViewport",arguments);
};
dojo.html.getScrollTop=function(){
return dojo.html._callDeprecated("getScrollTop","getScroll",arguments,null,"top");
};
dojo.html.getScrollLeft=function(){
return dojo.html._callDeprecated("getScrollLeft","getScroll",arguments,null,"left");
};
dojo.html.getScrollOffset=function(){
return dojo.html._callDeprecated("getScrollOffset","getScroll",arguments,null,"offset");
};
dojo.provide("dojo.uri.Uri");
dojo.uri=new function(){
this.dojoUri=function(uri){
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(),uri);
};
this.moduleUri=function(_489,uri){
var loc=dojo.hostenv.getModuleSymbols(_489).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _48c=loc.indexOf(":");
var _48d=loc.indexOf("/");
if(loc.charAt(0)!="/"&&(_48c==-1||_48c>_48d)){
loc=dojo.hostenv.getBaseScriptUri()+loc;
}
return new dojo.uri.Uri(loc,uri);
};
this.Uri=function(){
var uri=arguments[0];
for(var i=1;i<arguments.length;i++){
if(!arguments[i]){
continue;
}
var _490=new dojo.uri.Uri(arguments[i].toString());
var _491=new dojo.uri.Uri(uri.toString());
if((_490.path=="")&&(_490.scheme==null)&&(_490.authority==null)&&(_490.query==null)){
if(_490.fragment!=null){
_491.fragment=_490.fragment;
}
_490=_491;
}else{
if(_490.scheme==null){
_490.scheme=_491.scheme;
if(_490.authority==null){
_490.authority=_491.authority;
if(_490.path.charAt(0)!="/"){
var path=_491.path.substring(0,_491.path.lastIndexOf("/")+1)+_490.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==segs.length-1){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_490.path=segs.join("/");
}
}
}
}
uri="";
if(_490.scheme!=null){
uri+=_490.scheme+":";
}
if(_490.authority!=null){
uri+="//"+_490.authority;
}
uri+=_490.path;
if(_490.query!=null){
uri+="?"+_490.query;
}
if(_490.fragment!=null){
uri+="#"+_490.fragment;
}
}
this.uri=uri.toString();
var _495="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_495));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_495="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_495));
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
this.toString=function(){
return this.uri;
};
};
};
dojo.provide("dojo.html.style");
dojo.html.getClass=function(node){
node=dojo.byId(node);
if(!node){
return "";
}
var cs="";
if(node.className){
cs=node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
cs=dojo.html.getAttribute(node,"class");
}
}
return cs.replace(/^\s+|\s+$/g,"");
};
dojo.html.getClasses=function(node){
var c=dojo.html.getClass(node);
return (c=="")?[]:c.split(/\s+/g);
};
dojo.html.hasClass=function(node,_49c){
return (new RegExp("(^|\\s+)"+_49c+"(\\s+|$)")).test(dojo.html.getClass(node));
};
dojo.html.prependClass=function(node,_49e){
_49e+=" "+dojo.html.getClass(node);
return dojo.html.setClass(node,_49e);
};
dojo.html.addClass=function(node,_4a0){
if(dojo.html.hasClass(node,_4a0)){
return false;
}
_4a0=(dojo.html.getClass(node)+" "+_4a0).replace(/^\s+|\s+$/g,"");
return dojo.html.setClass(node,_4a0);
};
dojo.html.setClass=function(node,_4a2){
node=dojo.byId(node);
var cs=new String(_4a2);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_4a2);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("dojo.html.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_4a5,_4a6){
try{
if(!_4a6){
var _4a7=dojo.html.getClass(node).replace(new RegExp("(^|\\s+)"+_4a5+"(\\s+|$)"),"$1$2");
}else{
var _4a7=dojo.html.getClass(node).replace(_4a5,"");
}
dojo.html.setClass(node,_4a7);
}
catch(e){
dojo.debug("dojo.html.removeClass() failed",e);
}
return true;
};
dojo.html.replaceClass=function(node,_4a9,_4aa){
dojo.html.removeClass(node,_4aa);
dojo.html.addClass(node,_4a9);
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_4ab,_4ac,_4ad,_4ae,_4af){
_4af=false;
var _4b0=dojo.doc();
_4ac=dojo.byId(_4ac)||_4b0;
var _4b1=_4ab.split(/\s+/g);
var _4b2=[];
if(_4ae!=1&&_4ae!=2){
_4ae=0;
}
var _4b3=new RegExp("(\\s|^)(("+_4b1.join(")|(")+"))(\\s|$)");
var _4b4=_4b1.join(" ").length;
var _4b5=[];
if(!_4af&&_4b0.evaluate){
var _4b6=".//"+(_4ad||"*")+"[contains(";
if(_4ae!=dojo.html.classMatchType.ContainsAny){
_4b6+="concat(' ',@class,' '), ' "+_4b1.join(" ') and contains(concat(' ',@class,' '), ' ")+" ')";
if(_4ae==2){
_4b6+=" and string-length(@class)="+_4b4+"]";
}else{
_4b6+="]";
}
}else{
_4b6+="concat(' ',@class,' '), ' "+_4b1.join(" ') or contains(concat(' ',@class,' '), ' ")+" ')]";
}
var _4b7=_4b0.evaluate(_4b6,_4ac,null,XPathResult.ANY_TYPE,null);
var _4b8=_4b7.iterateNext();
while(_4b8){
try{
_4b5.push(_4b8);
_4b8=_4b7.iterateNext();
}
catch(e){
break;
}
}
return _4b5;
}else{
if(!_4ad){
_4ad="*";
}
_4b5=_4ac.getElementsByTagName(_4ad);
var node,i=0;
outer:
while(node=_4b5[i++]){
var _4bb=dojo.html.getClasses(node);
if(_4bb.length==0){
continue outer;
}
var _4bc=0;
for(var j=0;j<_4bb.length;j++){
if(_4b3.test(_4bb[j])){
if(_4ae==dojo.html.classMatchType.ContainsAny){
_4b2.push(node);
continue outer;
}else{
_4bc++;
}
}else{
if(_4ae==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_4bc==_4b1.length){
if((_4ae==dojo.html.classMatchType.IsOnly)&&(_4bc==_4bb.length)){
_4b2.push(node);
}else{
if(_4ae==dojo.html.classMatchType.ContainsAll){
_4b2.push(node);
}
}
}
}
return _4b2;
}
};
dojo.html.getElementsByClassName=dojo.html.getElementsByClass;
dojo.html.toCamelCase=function(_4be){
var arr=_4be.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
dojo.html.toSelectorCase=function(_4c2){
return _4c2.replace(/([A-Z])/g,"-$1").toLowerCase();
};
if(dojo.render.html.ie){
dojo.html.getComputedStyle=function(node,_4c4,_4c5){
node=dojo.byId(node);
if(!node||!node.currentStyle){
return _4c5;
}
return node.currentStyle[dojo.html.toCamelCase(_4c4)];
};
dojo.html.getComputedStyles=function(node){
return node.currentStyle;
};
}else{
dojo.html.getComputedStyle=function(node,_4c8,_4c9){
node=dojo.byId(node);
if(!node||!node.style){
return _4c9;
}
var s=document.defaultView.getComputedStyle(node,null);
return (s&&s[dojo.html.toCamelCase(_4c8)])||"";
};
dojo.html.getComputedStyles=function(node){
return document.defaultView.getComputedStyle(node,null);
};
}
dojo.html.getStyleProperty=function(node,_4cd){
node=dojo.byId(node);
return (node&&node.style?node.style[dojo.html.toCamelCase(_4cd)]:undefined);
};
dojo.html.getStyle=function(node,_4cf){
var _4d0=dojo.html.getStyleProperty(node,_4cf);
return (_4d0?_4d0:dojo.html.getComputedStyle(node,_4cf));
};
dojo.html.setStyle=function(node,_4d2,_4d3){
node=dojo.byId(node);
if(node&&node.style){
var _4d4=dojo.html.toCamelCase(_4d2);
node.style[_4d4]=_4d3;
}
};
dojo.html.setStyleText=function(_4d5,text){
try{
_4d5.style.cssText=text;
}
catch(e){
_4d5.setAttribute("style",text);
}
};
dojo.html.copyStyle=function(_4d7,_4d8){
if(!_4d8.style.cssText){
_4d7.setAttribute("style",_4d8.getAttribute("style"));
}else{
_4d7.style.cssText=_4d8.style.cssText;
}
dojo.html.addClass(_4d7,dojo.html.getClass(_4d8));
};
dojo.html.getUnitValue=function(node,_4da,_4db){
var s=dojo.html.getComputedStyle(node,_4da);
if((!s)||((s=="auto")&&(_4db))){
return {value:0,units:"px"};
}
var _4dd=s.match(/(\-?[\d.]+)([a-z%]*)/i);
if(!_4dd){
return dojo.html.getUnitValue.bad;
}
return {value:Number(_4dd[1]),units:_4dd[2].toLowerCase()};
};
dojo.html.getUnitValue.bad={value:NaN,units:""};
if(dojo.render.html.ie){
dojo.html.toPixelValue=function(_4de,_4df){
if(!_4df){
return 0;
}
if(_4df.slice(-2)=="px"){
return parseFloat(_4df);
}
var _4e0=0;
with(_4de){
var _4e1=style.left;
var _4e2=runtimeStyle.left;
runtimeStyle.left=currentStyle.left;
try{
style.left=_4df||0;
_4e0=style.pixelLeft;
style.left=_4e1;
runtimeStyle.left=_4e2;
}
catch(e){
}
}
return _4e0;
};
}else{
dojo.html.toPixelValue=function(_4e3,_4e4){
return (_4e4&&(_4e4.slice(-2)=="px")?parseFloat(_4e4):0);
};
}
dojo.html.getPixelValue=function(node,_4e6,_4e7){
return dojo.html.toPixelValue(node,dojo.html.getComputedStyle(node,_4e6));
};
dojo.html.setPositivePixelValue=function(node,_4e9,_4ea){
if(isNaN(_4ea)){
return false;
}
node.style[_4e9]=Math.max(0,_4ea)+"px";
return true;
};
dojo.html.styleSheet=null;
dojo.html.insertCssRule=function(_4eb,_4ec,_4ed){
if(!dojo.html.styleSheet){
if(document.createStyleSheet){
dojo.html.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
dojo.html.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(dojo.html.styleSheet.cssRules){
_4ed=dojo.html.styleSheet.cssRules.length;
}else{
if(dojo.html.styleSheet.rules){
_4ed=dojo.html.styleSheet.rules.length;
}else{
return null;
}
}
}
if(dojo.html.styleSheet.insertRule){
var rule=_4eb+" { "+_4ec+" }";
return dojo.html.styleSheet.insertRule(rule,_4ed);
}else{
if(dojo.html.styleSheet.addRule){
return dojo.html.styleSheet.addRule(_4eb,_4ec,_4ed);
}else{
return null;
}
}
};
dojo.html.removeCssRule=function(_4ef){
if(!dojo.html.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(dojo.render.html.ie){
if(!_4ef){
_4ef=dojo.html.styleSheet.rules.length;
dojo.html.styleSheet.removeRule(_4ef);
}
}else{
if(document.styleSheets[0]){
if(!_4ef){
_4ef=dojo.html.styleSheet.cssRules.length;
}
dojo.html.styleSheet.deleteRule(_4ef);
}
}
return true;
};
dojo.html._insertedCssFiles=[];
dojo.html.insertCssFile=function(URI,doc,_4f2,_4f3){
if(!URI){
return;
}
if(!doc){
doc=document;
}
var _4f4=dojo.hostenv.getText(URI,false,_4f3);
if(_4f4===null){
return;
}
_4f4=dojo.html.fixPathsInCssText(_4f4,URI);
if(_4f2){
var idx=-1,node,ent=dojo.html._insertedCssFiles;
for(var i=0;i<ent.length;i++){
if((ent[i].doc==doc)&&(ent[i].cssText==_4f4)){
idx=i;
node=ent[i].nodeRef;
break;
}
}
if(node){
var _4f9=doc.getElementsByTagName("style");
for(var i=0;i<_4f9.length;i++){
if(_4f9[i]==node){
return;
}
}
dojo.html._insertedCssFiles.shift(idx,1);
}
}
var _4fa=dojo.html.insertCssText(_4f4,doc);
dojo.html._insertedCssFiles.push({"doc":doc,"cssText":_4f4,"nodeRef":_4fa});
if(_4fa&&djConfig.isDebug){
_4fa.setAttribute("dbgHref",URI);
}
return _4fa;
};
dojo.html.insertCssText=function(_4fb,doc,URI){
if(!_4fb){
return;
}
if(!doc){
doc=document;
}
if(URI){
_4fb=dojo.html.fixPathsInCssText(_4fb,URI);
}
var _4fe=doc.createElement("style");
_4fe.setAttribute("type","text/css");
var head=doc.getElementsByTagName("head")[0];
if(!head){
dojo.debug("No head tag in document, aborting styles");
return;
}else{
head.appendChild(_4fe);
}
if(_4fe.styleSheet){
var _500=function(){
try{
_4fe.styleSheet.cssText=_4fb;
}
catch(e){
dojo.debug(e);
}
};
if(_4fe.styleSheet.disabled){
setTimeout(_500,10);
}else{
_500();
}
}else{
var _501=doc.createTextNode(_4fb);
_4fe.appendChild(_501);
}
return _4fe;
};
dojo.html.fixPathsInCssText=function(_502,URI){
if(!_502||!URI){
return;
}
var _504,str="",url="",_507="[\\t\\s\\w\\(\\)\\/\\.\\\\'\"-:#=&?~]+";
var _508=new RegExp("url\\(\\s*("+_507+")\\s*\\)");
var _509=/(file|https?|ftps?):\/\//;
regexTrim=new RegExp("^[\\s]*(['\"]?)("+_507+")\\1[\\s]*?$");
if(dojo.render.html.ie55||dojo.render.html.ie60){
var _50a=new RegExp("AlphaImageLoader\\((.*)src=['\"]("+_507+")['\"]");
while(_504=_50a.exec(_502)){
url=_504[2].replace(regexTrim,"$2");
if(!_509.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_502.substring(0,_504.index)+"AlphaImageLoader("+_504[1]+"src='"+url+"'";
_502=_502.substr(_504.index+_504[0].length);
}
_502=str+_502;
str="";
}
while(_504=_508.exec(_502)){
url=_504[1].replace(regexTrim,"$2");
if(!_509.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_502.substring(0,_504.index)+"url("+url+")";
_502=_502.substr(_504.index+_504[0].length);
}
return str+_502;
};
dojo.html.setActiveStyleSheet=function(_50b){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_50b){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.applyBrowserClass=function(node){
var drh=dojo.render.html;
var _517={dj_ie:drh.ie,dj_ie55:drh.ie55,dj_ie6:drh.ie60,dj_ie7:drh.ie70,dj_iequirks:drh.ie&&drh.quirks,dj_opera:drh.opera,dj_opera8:drh.opera&&(Math.floor(dojo.render.version)==8),dj_opera9:drh.opera&&(Math.floor(dojo.render.version)==9),dj_khtml:drh.khtml,dj_safari:drh.safari,dj_gecko:drh.mozilla};
for(var p in _517){
if(_517[p]){
dojo.html.addClass(node,p);
}
}
};
dojo.provide("dojo.html.display");
dojo.html._toggle=function(node,_51a,_51b){
node=dojo.byId(node);
_51b(node,!_51a(node));
return _51a(node);
};
dojo.html.show=function(node){
node=dojo.byId(node);
if(dojo.html.getStyleProperty(node,"display")=="none"){
dojo.html.setStyle(node,"display",(node.dojoDisplayCache||""));
node.dojoDisplayCache=undefined;
}
};
dojo.html.hide=function(node){
node=dojo.byId(node);
if(typeof node["dojoDisplayCache"]=="undefined"){
var d=dojo.html.getStyleProperty(node,"display");
if(d!="none"){
node.dojoDisplayCache=d;
}
}
dojo.html.setStyle(node,"display","none");
};
dojo.html.setShowing=function(node,_520){
dojo.html[(_520?"show":"hide")](node);
};
dojo.html.isShowing=function(node){
return (dojo.html.getStyleProperty(node,"display")!="none");
};
dojo.html.toggleShowing=function(node){
return dojo.html._toggle(node,dojo.html.isShowing,dojo.html.setShowing);
};
dojo.html.displayMap={tr:"",td:"",th:"",img:"inline",span:"inline",input:"inline",button:"inline"};
dojo.html.suggestDisplayByTagName=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var tag=node.tagName.toLowerCase();
return (tag in dojo.html.displayMap?dojo.html.displayMap[tag]:"block");
}
};
dojo.html.setDisplay=function(node,_526){
dojo.html.setStyle(node,"display",((_526 instanceof String||typeof _526=="string")?_526:(_526?dojo.html.suggestDisplayByTagName(node):"none")));
};
dojo.html.isDisplayed=function(node){
return (dojo.html.getComputedStyle(node,"display")!="none");
};
dojo.html.toggleDisplay=function(node){
return dojo.html._toggle(node,dojo.html.isDisplayed,dojo.html.setDisplay);
};
dojo.html.setVisibility=function(node,_52a){
dojo.html.setStyle(node,"visibility",((_52a instanceof String||typeof _52a=="string")?_52a:(_52a?"visible":"hidden")));
};
dojo.html.isVisible=function(node){
return (dojo.html.getComputedStyle(node,"visibility")!="hidden");
};
dojo.html.toggleVisibility=function(node){
return dojo.html._toggle(node,dojo.html.isVisible,dojo.html.setVisibility);
};
dojo.html.setOpacity=function(node,_52e,_52f){
node=dojo.byId(node);
var h=dojo.render.html;
if(!_52f){
if(_52e>=1){
if(h.ie){
dojo.html.clearOpacity(node);
return;
}else{
_52e=0.999999;
}
}else{
if(_52e<0){
_52e=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_52e*100+")";
}
}
node.style.filter="Alpha(Opacity="+_52e*100+")";
}else{
if(h.moz){
node.style.opacity=_52e;
node.style.MozOpacity=_52e;
}else{
if(h.safari){
node.style.opacity=_52e;
node.style.KhtmlOpacity=_52e;
}else{
node.style.opacity=_52e;
}
}
}
};
dojo.html.clearOpacity=function(node){
node=dojo.byId(node);
var ns=node.style;
var h=dojo.render.html;
if(h.ie){
try{
if(node.filters&&node.filters.alpha){
ns.filter="";
}
}
catch(e){
}
}else{
if(h.moz){
ns.opacity=1;
ns.MozOpacity=1;
}else{
if(h.safari){
ns.opacity=1;
ns.KhtmlOpacity=1;
}else{
ns.opacity=1;
}
}
}
};
dojo.html.getOpacity=function(node){
node=dojo.byId(node);
var h=dojo.render.html;
if(h.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
dojo.provide("dojo.html.color");
dojo.html.getBackgroundColor=function(node){
node=dojo.byId(node);
var _53a;
do{
_53a=dojo.html.getStyle(node,"background-color");
if(_53a.toLowerCase()=="rgba(0, 0, 0, 0)"){
_53a="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(["transparent",""],_53a));
if(_53a=="transparent"){
_53a=[255,255,255,0];
}else{
_53a=dojo.gfx.color.extractRGB(_53a);
}
return _53a;
};
dojo.provide("dojo.html.layout");
dojo.html.sumAncestorProperties=function(node,prop){
node=dojo.byId(node);
if(!node){
return 0;
}
var _53d=0;
while(node){
if(dojo.html.getComputedStyle(node,"position")=="fixed"){
return 0;
}
var val=node[prop];
if(val){
_53d+=val-0;
if(node==dojo.body()){
break;
}
}
node=node.parentNode;
}
return _53d;
};
dojo.html.setStyleAttributes=function(node,_540){
node=dojo.byId(node);
var _541=_540.replace(/(;)?\s*$/,"").split(";");
for(var i=0;i<_541.length;i++){
var _543=_541[i].split(":");
var name=_543[0].replace(/\s*$/,"").replace(/^\s*/,"").toLowerCase();
var _545=_543[1].replace(/\s*$/,"").replace(/^\s*/,"");
switch(name){
case "opacity":
dojo.html.setOpacity(node,_545);
break;
case "content-height":
dojo.html.setContentBox(node,{height:_545});
break;
case "content-width":
dojo.html.setContentBox(node,{width:_545});
break;
case "outer-height":
dojo.html.setMarginBox(node,{height:_545});
break;
case "outer-width":
dojo.html.setMarginBox(node,{width:_545});
break;
default:
node.style[dojo.html.toCamelCase(name)]=_545;
}
}
};
dojo.html.boxSizing={MARGIN_BOX:"margin-box",BORDER_BOX:"border-box",PADDING_BOX:"padding-box",CONTENT_BOX:"content-box"};
dojo.html.getAbsolutePosition=dojo.html.abs=function(node,_547,_548){
node=dojo.byId(node,node.ownerDocument);
var ret={x:0,y:0};
var bs=dojo.html.boxSizing;
if(!_548){
_548=bs.CONTENT_BOX;
}
var _54b=2;
var _54c;
switch(_548){
case bs.MARGIN_BOX:
_54c=3;
break;
case bs.BORDER_BOX:
_54c=2;
break;
case bs.PADDING_BOX:
default:
_54c=1;
break;
case bs.CONTENT_BOX:
_54c=0;
break;
}
var h=dojo.render.html;
var db=document["body"]||document["documentElement"];
if(h.ie){
with(node.getBoundingClientRect()){
ret.x=left-2;
ret.y=top-2;
}
}else{
if(document.getBoxObjectFor){
_54b=1;
try{
var bo=document.getBoxObjectFor(node);
ret.x=bo.x-dojo.html.sumAncestorProperties(node,"scrollLeft");
ret.y=bo.y-dojo.html.sumAncestorProperties(node,"scrollTop");
}
catch(e){
}
}else{
if(node["offsetParent"]){
var _550;
if((h.safari)&&(node.style.getPropertyValue("position")=="absolute")&&(node.parentNode==db)){
_550=db;
}else{
_550=db.parentNode;
}
if(node.parentNode!=db){
var nd=node;
if(dojo.render.html.opera){
nd=db;
}
ret.x-=dojo.html.sumAncestorProperties(nd,"scrollLeft");
ret.y-=dojo.html.sumAncestorProperties(nd,"scrollTop");
}
var _552=node;
do{
var n=_552["offsetLeft"];
if(!h.opera||n>0){
ret.x+=isNaN(n)?0:n;
}
var m=_552["offsetTop"];
ret.y+=isNaN(m)?0:m;
_552=_552.offsetParent;
}while((_552!=_550)&&(_552!=null));
}else{
if(node["x"]&&node["y"]){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
}
if(_547){
var _555=dojo.html.getScroll();
ret.y+=_555.top;
ret.x+=_555.left;
}
var _556=[dojo.html.getPaddingExtent,dojo.html.getBorderExtent,dojo.html.getMarginExtent];
if(_54b>_54c){
for(var i=_54c;i<_54b;++i){
ret.y+=_556[i](node,"top");
ret.x+=_556[i](node,"left");
}
}else{
if(_54b<_54c){
for(var i=_54c;i>_54b;--i){
ret.y-=_556[i-1](node,"top");
ret.x-=_556[i-1](node,"left");
}
}
}
ret.top=ret.y;
ret.left=ret.x;
return ret;
};
dojo.html.isPositionAbsolute=function(node){
return (dojo.html.getComputedStyle(node,"position")=="absolute");
};
dojo.html._sumPixelValues=function(node,_55a,_55b){
var _55c=0;
for(var x=0;x<_55a.length;x++){
_55c+=dojo.html.getPixelValue(node,_55a[x],_55b);
}
return _55c;
};
dojo.html.getMargin=function(node){
return {width:dojo.html._sumPixelValues(node,["margin-left","margin-right"],(dojo.html.getComputedStyle(node,"position")=="absolute")),height:dojo.html._sumPixelValues(node,["margin-top","margin-bottom"],(dojo.html.getComputedStyle(node,"position")=="absolute"))};
};
dojo.html.getBorder=function(node){
return {width:dojo.html.getBorderExtent(node,"left")+dojo.html.getBorderExtent(node,"right"),height:dojo.html.getBorderExtent(node,"top")+dojo.html.getBorderExtent(node,"bottom")};
};
dojo.html.getBorderExtent=function(node,side){
return (dojo.html.getStyle(node,"border-"+side+"-style")=="none"?0:dojo.html.getPixelValue(node,"border-"+side+"-width"));
};
dojo.html.getMarginExtent=function(node,side){
return dojo.html._sumPixelValues(node,["margin-"+side],dojo.html.isPositionAbsolute(node));
};
dojo.html.getPaddingExtent=function(node,side){
return dojo.html._sumPixelValues(node,["padding-"+side],true);
};
dojo.html.getPadding=function(node){
return {width:dojo.html._sumPixelValues(node,["padding-left","padding-right"],true),height:dojo.html._sumPixelValues(node,["padding-top","padding-bottom"],true)};
};
dojo.html.getPadBorder=function(node){
var pad=dojo.html.getPadding(node);
var _569=dojo.html.getBorder(node);
return {width:pad.width+_569.width,height:pad.height+_569.height};
};
dojo.html.getBoxSizing=function(node){
var h=dojo.render.html;
var bs=dojo.html.boxSizing;
if(((h.ie)||(h.opera))&&node.nodeName.toLowerCase()!="img"){
var cm=document["compatMode"];
if((cm=="BackCompat")||(cm=="QuirksMode")){
return bs.BORDER_BOX;
}else{
return bs.CONTENT_BOX;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _56e;
if(!h.ie){
_56e=dojo.html.getStyle(node,"-moz-box-sizing");
if(!_56e){
_56e=dojo.html.getStyle(node,"box-sizing");
}
}
return (_56e?_56e:bs.CONTENT_BOX);
}
};
dojo.html.isBorderBox=function(node){
return (dojo.html.getBoxSizing(node)==dojo.html.boxSizing.BORDER_BOX);
};
dojo.html.getBorderBox=function(node){
node=dojo.byId(node);
return {width:node.offsetWidth,height:node.offsetHeight};
};
dojo.html.getPaddingBox=function(node){
var box=dojo.html.getBorderBox(node);
var _573=dojo.html.getBorder(node);
return {width:box.width-_573.width,height:box.height-_573.height};
};
dojo.html.getContentBox=function(node){
node=dojo.byId(node);
var _575=dojo.html.getPadBorder(node);
return {width:node.offsetWidth-_575.width,height:node.offsetHeight-_575.height};
};
dojo.html.setContentBox=function(node,args){
node=dojo.byId(node);
var _578=0;
var _579=0;
var isbb=dojo.html.isBorderBox(node);
var _57b=(isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var ret={};
if(typeof args.width!="undefined"){
_578=args.width+_57b.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_578);
}
if(typeof args.height!="undefined"){
_579=args.height+_57b.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_579);
}
return ret;
};
dojo.html.getMarginBox=function(node){
var _57e=dojo.html.getBorderBox(node);
var _57f=dojo.html.getMargin(node);
return {width:_57e.width+_57f.width,height:_57e.height+_57f.height};
};
dojo.html.setMarginBox=function(node,args){
node=dojo.byId(node);
var _582=0;
var _583=0;
var isbb=dojo.html.isBorderBox(node);
var _585=(!isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var _586=dojo.html.getMargin(node);
var ret={};
if(typeof args.width!="undefined"){
_582=args.width-_585.width;
_582-=_586.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_582);
}
if(typeof args.height!="undefined"){
_583=args.height-_585.height;
_583-=_586.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_583);
}
return ret;
};
dojo.html.getElementBox=function(node,type){
var bs=dojo.html.boxSizing;
switch(type){
case bs.MARGIN_BOX:
return dojo.html.getMarginBox(node);
case bs.BORDER_BOX:
return dojo.html.getBorderBox(node);
case bs.PADDING_BOX:
return dojo.html.getPaddingBox(node);
case bs.CONTENT_BOX:
default:
return dojo.html.getContentBox(node);
}
};
dojo.html.toCoordinateObject=dojo.html.toCoordinateArray=function(_58b,_58c,_58d){
if(_58b instanceof Array||typeof _58b=="array"){
dojo.deprecated("dojo.html.toCoordinateArray","use dojo.html.toCoordinateObject({left: , top: , width: , height: }) instead","0.5");
while(_58b.length<4){
_58b.push(0);
}
while(_58b.length>4){
_58b.pop();
}
var ret={left:_58b[0],top:_58b[1],width:_58b[2],height:_58b[3]};
}else{
if(!_58b.nodeType&&!(_58b instanceof String||typeof _58b=="string")&&("width" in _58b||"height" in _58b||"left" in _58b||"x" in _58b||"top" in _58b||"y" in _58b)){
var ret={left:_58b.left||_58b.x||0,top:_58b.top||_58b.y||0,width:_58b.width||0,height:_58b.height||0};
}else{
var node=dojo.byId(_58b);
var pos=dojo.html.abs(node,_58c,_58d);
var _591=dojo.html.getMarginBox(node);
var ret={left:pos.left,top:pos.top,width:_591.width,height:_591.height};
}
}
ret.x=ret.left;
ret.y=ret.top;
return ret;
};
dojo.html.setMarginBoxWidth=dojo.html.setOuterWidth=function(node,_593){
return dojo.html._callDeprecated("setMarginBoxWidth","setMarginBox",arguments,"width");
};
dojo.html.setMarginBoxHeight=dojo.html.setOuterHeight=function(){
return dojo.html._callDeprecated("setMarginBoxHeight","setMarginBox",arguments,"height");
};
dojo.html.getMarginBoxWidth=dojo.html.getOuterWidth=function(){
return dojo.html._callDeprecated("getMarginBoxWidth","getMarginBox",arguments,null,"width");
};
dojo.html.getMarginBoxHeight=dojo.html.getOuterHeight=function(){
return dojo.html._callDeprecated("getMarginBoxHeight","getMarginBox",arguments,null,"height");
};
dojo.html.getTotalOffset=function(node,type,_596){
return dojo.html._callDeprecated("getTotalOffset","getAbsolutePosition",arguments,null,type);
};
dojo.html.getAbsoluteX=function(node,_598){
return dojo.html._callDeprecated("getAbsoluteX","getAbsolutePosition",arguments,null,"x");
};
dojo.html.getAbsoluteY=function(node,_59a){
return dojo.html._callDeprecated("getAbsoluteY","getAbsolutePosition",arguments,null,"y");
};
dojo.html.totalOffsetLeft=function(node,_59c){
return dojo.html._callDeprecated("totalOffsetLeft","getAbsolutePosition",arguments,null,"left");
};
dojo.html.totalOffsetTop=function(node,_59e){
return dojo.html._callDeprecated("totalOffsetTop","getAbsolutePosition",arguments,null,"top");
};
dojo.html.getMarginWidth=function(node){
return dojo.html._callDeprecated("getMarginWidth","getMargin",arguments,null,"width");
};
dojo.html.getMarginHeight=function(node){
return dojo.html._callDeprecated("getMarginHeight","getMargin",arguments,null,"height");
};
dojo.html.getBorderWidth=function(node){
return dojo.html._callDeprecated("getBorderWidth","getBorder",arguments,null,"width");
};
dojo.html.getBorderHeight=function(node){
return dojo.html._callDeprecated("getBorderHeight","getBorder",arguments,null,"height");
};
dojo.html.getPaddingWidth=function(node){
return dojo.html._callDeprecated("getPaddingWidth","getPadding",arguments,null,"width");
};
dojo.html.getPaddingHeight=function(node){
return dojo.html._callDeprecated("getPaddingHeight","getPadding",arguments,null,"height");
};
dojo.html.getPadBorderWidth=function(node){
return dojo.html._callDeprecated("getPadBorderWidth","getPadBorder",arguments,null,"width");
};
dojo.html.getPadBorderHeight=function(node){
return dojo.html._callDeprecated("getPadBorderHeight","getPadBorder",arguments,null,"height");
};
dojo.html.getBorderBoxWidth=dojo.html.getInnerWidth=function(){
return dojo.html._callDeprecated("getBorderBoxWidth","getBorderBox",arguments,null,"width");
};
dojo.html.getBorderBoxHeight=dojo.html.getInnerHeight=function(){
return dojo.html._callDeprecated("getBorderBoxHeight","getBorderBox",arguments,null,"height");
};
dojo.html.getContentBoxWidth=dojo.html.getContentWidth=function(){
return dojo.html._callDeprecated("getContentBoxWidth","getContentBox",arguments,null,"width");
};
dojo.html.getContentBoxHeight=dojo.html.getContentHeight=function(){
return dojo.html._callDeprecated("getContentBoxHeight","getContentBox",arguments,null,"height");
};
dojo.html.setContentBoxWidth=dojo.html.setContentWidth=function(node,_5a8){
return dojo.html._callDeprecated("setContentBoxWidth","setContentBox",arguments,"width");
};
dojo.html.setContentBoxHeight=dojo.html.setContentHeight=function(node,_5aa){
return dojo.html._callDeprecated("setContentBoxHeight","setContentBox",arguments,"height");
};
dojo.provide("dojo.lfx.html");
dojo.lfx.html._byId=function(_5ab){
if(!_5ab){
return [];
}
if(dojo.lang.isArrayLike(_5ab)){
if(!_5ab.alreadyChecked){
var n=[];
dojo.lang.forEach(_5ab,function(node){
n.push(dojo.byId(node));
});
n.alreadyChecked=true;
return n;
}else{
return _5ab;
}
}else{
var n=[];
n.push(dojo.byId(_5ab));
n.alreadyChecked=true;
return n;
}
};
dojo.lfx.html.propertyAnimation=function(_5ae,_5af,_5b0,_5b1,_5b2){
_5ae=dojo.lfx.html._byId(_5ae);
var _5b3={"propertyMap":_5af,"nodes":_5ae,"duration":_5b0,"easing":_5b1||dojo.lfx.easeDefault};
var _5b4=function(args){
if(args.nodes.length==1){
var pm=args.propertyMap;
if(!dojo.lang.isArray(args.propertyMap)){
var parr=[];
for(var _5b8 in pm){
pm[_5b8].property=_5b8;
parr.push(pm[_5b8]);
}
pm=args.propertyMap=parr;
}
dojo.lang.forEach(pm,function(prop){
if(dj_undef("start",prop)){
if(prop.property!="opacity"){
prop.start=parseInt(dojo.html.getComputedStyle(args.nodes[0],prop.property));
}else{
prop.start=dojo.html.getOpacity(args.nodes[0]);
}
}
});
}
};
var _5ba=function(_5bb){
var _5bc=[];
dojo.lang.forEach(_5bb,function(c){
_5bc.push(Math.round(c));
});
return _5bc;
};
var _5be=function(n,_5c0){
n=dojo.byId(n);
if(!n||!n.style){
return;
}
for(var s in _5c0){
try{
if(s=="opacity"){
dojo.html.setOpacity(n,_5c0[s]);
}else{
n.style[s]=_5c0[s];
}
}
catch(e){
dojo.debug(e);
}
}
};
var _5c2=function(_5c3){
this._properties=_5c3;
this.diffs=new Array(_5c3.length);
dojo.lang.forEach(_5c3,function(prop,i){
if(dojo.lang.isFunction(prop.start)){
prop.start=prop.start(prop,i);
}
if(dojo.lang.isFunction(prop.end)){
prop.end=prop.end(prop,i);
}
if(dojo.lang.isArray(prop.start)){
this.diffs[i]=null;
}else{
if(prop.start instanceof dojo.gfx.color.Color){
prop.startRgb=prop.start.toRgb();
prop.endRgb=prop.end.toRgb();
}else{
this.diffs[i]=prop.end-prop.start;
}
}
},this);
this.getValue=function(n){
var ret={};
dojo.lang.forEach(this._properties,function(prop,i){
var _5ca=null;
if(dojo.lang.isArray(prop.start)){
}else{
if(prop.start instanceof dojo.gfx.color.Color){
_5ca=(prop.units||"rgb")+"(";
for(var j=0;j<prop.startRgb.length;j++){
_5ca+=Math.round(((prop.endRgb[j]-prop.startRgb[j])*n)+prop.startRgb[j])+(j<prop.startRgb.length-1?",":"");
}
_5ca+=")";
}else{
_5ca=((this.diffs[i])*n)+prop.start+(prop.property!="opacity"?prop.units||"px":"");
}
}
ret[dojo.html.toCamelCase(prop.property)]=_5ca;
},this);
return ret;
};
};
var anim=new dojo.lfx.Animation({beforeBegin:function(){
_5b4(_5b3);
anim.curve=new _5c2(_5b3.propertyMap);
},onAnimate:function(_5cd){
dojo.lang.forEach(_5b3.nodes,function(node){
_5be(node,_5cd);
});
}},_5b3.duration,null,_5b3.easing);
if(_5b2){
for(var x in _5b2){
if(dojo.lang.isFunction(_5b2[x])){
anim.connect(x,anim,_5b2[x]);
}
}
}
return anim;
};
dojo.lfx.html._makeFadeable=function(_5d0){
var _5d1=function(node){
if(dojo.render.html.ie){
if((node.style.zoom.length==0)&&(dojo.html.getStyle(node,"zoom")=="normal")){
node.style.zoom="1";
}
if((node.style.width.length==0)&&(dojo.html.getStyle(node,"width")=="auto")){
node.style.width="auto";
}
}
};
if(dojo.lang.isArrayLike(_5d0)){
dojo.lang.forEach(_5d0,_5d1);
}else{
_5d1(_5d0);
}
};
dojo.lfx.html.fade=function(_5d3,_5d4,_5d5,_5d6,_5d7){
_5d3=dojo.lfx.html._byId(_5d3);
var _5d8={property:"opacity"};
if(!dj_undef("start",_5d4)){
_5d8.start=_5d4.start;
}else{
_5d8.start=function(){
return dojo.html.getOpacity(_5d3[0]);
};
}
if(!dj_undef("end",_5d4)){
_5d8.end=_5d4.end;
}else{
dojo.raise("dojo.lfx.html.fade needs an end value");
}
var anim=dojo.lfx.propertyAnimation(_5d3,[_5d8],_5d5,_5d6);
anim.connect("beforeBegin",function(){
dojo.lfx.html._makeFadeable(_5d3);
});
if(_5d7){
anim.connect("onEnd",function(){
_5d7(_5d3,anim);
});
}
return anim;
};
dojo.lfx.html.fadeIn=function(_5da,_5db,_5dc,_5dd){
return dojo.lfx.html.fade(_5da,{end:1},_5db,_5dc,_5dd);
};
dojo.lfx.html.fadeOut=function(_5de,_5df,_5e0,_5e1){
return dojo.lfx.html.fade(_5de,{end:0},_5df,_5e0,_5e1);
};
dojo.lfx.html.fadeShow=function(_5e2,_5e3,_5e4,_5e5){
_5e2=dojo.lfx.html._byId(_5e2);
dojo.lang.forEach(_5e2,function(node){
dojo.html.setOpacity(node,0);
});
var anim=dojo.lfx.html.fadeIn(_5e2,_5e3,_5e4,_5e5);
anim.connect("beforeBegin",function(){
if(dojo.lang.isArrayLike(_5e2)){
dojo.lang.forEach(_5e2,dojo.html.show);
}else{
dojo.html.show(_5e2);
}
});
return anim;
};
dojo.lfx.html.fadeHide=function(_5e8,_5e9,_5ea,_5eb){
var anim=dojo.lfx.html.fadeOut(_5e8,_5e9,_5ea,function(){
if(dojo.lang.isArrayLike(_5e8)){
dojo.lang.forEach(_5e8,dojo.html.hide);
}else{
dojo.html.hide(_5e8);
}
if(_5eb){
_5eb(_5e8,anim);
}
});
return anim;
};
dojo.lfx.html.wipeIn=function(_5ed,_5ee,_5ef,_5f0){
_5ed=dojo.lfx.html._byId(_5ed);
var _5f1=[];
dojo.lang.forEach(_5ed,function(node){
var _5f3={};
var _5f4,_5f5,_5f6;
with(node.style){
_5f4=top;
_5f5=left;
_5f6=position;
top="-9999px";
left="-9999px";
position="absolute";
display="";
}
var _5f7=dojo.html.getBorderBox(node).height;
with(node.style){
top=_5f4;
left=_5f5;
position=_5f6;
display="none";
}
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:1,end:function(){
return _5f7;
}}},_5ee,_5ef);
anim.connect("beforeBegin",function(){
_5f3.overflow=node.style.overflow;
_5f3.height=node.style.height;
with(node.style){
overflow="hidden";
height="1px";
}
dojo.html.show(node);
});
anim.connect("onEnd",function(){
with(node.style){
overflow=_5f3.overflow;
height=_5f3.height;
}
if(_5f0){
_5f0(node,anim);
}
});
_5f1.push(anim);
});
return dojo.lfx.combine(_5f1);
};
dojo.lfx.html.wipeOut=function(_5f9,_5fa,_5fb,_5fc){
_5f9=dojo.lfx.html._byId(_5f9);
var _5fd=[];
dojo.lang.forEach(_5f9,function(node){
var _5ff={};
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:function(){
return dojo.html.getContentBox(node).height;
},end:1}},_5fa,_5fb,{"beforeBegin":function(){
_5ff.overflow=node.style.overflow;
_5ff.height=node.style.height;
with(node.style){
overflow="hidden";
}
dojo.html.show(node);
},"onEnd":function(){
dojo.html.hide(node);
with(node.style){
overflow=_5ff.overflow;
height=_5ff.height;
}
if(_5fc){
_5fc(node,anim);
}
}});
_5fd.push(anim);
});
return dojo.lfx.combine(_5fd);
};
dojo.lfx.html.slideTo=function(_601,_602,_603,_604,_605){
_601=dojo.lfx.html._byId(_601);
var _606=[];
var _607=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_602)){
dojo.deprecated("dojo.lfx.html.slideTo(node, array)","use dojo.lfx.html.slideTo(node, {top: value, left: value});","0.5");
_602={top:_602[0],left:_602[1]};
}
dojo.lang.forEach(_601,function(node){
var top=null;
var left=null;
var init=(function(){
var _60c=node;
return function(){
var pos=_607(_60c,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_607(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_607(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_60c,true);
dojo.html.setStyleAttributes(_60c,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:(_602.top||0)},"left":{start:left,end:(_602.left||0)}},_603,_604,{"beforeBegin":init});
if(_605){
anim.connect("onEnd",function(){
_605(_601,anim);
});
}
_606.push(anim);
});
return dojo.lfx.combine(_606);
};
dojo.lfx.html.slideBy=function(_610,_611,_612,_613,_614){
_610=dojo.lfx.html._byId(_610);
var _615=[];
var _616=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_611)){
dojo.deprecated("dojo.lfx.html.slideBy(node, array)","use dojo.lfx.html.slideBy(node, {top: value, left: value});","0.5");
_611={top:_611[0],left:_611[1]};
}
dojo.lang.forEach(_610,function(node){
var top=null;
var left=null;
var init=(function(){
var _61b=node;
return function(){
var pos=_616(_61b,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_616(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_616(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_61b,true);
dojo.html.setStyleAttributes(_61b,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:top+(_611.top||0)},"left":{start:left,end:left+(_611.left||0)}},_612,_613).connect("beforeBegin",init);
if(_614){
anim.connect("onEnd",function(){
_614(_610,anim);
});
}
_615.push(anim);
});
return dojo.lfx.combine(_615);
};
dojo.lfx.html.explode=function(_61f,_620,_621,_622,_623){
var h=dojo.html;
_61f=dojo.byId(_61f);
_620=dojo.byId(_620);
var _625=h.toCoordinateObject(_61f,true);
var _626=document.createElement("div");
h.copyStyle(_626,_620);
if(_620.explodeClassName){
_626.className=_620.explodeClassName;
}
with(_626.style){
position="absolute";
display="none";
var _627=h.getStyle(_61f,"background-color");
backgroundColor=_627?_627.toLowerCase():"transparent";
backgroundColor=(backgroundColor=="transparent")?"rgb(221, 221, 221)":backgroundColor;
}
dojo.body().appendChild(_626);
with(_620.style){
visibility="hidden";
display="block";
}
var _628=h.toCoordinateObject(_620,true);
with(_620.style){
display="none";
visibility="visible";
}
var _629={opacity:{start:0.5,end:1}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_629[type]={start:_625[type],end:_628[type]};
});
var anim=new dojo.lfx.propertyAnimation(_626,_629,_621,_622,{"beforeBegin":function(){
h.setDisplay(_626,"block");
},"onEnd":function(){
h.setDisplay(_620,"block");
_626.parentNode.removeChild(_626);
}});
if(_623){
anim.connect("onEnd",function(){
_623(_620,anim);
});
}
return anim;
};
dojo.lfx.html.implode=function(_62c,end,_62e,_62f,_630){
var h=dojo.html;
_62c=dojo.byId(_62c);
end=dojo.byId(end);
var _632=dojo.html.toCoordinateObject(_62c,true);
var _633=dojo.html.toCoordinateObject(end,true);
var _634=document.createElement("div");
dojo.html.copyStyle(_634,_62c);
if(_62c.explodeClassName){
_634.className=_62c.explodeClassName;
}
dojo.html.setOpacity(_634,0.3);
with(_634.style){
position="absolute";
display="none";
backgroundColor=h.getStyle(_62c,"background-color").toLowerCase();
}
dojo.body().appendChild(_634);
var _635={opacity:{start:1,end:0.5}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_635[type]={start:_632[type],end:_633[type]};
});
var anim=new dojo.lfx.propertyAnimation(_634,_635,_62e,_62f,{"beforeBegin":function(){
dojo.html.hide(_62c);
dojo.html.show(_634);
},"onEnd":function(){
_634.parentNode.removeChild(_634);
}});
if(_630){
anim.connect("onEnd",function(){
_630(_62c,anim);
});
}
return anim;
};
dojo.lfx.html.highlight=function(_638,_639,_63a,_63b,_63c){
_638=dojo.lfx.html._byId(_638);
var _63d=[];
dojo.lang.forEach(_638,function(node){
var _63f=dojo.html.getBackgroundColor(node);
var bg=dojo.html.getStyle(node,"background-color").toLowerCase();
var _641=dojo.html.getStyle(node,"background-image");
var _642=(bg=="transparent"||bg=="rgba(0, 0, 0, 0)");
while(_63f.length>3){
_63f.pop();
}
var rgb=new dojo.gfx.color.Color(_639);
var _644=new dojo.gfx.color.Color(_63f);
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:rgb,end:_644}},_63a,_63b,{"beforeBegin":function(){
if(_641){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+rgb.toRgb().join(",")+")";
},"onEnd":function(){
if(_641){
node.style.backgroundImage=_641;
}
if(_642){
node.style.backgroundColor="transparent";
}
if(_63c){
_63c(node,anim);
}
}});
_63d.push(anim);
});
return dojo.lfx.combine(_63d);
};
dojo.lfx.html.unhighlight=function(_646,_647,_648,_649,_64a){
_646=dojo.lfx.html._byId(_646);
var _64b=[];
dojo.lang.forEach(_646,function(node){
var _64d=new dojo.gfx.color.Color(dojo.html.getBackgroundColor(node));
var rgb=new dojo.gfx.color.Color(_647);
var _64f=dojo.html.getStyle(node,"background-image");
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:_64d,end:rgb}},_648,_649,{"beforeBegin":function(){
if(_64f){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+_64d.toRgb().join(",")+")";
},"onEnd":function(){
if(_64a){
_64a(node,anim);
}
}});
_64b.push(anim);
});
return dojo.lfx.combine(_64b);
};
dojo.lang.mixin(dojo.lfx,dojo.lfx.html);
dojo.kwCompoundRequire({browser:["dojo.lfx.html"],dashboard:["dojo.lfx.html"]});
dojo.provide("dojo.lfx.*");

