/*
 * parser.js
 *
 * Sevilla game viewer. (C) 2007-2022 JBF Software.
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

function Parser(str, pieces)
{
	this.str = str;
	this.len = this.str.length;
	this.pieces = pieces;
	this.whitepattern = /[\t\r\n. ]/;
	this.alphapattern = new RegExp("[A-Za-z0-9"+pieces+"]");
}

Parser.prototype.symbolize = function()
{
	this.init();
	while (this.ps < this.len)
	{
		this.skipWhites();
		if (this.ps < this.len)
		{
			this.symbols[this.symcount] = this.getSymbol();
			this.symcount++;
		}
	}
	return this.symbols;
}

Parser.prototype.init = function()
{
	this.ps = -1;
	this.symcount = 0;
	this.symbols = new Array();
	this.scansym = ' ';
	this.nextChar();
}

Parser.prototype.nextChar = function()
{
	this.ps++;
	this.scansym = (this.ps<this.len) ? this.str.charAt(this.ps) : ' ';
}

Parser.prototype.skipWhites = function()
{
	while (this.whitepattern.test(this.scansym) && this.ps < this.len)
	{
		this.nextChar();
	}
}

Parser.prototype.getSymbol = function()
{
	if (this.alphapattern.test(this.scansym))
	{
		sym = this.getAlphaSymbol();
	}
	else
	{
		switch(this.scansym)
		{
			case '{':
				sym = this.getCommentSymbol('{', '}', ';', '', true);
				break;
			case '[':
				sym = this.getCommentSymbol('[', ']', '[', ']', true);
				break;
			case ';':
				sym = this.getCommentSymbol(';', '\n', ';', '', false);
				break;
			case '/':
				sym = this.getAlphaSymbol();
				break;
			case '?':
			case '!':
			case '+':
			case '=':
			case '-':
			case '/':
				sym = this.getValuationSymbol();
				break;
			case '$':
				sym = this.getNag();
				break;
			default:
				sym = this.getOtherSymbol();
		}
	}
	return sym;
}

Parser.prototype.getAlphaSymbol = function()
{
	var sym = "";
//	var movepattern = new RegExp("[A-Za-z0-9_\#\+\-\:\=\/"+this.pieces+"]");
	var movepattern = new RegExp("[A-Za-z0-9_\\\#\\\+\\\-\\\:\\\=\\\/"+this.pieces+"]");
	while (movepattern.test(this.scansym) && this.ps < this.len)
	{
		sym = sym+this.scansym;
		this.nextChar();
	}
	return (sym);
}

Parser.prototype.getCommentSymbol = function(openSym, closeSym, startString, endstring, nest)
{
	var sym = startString;
	var incmd = false;
	var bracketCount = 1;
	this.nextChar();
	while (bracketCount > 0 && this.ps<this.len)
	{
		if (this.scansym == openSym && nest)
				bracketCount++;
		if (this.scansym == closeSym)
				bracketCount--;
		if (this.scansym == '[' || this.scansym == '<')
		{
			this.nextChar();
			if (this.scansym == '%')
			{
				incmd = true;
			}
			else
			{
				sym = sym+'[';
			}
		}
		if (bracketCount > 0 && !incmd)
		{
			sym = sym+this.scansym;
		}
		if (this.scansym == ']' || this.scansym == '>')
		{
			incmd = false;
		}
		this.nextChar();
	}
	sym = sym+endstring;
	return (sym);
}

Parser.prototype.getValuationSymbol = function()
{
	var sym = "";
	var pattern = /[\?\!\+\=\-\/]/;
	while (pattern.test(this.scansym))
	{
		sym = sym+this.scansym;
		this.nextChar();
	}
	return (sym);
}

Parser.prototype.getNag = function()
{
	var sym = this.scansym;
	this.nextChar();
	var pattern = /[0-9]/;
	while (pattern.test(this.scansym))
	{
		sym = sym+this.scansym;
		this.nextChar();
	}
	return (sym);
}

Parser.prototype.getOtherSymbol = function()
{
	var sym = this.scansym;
	this.nextChar();
	return (sym);
}


