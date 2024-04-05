/*
 * game.js
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

function Field(pbrd, pfile, prank)
{
	this.brd = pbrd;
	this.ffile = pfile;
	this.frank = prank;
	this.fieldColor = this.getFieldColor();
	this.piece = Field.PC_NONE;
	this.pieceColor = Field.CL_NONE;
}

Field.CL_NONE = 0;
Field.CL_WHITE = 1;
Field.CL_BLACK = 2;

Field.PC_NONE = 0;
Field.PC_PAWN = 1;
Field.PC_KNIGHT = 2;
Field.PC_BISHOP = 3;
Field.PC_ROOK = 4;
Field.PC_QUEEN = 5;
Field.PC_KING = 6;

Field.SYM_PAWN = 'P';
Field.SYM_KNIGHT = 'N';
Field.SYM_BISHOP = 'B';
Field.SYM_ROOK = 'R';
Field.SYM_QUEEN = 'Q';
Field.SYM_KING = 'K';
Field.DISP_PAWN = 'P';
Field.DISP_KNIGHT = 'N';
Field.DISP_BISHOP = 'B';
Field.DISP_ROOK = 'R';
Field.DISP_QUEEN = 'Q';
Field.DISP_KING = 'K';
Field.PIECES = 'PNBRQK';

Field.oppcol = function(col)
{
	var ocol = Field.CL_NONE;
	if (col == Field.CL_BLACK) ocol = Field.CL_WHITE;
	if (col == Field.CL_WHITE) ocol = Field.CL_BLACK;
	return ocol;
}

Field.getFieldCode = function(sym, index, cut)
{
	var ret = '?';
	var syms = sym.split(",");
	if (syms.length > index && syms[index].length > 0)
	{
		ret = syms[index];
	}
	else
	{
		if (sym.length > index) ret = sym.charAt(index);
	}
	if (ret == '?')
	{
//		if the input is incorrect we will assume english piece letters
		switch (index)
		{
			case 0:	ret = 'P';
			case 1:	ret = 'N';
			case 2:	ret = 'B';
			case 3:	ret = 'R';
			case 4:	ret = 'Q';
			case 5:	ret = 'K';
		}
	}
	if (ret.length > 0 && cut) ret = ret.charAt(0);
	return ret;
}

Field.setCodes = function(sym, disp)
{
	var syms = sym.split(",");
	Field.SYM_PAWN = this.getFieldCode(sym, 0, true);
	Field.SYM_KNIGHT = this.getFieldCode(sym, 1, true);
	Field.SYM_BISHOP = this.getFieldCode(sym, 2, true);
	Field.SYM_ROOK = this.getFieldCode(sym, 3, true);
	Field.SYM_QUEEN = this.getFieldCode(sym, 4, true);
	Field.SYM_KING = this.getFieldCode(sym, 5, true);
	Field.DISP_PAWN = this.getFieldCode(disp, 0, false);
	Field.DISP_KNIGHT = this.getFieldCode(disp, 1, false);
	Field.DISP_BISHOP = this.getFieldCode(disp, 2, false);
	Field.DISP_ROOK = this.getFieldCode(disp, 3, false);
	Field.DISP_QUEEN = this.getFieldCode(disp, 4, false);
	Field.DISP_KING = this.getFieldCode(disp, 5, false);
	Field.PIECES = Field.SYM_PAWN+Field.SYM_KNIGHT+Field.SYM_BISHOP+
		Field.SYM_ROOK+Field.SYM_QUEEN+Field.SYM_KING;
}

Field.prototype.getFieldColor = function()
{
	return ((this.ffile+this.frank) % 2 == 0)
		? Field.CL_BLACK
		: Field.CL_WHITE;
}

Field.prototype.setPiece = function(col, piece)
{
	this.pieceColor = col;
	this.piece = piece;
}

Field.prototype.fieldName = function()
{
	return (
		this.brd.brdgame.viewer.vname+"_"+
		String.fromCharCode(this.ffile+Board.FIRSTFILE) +
		String.fromCharCode(this.frank+Board.FIRSTRANK));
}

Field.prototype.oppositeFieldName = function()
{
	return (
		this.brd.brdgame.viewer.vname+"_"+
		String.fromCharCode(Board.FIRSTFILE+Board.NRFILES-1-this.ffile) +
		String.fromCharCode(Board.FIRSTRANK+Board.NRRANKS-1-this.frank));
}

Field.prototype.getGif = function()
{
	var gif = this.brd.config.scriptdir+"/";
	switch (this.pieceColor)
	{
//		case Field.CL_NONE:		gif += "x"; break;
		case Field.CL_WHITE: 	gif += "w"; break;
		case Field.CL_BLACK: 	gif += "b"; break;
	}
	switch (this.piece)
	{
//		case Field.PC_NONE:		gif += "x"; break;
		case Field.PC_PAWN:		gif += "p"; break;
		case Field.PC_KNIGHT:	gif += "n"; break;
		case Field.PC_BISHOP:	gif += "b"; break;
		case Field.PC_ROOK:		gif += "r"; break;
		case Field.PC_QUEEN:	gif += "q"; break;
		case Field.PC_KING:		gif += "k"; break;
	}
	switch (this.fieldColor)
	{
		case Field.CL_WHITE: 	gif += "w"; break;
		case Field.CL_BLACK: 	gif += "b"; break;
	}
	gif += ".gif";
	return gif;
}

Field.prototype.setupHtml = function()
{
	document.write(
		"<td class=\"BoardSquare\"><img src=\"\" id=\"" +
			this.fieldName() + "\" class=\"PieceImage\" /></td>\n");
}

Field.prototype.updateHtml = function(flipped)
{
	var field = (flipped)
		? this.oppositeFieldName()
		: this.fieldName();
	document.getElementById(field).setAttribute("src", this.getGif());
}

function Board(config)
{
	this.config = config;
	this.fields = new Array(Board.NRFILES);
	for (var ifile = 0; ifile < Board.NRFILES; ifile++)
	{
		this.fields[ifile] = new Array(Board.NRRANKS);
		for (var irank = 0; irank < Board.NRRANKS; irank++)
		{
			this.fields[ifile][irank] = new Field(this, ifile, irank);
		}
	}
	this.flipped = false;
}

Board.NRFILES = 8;
Board.NRRANKS = 8;
Board.FIRSTFILE = 97;	// 'a'
Board.FIRSTRANK = 49;	// '1'

Board.prototype.clearb = function()
{
	for (var i=0; i< Board.NRRANKS; i++)
	{
		for (var j=0; j< Board.NRFILES; j++)
		{
			this.fields[j][i].setPiece(Field.CL_NONE, Field.PC_NONE);
		}
	}
}

Board.prototype.setStartPos = function()
{
	this.clearb();
	this.fields[0][7].setPiece(Field.CL_BLACK, Field.PC_ROOK);
	this.fields[1][7].setPiece(Field.CL_BLACK, Field.PC_KNIGHT);
	this.fields[2][7].setPiece(Field.CL_BLACK, Field.PC_BISHOP);
	this.fields[3][7].setPiece(Field.CL_BLACK, Field.PC_QUEEN);
	this.fields[4][7].setPiece(Field.CL_BLACK, Field.PC_KING);
	this.fields[5][7].setPiece(Field.CL_BLACK, Field.PC_BISHOP);
	this.fields[6][7].setPiece(Field.CL_BLACK, Field.PC_KNIGHT);
	this.fields[7][7].setPiece(Field.CL_BLACK, Field.PC_ROOK);
	for (var j=0; j< Board.NRFILES; j++)
	{
		this.fields[j][6].setPiece(Field.CL_BLACK, Field.PC_PAWN);
		this.fields[j][1].setPiece(Field.CL_WHITE, Field.PC_PAWN);
	}
	this.fields[0][0].setPiece(Field.CL_WHITE, Field.PC_ROOK);
	this.fields[1][0].setPiece(Field.CL_WHITE, Field.PC_KNIGHT);
	this.fields[2][0].setPiece(Field.CL_WHITE, Field.PC_BISHOP);
	this.fields[3][0].setPiece(Field.CL_WHITE, Field.PC_QUEEN);
	this.fields[4][0].setPiece(Field.CL_WHITE, Field.PC_KING);
	this.fields[5][0].setPiece(Field.CL_WHITE, Field.PC_BISHOP);
	this.fields[6][0].setPiece(Field.CL_WHITE, Field.PC_KNIGHT);
	this.fields[7][0].setPiece(Field.CL_WHITE, Field.PC_ROOK);
}

Board.prototype.setPos = function(fen)
{
	this.clearb();
	var s = new Parser(fen, Field.PIECES).symbolize();
	if (s.length >= 1) this.setFenPieces(s[0]);
	if (s.length >= 2) this.setFenColor(s[1]);
	if (s.length >= 5) this.setFenStartMove(s[5]);
}

Board.prototype.setFenPieces = function(startpos)
{
	var alphapattern = /[A-Za-z]/;
	var l=startpos.length;
	var i=0;
	var pfile=0;
	var prank=Board.NRRANKS-1;
	var pc;
	var col;
	for (var i=0;i<l;i++)
	{
		var c=startpos.charAt(i);
		if (c == '/')
		{
			pfile=0;
			prank--;
		}
		if (c >= '0' && c <= '9') pfile=pfile+(c-'0');
		if (alphapattern.test(c))
		{
			col = Field.CL_NONE;
			pc = Field.PC_NONE;
			if (c == Field.SYM_PAWN)                 {col=Field.CL_WHITE; pc=Field.PC_PAWN;  }
			if (c == Field.SYM_KNIGHT)               {col=Field.CL_WHITE; pc=Field.PC_KNIGHT;}
			if (c == Field.SYM_BISHOP)               {col=Field.CL_WHITE; pc=Field.PC_BISHOP;}
			if (c == Field.SYM_ROOK)                 {col=Field.CL_WHITE; pc=Field.PC_ROOK;  }
			if (c == Field.SYM_QUEEN)                {col=Field.CL_WHITE; pc=Field.PC_QUEEN; }
			if (c == Field.SYM_KING)                 {col=Field.CL_WHITE; pc=Field.PC_KING;  }
			if (c == Field.SYM_PAWN.toLowerCase())   {col=Field.CL_BLACK; pc=Field.PC_PAWN;  }
			if (c == Field.SYM_KNIGHT.toLowerCase()) {col=Field.CL_BLACK; pc=Field.PC_KNIGHT;}
			if (c == Field.SYM_BISHOP.toLowerCase()) {col=Field.CL_BLACK; pc=Field.PC_BISHOP;}
			if (c == Field.SYM_ROOK.toLowerCase())   {col=Field.CL_BLACK; pc=Field.PC_ROOK;  }
			if (c == Field.SYM_QUEEN.toLowerCase())  {col=Field.CL_BLACK; pc=Field.PC_QUEEN; }
			if (c == Field.SYM_KING.toLowerCase())   {col=Field.CL_BLACK; pc=Field.PC_KING;  }
			if (pfile >= 0 & pfile < Board.NRFILES && prank >= 0 && prank < Board.NRRANKS)
			{
				this.fields[pfile][prank].setPiece(col,pc);
				pfile++;
			}
		}
	}
}

Board.prototype.setFenColor = function(color)
{
	if (color.charAt(0) == 'b' || color.charAt(0) == 'B')
	{
		this.brdgame.startmovecolor = Field.CL_BLACK;
		this.brdgame.ofs = 1;
	}
}

Board.prototype.setFenStartMove = function(movenr)
{
	var m = parseInt(movenr);
	if (m != NaN && m > 0) this.brdgame.startmovenr = m;
}

Board.prototype.setupData = function()
{
	document.write("<span class=\"GameData\">");
	document.write("<span>"+this.brdgame.white+"</span> ");
	document.write("<span>"+this.brdgame.result+"</span> ");
	document.write("<span>"+this.brdgame.black+"</span>");
	document.write("</span>\n");
}

Board.prototype.setupHtml = function()
{
	document.write("<table class=\"Board\" cellpadding=\"1\" cellspacing=\"0\" border=\"0\">\n");
	for (var j=Board.NRRANKS-1; j>=0; j--)
	{
		document.write("<tr>");
		for (var i=0; i<Board.NRFILES; i++)
		{
			this.fields[i][j].setupHtml();
		}
		document.write("</tr>\n");
	}
	document.write("</table>\n");
}

Board.prototype.updateHtml = function()
{
	for (var j=Board.NRFILES-1; j>=0; j--)
	{
		for (var i=0; i<Board.NRRANKS; i++)
		{
			this.fields[i][j].updateHtml(this.flipped);
		}
	}
}

Board.prototype.copy = function()
{
	var brdcopy = new Board()
	for (var i=0; i< Board.NRFILES; i++)
	{
		for (var j=0; j< Board.NRRANKS; j++)
		{
			brdcopy.fields[i][j].piece = this.fields[i][j].piece;
			brdcopy.fields[i][j].pieceColor = this.fields[i][j].pieceColor;
		}
	}
	return brdcopy;
}

function Move(pmvcol, pmvnr, pvarilvl, pboard, pgame)
{
	this.moveColor = pmvcol;
	this.moveNumber = pmvnr;
	this.varilvl = pvarilvl;
	this.brd = pboard;
	this.gm = pgame;
	this.piece = Field.PC_PAWN;
	this.fromFile = -1;
	this.fromRank = -1;
	this.toFile = -1;
	this.toRank = -1;
	this.promPiece = Field.PC_NONE;
	this.castle = Move.CST_NONE;
	this.capture = false;
	this.comment = "";
	this.startComment = "";
	this.nag = 0;
	this.check = Move.CH_NONE;
	this.prev = Move.NULL;
	this.next = Move.NULL;
	this.vari = Move.NULL;
}

Move.CST_NONE = 0;
Move.CST_SHORT = 1;
Move.CST_LONG = 2;
Move.NULL = -1;

Move.CH_NONE = 0;
Move.CH_CHECK = 1;
Move.CH_CHECKMATE = 2;

Move.MV_ALL = 1;
Move.MV_PROM = 2;
Move.MV_NORM = 3;

Move.prototype.parseMove = function(mvtxt)
{
	this.moveText = mvtxt;
	if (mvtxt.substring(0,5) == "0-0-0" || mvtxt.substring(0,5) == "O-O-O")
	{
		this.fromFile = 4;
		this.fromRank = (this.moveColor == Field.CL_WHITE) ? 0 : Board.NRRANKS-1;
		this.toFile = 2;
		this.toRank = this.fromRank;
		this.piece = Field.PC_KING;
		this.castle = Move.CST_LONG;
	}
	else if (mvtxt.substring(0,3) == "0-0" || mvtxt.substring(0,3) == "O-O")
	{
		this.fromFile = 4;
		this.fromRank = (this.moveColor == Field.CL_WHITE) ? 0 : Board.NRRANKS-1;
		this.toFile = 6;
		this.toRank = this.fromRank;
		this.piece = Field.PC_KING;
		this.castle = Move.CST_SHORT;
	}
	else for (var i=0; i< mvtxt.length; i++)
	{
		var c = mvtxt.charAt(i);
		var ccode = mvtxt.charCodeAt(i);
		if (c == Field.SYM_KING   && i == 0) this.piece = Field.PC_KING;
//		if (c == Field.SYM_KING   && i > 0)  this.promPiece = Field.PC_KING;
		if (c == Field.SYM_QUEEN  && i == 0) this.piece = Field.PC_QUEEN;
		if (c == Field.SYM_QUEEN  && i > 0)  this.promPiece = Field.PC_QUEEN;
		if (c == Field.SYM_ROOK   && i == 0) this.piece = Field.PC_ROOK;
		if (c == Field.SYM_ROOK   && i > 0)  this.promPiece = Field.PC_ROOK;
		if (c == Field.SYM_BISHOP && i == 0) this.piece = Field.PC_BISHOP;
		if (c == Field.SYM_BISHOP && i > 0)  this.promPiece = Field.PC_BISHOP;
		if (c == Field.SYM_KNIGHT && i == 0) this.piece = Field.PC_KNIGHT;
		if (c == Field.SYM_KNIGHT && i > 0)  this.promPiece = Field.PC_KNIGHT;
		if (c == ":" || c == "x") this.capture = true;
		if (c == "+") this.check = Move.CH_CHECK;
		if (c == "#") this.check = Move.CH_CHECKMATE;
		if (c >= "a" && c <= "h")
		{
			if (this.toFile >= 0) this.fromFile = this.toFile;
			this.toFile = ccode-Board.FIRSTFILE;
		}
		if (c >= "1" && c <= "8")
		{
			if (this.toRank >= 0) this.fromRank = this.toRank;
			this.toRank = ccode-Board.FIRSTRANK;
		}
	}
	if (this.promPiece == Field.PC_NONE)
	{
		this.promPiece = this.piece;
	}
}

Move.prototype.completeMove = function()
{
	var res = false;
	if (this.toFile >= 0 && this.toFile < Board.NRFILES &&
	    this.toRank >= 0 && this.toRank < Board.NRRANKS)
	{
		var firstFile = (this.fromFile < 0) ? 0 : this.fromFile;
		var lastFile = (this.fromFile < 0) ? Board.NRFILES-1 : this.fromFile;
		var firstRank = (this.fromRank < 0) ? 0 : this.fromRank;
		var lastRank = (this.fromRank < 0) ? Board.NRRANKS-1 : this.fromRank;
		var validcount = 0;
		for (var ifile=firstFile; ifile <= lastFile; ifile++)
		{
			for (var irank=firstRank; irank <= lastRank; irank++)
			{
				if (this.validMove(ifile, irank))
				{
					var ofile = this.fromFile;
					var orank = this.fromRank;
					this.fromFile = ifile;
					this.fromRank = irank;
					validcount++;
					if (this.kingInCheck())
					{
						this.fromFile = ofile;
						this.fromRank = orank;
						validcount--;
					}
				}
			}
		}
		res = (validcount == 1);
	}
	return (res);
}

Move.prototype.validMove = function(pfile, prank)
{
	var t = false;
	if (this.piece == this.brd.fields[pfile][prank].piece &&
		this.moveColor == this.brd.fields[pfile][prank].pieceColor &&
		this.moveColor != this.brd.fields[this.toFile][this.toRank].pieceColor)
	{
		switch(this.piece)
		{
			case Field.PC_KING:		t = this.validKingMove(pfile, prank); break;
			case Field.PC_QUEEN:	t = this.validQueenMove(pfile, prank); break;
			case Field.PC_ROOK:		t = this.validRookMove(pfile, prank); break;
			case Field.PC_BISHOP:	t = this.validBishopMove(pfile, prank); break;
			case Field.PC_KNIGHT:	t = this.validKnightMove(pfile, prank); break;
			case Field.PC_PAWN:		t = this.validPawnMove(pfile, prank); break;
			default:				t = true;
		}
	}
	return t;
}

Move.prototype.validKingMove = function(pfile, prank)
{
	var t = (Math.abs(pfile-this.toFile) <= 1 && Math.abs(prank-this.toRank) <= 1);
	t |= (this.castle != Move.CST_NONE);
	return t;
}

Move.prototype.validQueenMove = function(pfile, prank)
{
	var t = this.validRookMove(pfile, prank);
	if (!t) t = this.validBishopMove(pfile, prank);
	return t;
}

Move.prototype.validRookMove = function(pfile, prank)
{
	var t = true;
	if (pfile == this.toFile)
	{
		var rs = Math.min(prank, this.toRank);
		var re = Math.max(prank, this.toRank);
		for (var irank = rs+1; irank<re; irank++)
		{
			if (this.brd.fields[pfile][irank].piece != Field.PC_NONE)
				t = false;
		}
	}
	else
	{
		if (prank == this.toRank)
		{
			var fs = Math.min(pfile, this.toFile);
			var fe = Math.max(pfile, this.toFile);
			for (var ifile = fs+1; ifile<fe; ifile++)
			{
				if (this.brd.fields[ifile][prank].piece != Field.PC_NONE)
					t = false;
			}
		}
		else
		{
			t = false;
		}
	}
	return t;
}

Move.prototype.validBishopMove = function(pfile, prank)
{
	var t = true;
	if (pfile - this.toFile == prank - this.toRank)
	{
		var afs = Math.abs(pfile - this.toFile);
		var e = Math.min(pfile, this.toFile);
		var f = Math.min(prank, this.toRank);
		for (var a=1; a<afs; a++)
		{
			if (this.brd.fields[e+a][f+a].piece != Field.PC_NONE)
				t = false;
		}
	}
	else
	{
		if (pfile - this.toFile == this.toRank - prank)
		{
			var afs = Math.abs(pfile - this.toFile);
			var e = Math.min(pfile, this.toFile);
			var f = Math.max(prank, this.toRank);
			for (var a=1; a<afs; a++)
			{
				if (this.brd.fields[e+a][f-a].piece != Field.PC_NONE)
					t = false;
			}
		}
		else
		{
			t = false;
		}
	}
	return t;
}

Move.prototype.validKnightMove = function(pfile, prank)
{
	return (Math.abs((pfile-this.toFile)*(prank-this.toRank)) == 2);
}

Move.prototype.validPawnMove = function(pfile, prank)
{
	var t = false;
	var dir = (this.moveColor == Field.CL_WHITE) ? 1 : -1;
	var stpos = (this.moveColor == Field.CL_WHITE) ? 1 : 6;
	if (pfile == this.toFile)
	{
		if (  (  (prank==stpos && this.toRank == prank+2*dir)
			  || this.toRank == prank+dir
			  )
		   && this.brd.fields[pfile][prank+dir].pieceColor == Field.CL_NONE
//		   && this.brd.fields[pfile][this.toRank].pieceColor == Field.CL_NONE
		   && !this.capture
		   )
			t = true;
	}
	if (  Math.abs(pfile-this.toFile) == 1
	   && prank+dir == this.toRank
	   && this.capture
	   )
	{
		t = true;
	}
	return t;
}

Move.prototype.kingInCheck = function()
{
	var checkFound = false;
	var brdcopy = this.brd.copy();
	this.execute(brdcopy);
	var ocol = Field.oppcol(this.moveColor);
	for (var ifile=0; ifile< Board.NRFILES; ifile++)
	{
		for (var irank=0; irank < Board.NRRANKS; irank++)
		{
			if (  brdcopy.fields[ifile][irank].piece == Field.PC_KING
			   && brdcopy.fields[ifile][irank].pieceColor == this.moveColor
			   )
			{
				var nextMove = new Move(ocol, 0, this.varilvl, brdcopy, this.gm);
				nextMove.toFile = ifile;
				nextMove.toRank = irank;
				nextMove.capture = true;
				for (var nfile = 0; nfile< Board.NRFILES; nfile++)
				{
					for (var nrank=0; nrank < Board.NRRANKS; nrank++)
					{
						if (brdcopy.fields[nfile][nrank].pieceColor == ocol)
						{
							nextMove.fromFile = nfile;
							nextMove.fromRank = nrank;
							nextMove.piece = brdcopy.fields[nfile][nrank].piece;
							if (nextMove.validMove(nfile, nrank))
							{
								checkFound = true;
							}
						}
					}
				}
			}
		}
	}
	return checkFound;
}

Move.prototype.execute = function(brd)
{
	if (this.piece == Field.PC_KING)
	{
		if (Math.abs(this.fromFile-this.toFile) > 1) // fix Castle
		{
			if (this.toFile == 6)
			{
				brd.fields[7][this.fromRank].setPiece(Field.CL_NONE, Field.PC_NONE);
				brd.fields[5][this.toRank].setPiece(this.moveColor, Field.PC_ROOK);
			}
			if (this.toFile == 2)
			{
				brd.fields[0][this.fromRank].setPiece(Field.CL_NONE, Field.PC_NONE);
				brd.fields[3][this.toRank].setPiece(this.moveColor, Field.PC_ROOK);
			}
		}
	}
	if (this.piece == Field.PC_PAWN)
	{
		if (  this.capture
		   && brd.fields[this.toFile][this.toRank].piece == Field.PC_NONE
		   ) // fix En Passant
		{
			brd.fields[this.toFile][this.fromRank].setPiece(Field.CL_NONE, Field.PC_NONE);
		}
	}
	brd.fields[this.fromFile][this.fromRank].setPiece(Field.CL_NONE, Field.PC_NONE);
	brd.fields[this.toFile][this.toRank].setPiece(this.moveColor, this.promPiece);
}

Move.prototype.moveStr = function()
{
	var str;
	switch (this.castle)
	{
		case Move.CST_SHORT:	str = "O-O"; break;
		case Move.CST_LONG:		str = "O-O-O"; break;
		default:				str = this.moveStrNoCast(); break;
	}
	switch (this.check)
	{
		case Move.CH_CHECK:		str += "+"; break;
		case Move.CH_CHECKMATE:	str += "#"; break;
	}
	return str+this.nagtext();
}

Move.prototype.moveStrNoCast = function()
{
	var s = "";
	if (this.gm.moveformat == "long") s = this.longNotation();
	if (this.gm.moveformat == "short") s = this.shortNotation();
	if (this.gm.moveformat == "longmain")
	{
		if (this.varilvl == 0)
			s = this.longNotation();
		else
			s = this.shortNotation();
	}
	if (s.length <= 0) s = this.longNotation();
	return(s);
}

Move.prototype.symChar = function(p)
{
	var r = '';
	switch(p)
	{
		case Field.PC_KING:		r = Field.SYM_KING; break;
		case Field.PC_QUEEN:	r = Field.SYM_QUEEN; break;
		case Field.PC_ROOK:		r = Field.SYM_ROOK; break;
		case Field.PC_BISHOP:	r = Field.SYM_BISHOP; break;
		case Field.PC_KNIGHT:	r = Field.SYM_KNIGHT; break;
		case Field.PC_PAWN:		r = Field.SYM_PAWN; break;
	}
	return(r);
}

Move.prototype.dispCh = function(p)
{
	var r = '';
	switch(p)
	{
		case Field.PC_KING:		r = Field.DISP_KING; break;
		case Field.PC_QUEEN:	r = Field.DISP_QUEEN; break;
		case Field.PC_ROOK:		r = Field.DISP_ROOK; break;
		case Field.PC_BISHOP:	r = Field.DISP_BISHOP; break;
		case Field.PC_KNIGHT:	r = Field.DISP_KNIGHT; break;
		case Field.PC_PAWN:		r = Field.DISP_PAWN; break;
	}
	if (r == '*' || r == '1')
	{
		if (this.moveColor == Field.CL_BLACK)
		{
			switch(p)
			{
				case Field.PC_KING:		r = '\u265A'; break;
				case Field.PC_QUEEN:	r = '\u265B'; break;
				case Field.PC_ROOK:		r = '\u265C'; break;
				case Field.PC_BISHOP:	r = '\u265D'; break;
				case Field.PC_KNIGHT:	r = '\u265E'; break;
				case Field.PC_PAWN:		r = '\u265F'; break;
			}
		}
		else
		{
			switch(p)
			{
				case Field.PC_KING:		r = '\u2654'; break;
				case Field.PC_QUEEN:	r = '\u2655'; break;
				case Field.PC_ROOK:		r = '\u2656'; break;
				case Field.PC_BISHOP:	r = '\u2657'; break;
				case Field.PC_KNIGHT:	r = '\u2658'; break;
				case Field.PC_PAWN:		r = '\u2659'; break;
			}
		}
	}
	return(r);
}

Move.prototype.displayChar = function(p, mode)
{
	var r = '';
	switch(p)
	{
		case Field.PC_KING:		if (mode != Move.MV_PROM) r = this.dispCh(p); break;
		case Field.PC_PAWN:		if (mode == Move.MV_ALL) r = this.dispCh(p); break;
		default:				r = this.dispCh(p); break;
	}
	return(r);
}

Move.prototype.shortNotation = function()
{
	var str = this.moveText;
	str = str.replace(this.symChar(this.piece), this.displayChar(this.piece,Move.MV_NORM));
	if (this.promPiece != this.piece)
	{
		str = str.replace(this.symChar(this.promPiece), this.displayChar(this.promPiece,Move.MV_PROM));
	}
	return(str);
}

Move.prototype.longNotation = function()
{
	var str;
	str = this.displayChar(this.piece, Move.MV_NORM);
	str += String.fromCharCode(Board.FIRSTFILE+this.fromFile);
	str += String.fromCharCode(Board.FIRSTRANK+this.fromRank);
	str += (this.capture) ? "x" : "-";
	str += String.fromCharCode(Board.FIRSTFILE+this.toFile);
	str += String.fromCharCode(Board.FIRSTRANK+this.toRank);
	if (this.promPiece != this.piece)
	{
		str += this.displayChar(this.promPiece, Move.MV_PROM);
	}
	return str;
}

Move.prototype.addNag = function(nagtext)
{
	if (this.nag == 0)
	{
		if (nagtext == "!") this.nag = 1;
		if (nagtext == "?") this.nag = 2;
		if (nagtext == "!!") this.nag = 3;
		if (nagtext == "??") this.nag = 4;
		if (nagtext == "!?") this.nag = 5;
		if (nagtext == "?!") this.nag = 6;
		if (nagtext == "*") this.nag = 8;
		if (nagtext.charAt(0) == '$') this.nag = parseInt(nagtext.substring(1));
	}
}

Move.prototype.nagtext = function()
{
	var s = "";
	switch (this.nag)
	{
		case 0:		break;
		case 1:		s = "!"; break;
		case 2:		s = "?"; break;
		case 3:		s = "!!"; break;
		case 4:		s = "??"; break;
		case 5:		s = "!?"; break;
		case 6:		s = "?!"; break;
		case 7, 8:	s = "*"; break;
		case 11:	s = "="; break;
		case 14:	s = "+="; break;
		case 15:	s = "=+"; break;
		case 16:	s = "+/-"; break;
		case 17:	s = "-/+"; break;
		case 18:	s = "+-"; break;
		case 19:	s = "-+"; break;
		case 20:	s = "+--"; break;
		case 21:	s = "--+"; break;
		default:	s = "$"+this.nag; break;
	}
	return s;
}

Move.prototype.setupHtml = function(neednr)
{
	var r;
	if (this.gm.format == "table") r = this.setupTableHtml(neednr);
	if (this.gm.format == "text") r = this.setupTextHtml(neednr);
	if (this.gm.format == "cont") r = this.setupTextHtml(neednr);
	return r;
}

Move.prototype.setupTableHtml = function(neednr)
{
	var v = this.gm.viewer;
	var i = this.mvid;
	var el = v.vname+"_mv"+i;
	document.writeln("<td class=\""+this.gm.moveClass+"\" id=\"" + el +	"\">" +
		this.moveStr()+"</td>\n");
	setMovenr(document.getElementById(el), this.gm.viewer, i);
	return false;
}

Move.prototype.setupTextHtml = function(neednr)
{
	var hasComment = false;
	var v = this.gm.viewer;
	var i = this.mvid;
	var el = v.vname+"_mv"+i;
	if (this.startComment.length > 0)
	{
		document.write("<span class=\"MoveComment\">" + this.startComment + "</span>");
		if (this.gm.format == "text")
			document.write("<br/>");
		else
			document.write(" ");
		neednr = true;
	}
	if (neednr)
	{
		document.write("<span class=\""+this.moveTypeClass()+"\">" +
			"<span class=\""+this.gm.moveClass+"\">" +
			this.moveNumber+".");
		if (this.moveColor == Field.CL_BLACK) document.write("..");
		document.write("</span></span> ");
	}
	document.write("<span class=\""+this.moveTypeClass()+"\">" +
		"<span class=\""+this.gm.moveClass+"\" id=\""+ el + "\">" +
		this.moveStr() +
		"</span></span>\n");
	setMovenr(document.getElementById(el), this.gm.viewer, i);
//	document.write(this.mvid+" "+this.prev+" "+this.next+" "+this.vari);
	if (this.comment.length > 0)
	{
		if (this.gm.format == "text")
			document.write("<br/>");
		else
			document.write(" ");
		document.write("<span class=\"MoveComment\">" + this.comment + "</span>\n");
		hasComment = true;
	}
	document.writeln("");
	return (hasComment);
}

Move.prototype.moveTypeClass = function()
{
	return (this.varilvl==0 ? "MoveTextMainLine" : "MoveTextVariation" );
}

function Game(pviewer, pcapts, pmovelist, pbrd)
{
	this.viewer = pviewer;
	this.event = (pcapts.event) ? pcapts.event : "?";
	this.site = (pcapts.site) ? pcapts.site : "?";
	this.date = (pcapts.date) ? pcapts.date : "?";
	this.round = (pcapts.round) ? pcapts.round : "?";
	this.white = pcapts.white;
	this.black = pcapts.black;
	this.result = pcapts.result;
	this.format = pcapts.format;
	this.moveformat = pcapts.moveformat;
	this.brackets = pcapts.brackets;
	this.mvlstpos = pcapts.mvlstpos;
	this.setup = pcapts.setup;
	this.startmovenr = 1;
	this.startmovecolor = Field.CL_WHITE;
	this.ofs = 0;
	this.brd = pbrd;
	this.brd.brdgame = this;
	this.movelist = pmovelist;
	this.reset();
	this.parseMoves(pmovelist);
}

Game.STARTVAR = "(";
Game.ENDVAR = ")";

Game.recognizedAsMove = function(movetext)
{
	var r = false;
	if (movetext.length > 0)
	{
		var pattern = new RegExp ("[A-Za-z"+Field.PIECES+"]");
		r = (  pattern.test(movetext.charAt(0))
			|| movetext.substr(0,3) == "O-O"
			|| movetext.substr(0,3) == "0-0"
			);
	}
	return r;
}

Game.recognizedAsNag = function(nagtext)
{
	var pattern = /[\!\?\+\=\-\/\$\*]/;
	return pattern.test(nagtext.charAt(0));
}

Game.recognizedAsComment = function(comment)
{
	var res =
		comment.length > 0 && comment.charAt(0) == ';'
	return res;
}

Game.prototype.setupHtml = function()
{
	if (this.format == "table") this.setupTableHtml();
	if (this.format == "text") this.setupTextHtml();
	if (this.format == "cont") this.setupTextHtml();
}

Game.prototype.setupTableHtml = function()
{
	this.moveClass = "Move";
	this.selectedMoveClass = "SelectedMove";
	this.moveListClass = "MoveList";
	document.write("<table class=\""+this.moveListClass+"\" cellspacing=\"0\" >");
	var movenr = this.startmovenr;
	if (this.moves.length > 0)
	{
		var i = 0;
		var cnt= (this.startmovecolor==Field.CL_BLACK ? 1 : 0);
		while (i != Move.NULL)
		{
			if (i == 0 || cnt == 0) document.write("<tr>");
			if (i == 0 && cnt == 1) document.write("<td class=\""+this.moveClass+"\">&nbsp;</td>");
			if (cnt == 1) document.write("<td class=\""+this.moveClass+"\">"+ movenr + "</td>");
			this.moves[i].setupHtml(false);
			i = this.moves[i].next;
			if (cnt == 0 && i == Move.NULL)
			{
				document.write("<td class=\""+this.moveClass+"\">"+ movenr + "</td>");
				document.write("<td>&nbsp;</td>");
				cnt = 1;
			}
			if (cnt == 1)
			{
				document.write("</tr>");
				movenr++;
			}
			cnt = (cnt+1)%2;
		}
	}
	document.write("</table>\n");
}

Game.prototype.setupTextHtml = function()
{
	this.moveClass = "MoveText";
	this.selectedMoveClass = "SelectedMoveText";
	switch (this.mvlstpos)
	{
		case "bottom":	this.moveListClass = "MoveListRows"; break;
		default:		this.moveListClass = "MoveListText";
	}
	document.write("<table class=\""+this.moveListClass+"\" cellspacing=\"0\" >");
	document.write("<tr><td>");
	var movenr = this.startmovenr;
	if (this.moves.length > 0) this.setupTextVariation(0, 0);
	document.write("</td></tr>");
	document.write("</table>\n");
}

Game.prototype.setupTextVariation = function(mvid, depth)
{
	var neednr = true;
	while (mvid != Move.NULL)
	{
		var movenr = this.moves[mvid].moveNumber;
		var movecl = this.moves[mvid].moveColor;
		neednr = this.moves[mvid].setupHtml(neednr);
		if (this.moves[mvid].vari != Move.NULL)
		{
			if (this.moves[mvid].varilvl==0 && this.format=="text")
				document.write("<br/>");
			document.write(" ");
			if (this.brackets) document.write("(");
			this.setupTextVariation(this.moves[mvid].vari, depth+1);
			if (this.brackets) document.write(")");
			document.write(" ");
			neednr = true;
		}
		if (movecl == Field.CL_BLACK)
		{
			neednr = true;
		}
		if (neednr && depth == 0 && this.format=="text")
			document.write("<br/>");
		else
			document.write(" ");
		mvid = this.moves[mvid].next;
	}
}

Game.prototype.parseMoves = function(movelist)
{
	this.moves = new Array();
	this.mvid = 0;
	var movenr = this.startmovenr;
	var movecl = this.startmovecolor;
	var s = new Parser(movelist, Field.PIECES).symbolize();
	this.parseVariation(movenr, movecl, 0, s, 0, Move.NULL, this.brd);
}

Game.prototype.parseVariation = function(movenr, movecl, varilvl, s, idx, previd, brd)
{
	var finished = false;
	var firstmv = true;
	var comm = "";
	while (idx >= 0 && idx < s.length && !finished)
	{
		if (Game.recognizedAsMove(s[idx]))
		{
			var myid = this.mvid;
			idx = this.parseMove(movenr, movecl, varilvl, s, idx, previd, firstmv, comm, brd);
			if (idx >= 0)
			{
				this.moves[myid].execute(brd);
				if (movecl == Field.CL_BLACK) movenr++;
				movecl = Field.oppcol(movecl);
			}
			previd = myid;
			firstmv = false;
			comm = "";
		}
		else
		{
			if (s[idx] == Game.ENDVAR)
			{
				idx++;
				finished = true;
			}
			else
			{
				if (Game.recognizedAsComment(s[idx]))
				{
					var t = s[idx].substring(1).trim();
					if (comm.length > 0 && t.length > 0) comm += " ";
					comm += t;
					idx++;
				}
				else
				{
//					document.write("Unrecognized token:"+s[idx]);
					idx++;
				}
			}
		}
	}
	return (idx);
}

Game.prototype.parseMove = function(movenr, movecl, varilvl, s, idx, previd, firstmv, comm, brd)
{
	var cmove = new Move(movecl, movenr, varilvl, brd, this);
	cmove.parseMove(s[idx]);
	if (cmove.completeMove())
	{
		var myid = this.mvid;
		cmove.mvid = myid;
		cmove.startComment = comm;
		this.moves[myid] = cmove;
		if (previd != Move.NULL)
		{
			if (firstmv)
			{
				var pmv = previd;
				while (this.moves[pmv].vari != Move.NULL)
					pmv = this.moves[pmv].vari;
				this.moves[pmv].vari = myid;
				this.moves[myid].prev = this.moves[previd].prev;
			}
			else
			{
				this.moves[myid].prev = previd;
				this.moves[previd].next = myid;
			}
		}
		this.mvid++;
		idx++;
		var mvfin = false;
		var variid = myid;
		while (!mvfin && idx >= 0 && idx < s.length)
		{
			if (Game.recognizedAsNag(s[idx]))
			{
				this.moves[myid].addNag(s[idx]);
				idx++;
			}
			else
			{
				if (s[idx].charAt(0) == ';')
				{
					if (this.moves[myid].comment.length == 0)
						this.moves[myid].comment = s[idx].substring(1);
					else
						moves[myid].comment += (" "+s[idx].substring(1));
					idx++;
				}
				else
				{
					if (s[idx] == Game.STARTVAR)
					{
						var brdcpy = brd.copy();
						idx = this.parseVariation(movenr, movecl, varilvl+1, s, idx+1, myid, brdcpy);
					}
					else
					{
						mvfin = true;
					}
				}
			}
		}
	}
	else
	{
		idx = -1; // flagging an error
	}
	return (idx);
}

Game.prototype.lastMoveNr = function()
{
	var last = Move.NULL;
	if (this.moves.length > 0)
	{
		last = 0;
		while (this.moves[last].next != Move.NULL)
		{
			last = this.moves[last].next;
		}
	}
	return (last);
}

Game.prototype.reset = function()
{
	if (this.setup.length < 1)
		this.brd.setStartPos();
	else
		this.brd.setPos(this.setup);
	this.mvid = Move.NULL;
}

Game.prototype.playMoves = function(mvnr, restart)
{
	var v=this.viewer;
	if (this.mvid != Move.NULL && this.mvid < this.moves.length)
		setClass(this.viewer.vname+"_mv"+this.mvid, this.moveClass);
	if (restart)
	{
		this.reset();
	}
	var mvid = this.mvid;
	if (mvnr != Move.NULL && mvid != mvnr)
	{
		do
		{
			var nxt = (mvid==Move.NULL)?0:this.moves[mvid].next;
			if (nxt != mvnr && nxt != Move.NULL)
			{
				nxt = this.takeBestVari(mvnr, nxt);
			}
			if (nxt != Move.NULL)
			{
				this.moves[nxt].execute(this.brd);
			}
			mvid = nxt;
		}
		while (mvid!=mvnr && mvid != Move.NULL);
	}
	this.mvid = mvid;
	if (mvid == Move.NULL)
	{
		document.getElementById(v.vname+"_MoveListContainer").scrollTop = 0;
	}
	else
	{
		var mvidname=v.vname+"_mv"+mvid;
		setClass(mvidname, this.selectedMoveClass);
		document.getElementById(v.vname+"_MoveListContainer").scrollTop = document.getElementById(mvidname).offsetTop;
	}
	var navBack = (this.mvid == Move.NULL) ? "NavigateDisabled" : "Navigate";
	var navForward = (this.mvid == Move.NULL) ? (this.moves.length > 0 ? "Navigate" : "NavigateDisabled") : (this.moves[this.mvid].next == Move.NULL ? "NavigateDisabled" : "Navigate" );
	var navLast = (this.mvid == this.lastMoveNr()) ? "NavigateDisabled" : "Navigate";
	setClass(this.viewer.vname+"_navFirst", navBack);
	setClass(this.viewer.vname+"_navPrevious", navBack);
	setClass(this.viewer.vname+"_navNext", navForward);
	setClass(this.viewer.vname+"_navLast", navLast);
}

Game.prototype.takeBestVari = function(mvnr, tmv)
{
	var r = tmv;
	var nnxt = this.moves[tmv].next;
	var vari = this.moves[tmv].vari;
	var bvari = vari;
	var ready = false;
	while (vari != Move.NULL && !ready)
	{
		var nvari = this.moves[vari].vari;
		var nvnxt = this.moves[vari].next;
		if (nvari != Move.NULL && nvari <= mvnr)
		{
			if (nvari > this.moves[bvari].next || this.moves[bvari].next > mvnr)
			{
				bvari = nvari;
			}
			vari = nvari;
		}
		else
		{
			ready = true;
		}
	}
	if (bvari != Move.NULL)
	{
		if (nnxt > mvnr) r = bvari;
		else if (bvari > mvnr) r = tmv;
		else r = (bvari>nnxt)?vari:tmv;
	}
	return r;
}

Game.prototype.firstMove = function()
{
	this.playMoves(Move.NULL, true);
}

Game.prototype.lastMove = function()
{
	this.playMoves(this.lastMoveNr(), true);
}

Game.prototype.nextMove = function()
{
	var n = (this.mvid==Move.NULL) ? 0  :this.moves[this.mvid].next;
	this.playMoves(n, false);
}

Game.prototype.previousMove = function()
{
	this.playMoves(this.moves[this.mvid].prev,true);
}

Game.prototype.wrap = function(long_string, max_char)
{
	var sum_length_of_words = function(word_array)
	{
		var out = 0;
		if (word_array.length!=0)
		{
			for (var i=0; i<word_array.length; i++)
			{
				var word = word_array[i];
				out = out + word.length;
			}
		};
		return out;
	}
	var split_out = [[]];
	var split_string = long_string.split(' ');
	for (var i=0; i<split_string.length; i++)
	{
		var word = split_string[i];
	    if ((sum_length_of_words(split_out[split_out.length-1]) + word.length) > max_char)
	    {
			split_out = split_out.concat([[]]);
		}
		split_out[split_out.length-1] = split_out[split_out.length-1].concat(word);
	}
	for (var i=0; i<split_out.length; i++)
	{
		split_out[i] = split_out[i].join(" ");
	}
	return split_out.join('\n');
}

Game.prototype.asPGN = function()
{
	var newline = "\n";
	var text =
		"[Event \""+this.event+"\"]"+newline+
		"[Site \""+this.site+"\"]"+newline+
		"[Date \""+this.date+"\"]"+newline+
		"[Round \""+this.round+"\"]"+newline+
		"[White \""+this.white+"\"]"+newline+
		"[Black \""+this.black+"\"]"+newline+
		"[Result \""+this.result+"\"]"+newline;
	if (this.setup.trim().length > 0)
	{
		text +=
			"[SetUp \"1\"]"+newline+
			"[FEN \""+ this.setup.trim() + "\"]"+newline;
	}
	text +=
		newline+
		this.wrap(this.movelist,77)+newline+
		this.result+newline;
	return text;
}

