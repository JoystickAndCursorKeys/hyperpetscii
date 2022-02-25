class CBMScreen {

	 constructor( parentEl, onload, onloaddata  ) {
     console.log("here");

     var __this = this;
     var font = new Image();
     this.font = font;
     this.onload = onload;
     this.onloaddata = onloaddata;

      font.onload = function ( evt ) {
        __this._postLoadFontImage();
      }

      font.src = "res/petscii.png";
      this.ready = false;

      this.canvas =  document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

			this.rcanvas =  document.createElement('canvas');
      this.rcontext = this.rcanvas.getContext('2d');

      this.canvas.width=320;
      this.canvas.height=200;

			this.rcanvas.width=800;
      this.rcanvas.height=500;

			this.colors = [];

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

			this.map = map;
			//https://www.c64-wiki.com/wiki/Color

      parentEl.appendChild( this.rcanvas );


   }

	 getCanvas() {
		 return this.rcanvas;
	 }

	 initBuffer() {
		this.buffer = [];
		this.cursorx = 0;
		this.cursory = 0;

	 	for( var y=0; y<25; y++) {
			var row = [];
	 		for( var x=0; x<40; x++) {
				row[ x ] = [32,14,true];
	 		}
	 		this.buffer[ y ] = row;
	 	}
	 }

	 renderBackGround() {
		 var ctx = this.context;
		 var cvs = this.canvas;

		 ctx.fillStyle = this._htmlColor( this.colors[ 6 ] );
		 ctx.fillRect(
			 0,0,
			 cvs.width,
			 cvs.height
		 );
	 }

	 renderBuffer() {
		 var buf = this.buffer;
		 var ctx = this.context;

		 ctx.fillStyle = this._htmlColor( this.colors[ 6 ] );

		 for( var y=0; y<25; y++) {
		 	for( var x=0; x<40; x++) {
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

	 scrollUp() {
		 console.log("Scrolling not yet implemented");
		 var buf = this.buffer;

		 this.cursory=24;

		 for( var y=0; y<24; y++) {
			 buf[y] = buf[y + 1];
		 }


		var newrow = [];
		for( var x=0; x<40; x++) {
			newrow[ x ] = [32,14,true];
		}
		buf[ 24 ] = newrow;

		for( var y=0; y<25; y++) {
		  for( var x=0; x<40; x++) {
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
	  var index = c;
	  var buf = this.buffer;
	  if( index > -1 ) {
	 	 buf[y][x][2] = true;
	 	 buf[y][x][0] = index;
	  }
	 }

	 getCharCode( x, y ) {
	  var buf = this.buffer;
  	return buf[y][x][0];
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

	 writeString( str, newLine ) {
		 for (var i = 0; i < str.length; i++) {
				 this.writeChar( str.charAt(i) );
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

	 renderChar(x, y, c, col) {
		 this.fonts[ col ].drawRaw( this.context, x, y, c );
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

	 renderDisplay( ) {

		 //this.renderBackGround();
		 console.log("Rendering");
		 this.renderBuffer();
		 this.updateDisplay();
	 }


   updateDisplay( ) {

		var sCtx = this.context;
		var dCtx = this.rcontext;

 		var w = 320;
 		var h = 200;
		var dw = 800;
		var dh = 500;

		dCtx.drawImage( this.canvas, 0, 0, dw, dh);
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
