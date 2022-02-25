class TextPaintArea {

  constructor( screen ) {
    this.screen = screen;
    this.undoStack = [];
    this.redoStack = [];

    this.toggleImageMode = 0;
    this.previewCanvas = null;
    this.image = null;

    this.tResize = 1.0;
    this.tX = 0;
    this.tY = 0;

  }

  updateMode() {

  }

  screenCols() {
    return this.screen.cW;
  }

  screenRows() {
    return this.screen.cH;
  }

  screenCW() {
    return this.screen.screenCW;
  }

  screenCH() {
    return this.screen.screenCH;
  }

  clear() {
    this._pushUndoRaw( this.getFullScreenData() );
    this.screen.clear();
  }

  swapColors( c1, c2 ) {
    this._pushUndoRaw( this.getFullScreenData() );

    var s=this.screen;

    for( var y=0; y<this.screen.cH; y++ ) {
      for( var x=0; x<this.screen.cW; x++ ) {

          var c = this.getFullChar(x,y);

          if( c[ 3 ] == c1 ) {
            s.setCharColor( x,y , c2 );

          }
          if( c[ 4 ] == c1 ) {
            s.setCharBGColor( x,y , c2 );

          }
          if( c[ 6 ] == c1 ) {
            s.setDBCharColor( x,y , c2 );
          }
      }
    }

    this.screen.updateDisplay();
  }

  clearTrace() {
    var ti = this.screen.traceImage;
    ti.enable = false;
    ti.image = null;
    this.screen.updateDisplay();
  }

  setPreviewCanvas( cnvs ) {

    var ti = this.screen.traceImage;

    ti.enable = false;
    ti.image = cnvs;
    ti.x = 0;
    ti.y = 0;
    ti.resizeFactor = 1.0;
    ti.alpha = 1.0;

    this.previewCanvas = cnvs;

    this.screen.updateDisplay();

    console.log("preview set done");
  }

  setTraceImage( img ) {

    var ti = this.screen.traceImage;

    ti.enable = true;
    ti.image = img;
    ti.x = this.tX;
    ti.y = this.tY;
    ti.resizeFactor = this.tResize;
    ti.alpha = 0.5;

    this.image = img;

    this.screen.updateDisplay();

    console.log("trace set done");
  }


  setToggleImage( x ) {
    for( var i=0; i<3; i++ ) {
      if( this.toggleImageMode == x ) {
        return;
      }
      this.toggleImage();
    }
  }

  toggleImage( x ) {
    for( var i=0; i<3; i++ ) {

      this.toggleThroughImage();

      if( this.toggleImageMode == 0 ) {
        return;
      }
      if( this.toggleImageMode == 1 && x == "trace" ) {
        return;
      }
      if( this.toggleImageMode == 2 && x == "preprocessed" ) {
        return;
      }


    }
  }



  toggleThroughImage() {
    var ti = this.screen.traceImage;

    if( this.image != null ) {

      this.toggleImageMode = this.toggleImageMode + 1;
      if( this.toggleImageMode == 3) {
        this.toggleImageMode = 0;
      }

      if( this.toggleImageMode == 0) {
          ti.enable = false;
      }
      else if( this.toggleImageMode == 1) {
          ti.enable = true;
          ti.image = this.image;
          ti.x = this.tX;
          ti.y = this.tY;
          ti.resizeFactor = this.tResize;
          ti.alpha = 0.5;
      }
      else if( this.toggleImageMode == 2) {
          ti.enable = true;
          ti.image = this.previewCanvas;
          ti.x = 0;
          ti.y = 0;
          ti.resizeFactor = 1;
          ti.alpha = 1;
      }
    }
    this.screen.updateDisplay();
  }

  hideImage() {
    var ti = this.screen.traceImage;

    ti.enable = false;
    this.toggleImageMode = 0;

    this.screen.updateDisplay();
  }

  updateDisplay() {
    this.screen.updateDisplay();
  }

  zoomTrace( p ) {
    var ti = this.screen.traceImage;
    if( this.toggleImageMode == 1 || this.toggleImageMode == 2) {
      if( p == "in" ) {
        this.tResize += .2;
      }
      else {
        this.tResize -= .2;
      }
    }

    if( this.toggleImageMode == 1 ) {
      ti.resizeFactor = this.tResize;
    }
  }





  scrollTrace( p ) {

    var ti = this.screen.traceImage;

    if( this.toggleImageMode == 1 || this.toggleImageMode == 2) {
      if( p == "up" ) {
        this.tY -= (4 * this.tResize);
      }
      else if( p == "down" ) {
        this.tY += (4 * this.tResize);
      }
      else if( p == "left" ) {
        this.tX -= (4 * this.tResize);
      }
      else if( p == "right" ) {
        this.tX += (4 * this.tResize);
      }
    }

    if( this.toggleImageMode == 1) {
      ti.x = this.tX;
      ti.y = this.tY;
    }
  }

  getTraceImageContainer() {
    return this.screen.traceImage;
  }

  _pushUndoRaw( x ) {

    this.undoStack.push(x);

  }

  rememberForUndo( x, y ) {
      var c0 = this.rememberChar = this.getFullChar( x,y );;

  }

  pushUndo( x, y ) {
    var c = this.getFullChar( x,y );
    var c0 = this.rememberChar;

    if(
      c[0] == c0[0] &&
      c[1] == c0[1] &&
      c[2] == c0[2] &&
      c[3] == c0[3] &&
      c[4] == c0[4] &&
      c[5] == c0[5] &&
      c[6] == c0[6]
    ) {
      /*If the char did not change */
      return;
    }

    var top = this.undoStack.pop()

    if( top ) {

      this.undoStack.push( top );

      if( top.length == 1 ) {
        top = top[ 0 ];
        if(
          c[0] == top[0] &&
          c[1] == top[1] &&
          c[2] == top[2] &&
          c[3] == top[3] &&
          c[4] == top[4] &&
          c[5] == top[5] &&
          c[6] == top[6]
        ) {

          console.log("skipping ["+c[0]+","+c[1]+"] ("+c[2]+")");
          return; //skip, allready undid this char, with same value
        }
      }
    }

    this._pushUndoRaw([ c0 ]);
  }

  undo( ) {
    //console.log("before undo",this.undoStack);
    this.reCreate( this.undoStack.pop() );
    //console.log("after undo",this.undoStack);

  }

  reCreate( itemArray ) {

    if( !itemArray ) { return; }
    var s=this.screen;

    console.log("reCreate("+itemArray.length+") elements");
    for( var i = 0; i<itemArray.length; i++ ) {
      var el=itemArray[ i ];
      var x = el[0];
      var y = el[1];

      //console.log("reCreate("+i+")", itemArray);
      //console.log("recreate ["+el[0]+","+el[1]+"]="+el[2]);

      s.setCharCode( x,y , el[ 2 ]);
      s.setCharColor( x,y , el[ 3 ]);
      s.setCharBGColor( x,y , el [ 4 ]);
      s.setDBCharCode( x,y , el[ 5 ] );
      s.setDBCharColor( x,y , el[ 6 ] );

    }
  }

  renderDisplay() {
    this.screen.renderDisplay();
  }

  setBackgroundColor( bgcol ) {
    this.screen.setBackgroundColor( bgcol );
  }

  setCharCode( x, y, c ) {
    this.screen.setCharCode( x, y, c );
  }

  setCharColor( x, y, c ) {
    this.screen.setCharColor( x, y, c );
  }

  getCharCode( x, y ) {
    return this.screen.getCharCode( x,y );
  }

  setDBCharCode( x, y, c ) {
    this.screen.setDBCharCode( x, y, c );
  }

  setDBCharColor( x, y, c ) {
    this.screen.setDBCharColor( x, y, c );
  }

  setCharBGColor( x, y, c ) {
    this.screen.setCharBGColor( x, y, c );
  }

  scrollPicture( p ) {

    if( p == "up" ) {
      for( var x=0;x<this.screen.cW; x++ ) {
        for( var y=1; y<this.screen.cH; y++ ) {
            var c = this.getFullChar(x,y);
            this.setFullChar(x,y-1,c);
        }
      }
    }
    else if( p == "down" ) {
      for( var x=0;x<this.screen.cW; x++ ) {
        for( var y=this.screen.cH-2; y>=0; y-- ) {
            var c = this.getFullChar(x,y);
            this.setFullChar(x,y+1,c);
        }
      }
    }
    else if( p == "left" ) {
      for( var y=0;y<this.screen.cH; y++ ) {
        for( var x=1; x<this.screen.cW; x++ ) {
            var c = this.getFullChar(x,y);
            this.setFullChar(x-1,y,c);
        }
      }
    }
    else if( p == "right" ) {
      for( var y=0;y<this.screen.cH; y++ ) {
        for( var x=this.screen.cW-2; x>=0; x-- ) {
            var c = this.getFullChar(x,y);
            this.setFullChar(x+1,y,c);
        }
      }
    }
  }



  getFullScreenData() {

    var state = [];
    for( var y=0; y<this.screenCH(); y++ ) {
      for( var x=0; x<this.screenCW(); x++ ) {
        var c=this.getFullChar(x,y);
        state.push( c );
      }
    }
    return state;

  }



  setFullChar(x,y,c) {

    var s = this.screen;

    s.setCharCode(    x, y, c[2] );
    s.setCharColor(   x, y, c[3] );
    s.setCharBGColor( x, y, c[4] );
    s.setDBCharCode(  x, y, c[5] );
    s.setDBCharColor( x, y, c[6] );

  }

  getFullChar(x,y) {
    var s = this.screen;
    return [
      x, y,
      s.getCharCode(x,y),
      s.getCharColor(x,y),
      s.getCharBGColor(x,y),
      s.getDBCharCode(x,y),
      s.getDBCharColor(x,y)
    ];
  }

  fill( x, y, brush, flags ) {

    this.fillStack=[];
    this.fillStack.push( [x,y] );

    if( flags.doubleBuffer && flags.layer==1 ) {
      this.screen.setLayer( 1 );
    }
    else {
      this.screen.setLayer( 0 );
    }

    var char = this.screen.getLayerChar( x, y );
    console.log("fill all these chars" , char, x, y);


    var col = this.screen.getLayerCol( x, y );
    var bcol = this.screen.getCharBGColor( x, y );
    if( char != brush.drawCode || col != brush.drawColor || col != brush.bgColor) {
      /* don't fill if the result will be the same as the current state (fillchar == char_under_cursor)*/
      this.fillUndo = [];
      this.fill2Count = 0;
      this.fill2( char, col, bcol, brush );
      this._pushUndoRaw( this.fillUndo );
      this.fillUndo = null;
      console.log("entered fill2 " + this.fill2Count );
    }

    this.screen.renderDisplay();
  }


  fill2(  char, col, bcol, brush  ) {

    var stack = this.fillStack;

    if( stack.length > 0) {

        this.fill2Count++;

        var pos=stack.pop();
        var x,y;
        x=pos[0]; y=pos[1];

        var undoChar = this.getFullChar( x,y );
        this.fillUndo.push( undoChar );
        console.log("Pushed", undoChar);

        this.screen.setLayerCol( x, y, brush.drawColor );
        this.screen.setCharBGColor( x, y, brush.bgColor );
        this.screen.setLayerChar( x, y, brush.drawCode );

        var upc,upbc,up = -1;
        if( y>0) {
          up = this.screen.getLayerChar( x, y-1 );
          upc = this.screen.getLayerCol( x, y-1 );
          upbc = this.screen.getCharBGColor( x, y-1 );
        }
        var downc,downbc,down = -1;
        if( y<this.screen.cH-1) {
          down = this.screen.getLayerChar( x, y+1 );
          downc = this.screen.getLayerCol( x, y+1 );
          downbc = this.screen.getCharBGColor( x, y+1 );
        }
        var leftc,leftbc,left = -1;
        if( x>0) {
          left = this.screen.getLayerChar( x-1, y );
          leftc = this.screen.getLayerCol( x-1, y );
          leftbc = this.screen.getCharBGColor( x-1, y );
        }
        var rightc,rightbc, right = -1;
        if( x<this.screen.cW-1) {
          right = this.screen.getLayerChar( x+1, y );
          rightc = this.screen.getLayerCol( x+1, y );
          rightbc = this.screen.getCharBGColor( x+1, y );
        }

        if( up == char && upc == col && upbc == bcol ) {
          this.fillStackPush( [ x, y-1, "up"] );
        }

        if( down == char && downc == col && downbc == bcol) {
          this.fillStackPush( [ x, y+1, "down"] );
        }

        if( left == char && leftc == col && leftbc == bcol) {
          this.fillStackPush( [ x-1, y, "left"] );
        }

        if( right == char && rightc == col && rightbc == bcol) {
          this.fillStackPush( [ x+1, y, "right"] );
        }

        this.fill2( char, col, bcol, brush );
    }
  }

  fillStackPush( newEl ) {
    var stack = this.fillStack;

    for( var i=0; i<stack.length; i++ ) {
      var el = stack[i];

      if( el[0] == newEl[0] && el[1] == newEl[1] ) {
        return;
      }
    }

    stack.push( newEl );
  }
  /*
  fillCol( x, y ) {

    var stack=[];
    stack.push( [x,y] );

    if( this.doubleBuffer && this.layer==1 ) {
      this.screen.setLayer( 1 );
    }
    else {
      this.screen.setLayer( 0 );
    }

    var col = this.screen.getLayerCol( x, y );
    if( col != this.drawColor ) {
      this.fillCol( stack, col );
    }

    this.screen.renderDisplay();
  }


  fillCol2( stack, col  ) {
    if( stack.length > 0) {
        var pos=stack.pop();
        var x,y;
        x=pos[0]; y=pos[1];
        scr.setLayerCol( x, y, this.drawColor );

        var upc,up = -1;
        if( y>0) {
          upc = this.screen.getLayerCol( x, y-1 );
        }
        var downc,down = -1;
        if( y<this.screen.cH-1) {
          downc = this.screen.getLayerCol( x, y+1 );
        }
        var leftc,left = -1;
        if( x>0) {
          leftc = this.screen.getLayerCol( x-1, y );
        }
        var rightc,right = -1;
        if( x<this.screen.cW-1) {
          rightc = this.screen.getLayerCol( x+1, y );
        }

        if( upc == col ) {
          stack.push( [ x, y-1] );
        }

        if( downc == col ) {
          stack.push( [ x, y+1] );
        }

        if( leftc == col ) {
          stack.push( [ x-1, y] );
        }

        if( rightc == col ) {
          stack.push( [ x+1, y] );
        }

        this.fillCol2( stack, col );
    }
  }
  */
}
