/*
 * display.js
 *
 * Sevilla game viewer. (C) 2007-2016 JBF Software.
 * Written by JP Hendriks.
 *
 * The use of this code is permitted only with Sevilla generated web sites.
 * Use, copying, distribution, duplication for any other use is prohibited.
 *
 * Modifying or reverse engineering of this code is allowed only if
 * the application of the pages is still within a Sevilla generated website.
 * A copy of the modified files must be e-mailed to JBF Software before the
 * page is actually published. JBF Software holds the right to re-use the
 * modifications of these pages in their own code.
 *
 * This source code is the intellectual property of JBF Software. It is no
 * Open Source! If you would like to use this source or parts of it in a
 * project in any other environment then a Sevilla generated website, then
 * you need a license. To obtain this licence a license fee must be paid to
 * JBF Software, and a non-disclosure agreement must be signed. Also the
 * resulting project page(s) should clearly state that (parts of) the code
 * is (C) JBF Software - used with permission.
 * Please contact JBF Software for details.
 */

function openGame(zid, url)
{
	setClass(zid, "ShowBoard");
	document.getElementById(zid).setAttribute("src", url);
}

function closeGame(zid)
{
	setClass(zid, "HideBoard");
}

function setClass(zid, zvalue)
{
	document.getElementById(zid).setAttribute("class", zvalue);
	document.getElementById(zid).setAttribute("className", zvalue);
}

function setSize(zid, pwidth, pheight)
{
	var elem = document.getElementById(zid);
	var w = pwidth+25;
	var h = pheight+25;
	elem.style.boxSizing = "content-box";
//	frameborder and scrolling shouldn't be used for html5
//	but there are few working alternatives
	elem.frameborder = "0";
	elem.scrolling = "no";
	elem.style.padding = "0";
	elem.style.borderWidth = "0";
	elem.style.width = w+"px";
	elem.style.height = h+"px";
}

