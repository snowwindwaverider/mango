/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

dojo.provide("tests.i18n.testmod");
dojo.require('dojo.i18n.common');
dojo.requireLocalization("tests.i18n","salutations");

tests.i18n.testmod = {
	salutations: dojo.i18n.getLocalization("tests.i18n", "salutations") 
}

