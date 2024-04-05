/*
 * main.js
 *
 * Sevilla game viewer. (C) 2007-2021 JBF Software.
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

function GameViewer(pname, config, moves)
{
	this.vname = pname;
	if (!config.notation) config.notation = "Notation";
	this.config = config;
	Field.setCodes(config.inpcodes, config.dispcodes);
	this.b = new Board(config);
	this.g = new Game(this, config, moves, this.b);
	this.notationWindow = null;
	document.write("<div id=\"JBFViewer\" class=\"GameTable IVFlex\">");
	this.drawHeaderRow();
	switch (config.mvlstpos)
	{
	case "bottom":	this.drawRowsContent(); break;
	default:		this.drawClassicContent();
	}
	document.write("</div>\n");
	this.handleFirst();
//	adjustParentSize();
	if (config.haveClose)
	{
		window.onload=adjustParentSize;
	}
}

GameViewer.prototype.drawRowsContent = function()
{
	document.write("<div class=\"Board\" valign=\"top\">");
	this.b.setupHtml();
	document.write("</div>");
	this.writeControlRow();
	document.write("<div id=\""+this.vname+"_MoveListContainer\" class=\"MoveListContainerRows Unit\">");
	this.g.setupHtml();
	document.write("</div>\n");
}

GameViewer.prototype.drawClassicContent = function()
{
	document.write("<div class=\"HFlex\">");
	document.write("<div class=\"VFlex Unit\">");
	document.write("<div class=\"Board\" valign=\"top\">");
	this.b.setupHtml();
	document.write("</div>\n");
	this.writeControlRow();
	document.write("</div>\n");
	document.write("<div id=\""+this.vname+"_MoveListContainer\" class=\"MoveListContainer Unit\">");
	this.g.setupHtml();
	document.write("</div>\n");
	document.write("</div>\n");
}

GameViewer.prototype.drawHeaderRow = function()
{
	document.write("<div class=\"GameData\">");
	this.b.setupData();
	if (this.config.haveClose)
	{
		document.write(
			"<img id=\""+this.vname+"_navClose\" onclick=\"handleClose()\" src=\""+this.config.scriptdir+"/closebi.gif\" alt=\""+ this.config.close+ "\" align=\"right\"/>");
	}
	document.write("</div>\n");
}

GameViewer.prototype.writeControlRow = function()
{
	document.write("<div id=\"NavigatePanel\">");
	this.setupNavigation();
	document.write("</div>\n");
}

GameViewer.prototype.setupNavigation = function()
{
	document.write("<div id=\"NavigateArea\" class=\"HFlex\">");
	document.write("<span>" +
		"<img id=\""+this.vname+"_navFirst\" class=\"Navigate\" src=\""+this.config.scriptdir+"/first.gif\" alt=\""+ this.config.first+ "\" />" +
		"</span>");
	setFirst(document.getElementById(this.vname+"_navFirst"),this);
	document.write("<span>" +
		"<img id=\""+this.vname+"_navPrevious\" class=\"Navigate\" src=\""+this.config.scriptdir+"/previous.gif\" alt=\""+ this.config.previous+ "\" />" +
		"</span>");
	setPrevious(document.getElementById(this.vname+"_navPrevious"),this);
	document.write("<span>" +
		"<img id=\""+this.vname+"_navNext\" class=\"Navigate\" src=\""+this.config.scriptdir+"/next.gif\" alt=\""+ this.config.next+ "\" />" +
		"</span>");
	setNext(document.getElementById(this.vname+"_navNext"),this);
	document.write("<span>" +
		"<img id=\""+this.vname+"_navLast\" class=\"Navigate\" src=\""+this.config.scriptdir+"/last.gif\" alt=\""+ this.config.last+ "\" />" +
		"</span>");
	setLast(document.getElementById(this.vname+"_navLast"),this);
	document.write("<span>" +
		"<img id=\""+this.vname+"_navFlip\" class=\"Navigate\" src=\""+this.config.scriptdir+"/flip.gif\" alt=\""+ this.config.flip+ "\" />" +
		"</span>");
	setFlip(document.getElementById(this.vname+"_navFlip"),this);
	document.write("<span>" +
		"<img id=\""+this.vname+"_navNotation\" class=\"Navigate\" src=\""+this.config.scriptdir+"/not.gif\" alt=\""+ this.config.notation+ "\" />" +
		"</span>");
	setNotation(document.getElementById(this.vname+"_navNotation"),this);
	if (this.config.pgnurl.length > 0)
	{
		document.write("<span><a href=\"" + this.config.pgnurl + "\" target=\"_blank\">" +
			"<img id=\""+this.vname+"_navDownload\" class=\"Navigate\" src=\""+this.config.scriptdir+"/download.gif\" alt=\""+ this.config.pgn+ "\" />" +
			"</a></span>")
	}
	document.write("</div>");
}

GameViewer.prototype.handleFirst = function()
{
	this.g.firstMove();
	this.b.updateHtml();
}

GameViewer.prototype.handleNext = function(e)
{
	this.g.nextMove();
	this.b.updateHtml();
}

GameViewer.prototype.handlePrevious = function()
{
	this.g.previousMove();
	this.b.updateHtml();
}

GameViewer.prototype.handleLast = function()
{
	this.g.lastMove();
	this.b.updateHtml();
}

GameViewer.prototype.handleFlip = function()
{
	this.b.flipped = !this.b.flipped;
	this.b.updateHtml();
}

GameViewer.prototype.handleNotation = function()
{
	var title=this.g.white+" "+this.g.result+" "+this.g.black;
	if (this.notationWindow && !this.notationWindow.closed)
	{
		this.notationWindow.close();
	}
	this.notationWindow=window.open("", "Notation",
		"resizable=yes,scrollbars=yes,toolbar=no,menubar=no,status=no,width=480,height=320");
	this.notationWindow.document.open("text/html","replace");
	this.notationWindow.document.title=title;
	this.notationWindow.document.write(
		"<html><head><title>"+title+"</title></head>"+
		"<body><pre>"+this.g.asPGN()+"</pre></body></html>");
	this.notationWindow.document.close();
	if (window.focus)
	{
		this.notationWindow.focus();
	}
}

GameViewer.prototype.handleMoveClick = function(mvid)
{
	this.g.playMoves(mvid, true);
	this.b.updateHtml();
}

function handleClose()
{
	parent.closeGame("gframe");
}

function setClass(id, value)
{
	document.getElementById(id).setAttribute("class", value);
	document.getElementById(id).setAttribute("className", value);
}

function adjustParentSize()
{
	var body = document.getElementById("JBFViewer");
//	var body = document.body;
//	parent.setSize("gframe", body.scrollWidth, body.scrollHeight);
	parent.setSize("gframe", body.clientWidth, body.clientHeight);
}

function setFirst(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleFirst();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleFirst();} );
		}
	}
}

function setPrevious(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handlePrevious();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handlePrevious();} );
		}
	}
}

function setNext(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleNext();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleNext();} );
		}
	}
}

function setLast(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleLast();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleLast();} );
		}
	}
}

function setFlip(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleFlip();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleFlip();} );
		}
	}
}

function setNotation(element, listener)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleNotation();},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleNotation();} );
		}
	}
}

function setMovenr(element, listener, mvid)
{
	if (element.addEventListener)
	{
		element.addEventListener("click",
			function(event){listener.handleMoveClick(mvid);},
			false);
	}
	else
	{
		if (element.attachEvent)
		{
			element.attachEvent("onclick",
				function(event){listener.handleMoveClick(mvid);} );
		}
	}
}


