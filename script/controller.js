
class TextDisplayBox {
  constructor( x, y, w) {
    this.screen = screen;

    this.x = x;
    this.y = y;
    this.w = w;
    this.txt = "???";

  }

  update( txt ) {
    this.txt = txt;
  }

  render( scr ) {
    var c=0,base,wi;
    scr.setCursorPos(this.x,this.y);
    scr.writeString(this.txt, false);
    wi=this.txt.length;
    for( var i=wi; i<this.w; i++ ) {
      scr.writeChar(' ');
    }
  }

  clear( scr ) {
    var c=0,base,wi;
    scr.setCursorPos(this.x,this.y);
    wi=0;
    for( var i=wi; i<this.w; i++ ) {
      scr.writeChar(' ');
    }
  }

  onClick( x, y, mode, gui  ) {
  }

  isOn() {
    return false;
  }
}



class SelectColor {
  constructor( x, y, color, callback, callbackdata ) {
    this.screen = screen;

    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.c = color;

    this.callback = callback;
    this.callbackdata = callbackdata;
  }

  render( scr ) {
    var c=0,base;

    scr.setCharCode( this.x, this.y-1, 100 );
    if( this.c < 10 ) { base=128+48; }
    else { base=128+1-10; }
    scr.setCharCode( this.x, this.y, 32+128 );
    scr.setCharColor( this.x, this.y, this.c );
  }

  clear( scr ) {
    var c=0;

    scr.setCharCode( this.x, this.y-1, 32 );
    scr.setCharCode( this.x, this.y, 32 );
  }

  isOn(x,y) {
    if( x>= this.x && y>=this.y && x<=this.x+this.w-1 && y<=this.y+this.h-1) {
      return true;
    }
    return false;
  }

  onClick( x, y, mode, gui  ) {

    console.log("x="+ x + " y=" + y + "c="+this.c);
    console.log(this.callback);
    this.callback.object[this.callback.method]( this.c );
  }
}

class SelectCharButton {
  constructor( x, y, w, h, callback, callbackdata ) {
    this.screen = screen;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.callback = callback;
    this.callbackdata = callbackdata;

    this.mode="all";
    this.lastRenderedMode="";

    this.inverse = false;

    this.lines=[

        0x40,0x42,0x43,0x43,0x44,0x45,0x46,0x47,0x48,0x4C,0x4D,0x4E,0x4D,0x4F,
        0x50, 0x52, 0x54,0x59,0x5D,
        0x65, 0x67, 0x6A,0x6F,0x74, 0x77, 0x7A,
        0x6B, 0x71, 0x72, 0x73,
        0x70,0x7D,0x6D,0x6E,0x49,0x4A,0x4B,0x55,0x56,0x5B];

    this.gradients=[
        0x5f,0x69,0xDF,0xE9,-1,
        0x65,0x74,0x75,0x61,0xe7,0xea,0xe0,
        0xe5,0xf4,0xf5,0xe1,0x76,0x67,0x6a,
        -1,
        0x63,0x77,0x78,0xe2,0xef,0xe4,0xa0,
        0xe3,0xf7,0xf8,0x62,0x79,0x6f,0x64
    ];



    this.blocks=[

        0xa0,0x66,0xe6,
        0x61,0x62,0x6c,0x7b,0x7c,0x7e,0x7f,
        128+0x61,128+0x62,128+0x6c,128+0x7b,128+0x7c,128+0x7e,128+0x7f
      ];

    this.symbol=[

        0x41,0x51,0x53,0x56,0x57,0x58,0x5a,0x5b,0x5c,0x5f, 0x68,0x69,
        128+0x41,128+0x51,128+0x53,128+0x56,128+0x57,128+0x58,128+0x5a,128+0x5b,128+0x5c,128+0x5f, 128+0x68,128+0x69
      ];

  }

  /*renderDimensions() {
    return {
      x0: this.x,
      y0: this.y,
      x1: this.x+this.w-1,
      y1: this.y+this.h-1
    }
  }*/

  render( scr ) {

      this.clear( scr );
      if( this.mode=="all") {
        if( this.inverse ) {
          this.renderInverse(scr);
        }
        else { this.renderAll( scr ); }
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="lines") {
        if( this.inverse ) {
          this.renderLines2(scr);
        }
        else { this.renderLines( scr ); }
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="gradients") {
        this.renderGradients( scr );
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="blocks") {
        this.renderBlocks( scr );
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="symbol") {
        this.renderSymbol( scr );
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="inverse") {
        this.renderInverse( scr );
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="text") {
        if( this.inverse ) {
          this.renderText2(scr);
        }
        else { this.renderText( scr ); }
        this.lastRenderedMode = this.mode;
      }
      else if( this.mode=="color") {
        this.renderColor( scr );
        this.lastRenderedMode = this.mode;
      }

  }

  setMode( mode ) {
    if( this.mode == mode ) {
        this.inverse = !this.inverse;
    }
    this.mode = mode;

  }

  clear( scr ) {
    var c=0;
    for(var y=0; y<9; y++) {
    for(var x=0; x<16; x++) {
      scr.setCharCode( x+this.x,y+this.y, 32 );
      //this.toolscreen
    }
    }
  }

  renderAll( scr ) {
    var c=64;
    for(var y=0; y<4; y++) {
    for(var x=0; x<16; x++) {
      scr.setCharCode( x+this.x,y+this.y, c++ );
      //this.toolscreen
    }
    }
  }

  renderInverse( scr ) {
    var c=128+64;
    for(var y=0; y<4; y++) {
    for(var x=0; x<16; x++) {
      scr.setCharCode( x+this.x,y+this.y, c++ );
      //this.toolscreen
    }
    }
  }

  renderText( scr ) {
    var c=0;
    for(var y=0; y<4; y++) {
    for(var x=0; x<16; x++) {
      scr.setCharCode( x+this.x,y+this.y, c++ );
      //this.toolscreen
    }
    }
  }

  renderText2( scr ) {
    var c=0;
    c=128;
    for(var y=0; y<4; y++) {
    for(var x=0; x<16; x++) {
      scr.setCharCode( x+this.x,y+this.y, c++ );
      //this.toolscreen
    }
    }
  }

    renderGradients( scr ) {
      var i=0;
      for(var y=0; y<16; y+=2) {
      for(var x=0; x<16; x+=2) {
        if( this.gradients[i] ==-1 ) {
          i++;
          break;
        }
        if( i>=this.gradients.length ) { return;}
        scr.setCharCode( x+this.x,y+this.y, this.gradients[i++] );
        //this.toolscreen
      }
      }
  }



    renderLines( scr ) {
      var i=0;
      for(var y=0; y<16; y+=2) {
      for(var x=0; x<16; x+=2) {
        if( i>=this.lines.length ) { return;}
        scr.setCharCode( x+this.x,y+this.y, this.lines[i++] );
      //this.toolscreen
      }
      }
  }

  renderLines2( scr ) {
    var i=0;
    for(var y=0; y<16; y+=2) {
    for(var x=0; x<16; x+=2) {
      if( i>=this.lines.length ) { return;}
      scr.setCharCode( x+this.x,y+this.y, this.lines[i++]+128 );
      //this.toolscreen
    }
    }
}


  renderBlocks( scr ) {
    var i=0;
    for(var y=0; y<16; y+=2) {
    for(var x=0; x<16; x+=2) {
      if( i>=this.blocks.length ) { return;}
      scr.setCharCode( x+this.x,y+this.y, this.blocks[i++] );
      //this.toolscreen
    }
    }
}


renderSymbol( scr ) {
  var i=0;
  for(var y=0; y<16; y+=2) {
  for(var x=0; x<16; x+=2) {
    if( i>=this.symbol.length ) { return;}
    scr.setCharCode( x+this.x,y+this.y, this.symbol[i++] );
      //this.toolscreen
  }
  }
}

  isOn(x,y) {
    if( x>= this.x && y>=this.y && x<=this.x+this.w && y<=this.y+this.h) {
      return true;
    }
    return false;
  }

  onClick( x, y, mode, gui  ) {
    var c= gui.getScreen().getCharCode( x, y );
    console.log("x="+ x + " y=" + y + "c="+c);
    console.log(this.callback);
    this.callback.object[this.callback.method]( c );
  }
}


class Control {

  constructor( paintScreen, paintArea, scr2, gui, loader,  saver ) {
    this.screen = paintScreen;
    this.paintArea = paintArea;
    this.toolscreen = scr2;
    this.gui = gui;

    this.petsciilib = new Petscii( paintScreen.getFont( 1 ) );

    this.multiColBG = true;
    this.doubleBuffer = true;
    this.layer = 0;
    this.frameCount = 1;
    this.frameIndex = 0;
    this.frameBuffers = [paintScreen.getBuffers()];
    this.drawBGColor = 6;

    this.importContrastValue = 1; //GUI default
    this.importSaturationContrastValue = 3; //GUI default
    this.importSaturationMultiplyValue = 1; //GUI default
    this.importDitherValue = true; //GUI default

    this.mode = this.modeInt('draw');

    this.screen.setBackgroundColor( this.drawBGColor );

    this.importexport=new ImportExport( loader, saver, this );

    this.screenModeId = "40x30,bgcol-true,l2";

    var canvas =  document.createElement('canvas');
    var context = canvas.getContext('2d');
    this.preprocessedImage = canvas;
    this.preprocessedImageCtx = context;


  }

  modeInt(x) {
    var tools = false;
    if( x=='draw' )  { return 0;}
    else if( x=='color' )  { return 1;}
    else if( x=='bgcolor' )  { return 2;}
    else if( x=='erase' )  { return 3;}
    else if( x=='fill' )  { return 4;}
    else if( x=='text' )  { return 5;}

    return 0;
  }

  setMode(x) {
    this.mode = this.modeInt(x);

    var tools=false, movie=false;
    if( x=='draw' )         { tools=true;}
    else if( x=='color' )   {}
    else if( x=='bgcolor' ) {}
    else if( x=='erase' )   {}
    else if( x=='fill' )    { tools=true;}
    else if( x=='movie' )   { movie=true;}
    else if( x=='text' )    {}

    console.log("tools=" + tools );
    this.brushSelect.enable( tools, this.toolscreen );
    this.movieControls.enable( movie, this.toolscreen );
    this.gui.render();
    console.log("mode=" + this.mode);
  }



  screenMode( mode ) {

    console.log("screenmode -> " + mode );
    if( this.screenModeId.localeCompare( mode ) == 0 ) {
      return;
    }
    else {




      this.screenModeId = mode;
      var flags = this.screenModeId.split(",");
      var wh = flags[0].split("x");

      var scale = 2.5;
      if( wh[0] > 40 ) {
        scale=1.5;
      }
      console.log(flags);
      this.screen.changeMode( parseInt( wh[0] ), parseInt ( wh[1] ),
            flags[1].localeCompare("bgcol-true")==0,
            flags[2].localeCompare("l2")==0, scale, scale );


      this.frameCount = 1;
      this.frameIndex = 0;
      this.frameBuffers = [this.screen.getBuffers()];

      this.cxSize=this.paintArea.screenCW();
      this.cySize=this.paintArea.screenCH();

      this.paintArea.updateMode();


      this.multiColBG = this.screen.multiBGColor;
      this.doubleBuffer = this.screen.doubleBuffer;


      console.log( flags );
    }
  }

  updateMovieIndex() {

    if( this.playing ) {
      this.movieInfo.update( "P" + (this.frameIndex+1) + "/" + this.frameCount );
    }
    else {
      this.movieInfo.update( " " + (this.frameIndex+1) + "/" + this.frameCount );
    }

    this.toolsArea.render( this.toolscreen );

  }

  incFrame() {

    this.frameIndex++;
    if (this.frameIndex>=this.frameCount ) {
      this.frameIndex = 0;
    }
    this.screen.setBuffers( this.frameBuffers[ this.frameIndex ] );
    this.screen.touch();
    this.screen.renderDisplay();

    this.updateMovieIndex();

    console.log("i=" + this.frameIndex);
  }

  decFrame() {
    this.frameIndex--;
    if (this.frameIndex<0 ) {
      this.frameIndex = this.frameCount-1;
    }
    this.screen.setBuffers( this.frameBuffers[ this.frameIndex ] );
    this.screen.touch();
    this.screen.renderDisplay();

    this.updateMovieIndex();

    console.log("i=" + this.frameIndex);
  }

  addFrame() {
    var b = this.screen.cloneBuffers();
    this.frameBuffers.push( b );
    this.frameIndex = this.frameBuffers.length - 1;
    this.frameCount = this.frameBuffers.length;

    this.screen.setBuffers( b );
    this.screen.touch();
    this.screen.renderDisplay();

    this.updateMovieIndex();

    console.log("l=" + this.frameBuffers.length);

  }
  delFrame() {}
  playMovie() { this.playing = true;   this.updateMovieIndex();}
  pauseMovie() { this.playing = false; this.updateMovieIndex();}


  clear() {
    this.screen.setBackgroundColor( this.drawBGColor );
    this.paintArea.clear();
    this.paintArea.renderDisplay();
  }

  swapColors() {
    this.paintArea.swapColors( this.drawColor, this.drawBGColor );
    this.paintArea.renderDisplay();
  }

  clearTrace() {
    this.paintArea.clearTrace();
  }

  loadImage() {

    this.importexport.loadTraceImage();

  }


  setImportContrast() {
    this.impContrastArea.enable( true );
    this.impSaturationArea.enable( false, this.toolscreen );
    this.impDitherArea.enable( false, this.toolscreen );

    this.impContrastArea.render( this.toolscreen );
    this.screen.renderDisplay(); //TODO is this one needed

    this.preprocessImage();
    this.paintArea.updateDisplay();

  }

setImportDither() {
  this.impContrastArea.enable( false, this.toolscreen );
  this.impSaturationArea.enable( false, this.toolscreen );
  this.impDitherArea.enable( true );

  this.impDitherArea.render( this.toolscreen );
  this.screen.renderDisplay(); //TODO is this one needed

  this.preprocessImage();
  this.paintArea.updateDisplay();
}


  setImportSaturation() {
    this.impContrastArea.enable( false, this.toolscreen );
    this.impSaturationArea.enable( true );
    this.impDitherArea.enable( false, this.toolscreen );

    this.impSaturationArea.render( this.toolscreen );
    this.screen.renderDisplay(); //TODO is this one needed

    this.preprocessImage();
    this.paintArea.updateDisplay();
  }

  importContrast( x ) {
    console.log("importContrast("+x+")")
    this.importContrastValue = x;

    this.preprocessImage();
    this.paintArea.updateDisplay();
  }

  importDither( x ) {
    console.log("importDither("+x+")")
    this.importDitherValue = x;

    this.preprocessImage();
    this.paintArea.updateDisplay();
  }

  importSaturationContrast( x ) {
    console.log("importSaturationContrast("+x+")")
    this.importSaturationContrastValue = x;

    this.preprocessImage();
    this.paintArea.updateDisplay();
  }

  importSaturationMultiply( x ) {
    console.log("importSaturationMultiply("+x+")")
    this.importSaturationMultiplyValue = x;

    this.preprocessImage();
    this.paintArea.updateDisplay();
  }


  preprocessImage() {

    var CW = this.paintArea.screenCols();
    var CH = this.paintArea.screenRows();

    var destW = CW * 8;
    var destH = CH * 8;
    var plib = this.petsciilib;

    console.log("importLoadedImage");

    var canvas =  this.preprocessedImage;
    var context = this.preprocessedImageCtx;

    var img = this.image;
    if( ! img ) {
      console.log("No image loaded");
      return;
    }
    canvas.width=destW; canvas.height=destH;

    var ti = this.paintArea.getTraceImageContainer();

    var xoff=this.paintArea.tX,
        yoff = this.paintArea.tY,
        factor = this.paintArea.tResize;

    context.drawImage(
      img,
      xoff, yoff,
      img.width * factor,
      img.height * factor
    );

    var colors = this.screen.getColors();

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    plib.clampToPalette(imageData.data, destW, destH, colors,
      {
        contrast: this.importContrastValue,
        saturationContrast: this.importSaturationContrastValue,
        saturationMultiply: this.importSaturationMultiplyValue,
      });

    /*var cells = plib.analyzeCells( imageData.data, destW,
      this.paintArea.screenCols(),
      this.paintArea.screenRows() );*/

    plib.convertToPreviewImage( imageData.data, destW, destH, colors );
    context.putImageData(imageData, 0, 0);

    //plib.convertToPetscii( cells, destW, destH, this.paintArea );
    this.paintArea.renderDisplay();

  }


  importLoadedImage() {

    var CW = this.paintArea.screenCols();
    var CH = this.paintArea.screenRows();

    var destW = CW * 8;
    var destH = CH * 8;
    var plib = this.petsciilib;

    console.log("importLoadedImage");

    var canvas =  this.preprocessedImage;
		var context = this.preprocessedImageCtx;

    var img = this.image;
    if( ! img ) {
      console.log("No image loaded");
      return;
    }
    canvas.width=destW; canvas.height=destH;

    var ti = this.paintArea.getTraceImageContainer();

    var xoff=this.paintArea.tX,
        yoff = this.paintArea.tY,
        factor = this.paintArea.tResize;

    context.drawImage(
      img,
      xoff, yoff,
      img.width * factor,
      img.height * factor
    );

    var colors = this.screen.getColors();

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    plib.clampToPalette(imageData.data, destW, destH, colors,
      {
        contrast: this.importContrastValue,
        saturationContrast: this.importSaturationContrastValue,
        saturationMultiply: this.importSaturationMultiplyValue
      });

    var cells = plib.analyzeCells( imageData.data, destW,
      this.paintArea.screenCols(),
      this.paintArea.screenRows() );

    plib.convertToPetscii( cells, destW, destH, this.paintArea, { dither: this.importDitherValue } );

    plib.convertToPreviewImage( imageData.data, destW, destH, colors );
    context.putImageData(imageData, 0, 0);

    this.paintArea.setToggleImage(0);
    this.paintArea.renderDisplay();

  }

  toggleImage( x ) {
    console.log("toggling trace");
    this.paintArea.toggleImage( x );
    this.paintArea.renderDisplay();
  }

  toggleImport() {
    console.log("toggling import");
    this.paintArea.toggleImport();
    this.paintArea.renderDisplay();
  }


  zoomTrace( p ) {
    console.log( "zoomTrace " + p );
    this.paintArea.zoomTrace( p );
    if( this.paintArea.toggleImageMode == 2) {
      this.preprocessImage();
    }
    this.paintArea.updateDisplay();
  }

  scrollTrace( p ) {
    console.log( "scrollTrace " + p );
    this.paintArea.scrollTrace( p );
    if( this.paintArea.toggleImageMode == 2) {
      this.preprocessImage();
    }
    this.paintArea.updateDisplay();
  }

  scrollPicture( p ) {
    console.log( "scrollPicture " + p );
    this.paintArea.scrollPicture( p );

    this.paintArea.renderDisplay();
  }



  setImage( img ) {

    console.log( "setImage" , img);
    this.image = img;
    this.preprocessImage();

    this.paintArea.setTraceImage(  this.image );
    this.paintArea.setPreviewCanvas( this.preprocessedImage );
    this.paintArea.hideImage();

  }

  undo() {
    this.paintArea.undo();
    this.paintArea.renderDisplay();
  }

  fill( x, y ) {
    this.paintArea.fill(x,y,
        { drawCode: this.drawCode, drawColor: this.drawColor, bgColor: this.drawBGColor },
        { doubleBuffer: this.doubleBuffer,  layer:  this.layer }
      );
  }


  fillCol( x, y ) {

    //this.paintArea.fillCol(x,y, { drawCode: this.drawCode, drawColor: this.drawColor });
  }

  erasechar() {
    this.drawCode = 32;
  }

  get( str ) {
    return new PetsciiCallBack( this, str );
  }

  debug( debug) {
    console.log("debug: ", debug );
    this.toolscreen.renderDisplay();
  }

  setSelectAll() {
    this.setSelect("all");
  }

  setSelectInverse() {
    this.setSelect("inverse");
  }

  setSelectGradients() {
    this.setSelect("gradients");
  }

  setSelectText() {
    this.setSelect("text");
  }

  setSelectLines() {
    this.setSelect("lines");
  }

  setSelectLines2() {
    this.setSelect("lines2");
  }

  setSelectBlocks() {
    this.setSelect("blocks");
  }

  setSelectSymbol() {
    this.setSelect("symbol");
  }

  selectChar( c ) {
    this.drawCode = c;
  }

  getLayerBytes( l ) { /* for save */
    var len = this.screen.cW * this.screen.cH * 2;
    var bytes = new Uint8Array( len );

    var i=0;
    for( var x=0; x<this.screen.cW; x++ ) {
      for( var y=0; y<this.screen.cH; y++ ) {
        var t = this.screen.getLayerChar( x, y );
        var c = this.screen.getLayerCol( x, y );
        var bg = 0;
        if( l == 0 && this.multiColBG ) {
          bg = this.screen.getCharBGColor( x, y );
        }
        bytes[ i ] = t; bytes[ i + 1 ] = c + (bg * 16);
        i+=2;
      }
    }

    console.log( "i=" , i);

    return bytes;
  }


  getLayerBytes2( l ) { /* for export */
    var len = this.screen.cW * this.screen.cH * 2;
    var bytes = new Uint8Array( len );

    var i=0;

    for( var y=0; y<this.screen.cH; y++ ) {
      for( var x=0; x<this.screen.cW; x++ ) {
        var t = this.screen.getLayerChar( x, y );
        var c = this.screen.getLayerCol( x, y );
        var bg = 0;
        if( l == 0 && this.multiColBG ) {
          bg = this.screen.getCharBGColor( x, y );
        }
        bytes[ i ] = t; bytes[ i + 1 ] = c + (bg * 16);
        i+=2;
      }
    }

    console.log( "i=" , i);

    return bytes;
  }


  setLayerBytes( bytes, offset, l ) { /* for load */
    var len = this.screen.cW * this.screen.cH * 2;

    var i=offset;
    for( var x=0; x<this.screen.cW; x++ ) {
      for( var y=0; y<this.screen.cH; y++ ) {

        var t = bytes[ i ];
        var c = bytes[ i + 1 ];

        this.screen.setLayerChar( x, y, t );

        if( l == 1 ) {
          this.screen.setLayerCol( x, y, c );
        }
        else {
          var lc = c & 0xF;
          var hc = c >> 4;
          this.screen.setLayerCol( x, y, lc );
          this.screen.setCharBGColor( x, y, hc );
        }

        i+=2;
      }
    }



    return bytes;
  }

  load() {
    this.importexport.load();
  }

  onLoad( bytes ) {
    console.log( bytes ) ;

    var currentdate = new Date();
    var datetime;
    datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();


    //TODO check signature  'HPETSII1'

    if(
      (bytes[0] == 'H'.charCodeAt(0) &&
		   bytes[1] == 'P'.charCodeAt(0) &&
		   bytes[2] == 'E'.charCodeAt(0) &&
		   bytes[3] == 'T'.charCodeAt(0) &&
		   bytes[4] == 'S'.charCodeAt(0) &&
		   bytes[5] == 'I'.charCodeAt(0) &&
		   bytes[6] == 'I'.charCodeAt(0) &&
		   bytes[7] == '1'.charCodeAt(0) ) ||

       (bytes[0] == 'H'.charCodeAt(0) &&
 		   bytes[1] == 'P'.charCodeAt(0) &&
 		   bytes[2] == 'E'.charCodeAt(0) &&
 		   bytes[3] == 'T'.charCodeAt(0) &&
 		   bytes[4] == 'S'.charCodeAt(0) &&
 		   bytes[5] == 'C'.charCodeAt(0) &&
 		   bytes[6] == 'I'.charCodeAt(0) &&
 		   bytes[7] == 'I'.charCodeAt(0) )

    ) {
      console.log("Picture recognized as a PETSCII picture!");
    }
    else {
      console.log("Picture is NOT a PETSCII picture!");
      return;
    }

    var w = bytes[8];
    var h= bytes[9];
    var flags = bytes[10];
    var multiColorBG =  ( flags & 0x2 ) > 0;
    var doubleBuffer =  ( flags & 0x4 ) > 0;
    var doubleBufferStr = "l1";
    if( doubleBuffer) {
      doubleBufferStr = "l2";
    }
    var multiColorBGStr = "false";
    if( multiColorBG) {
      multiColorBGStr = "true";
    }

    this.multiColBG = multiColorBG;
    this.doubleBuffer = doubleBuffer;


    console.log( datetime + ": start loading");
    console.log( "MultiColorBG: " + multiColorBG);
    console.log( "DoubleBuffer: " + doubleBuffer);

    var mode = w+"x"+h+",bgcol-"+multiColorBGStr+","+doubleBufferStr;
    console.log( "mode: " + mode);
    this.screenMode( mode );

    if( !multiColorBG ) {
      this.screen.setBackgroundColor( bytes[11] );
    }

    this.screen.setLayer( 0 );
    this.setLayerBytes( bytes, 12, 0 );

    if( doubleBuffer) {
      var offset2 = 12 + ((this.screen.cW * this.screen.cH) * 2);
      this.screen.setLayer( 1 );
      this.setLayerBytes( bytes, offset2, 1 );
    }

    datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();

    console.log( datetime + ": done");
    this.screen.renderDisplay();
    //this.screen.setLayerCol( x, y, c );
  }


  onMLoad( bytes ) {
    console.log( bytes ) ;

    var currentdate = new Date();
    var datetime;
    datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();


    //TODO check signature  'HPETSII1'

    if(
      (bytes[0] == 'H'.charCodeAt(0) &&
		   bytes[1] == 'P'.charCodeAt(0) &&
		   bytes[2] == 'E'.charCodeAt(0) &&
		   bytes[3] == 'T'.charCodeAt(0) &&
		   bytes[4] == 'S'.charCodeAt(0) &&
		   bytes[5] == 'I'.charCodeAt(0) &&
		   bytes[6] == 'I'.charCodeAt(0) &&
		   bytes[7] == '1'.charCodeAt(0) ) ||

       (bytes[0] == 'H'.charCodeAt(0) &&
 		   bytes[1] == 'P'.charCodeAt(0) &&
 		   bytes[2] == 'E'.charCodeAt(0) &&
 		   bytes[3] == 'T'.charCodeAt(0) &&
 		   bytes[4] == 'S'.charCodeAt(0) &&
 		   bytes[5] == 'C'.charCodeAt(0) &&
 		   bytes[6] == 'I'.charCodeAt(0) &&
 		   bytes[7] == 'I'.charCodeAt(0) )

    ) {
      console.log("Picture recognized as a PETSCII picture!");
    }
    else {
      console.log("Picture is NOT a PETSCII picture!");
      return;
    }

    var w = bytes[8];
    var h= bytes[9];
    var flags = bytes[10];
    var multiColorBG =  ( flags & 0x2 ) > 0;
    var doubleBuffer =  ( flags & 0x4 ) > 0;
    var doubleBufferStr = "l1";
    if( doubleBuffer) {
      doubleBufferStr = "l2";
    }
    var multiColorBGStr = "false";
    if( multiColorBG) {
      multiColorBGStr = "true";
    }

    this.multiColBG = multiColorBG;
    this.doubleBuffer = doubleBuffer;


    console.log( datetime + ": start loading");
    console.log( "MultiColorBG: " + multiColorBG);
    console.log( "DoubleBuffer: " + doubleBuffer);

    var mode = w+"x"+h+",bgcol-"+multiColorBGStr+","+doubleBufferStr;
    console.log( "mode: " + mode);
    this.screenMode( mode );

    if( !multiColorBG ) {
      this.screen.setBackgroundColor( bytes[11] );
    }

    this.screen.setLayer( 0 );
    this.setLayerBytes( bytes, 12, 0 );

    if( doubleBuffer) {
      var offset2 = 12 + ((this.screen.cW * this.screen.cH) * 2);
      this.screen.setLayer( 1 );
      this.setLayerBytes( bytes, offset2, 1 );
    }

    datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();

    console.log( datetime + ": done");
    this.screen.renderDisplay();
    //this.screen.setLayerCol( x, y, c );
  }


  collectMDataForSave( ) {

    console.log("collectMDataForSave");

    var bytes=[];

    this.screen.setLayer( 0 );

    for( var i=0; i<this.frameCount; i++) {
      bytes.push( this.frameBuffers[ i ]);
    }

    return bytes;

  }

  collectDataForSave( vertical ) {

    console.log("collectDataForSave");

    var bytes0,bytes1;


    this.screen.setLayer( 0 );
    if( vertical ) {
       bytes0 = this.getLayerBytes(0);
    }
    else {
      bytes0 = this.getLayerBytes2(0);
    }


    if( this.doubleBuffer ) {
      this.screen.setLayer( 1 );
      if( vertical ) {
        bytes1 = this.getLayerBytes(1);
      }
      else {
        bytes1 = this.getLayerBytes2(1);
      }
    }
    else {
      bytes1 = null;
    }



    return [bytes0,bytes1];
  }

  save(  ) {

    var buffers=this.collectDataForSave( true );

    var bytes0, bytes1, blob;
    bytes0 = buffers[0];
    bytes1 = buffers[1];

    this.importexport.save(
      bytes0, bytes1, "hello.petscii",
      this.screen.cW, this.screen.cH,
      true, this.screen.getBackgroundColor(),
      this.multiColBG, this.doubleBuffer
    );

  }

  msave(  ) {

    var screens=this.collectMDataForSave();

    this.importexport.msave(
      screens, "hello.mpetscii",
      this.screen.cW, this.screen.cH,
      true, this.screen.getBackgroundColor(),
      this.multiColBG, this.doubleBuffer
    );

  }


  exportAsTextData(  ) {
    var buffers=this.collectDataForSave( false );

    var bytes0, bytes1;
    bytes0 = buffers[0];
    bytes1 = buffers[1];

    this.importexport.print( "chexadecimal", bytes0, bytes1, "SCREEN1",
      this.screen.cW, this.screen.cH,
      true, this.screen.getBackgroundColor(),
      this.multiColBG, this.doubleBuffer );
  }


  setColor( c ) {
    this.drawColor = c;
  }

  setBrushMode( c ) {
    var chars = false;
    if(c=='char') {
      chars = true;
    }
    else if(c=='grab') {
      chars = false;
    }
    else if(c=='block') {
      chars = false;
    }
    else if(c=='line') {
      chars = false;
    }
    this.selCharArea.enable( chars, this.toolscreen );
    this.gui.render();

    //,grab,block,line
  }

  flipLayer( button ) {
    this.layer = 1-this.layer;
    button.setText("LAY:"+this.layer);
    this.gui.render();
    console.log("layer = " + this.layer);
  }

  setBackgroundColor( c ) {

    this.drawBGColor = c;

    if( !this.multiColBG ) {
      console.log("set bg color: " + c);
      this.screen.setBackgroundColor( c );
      this.screen.touch();
      this.screen.renderDisplay();
    }
    else {
      //Nothing
    }
  }

  fileMenu() {
    this.toolsArea.enable( false, this.toolscreen );
    this.filesArea.enable( true );
    this.pictureArea.enable( false, this.toolscreen );

    this.filesArea.render( this.toolscreen );
    this.screen.renderDisplay();
  }

  pictureMenu() {

    console.log("pictureMenu");

    this.toolsArea.enable( false, this.toolscreen );
    this.filesArea.enable( false, this.toolscreen );
    this.pictureArea.enable( true );

    this.pictureArea.render( this.toolscreen );
    this.screen.renderDisplay();
  }

  toolMenu() {
    this.toolsArea.enable( true );
    this.filesArea.enable( false, this.toolscreen );
    this.pictureArea.enable( false, this.toolscreen );

    this.toolsArea.render( this.toolscreen );
    this.screen.renderDisplay();
  }

  setSelect(x) {
    this.selectCharWidget.setMode(x);
    this.selectCharWidget.render( this.toolscreen );
    this.screen.renderDisplay();
  }

}
