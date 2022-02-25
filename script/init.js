


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function init() {


  var colors = [];
  var colors2 = [];

  //c64 adjusted
  colors[ 0 ] = { r: 0x00, g:  0x00, b:  0x00 };
  colors[ 1 ] = { r: 0xFF, g:  0xFF, b:  0xFF };
  colors[ 2 ] = { r: 0x68, g:  0x37, b:  0x2B };
  colors[ 3 ] = { r: 0x70, g:  0xA4, b:  0xB2 };
  colors[ 4 ] = { r: 0x6F, g:  0x3D, b:  0x86 };
  colors[ 5 ] = { r: 0x58, g:  0x8D, b:  0x43 };
  colors[ 6 ] = { r: 0x35, g:  0x28, b:  0x79 };
  colors[ 7 ] = { r: 0xB8, g:  0xC7, b:  0x6F };
  colors[ 8 ] = { r: 0x43, g:  0x39, b:  0x00 };
  colors[ 9 ] = { r: 0x9A, g:  0x67, b:  0x59 };
  colors[ 10 ] = { r: 0x6F, g:  0x4F, b:  0x25 };
  colors[ 11 ] = { r: 0x44, g:  0x44, b:  0x44 };
  colors[ 12 ] = { r: 0x6C, g:  0x6C, b:  0x6C };
  colors[ 13 ] = { r: 0x9A, g:  0xD2, b:  0x84 };
  colors[ 14 ] = { r: 0x6C, g:  0x5E, b:  0xB5 };
  colors[ 15 ] = { r: 0x95, g:  0x95, b:  0x95 };


  //commander 16
  colors2[ 0 ] = { r: 0x01, g:0x01,b:0x01 };
  colors2[ 1 ] = { r: 0xf0, g:0xf0,b:0xf0 };
  colors2[ 2 ] = { r: 0x80, g:0x00,b:0x00 };
  colors2[ 3 ] = { r: 0xa0, g:0xf0,b:0xe0 };
  colors2[ 4 ] = { r: 0xc0, g:0x40,b:0xc0 };
  colors2[ 5 ] = { r: 0x00, g:0xc0,b:0x50 };
  colors2[ 6 ] = { r: 0x00, g:0x00,b:0xa0 };
  colors2[ 7 ] = { r: 0xe0, g:0xe0,b:0x70 };
  colors2[ 8 ] = { r: 0xd0, g:0x80,b:0x50 };
  colors2[ 9 ] = { r: 0x60, g:0x40,b:0x00 };
  colors2[ 10 ] = { r: 0xf0, g:0x70,b:0x70 };
  colors2[ 11 ] = { r: 0x30, g:0x30,b:0x30 };
  colors2[ 12 ] = { r: 0x70, g:0x70,b:0x70 };
  colors2[ 13 ] = { r: 0xa0, g:0xf0,b:0x60 };
  colors2[ 14 ] = { r: 0x00, g:0x80,b:0xf0 };
  colors2[ 15 ] = { r: 0xb0, g:0xb0,b:0xb0 };


  var paintScreen = new PetsciiScreen( document.getElementById("console"), ready,
      "DrawScreen",40,30,2.5,2.5,
      { urlPath: "res/img/console", doubleBuffer: true, multiBGColor: true },
      colors2
    );

var scr2 ;

function ready( data ) {

    console.log("Screen1 ready " + data );

    var paintArea = new TextPaintArea( paintScreen );


    scr2 = new PetsciiScreen( document.getElementById("console2"), null, "ToolScreen",25,30,2.5,2.5, { sharedScreen: paintScreen } );
    var gui = new PetsciiGUI( scr2 );
    var control = new Control( paintScreen, paintArea, scr2, gui, "imageLoader", "imageSaver" );
    var C=control;

    C.drawCode = 81;
    C.drawColor = 14;

    paintScreen.clear();
    paintArea.renderDisplay();

    C.cxSize=paintArea.screenCW();
    C.cySize=paintArea.screenCH();
    C.oMMX=-1;
    C.oMMY=-1;
    C.oMMC=-1;
    var down=0;
    var crossCode = 91;

    var scrCanvas = paintScreen.getCanvas();

    var Mdraw = C.modeInt("draw");
    var Mcolor = C.modeInt("color");
    var Mbgcolor = C.modeInt("bgcolor");
    var Merase = C.modeInt("erase");
    var Mfill = C.modeInt("fill");

    C.playing = false;
    C.busy = false;
    var id = setInterval(frame, 50);

    function frame() {
        if(C.playing && !C.busy) {
          C.busy = true;
          C.incFrame();
          C.busy = false;
        }
    }

    scrCanvas.onmouseup = function( evt ){
      down=0;
    }

    scrCanvas.onmouseenter = function( evt ){
      down=0;
    }

    scrCanvas.onmousedown = function( evt ){
      var pos = getMousePos( scrCanvas, evt );
      var cx = Math.floor(pos.x / C.cxSize);
      var cy = Math.floor(pos.y / C.cySize);

      plot( cx, cy, false );

      down=1;
      paintArea.renderDisplay();

    };

    scrCanvas.onmousemove = function( evt ){

      var pos = getMousePos( scrCanvas, evt );
      var cx = Math.floor(pos.x / C.cxSize);
      var cy = Math.floor(pos.y / C.cySize);

      C.oMMX=cx;
      C.oMMY=cy;

      if(down == 0) {
        C.oMMC=paintArea.getCharCode( cx,cy );
        paintArea.setCharCode( cx,cy,crossCode );
      }
      else {  /* Mouse down and movement */

        plot(cx,cy, true);

      }
      if( C.oMMC != -1 ) {
        paintArea.setCharCode( C.oMMX,C.oMMY,C.oMMC );
      }

      paintArea.renderDisplay();
    };

    function plot( cx, cy, move ) {
      var bakOMMC = C.oMMC;
      var singleChar = false;

      C.oMMC = -1;

      if( C.mode == Mdraw ||
          C.mode == Merase ||
          C.mode == Mcolor ||
          C.mode == Mbgcolor 	)
      {
        paintArea.rememberForUndo( cx, cy );
        singleChar = true;
      }

      if( C.mode == Mdraw ) {

        if( C.doubleBuffer && C.layer==1 ) {
          paintArea.setDBCharCode( cx,cy, C.drawCode );
          paintArea.setDBCharColor( cx,cy, C.drawColor );
        }
        else {
          paintArea.setCharCode( cx,cy, C.drawCode );
          paintArea.setCharColor( cx,cy, C.drawColor );
          C.oMMC = C.drawCode;
        }

      }
      else if( C.mode == Merase ) {
        paintArea.setCharCode( cx,cy, 32 );
        if( C.doubleBuffer ) {
          paintArea.setDBCharCode( cx,cy, 32 );
        }
        C.oMMC = 32;
      }
      else if( C.mode == Mcolor ) {
        if( C.doubleBuffer && C.layer==1 ) {
          paintArea.setDBCharColor( cx,cy, C.drawColor );
        }
        else {
          paintArea.setCharColor( cx,cy, C.drawColor );
        }

      }
      else if( C.mode == Mbgcolor ) {
        paintArea.setCharBGColor( cx,cy, C.drawBGColor );
      }

      if( move ) {
        if(	C.oMMC == -1 ) {
          C.oMMC=paintArea.getCharCode( cx,cy );
        }
      }
      else { //click

        if( C.mode == Mfill ) {
          paintArea.setCharCode( cx,cy, bakOMMC );
          C.fill( cx,cy );
          C.oMMC = C.drawCode;
        }

        if(	C.oMMC == -1 ) { C.oMMC=bakOMMC; }
        else if( (cx==C.oMMX && cy==C.oMMY ) ) {
            C.oMMC=paintArea.getCharCode( cx,cy );
        }

      }

      if( singleChar )
      {
        if( move ) { var debug=1; }
        paintArea.pushUndo( cx, cy );
      }
    }

    buildGui( control );
  }




function buildGui( control ) {

    console.log("Screen2 is ready " + control );

    var gui = control.gui;
    var env_dev = false;

    scr2.clear();

    var button, toolsArea, selCharArea, toolsArea2, filesArea, importArea, pictureArea;
    var impContrastArea, impDitherArea, impSatArea,  impRulesArea;

    y=1;
    button= new PetsciiToggleButton( 15,y , " File", 9, control.get("fileMenu"), "File", "main",  false );
    gui.addWidget(button);y+=2;

    button= new PetsciiToggleButton( 15,y , " Picture", 9, control.get("pictureMenu"), "Picture", "main", false );
    gui.addWidget(button);y+=2;

    button= new PetsciiToggleButton( 15,y , " Drawing", 9, control.get("toolMenu"), "Tools", "main", true );
    gui.addWidget(button);y+=2;


    var x0,w,y,x;

    x0=1,w=6,y=5, x=x0,w2=6;
    filesArea = new PetsciiArea(x,y);
    filesArea.enable( false );
    x=0,y=-4;
    button= new PetsciiButton( x,y , "LOAD", 5, control.get("load"), null );x+=w2;
    filesArea.addWidget(button);
    button= new PetsciiButton( x,y , "SAVE", 5, control.get("save"), null );x+=w2;
    filesArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiButton( x,y , "MLOAD", 5, control.get("mload"), null );x+=w2;
    filesArea.addWidget(button);
    button= new PetsciiButton( x,y , "MSAVE", 5, control.get("msave"), null );x+=w2;
    filesArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiButton( x,y , "EXP.", 5, control.get("exportAsTextData"), null );x+=w2;
    filesArea.addWidget(button);
    y+=3;x=0;

    //button= new PetsciiButton( x,y , "LOAD BRUSH ", 12, control.get("clear"), null );x+=w2;
    //if( env_dev ) filesArea.addWidget(button);
    //y+=2;x=0;

    button= new PetsciiButton( x,y , "LOAD IMAGE", 11, control.get("loadImage"), null );
    filesArea.addWidget(button);x+=12;

    button= new PetsciiButton( x,y , "+", 1, control.get("zoomTrace"), "in" );
    filesArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "-", 1, control.get("zoomTrace"), "out" );
    filesArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "L", 1, control.get("scrollTrace"), "left" );
    filesArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "R", 1, control.get("scrollTrace"), "right" );
    filesArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "U", 1, control.get("scrollTrace"), "up" );
    filesArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "D", 1, control.get("scrollTrace"), "down" );
    filesArea.addWidget(button);x+=2;
    y+=3;

    x=0;
    button= new PetsciiButton( x,y , "TOGGLE TRC.", 11, control.get("toggleImage"), "trace" );
    filesArea.addWidget(button);x=0;y+=3
    button= new PetsciiButton( x,y , "TOGGLE PRE.", 11, control.get("toggleImage"), "preprocessed" );
    filesArea.addWidget(button);x+=12;



    y+=3;x=0;
    button= new PetsciiButton( x,y , "IMPORT IMG.",    11, control.get("importLoadedImage"), null );
    filesArea.addWidget(button); x+=12;//y+=3;x=0;

    button= new PetsciiButton( x,y , "SHOW DBG.",    11, control.get("toggleDebug"), null );
    filesArea.addWidget(button);y+=0;x+=12;

    importArea = new PetsciiArea(0,0);
    importArea.enable( true );
    control.importArea = importArea;
    filesArea.addWidget(importArea);

    x=0;y+=2;
    var ycont = y;
    button= new PetsciiToggleButton( x,y , "CNTRST", 6, control.get("setImportContrast"), null, "importopt", true );
    importArea.addWidget(button); y+=2;
    button= new PetsciiToggleButton( x,y , "SATUR.", 6, control.get("setImportSaturation"), null, "importopt", false );
    importArea.addWidget(button); y+=2;
    button= new PetsciiToggleButton( x,y , "DITHER", 6, control.get("setImportDither"), null, "importopt", false );
    importArea.addWidget(button); y+=2;


    impContrastArea = new PetsciiArea(0,0);
    impContrastArea.enable( true );
    control.impContrastArea = impContrastArea;
    importArea.addWidget(impContrastArea);

    y=ycont;x=8;

/*    button= new PetsciiToggleButton( x,y , "0.2", 3, control.get("importContrast"), .25, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);*/
    button= new PetsciiToggleButton( x,y , "0.5", 3, control.get("importContrast"), .5, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
/*    button= new PetsciiToggleButton( x,y , "0.7", 3, control.get("importContrast"), .7, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);*/
    button= new PetsciiToggleButton( x,y , "1.0", 3, control.get("importContrast"), 1, "impContrast", true );x+=4;
    impContrastArea.addWidget(button);
    x=8;y+=4;

    button= new PetsciiToggleButton( x,y , "1.5", 3, control.get("importContrast"), 1.5, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "2.0", 3, control.get("importContrast"), 2, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "2.5", 3, control.get("importContrast"), 2.5, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "3.0", 3, control.get("importContrast"), 3, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    x=8;y+=4;

    button= new PetsciiToggleButton( x,y , "3.5", 3, control.get("importContrast"), 3.5, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "4.0", 3, control.get("importContrast"), 4, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "6.0", 3, control.get("importContrast"), 6, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "8.0", 3, control.get("importContrast"), 8, "impContrast", false );x+=4;
    impContrastArea.addWidget(button);



    impSatArea = new PetsciiArea(0,0);
    impSatArea.enable( false );
    control.impSaturationArea = impSatArea;
    importArea.addWidget(impSatArea);

    y=ycont;x=8;
    button= new PetsciiToggleButton( x,y , "0.0", 3, control.get("importSaturationMultiply"), 0, "impSatMul", false );x+=4;
    impSatArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "0.5", 3, control.get("importSaturationMultiply"), 0.5, "impSatMul", false );x+=4;
    impSatArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "1.0", 3, control.get("importSaturationMultiply"), 1.0, "impSatMul", true );x+=4;
    impSatArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "2.0", 3, control.get("importSaturationMultiply"), 2.0, "impSatMul", false );x+=4;
    impSatArea.addWidget(button);

    y+=3;x=8;
    button= new PetsciiToggleButton( x,y , "CONTR1", 7, control.get("importSaturationContrast"), 1, "impSatCont", true );x+=8;
    impSatArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "CONTR3", 7, control.get("importSaturationContrast"), 3, "impSatCont", false );x+=8;
    impSatArea.addWidget(button);
    y+=2;x=8;
    button= new PetsciiToggleButton( x,y , "CONTR6", 7, control.get("importSaturationContrast"), 6, "impSatCont", false );x+=8;
    impSatArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "CONTR9", 7, control.get("importSaturationContrast"), 9, "impSatCont", false );x+=8;
    impSatArea.addWidget(button);


    impDitherArea = new PetsciiArea(0,0);
    impDitherArea.enable( false );
    control.impDitherArea = impDitherArea;
    importArea.addWidget(impDitherArea);

    y=ycont;x=8;
    button= new PetsciiToggleButton( x,y , "ON ", 3, control.get("importDither"), true, "impDither", true );x+=4;
    impDitherArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "OFF", 3, control.get("importDither"), false, "impDither", false );x+=4;
    impDitherArea.addWidget(button);

    y+=3;x=8;
    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(102, true),
      1, control.get("importDither"), true, "impDitherChar", true );x+=2;
    impDitherArea.addWidget(button);

    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(104, true),
      1, control.get("importDither"), false, "impDitherChar", false );x+=2;
    impDitherArea.addWidget(button);

    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(92, true),
      1, control.get("importDither"), false, "impDitherChar", false );x+=2;
    impDitherArea.addWidget(button);

    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(37, true),
      1, control.get("importDither"), false, "impDitherChar", false );x+=2;
    impDitherArea.addWidget(button);

    y+=3;x=8;
    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(62 , true) +
      gui.controlChar(32 , true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(104, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(102, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(104+128, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(32+128, true)+
      gui.controlChar(62 , true),
      7, control.get("importDither"), false, "impDitherChar", false );x+=2;
    impDitherArea.addWidget(button);

    x+=6;
    button= new PetsciiToggleButton( x,y ,
      gui.controlChar(62 , true) +
      gui.controlChar(32 , true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(37, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(102, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(37+128, true) +
      //gui.controlChar(62 , true) +
      gui.controlChar(32+128, true)+
      gui.controlChar(62 , true),
      7, control.get("importDither"), false, "impDitherChar", false );x+=2;
    impDitherArea.addWidget(button);


    x0=1,w=6,y=5, x=x0,w2=6;
    pictureArea = new PetsciiArea(x,y);
    pictureArea.enable( false );
    x=0,y=-4;

    y++;
    y+=2*5;x=0;
    button= new PetsciiToggleButton( x,y , "40x25 C64     *2cpc", 19, control.get("screenMode"), "40x25,bgcol-false,l1", "screenMode", false );x+=w2;
    pictureArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "40x30 X16      2cpc", 19, control.get("screenMode"), "40x30,bgcol-true,l1", "screenMode", false );x+=w2;
    pictureArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "40x30 X16 2lay 3cpc", 19, control.get("screenMode"), "40x30,bgcol-true,l2", "screenMode", true );x+=w2;
    pictureArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "80x60 X16      2cpc", 19, control.get("screenMode"), "80x60,bgcol-true,l1", "screenMode", false );x+=w2;
    pictureArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "80x60 X16 2lay 3cpc", 19, control.get("screenMode"), "80x60,bgcol-true,l2", "screenMode", false );x+=w2;
    pictureArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "CUSTOM", 16, control.get("clear"), null );x+=w2;
    if( env_dev ) pictureArea.addWidget(button);
    y+=2;x=0;


    button= new PetsciiButton( x,y , "L", 1, control.get("scrollPicture"), "left" );
    pictureArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "R", 1, control.get("scrollPicture"), "right" );
    pictureArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "U", 1, control.get("scrollPicture"), "up" );
    pictureArea.addWidget(button);x+=2;
    button= new PetsciiButton( x,y , "D", 1, control.get("scrollPicture"), "down" );
    pictureArea.addWidget(button);x+=2;
    y+=3;


    x0=1,w=6,y=5, x=x0;
    toolsArea = new PetsciiArea(x,y);
    toolsArea.enable( true );
    x=0,y=-4;
    button= new PetsciiButton( x,y , "CLR", 5, control.get("clear"), null );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiButton( x,y , "LAY:0", 5, control.get("flipLayer"), null );x+=w;
    button.setCallBackData( button );
    toolsArea.addWidget(button);
    y+=2;x=0;

    button= new PetsciiButton( x,y , "UNDO", 5, control.get("undo"), null );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiButton( x,y , "REDO", 5, control.get("redo"), null );x+=w;
    if( env_dev )toolsArea.addWidget(button);
    y+=3;x=0;
    button= new PetsciiToggleButton( x,y , "DRAW", 5, control.get("setMode"), "draw", "toolselect1", true );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "ERASE", 5, control.get("setMode"), "erase", "toolselect1", false );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "LINE", 5, control.get("setMode"), "line", "toolselect1", false );x+=w;
    if( env_dev )toolsArea.addWidget(button);

    y+=2;x=0;


    button= new PetsciiToggleButton( x,y , "FCOL", 5, control.get("setMode"), "color", "toolselect1", false );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "BCOL", 5, control.get("setMode"), "bgcolor", "toolselect1", false );x+=w;
    toolsArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "OVAL", 5, control.get("setMode"), "oval", "toolselect1", false );x+=w;
    if( env_dev ) toolsArea.addWidget(button);
    button= new PetsciiToggleButton( x,y , "RECT", 5, control.get("setMode"), "rect", "toolselect1", false );x+=w;
    if( env_dev ) toolsArea.addWidget(button);
    y+=2;x=0;
    button= new PetsciiToggleButton( x,y , "FILL", 5, control.get("setMode"), "fill", "toolselect1", false );x+=w;
    toolsArea.addWidget(button);

    button= new PetsciiToggleButton( x,y , "MOVIE", 5, control.get("setMode"), "movie", "toolselect1", false );x+=w;
    toolsArea.addWidget(button);

    button= new PetsciiButton( x,y , "+", 1, control.get("incFrame"), false);
    toolsArea.addWidget(button);
    button= new PetsciiButton( x+2,y , "-", 1, control.get("decFrame"), false);
    toolsArea.addWidget(button);

    button=new TextDisplayBox(x+4,y,8);
    toolsArea.addWidget(button);
    control.movieInfo = button;
    control.movieInfo.update(" 1/1");

    button= new PetsciiToggleButton( x,y , "TEXT", 5, control.get("setMode"), "text", "toolselect1", false );x+=w;
    if( env_dev ) toolsArea.addWidget(button);
    y+=2;x=0;

/*		button= new PetsciiButton( x,y , "TEXT", 5, null, null );x+=w;
    toolsArea.addWidget(button);
    y+=2;x=0;*/


    for(var c=0; c<16; c++ ) {
      button=new SelectColor(0+c,21,c,control.get("setColor"),c);
      toolsArea.addWidget(button);
    }

    button= new PetsciiButton( 17,21 , "SWPCLR", 6, control.get("swapColors"), null );
    toolsArea.addWidget(button);

    for(var c=0; c<16; c++ ) {
      button=new SelectColor(0+c,23,c,control.get("setBackgroundColor"),c);
      toolsArea.addWidget(button);
    }

    toolsArea2 = new PetsciiArea(0,16);
    toolsArea2.enable( true );
    control.brushSelect = toolsArea2;

    y=8;x=1;
    button= new PetsciiToggleButton( x,-3 , "CHAR", 5, control.get("setBrushMode"), "char", "brush", true );x+=w;
    toolsArea2.addWidget(button);
    button= new PetsciiToggleButton( x,-3 , "GRAB", 5, control.get("setBrushMode"), "grab", "brush", false );x+=w;
    if( env_dev ) toolsArea2.addWidget(button);
    button= new PetsciiToggleButton( x,-3 , "BLOCK", 5, control.get("setBrushMode"), "block", "brush",false );x+=w;
    if( env_dev ) toolsArea2.addWidget(button);
    button= new PetsciiToggleButton( x,-3 , "LINE", 5, control.get("setBrushMode"), "line", "brush",false );x+=w;
    if( env_dev ) toolsArea2.addWidget(button);


    selCharArea = new PetsciiArea(0,0);
    selCharArea.enable( true );
    control.selCharArea = selCharArea;
    toolsArea2.addWidget(selCharArea);


    x=1;y=0;
    button= new PetsciiToggleButton( x,y , "SYMB", 4, control.get("setSelectAll"), null, "chars", true );
    selCharArea.addWidget(button); y+=2;
    button= new PetsciiToggleButton( x,y , "TEXT", 4, control.get("setSelectText"), null, "chars", false );
    selCharArea.addWidget(button); y+=2;
    button= new PetsciiToggleButton( x,y , "LINE", 4, control.get("setSelectLines"), null, "chars", false );
    selCharArea.addWidget(button);y+=2;
    button= new PetsciiToggleButton( x,y , "SLNT", 4, control.get("setSelectGradients"), null, "chars", false );
    selCharArea.addWidget(button);y+=2;
    button= new PetsciiToggleButton( x,y , "BLOC", 4, control.get("setSelectBlocks"), null, "chars", false );
    selCharArea.addWidget(button);y+=2;
/*		button= new PetsciiToggleButton( x,y , "SYMB", 4, control.get("setSelectSymbol"), null, "chars", false );
    toolsArea2.addWidget(button);y+=2;*/

    var selectChar = new SelectCharButton(6,0,16,16,control.get("selectChar"),null);
    control.selectCharWidget = selectChar;
    selCharArea.addWidget(selectChar);

    var toolsArea3 = new PetsciiArea(0,16);
    toolsArea3.enable( false );
    control.movieControls = toolsArea3;

    w=8;
    x=1;

    x=1;
    button= new PetsciiButton( x,-3 , "+ FRAME", w, control.get("addFrame"), false );x+=w+1;
    toolsArea3.addWidget(button);
    button= new PetsciiButton( x,-3 , "- FRAME", w, control.get("delFrame"), false );x+=w+1;
    toolsArea3.addWidget(button);

    x=1;
    button= new PetsciiButton( x,-1 , "> PLAY", w, control.get("playMovie"), false );x+=w+1;
    toolsArea3.addWidget(button);
    button= new PetsciiButton( x,-1 , "# PAUSE", w, control.get("pauseMovie"), false );x+=w+1;
    toolsArea3.addWidget(button);



    toolsArea.addWidget(toolsArea2);
    //toolsArea.addWidget(toolsArea3);
    gui.addWidget( toolsArea );
    gui.addWidget( toolsArea3 );
    gui.addWidget( filesArea );
    gui.addWidget( pictureArea );
    control.toolsArea = toolsArea;
    control.filesArea = filesArea;
    control.pictureArea = pictureArea;

    gui.render();

    scr2.renderDisplay();

    var cxSize=scr2.screenCW;
    var cySize=scr2.screenCH;
    var oMMX=-1;
    var oMMY=-1;
    var oMMC=-1;
    var down=0;

    var crossColor = 15;
    var selectColor = 1;

    var scrCanvas = scr2.getCanvas();

    /*

      Input handling

    */

    scrCanvas.onmouseup = function( evt ){
      down=0;
    }

    scrCanvas.onmousedown = function( evt ){
      var pos = getMousePos( scrCanvas, evt );
      var cx = Math.floor(pos.x / cxSize);
      var cy = Math.floor(pos.y / cySize);

      if( cx==oMMX && cy==oMMY )
      {

        gui.onClick( cx, cy, "left" );

      }

      down=1;
      scr2.renderDisplay();

    };


    scrCanvas.onmousemove = function( evt ){

      if( oMMC != -1 ) {
        scr2.setCharColor( oMMX,oMMY,oMMC );
      }
      var pos = getMousePos( scrCanvas, evt );
      var cx = Math.floor(pos.x / cxSize);
      var cy = Math.floor(pos.y / cySize);

      oMMX=cx;
      oMMY=cy;

      oMMC=scr2.getCharColor( cx,cy );
      scr2.setCharColor( cx,cy,crossColor );

      scr2.renderDisplay();
    };
  }

}
