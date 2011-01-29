/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

dojo.provide("testlocal.thingyi18n");
dojo.require("dojo.i18n.common");

dojo.requireLocalization("testlocal", "thingyBundle");

testlocal.thingyi18n = {
	messageText: dojo.i18n.getLocalization("testlocal", "thingyBundle").messageText,
	
	message: function(){
		return this.messageText;
	}
}
