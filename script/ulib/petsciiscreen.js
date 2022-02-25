class PetsciiCallBack {
	constructor( object, method  ) {
		this.object = object;
		this.method = method;
	}
}


class PetsciiScreen {

	 constructor( parentEl, onload, onloaddata, _w, _h, _rWF, _rHF, flags, palette  ) {
     console.log("PetsciiScreen::new("+_w+","+_h+")");

    var __this = this;

		//MODE
		this.multiBGColor = false;
		this.doubleBuffer = false;

		this.canvas =  document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		this.rcanvas =  document.createElement('canvas');
		this.rcontext = this.rcanvas.getContext('2d');

		this.cW = _w;
		this.cH = _h;

		this.canvas.width= this.cW * 8;
		this.canvas.height= this.cH * 8;

		this.rWF = _rWF;
		this.rHF = _rHF;

		this.rcanvas.width=(this.canvas.width * _rWF);
		this.rcanvas.height=(this.canvas.height * _rHF);

		this.screenCW = this.rcanvas.width / this.cW;
		this.screenCH = this.rcanvas.height / this.cH;


		this.colors = [];

		/*
		* #000000 black
		* #FFFFFF white
		* #68372B red
		* #70A4B2 light blue
		* #6F3D86 purple
		* #588D43 green
		* #352879 dark blue
		* #B8C76F yellow
		* #6F4F25 brown
		* #433900 dark brown
		* #9A6759 light red
		* #444444 dark grey
		* #6C6C6C mid grey
		* #9AD284 light green
		* #6C5EB5 mid blue
		* #959595 light grey

		http://unusedino.de/ec64/technical/misc/vic656x/colors/
		this.colors[ 0 ] = { r: 0x00, g:  0x00, b:  0x00 };
		this.colors[ 1 ] = { r: 0xFF, g:  0xFF, b:  0xFF };
		this.colors[ 2 ] = { r: 0x68, g:  0x37, b:  0x2B };
		this.colors[ 3 ] = { r: 0x70, g:  0xA4, b:  0xB2 };
		this.colors[ 4 ] = { r: 0x6F, g:  0x3D, b:  0x86 };
		this.colors[ 5 ] = { r: 0x58, g:  0x8D, b:  0x43 };
		this.colors[ 6 ] = { r: 0x35, g:  0x28, b:  0x79 };
		this.colors[ 7 ] = { r: 0xB8, g:  0xC7, b:  0x6F };
		this.colors[ 8 ] = { r: 0x43, g:  0x39, b:  0x00 };
		this.colors[ 9 ] = { r: 0x9A, g:  0x67, b:  0x59 };
		this.colors[ 10 ] = { r: 0x6F, g:  0x4F, b:  0x25 };
		this.colors[ 11 ] = { r: 0x44, g:  0x44, b:  0x44 };
		this.colors[ 12 ] = { r: 0x6C, g:  0x6C, b:  0x6C };
		this.colors[ 13 ] = { r: 0x9A, g:  0xD2, b:  0x84 };
		this.colors[ 14 ] = { r: 0x6C, g:  0x5E, b:  0xB5 };
		this.colors[ 15 ] = { r: 0x95, g:  0x95, b:  0x95 };

		//old
		this.colors[ 0 ] = { r:1, g:1, b:1 };
		this.colors[ 1 ] = { r:255, g:255, b:255 };
		this.colors[ 2 ] = { r:136, g:0, b:0 };
		this.colors[ 3 ] = { r:170, g:255, b:238 };
		this.colors[ 4 ] = { r:204, g:68, b:204 };
		this.colors[ 5 ] = { r:0, g:204, b:85 };
		this.colors[ 6 ] = { r:0, g:0, b:170 };
		this.colors[ 7 ] = { r:238, g:238, b:119 };
		this.colors[ 8 ] = { r:221, g:136, b:85 };
		this.colors[ 9 ] = { r:102, g:68, b:0 };
		this.colors[ 10 ] = { r:255, g:119, b:119 };
		this.colors[ 11 ] = { r:51, g:51, b:51 };
		this.colors[ 12 ] = { r:119, g:119, b:119 };
		this.colors[ 13 ] = { r:170, g:255, b:102 };
		this.colors[ 14 ] = { r:0, g:136, b:255 };
		this.colors[ 15 ] = { r:187, g:187, b:187 };


		//commander x16
		static const unsigned char palette[] = {
		  0x0,0x00, 0xf,0xff, 0x8,0x00, 0xa,0xfe, 0xc,0x4c,
		  0x0,0xc5, 0x0,0x0a, 0xe,0xe7, 0xd,0x85, 0x6,0x40,
		  0xf,0x77, 0x3,0x33, 0x7,0x77, 0xa,0xf6, 0x0,0x8f,
		  0xb,0xbb
		};

		this.colors[ 0 ] = { r: 0x00, g:0x00,b:0x00 };
		this.colors[ 1 ] = { r: 0xf0, g:0xf0,b:0xf0 };
		this.colors[ 2 ] = { r: 0x80, g:0x00,b:0x00 };
		this.colors[ 3 ] = { r: 0xa0, g:0xf0,b:0xe0 };
		this.colors[ 4 ] = { r: 0xc0, g:0x40,b:0xc0 };
		this.colors[ 5 ] = { r: 0x00, g:0xc0,b:0x50 };
		this.colors[ 6 ] = { r: 0x00, g:0x00,b:0xa0 };
		this.colors[ 7 ] = { r: 0xe0, g:0xe0,b:0x70 };
		this.colors[ 8 ] = { r: 0xd0, g:0x80,b:0x50 };
		this.colors[ 9 ] = { r: 0x60, g:0x40,b:0x00 };
		this.colors[ 10 ] = { r: 0xf0, g:0x70,b:0x70 };
		this.colors[ 11 ] = { r: 0x30, g:0x30,b:0x30 };
		this.colors[ 12 ] = { r: 0x70, g:0x70,b:0x70 };
		this.colors[ 13 ] = { r: 0xa0, g:0xf0,b:0x60 };
		this.colors[ 14 ] = { r: 0x00, g:0x80,b:0xf0 };
		this.colors[ 15 ] = { r: 0xb0, g:0xb0,b:0xb0 };

		*/

		if( palette === undefined) {
			this.colors[ 0 ] = { r: 0x01, g:0x01,b:0x01 };
			this.colors[ 1 ] = { r: 0xf0, g:0xf0,b:0xf0 };
			this.colors[ 2 ] = { r: 0x80, g:0x00,b:0x00 };
			this.colors[ 3 ] = { r: 0xa0, g:0xf0,b:0xe0 };
			this.colors[ 4 ] = { r: 0xc0, g:0x40,b:0xc0 };
			this.colors[ 5 ] = { r: 0x00, g:0xc0,b:0x50 };
			this.colors[ 6 ] = { r: 0x00, g:0x00,b:0xa0 };
			this.colors[ 7 ] = { r: 0xe0, g:0xe0,b:0x70 };
			this.colors[ 8 ] = { r: 0xd0, g:0x80,b:0x50 };
			this.colors[ 9 ] = { r: 0x60, g:0x40,b:0x00 };
			this.colors[ 10 ] = { r: 0xf0, g:0x70,b:0x70 };
			this.colors[ 11 ] = { r: 0x30, g:0x30,b:0x30 };
			this.colors[ 12 ] = { r: 0x70, g:0x70,b:0x70 };
			this.colors[ 13 ] = { r: 0xa0, g:0xf0,b:0x60 };
			this.colors[ 14 ] = { r: 0x00, g:0x80,b:0xf0 };
			this.colors[ 15 ] = { r: 0xb0, g:0xb0,b:0xb0 };
		}
		else {
			this.colors = palette;
		}

		this.bgcolorix = 6;
		this.bgcolor = this.colors[ this.bgcolorix ];

		var map = [];

		map['@'] = 0;
		map['a'] = 1;
		map['b'] = 2;
		map['c'] = 3;
		map['d'] = 4;
		map['e'] = 5;
		map['f'] = 6;
		map['g'] = 7;
		map['h'] = 8;
		map['i'] = 9;
		map['j'] = 10;
		map['k'] = 11;
		map['l'] = 12;
		map['m'] = 13;
		map['n'] = 14;
		map['o'] = 15;
		map['p'] = 16;
		map['q'] = 17;
		map['r'] = 18;
		map['s'] = 19;
		map['t'] = 20;
		map['u'] = 21;
		map['v'] = 22;
		map['w'] = 23;
		map['x'] = 24;
		map['y'] = 25;
		map['z'] = 26;

		map['['] = 27;
		map[']'] = 29;
		map['!'] = 33;
		map['"'] = 34;
		map['#'] = 35;
		map['$'] = 36;
		map['%'] = 37;
		map['&'] = 38;
		map['\''] = 39;
		map['('] = 40;
		map[')'] = 41;

		map['*'] = 42;
		map['+'] = 43;
		map[','] = 44;
		map['-'] = 45;
		map['.'] = 46;
		map['/'] = 47;

		map['0'] = 48;
		map['1'] = 49;
		map['2'] = 50;
		map['3'] = 51;
		map['4'] = 52;
		map['5'] = 53;
		map['6'] = 54;
		map['7'] = 55;
		map['8'] = 56;
		map['9'] = 57;

		map[':'] = 58;
		map[';'] = 59;
		map['<'] = 60;
		map['='] = 61;
		map['>'] = 62;
		map['?'] = 63;

		map[' '] = 32;

		this.map = map;
		//https://www.c64-wiki.com/wiki/Color

		parentEl.appendChild( this.rcanvas );

		var sharedScreen = undefined;
		var fontPath = undefined;
		if( flags != undefined ) {
			sharedScreen = flags.sharedScreen;
			fontPath = flags.urlPath;
			this.multiBGColor = flags.multiBGColor;
			this.doubleBuffer = flags.doubleBuffer;
		}


		this.traceImage = {}
		this.traceImage.enable = false;
		this.traceImage.image = null;
		this.traceImage.x = 0;
		this.traceImage.y = 0;
		this.traceImage.resizeFactor = 1.0;
		this.traceImage.alpha = .5;


  	if( sharedScreen != undefined ) {
			 this.font = sharedScreen.font;
			 this.fonts = [];

			 this.fonts = sharedScreen.fonts;

			 var ctx = this.context;
			 var cvs = this.canvas;

			 var rctx = this.context;
			 var rcvs = this.canvas;

			 this.initBuffer();
			 this.writeString( "ready.", true );
			 this.renderBackGround();
			 this.renderBuffer();

			 this.updateDisplay();

			 this.ready = true;
		 }
		 else {
     		var font = new Image();
     		this.font = font;
     		this.onload = onload;
     		this.onloaddata = onloaddata;

      	font.onload = function ( evt ) {
					__this._postLoadFontImage();

      	}

				if( fontPath != undefined ) {
					font.src = fontPath + "/petscii.png";
				}
				else {
					font.src = "res/petscii.png";
				}
			}





   }

	 	getColors() {
			return this.colors;
		}

	 changeMode( w, h, bgcols, layer2, _rWF, _rHF )
	 {
		this.multiBGColor = bgcols;
		this.doubleBuffer = layer2;


		this.cW = w;
 		this.cH = h;

 		this.canvas.width= this.cW * 8;
 		this.canvas.height= this.cH * 8;

 		this.rWF = _rWF;
 		this.rHF = _rHF;

 		this.rcanvas.width=(this.canvas.width * this.rWF);
 		this.rcanvas.height=(this.canvas.height * this.rHF);

 		this.screenCW = this.rcanvas.width / this.cW;
 		this.screenCH = this.rcanvas.height / this.cH;

		this.initBuffer();
		this.renderBackGround();
		this.renderBuffer();
		this.updateDisplay();

	 }

	 getCanvas() {
		 return this.rcanvas;
	 }

	 makeBuffers() {
		var buffer = [];
		if( this.doubleBuffer ) {
			var dbuffer = [];
		}
		else {
			var dbuffer = undefined;
		}

	 	for( var y=0; y<this.cH; y++) {
			var row = [], drow;
			if( this.doubleBuffer ) {
				drow=[];
			}
	 		for( var x=0; x<this.cW; x++) {
				row[ x ] = [32,14,true];
				if( this.multiBGColor ) {
					row[ x ][ 3 ] = this.bgcolorix;
				}
				if( this.doubleBuffer ) {
					drow[ x ] = [32,12,true];
				}
	 		}
	 		buffer[ y ] = row;
			if( this.doubleBuffer ) {
				dbuffer[ y ] = drow;
			}
	 	}
		return [buffer, dbuffer];
	 }

	 initBuffer() {
		 var bufs = this.makeBuffers();

		 this.buffer=bufs[0];
		 this.dbuffer=bufs[1];

		 this.cursorx = 0;
 		 this.cursory = 0;

	 }

	 getBuffers() {
		 return [this.buffer, this.dbuffer];
	 }

	 setBuffers( bufs ) {
		 this.buffer = bufs[0];
		 this.dbuffer = bufs[1];
	 }

	 cloneBuffers() {
	 	var cbuffer = [];
		var cdbuffer = [];

	 	for( var y=0; y<this.cH; y++) {
	 	 var row = this.buffer[ y ];
	 	 var crow = [];

	 	 for( var x=0; x<this.cW; x++) {
			 crow[ x ]=[];
	 		 crow[ x ][ 0 ] = row[ x ][ 0 ];
			 crow[ x ][ 1 ] = row[ x ][ 1 ];
			 crow[ x ][ 2 ] = true;
			 if( this.multiBGColor ) {
			 	crow[ x ][ 3 ] = row[ x ][ 3 ];
			}
	 	 }
	 	 cbuffer[ y ] = crow;
	 	}

		if( this.doubleBuffer ) {
			for( var y=0; y<this.cH; y++) {
		 	 var row = this.dbuffer[ y ];
		 	 var crow = [];

		 	 for( var x=0; x<this.cW; x++) {
				 crow[ x ]=[];
				 crow[ x ][ 0 ] = row[x][ 0 ];
				 crow[ x ][ 1 ] = row[x][ 1 ];
				 crow[ x ][ 2 ] = true;
				 crow[ x ][ 3 ] = row[x][ 3 ];
		 	 }
		 	 cdbuffer[ y ] = crow;
		 	}
		}
	 	return [cbuffer,cdbuffer];
	 }

	 setLayer( l ) {
		 this.getLayerChar = this.getCharCode;
		 this.getLayerCol = this.getCharColor;
		 this.setLayerChar = this.setCharCode;
		 this.setLayerCol = this.setCharColor;

		 if( l==1 ) {
			 this.getLayerChar = this.getDBCharCode;
			 this.getLayerCol = this.getDBCharColor;
			 this.setLayerChar = this.setDBCharCode;
			 this.setLayerCol = this.setDBCharColor;
		 }
	 }

	 renderBackGround() {
		 var ctx = this.context;
		 var cvs = this.canvas;

		 ctx.fillStyle = this._htmlColor( this.bgcolor );
		 ctx.fillRect(
			 0,0,
			 cvs.width,
			 cvs.height
		 );

	 }

	 renderBuffer() {
		 var buf = this.buffer;
		 var dbuf = this.dbuffer;
		 var ctx = this.context;

		 if( this.multiBGColor ) {

			 if( !this.doubleBuffer ) {
				 var cols=[];
				 for(var i=0; i<16; i++) {
					 cols[i] = this._htmlColor(  this.colors[ i ] );
				 }

					for( var y=0; y<this.cH; y++) {
						for( var x=0; x<this.cW; x++) {
						if( buf[y][x][2]  ) {
								buf[y][x][2] = false;
								ctx.fillStyle = cols[ buf[y][x][3] ];
								ctx.fillRect(
					 			 x*8, y*8,
					 			 8,8
					 		 );
							 this.renderChar(x*8, y*8, buf[y][x][0], buf[y][x][1] );
						}
					}
				}
			}
			else  { //if double buffer
				var cols=[];
				for(var i=0; i<16; i++) {
					cols[i] = this._htmlColor(  this.colors[ i ] );
				}

				 for( var y=0; y<this.cH; y++) {
					 for( var x=0; x<this.cW; x++) {
					 if( buf[y][x][2] || dbuf[y][x][2]) {
							 buf[y][x][2] = false;
							 dbuf[y][x][2] = false;
							 ctx.fillStyle = cols[ buf[y][x][3] ];
							 ctx.fillRect(
								x*8, y*8,
								8,8
							);
							this.renderChar(x*8, y*8, buf[y][x][0], buf[y][x][1] );
							this.renderChar(x*8, y*8, dbuf[y][x][0], dbuf[y][x][1] );
					 }
				 }
			 }
		 }

	 	}
		 else {
				ctx.fillStyle = this._htmlColor( this.bgcolor );
				for( var y=0; y<this.cH; y++) {
					for( var x=0; x<this.cW; x++) {
					if( buf[y][x][2] ) {
							buf[y][x][2] = false;
							ctx.fillRect(
				 			 x*8, y*8,
				 			 8,8
				 		 );
						 this.renderChar(x*8, y*8, buf[y][x][0], buf[y][x][1] );
					}
				}
			}
	 	}
	 }

	 touch() {
		 var buf = this.buffer;
		 for( var y=0; y<this.cH; y++) {
			 for( var x=0; x<this.cW; x++) {
				 buf[y][x][2] = true;
			 }
		 }
		 if( this.doubleBuffer ) {
			 var buf = this.dbuffer;
			 for( var y=0; y<this.cH; y++) {
				 for( var x=0; x<this.cW; x++) {
					 buf[y][x][2] = true;
				 }
			 }
	 	}
	 }

	 scrollUp() {
		 console.log("Scrolling needs to account for X16 screen size");
		 var buf = this.buffer;

		 this.cursory=24;

		 for( var y=0; y<24; y++) {
			 buf[y] = buf[y + 1];
		 }


		var newrow = [];
		for( var x=0; x<this.cW; x++) {
			newrow[ x ] = [32,14,true];
		}
		buf[ 24 ] = newrow;

		for( var y=0; y<this.cH; y++) {
		  for( var x=0; x<this.cW; x++) {
		 	  buf[y][x][2] = true;
		  }
		 }

	 }

	 nextLine(  c ) {
		 this.cursory++;
		 this.cursorx=0;
		 if( this.cursory > 24 ) {
			 this.cursory = 24;
			 this.scrollUp();
		 }
	 }

	 setCharCode( x, y, c ) {

	  var buf = this.buffer;
	  if( y<buf.length ) {
		 if( x<buf[0].length ) {
	 	 	buf[y][x][2] = true;
	 	 	buf[y][x][0] = c;
		 }
	  }
	 }

	 setCharColor( x, y, c ) {
	  var buf = this.buffer;
	 	buf[y][x][2] = true;
	 	buf[y][x][1] = c;
	 }


 	 setDBCharCode( x, y, c ) {

		if( !this.doubleBuffer ) { return; }
 	  var buf = this.dbuffer;
		if( buf == undefined ) { return }
 	  if( y<buf.length ) {
 		 if( x<buf[0].length ) {
 	 	 	buf[y][x][2] = true;
 	 	 	buf[y][x][0] = c;
 		 }
 	  }
 	 }


 	 setDBCharColor( x, y, c ) {

		if( !this.doubleBuffer ) { return; }

 	  var buf = this.dbuffer;
		if( buf == undefined ) { return }

 	 	buf[y][x][2] = true;
 	 	buf[y][x][1] = c;
 	 }

	 getDBCharColor( x, y ) {
 	  var buf = this.dbuffer;
 	 	return buf[y][x][1];
 	 }

	 setCharBGColor( x, y, c ) {
	  var buf = this.buffer;
	 	buf[y][x][2] = true;
	 	buf[y][x][3] = c;
	 }

	 getCharsBuffer() {
	  var buf = this.buffer;
  	return buf[y][x][0];
	 }

	 getCharColor( x, y ) {
	  var buf = this.buffer;
  	return buf[y][x][1];
	 }

	 getCharBGColor( x, y ) {
	  var buf = this.buffer;
  	return buf[y][x][3];
	 }

	 getCharCode( x, y ) {
	  var buf = this.buffer;
  	return buf[y][x][0];
	 }


	 getDBCharColor( x, y ) {
		 if(!this.doubleBuffer) {
 			return null;
 		}

		var buf = this.dbuffer;
		if( buf == undefined ) { return -1 }
		return buf[y][x][1];
	 }

	 getDBCharCode( x, y ) {
		if(!this.doubleBuffer) {
			return null;
		}
		var buf = this.dbuffer;
		if( buf == undefined ) { return -1 }
		return buf[y][x][0];
	 }

	 clear() {
		 var x,y;
     for(y=0; y<this.cH; y++) {
     for(x=0; x<this.cW; x++) {
       this.setCharCode( x,y, 32 );
			 this.setCharColor( x,y, 14 );
			 if( this.multiBGColor ) {
				 this.setCharBGColor( x,y, this.bgcolorix );
				 if( this.doubleBuffer ) {
					 this.setDBCharCode( x,y, 32 );
					 this.setDBCharColor( x,y, 14 );
				 }
			 }
     }
     }
	 }

	 getBackgroundColor( col ) {
		return this.bgcolorix;
	}


	 setBackgroundColor( col ) {
	 	this.bgcolor = this.colors [ col ];
		this.bgcolorix = col;
	}

	 setCursorPos(x,y) {
		 this.cursorx = x;
		 this.cursory = y;
	 }

	 writeChar(  c ) {
    var index = this._mapChar( c );
		var buf = this.buffer;
 		if( index > -1 ) {
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][0] = index;
 		}
		this.cursorx++;
		if(this.cursorx > 39) {
			this.cursorx = 0;
			this.nextLine();
		}
   }

	 writeChar2(  c, inverse ) {
    var index = this._mapChar2( c );
		var buf = this.buffer;
 		if( index > -1 ) {
			if( inverse ) {
				if( index < 128 ) {
					index = index + 128;
				}
				else {
					index = index - 128;
				}
			}
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][0] = index;
 		}
		this.cursorx++;
		if(this.cursorx > 39) {
			this.cursorx = 0;
			this.nextLine();
		}
   }

	 writeChar3(  index ) {
		var buf = this.buffer;
 		if( index > -1 ) {
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][0] = index;
 		}
		this.cursorx++;
		if(this.cursorx > 39) {
			this.cursorx = 0;
			this.nextLine();
		}
   }

	 writeString( str, newLine ) {

		 var dcontrol = String.fromCharCode( 16 );
		 var petscii = false;
		 for (var i = 0; i < str.length; i++) {
			  var c = str.charAt(i);

			 	if( !petscii ) {

					if( c !== dcontrol ) {
						this.writeChar( str.charAt(i) );
					} else {
						petscii = true;
					}
				}
				else {
					var p = str.charCodeAt(i);
					this.writeChar3( p );
					petscii = false;
				}
		 }
		 if(newLine) {
			 this.nextLine();
		 }
	 }


	 writeStringInverse( str, newLine ) {

		 var dcontrol = String.fromCharCode( 16 );
		 var petscii = false;
		 for (var i = 0; i < str.length; i++) {
			 var c = str.charAt(i);

			 if( !petscii ) {

				 if( c !== dcontrol ) {
					 this.writeChar2( str.charAt(i), true );
				 } else {
					 petscii = true;
				 }
			 }
			 else {
				 var p = str.charCodeAt(i);
				 this.writeChar3( p );
				 petscii = false;
			 }
		 }
		 if(newLine) {
			 this.nextLine();
		 }
	 }

	 _mapChar( c0 ) {

     var c = c0.toLowerCase();

     var map = this.map;
     var index;

     index = map [ c ];
     if( index == undefined ) {
 			if( c == ' ' ) {
 				return -1;
 			}
       index = 49;
     }

     return  index;
   }

	 _mapChar2( c0 ) {

     var c = c0.toLowerCase();

     var map = this.map;
     var index;

     index = map [ c ];
     if( index == undefined ) {
       index = 49;
     }

     return  index;
   }

	 renderChar(x, y, c, col) {
		 try {
			 this.fonts[ col ].drawRaw( this.context, x, y, c );
		 }
		 catch( e ) {
			 console.log( "Exception " + e);
			 console.log( "col=" + col);
			 console.log( "x=" + x);
			 console.log( "y=" + y);
			 console.log( "c=" + c);

			 throw e;
		 }
	 }


	 _htmlColor( c ) {
		  return 'rgba('+c.r+','+c.g+','+c.b+',1)';
	 }

   _postLoadFontImage() {

     console.log("here");
     this.fonts = [];

		 for (var i = 0; i < 16; i++) {

     	var tmpFont = this.prepColor( this.font, this.colors[ i ] );
     	this.fonts[ i ] = new C64BlockFont( tmpFont , 8, 8, { r:0, g:0, b:0 } );

		 }

		 var ctx = this.context;
		 var cvs = this.canvas;

		 var rctx = this.context;
		 var rcvs = this.canvas;

		 this.initBuffer();
		 this.writeString( "ready.", true );
		 this.renderBackGround();
		 this.renderBuffer();
		 this.updateDisplay();

     this.ready = true;
     if( this.onload != undefined ) {
       this.onload( this.onloaddata );
     }
   }

	 getFont( i ) {
		 return this.fonts[ i ];
	 }

	 renderDisplay( ) {

//		 console.log("Rendering display");
		 this.renderBuffer();
		 this.updateDisplay();
	 }


   updateDisplay( ) {

		var sCtx = this.context;
		var dCtx = this.rcontext;
		var mCtx;

 		var w = this.canvas.width;
 		var h = this.canvas.height;
		var dw = this.rcanvas.width;
		var dh = this.rcanvas.height;



		if( this.traceImage.enable ) {
			var ti = this.traceImage;

			if( this.traceImage.canvas === undefined ) {

				var canvas =  document.createElement('canvas');
				var context = canvas.getContext('2d');

				canvas.width=this.canvas.width;
				canvas.height=this.canvas.height;

				this.traceImage.canvas = canvas;
				this.traceImage.context = context;

			}

			if( this.traceImage.canvas.width != this.canvas.width ) {
				this.traceImage.canvas.width=this.canvas.width;
			}
			if( this.traceImage.canvas.height != this.canvas.height ) {
				this.traceImage.canvas.height=this.canvas.height;
			}

			mCtx = this.traceImage.context;

			mCtx.fillStyle = "#000000";
   		mCtx.fillRect(
	 			 0,0,
	 			 this.traceImage.canvas.width,
	 			 this.traceImage.canvas.height
 		  );


			mCtx.drawImage(
				ti.image,
				ti.x, ti.y,
				ti.image.width  * ti.resizeFactor,
				ti.image.height * ti.resizeFactor
			);

			dCtx.drawImage( this.canvas, 0, 0, dw, dh);
			dCtx.globalAlpha = ti.alpha;
			dCtx.drawImage( this.traceImage.canvas, 0, 0, dw, dh );
			dCtx.globalAlpha = 1;

		} else {
			dCtx.drawImage( this.canvas, 0, 0, dw, dh);
		}
	 }


   prepColor( img, col ) {

 			var canvas = document.createElement('canvas');
 			var context = canvas.getContext('2d');

      var w = img.width;
      var h = img.height;

      canvas.width  = w;
      canvas.height = h * 2;

      context.drawImage( img, 0, 0 );
			context.drawImage( img, 0, h );
      var imgdata = context.getImageData(0, 0, w, h*2);
      var dd  = imgdata.data;

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var offset = (x  + ( y * w )) * 4;

          if( dd[ offset ] != 0 && dd[ offset + 1 ] != 0 && dd[ offset + 2 ] != 0 ) {
            dd[ offset ] = col.r;
            dd[ offset + 1] = col.g;
            dd[ offset + 2] = col.b;
          }
        }
      }

			for ( ; y < (h*2); y++) {
        for (var x = 0; x < w; x++) {
          var offset = (x  + ( y * w )) * 4;


          if( dd[ offset ] != 0 && dd[ offset + 1 ] != 0 && dd[ offset + 2 ] != 0 ) {

						dd[ offset ] = 0;
            dd[ offset + 1] = 0;
            dd[ offset + 2] = 0;
          }
					else {
						dd[ offset ] = col.r;
            dd[ offset + 1] = col.g;
            dd[ offset + 2] = col.b;
					}
        }
      }

      context.putImageData( imgdata, 0, 0);
      return canvas;
   }

}
