function __PetsciiCtrStrLen( str ) {
  var dcontrol = String.fromCharCode( 16 );
  var l=0;
  for (var i = 0; i < str.length; i++) {
    if( str.charAt(i) != dcontrol ) {
      l ++;
    }
  }
  return l;
}

class PetsciiButton{

  constructor( x, y, text, length, callback, callbackdata ) {

    this.x = x;
    this.y = y;
    this.text = text;
    this.length = length;
    this.callback = callback;
    this.callbackdata = callbackdata;
    this.hilite=false;

    this.setText( text );

  }

  setCallBackData( callbackdata ) {
    this.callbackdata = callbackdata;
  }

  setText( text ) {
    this.text = text;
    if( __PetsciiCtrStrLen( this.text ) > this.length )  {
      this.text = this.text.substring(0, this.length );
    }
    else  {
      while( __PetsciiCtrStrLen( this.text )  < this.length) {
        this.text=this.text+" ";
      }
    }
  }

  hiLight( val ) {
    this.hilite = val;
  }

  /*renderDimensions() {
    return {
      x0: this.x,
      y0: this.y-1,
      x1: this.x+this.length,
      y1: this.y
    }
  }*/


  clear( scr ) {

    var l=this.length;
    var i;

    for(i=0; i<l; i++) {
      scr.setCharCode( this.x+i,this.y, 32 );
      scr.setCharCode( this.x+i,this.y-1, 32 );
    }
  }

  render( scr ) {

    var highlightUp = this.y>0;

    var l=this.length;
    var i;

    if( highlightUp ) {
      scr.setCursorPos( this.x, this.y-1 );
      for(i=0; i<l; i++) {
         scr.writeChar3( 0x6f );
      }
    }

    scr.setCursorPos( this.x, this.y );
    scr.writeStringInverse( this.text );
    var c=14;
    if( this.hilite ) {
      c=1;
    }
    for(i=0; i<l; i++) {
      if( highlightUp ) { scr.setCharColor( this.x+i,this.y-1, c ); }
      scr.setCharColor( this.x+i,this.y, c );
    }
  }

  isOn(x,y) {
    if( x>= this.x && y==this.y && x<=this.x+this.length) {
      return true;
    }
    return false;
  }

  onClick( x, y, mode, gui  ) {
    this.callback.object[this.callback.method]( this.callbackdata );
  }

  onMove(x,y) {

  }

}

class PetsciiArea {

    constructor( x, y ) {

      this.x = x;
      this.y = y;
      this.enabled=false;
      this.widgets = [];
    }

    addWidget( b ) {
      this.widgets.push( b );
      b.x += this.x;
      b.y += this.y;
    }

    hiLight( val ) {
      //Cannot hilite an Area
    }


    render( scr ) {
      console.log("area:render");
      if( this.enabled ) {
        console.log("area:render.enabled");
        for(var i=0; i<this.widgets.length; i++) {
          this.widgets[i].render( scr );
        }
      }
    }

    isOn(x,y) {
      if( !this.enabled ) { return false; }

      for(var i=0; i<this.widgets.length; i++) {
        if( this.widgets[i].isOn( x, y )) {
          return true;
        }
      }
      return false;
    }

    onClick( x, y, mode, gui ) {
      if( !this.enabled ) { return; }
      var w=null;
      for(var i=0; i<this.widgets.length; i++) {
        if( this.widgets[i].isOn( x, y )) {
          w=this.widgets[i];
          break;
        }
      }
      if( w!= null )  {
        w.onClick( x, y, mode, gui );
      }
    }

    onMove(x,y) {

    }

    clear( scr ) {
      for(var i=0; i<this.widgets.length; i++) {
        var d=this.widgets[i].clear( scr );
      }
    }

    enable( flag, scr ) {

      if( flag ) {
        this.enabled=true;
        return;
      }

      this.enabled=false;
      var x0,x1,y0,y1;
      x0=this.x; x1=x0;
      y0=this.y; y1=y0;

      this.clear( scr );

    }

}


class PetsciiToggleButton extends PetsciiButton {

  constructor( x, y, text, length, callback, callbackdata, toggleId, isDefault ) {

      super( x, y, text, length, callback, callbackdata );
  		this.toggleId = toggleId;
      this.toggleSelected = isDefault;
  	}

    clear( scr ) {

    super.clear( scr );
    scr.setCharCode( this.x-1,this.y, 32 );
    //scr.setCharCode( this.x-1,this.y-1, 32 );
    }


  render( scr ) {

    var l=super.hiLight( this.toggleSelected );
    super.render( scr );
    var char = 0x6c, col=14, char2=100;
    if( this.toggleSelected ) {
      char = 0x6c;
      col=5;
    }
    scr.setCharCode( this.x-1,this.y, char );
    scr.setCharColor( this.x-1,this.y, col );
    //scr.setCharCode( this.x-1,this.y-1, char2 );
    //scr.setCharColor( this.x-1,this.y-1, col );


  }

  isOn(x,y) {
    if( x>= this.x && y==this.y && x<=this.x+this.length) {
      return true;
    }
    return false;
  }

  onClick( x, y, mode, gui ) {
    gui.unToggleAll( this.toggleId );
    this.toggleSelected = true;
    this.render( gui.getScreen() );
    this.callback.object[this.callback.method]( this.callbackdata );
  }

  onMove(x,y) {

  }

}



class PetsciiGUI {

	 constructor( screen  ) {
     this.screen = screen;
     this.widgets = [];

   }

   controlChar( x, inverse ) {
     var str = String.fromCharCode( 16 );
     var code = x;
     if( inverse ) {
       if( code < 128 ) {
         code += 128;
       }
       else {
         code -= 128;
       }
     }
     str += String.fromCharCode( code );
     return str;
   }



   getScreen() {
     return this.screen;
   }

   addWidget( w ) {
     this.widgets.push( w );
     //w.fixTextLen( this );
   }

   render() {
     for( var i=0; i < this.widgets.length; i++ ) {
      this.widgets[i].render( this.screen );
     }
   }

   onClick( x, y, mode ) {

     var w=null;
     for(var i=0; i<this.widgets.length; i++) {
       if( this.widgets[i].isOn( x, y )) {
         w=this.widgets[i];
         break;
       }
     }
     if( w!= null )  {
       w.onClick( x, y, mode, this );
     }
   }


   unToggleAll( id ) {
     this.unToggleMore( id, this );
   }


   unToggleMore( id, w ) {

     for( var i=0; i < w.widgets.length; i++ ) {

      if( w.widgets[i].toggleSelected != undefined && id == w.widgets[i].toggleId ) {

        w.widgets[i].toggleSelected = false;
        w.widgets[i].render( this.screen );
      }
      if( w.widgets[i].widgets != undefined ) {

        this.unToggleMore( id, w.widgets[i] );
      }
     }
   }

 }
