class Petscii {

  constructor( font ) {

    this.match = [];

    for( var i=0; i< font.iconsContext.length; i++) {
        var data = font.iconsContext[i].getImageData(0, 0, 8, 8 ).data;

        var buf = new Array();

        for( var j=0; j< data.length; j+=4) {
          if( data[ j ] > 128 ) {
            buf.push( 1 );
          }
          else { buf.push( 0 ); }
        }

        this.match.push( buf );
    }
  }


  int_mix(a, b, v)
	{
		return (1-v)*a + v*b;
	}

  RGBtoHSV (r, g, b) {
	    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
	    rabs = r / 255;
	    gabs = g / 255;
	    babs = b / 255;
	    v = Math.max(rabs, gabs, babs),
	    diff = v - Math.min(rabs, gabs, babs);
	    diffc = c => (v - c) / 6 / diff + 1 / 2;
	    percentRoundFn = num => Math.round(num * 100) / 100;
	    if (diff == 0) {
	        h = s = 0;
	    } else {
	        s = diff / v;
	        rr = diffc(rabs);
	        gg = diffc(gabs);
	        bb = diffc(babs);

	        if (rabs === v) {
	            h = bb - gg;
	        } else if (gabs === v) {
	            h = (1 / 3) + rr - bb;
	        } else if (babs === v) {
	            h = (2 / 3) + gg - rr;
	        }
	        if (h < 0) {
	            h += 1;
	        }else if (h > 1) {
	            h -= 1;
	        }
	    }
	    return {
	        h: Math.round(h * 360),
	        s: percentRoundFn(s * 100) / 100,
	        v: percentRoundFn(v * 100) / 100
	    };
	}

  /*
		This function expects 0<=H<=360, 0<=S<=1 and 0<=V<=1 and returns an object that contains R, G and B
		See HSV image: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:HSV_color_solid_cylinder_saturation_gray.png
		H = Hue				(Spectrum of the rainbow, divided in 360 steps)
		S = Saturation		(0 is gray, 1 is fully saturated color)
		V = Value 			(0 is black, 1 is fully bright color)
	*/
	HSVtoRGB(H, S, V)
	{
		var V2 = V * (1 - S);
		var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? this.int_mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? this.int_mix(V2,V,(H-240)/60) : 0)));
		var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? this.int_mix(V2,V,H/60) : ((H>=180 && H<=240) ? this.int_mix(V,V2,(H-180)/60) : 0)));
		var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? this.int_mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? this.int_mix(V,V2,(H-300)/60) : 0)));

		return {
			r : Math.round(r * 255),
			g : Math.round(g * 255),
			b : Math.round(b * 255)
		};
	}


  analyzeCells( data, w, CW, CH ) {

    var rowSize = w*4;
    var yoffset = 0;
    var yoffset2 = rowSize * 4;
    var yoffsetmin = 0;

    var blocks = [];
    var bp=0;

    for( var Y=0; Y<CH; Y++ ) {
      for( var X=0; X<CW; X++) {

        var analyze = new Object();

        analyze.buffer1 =
          new Uint8Array( 8*8  );

        analyze.buffer2 =
            new Uint8Array( 8*8  );

        var bi=0;
        for( var YY=0; YY<8; YY++ ) {
          for( var XX=0; XX<8; XX++) {
            var yoff =
              yoffset + ( YY *  rowSize );
            var xoff =
              (X * 4 * 8) + ( XX * 4 );

            analyze.buffer1[ bi ] =  data[ yoff + xoff ];
            analyze.buffer2[ bi ] =  data[ yoff + xoff +1];
            bi++;
          }
        }

        var offset =  yoffset  + (X * 4 * 8)  + ( 7*4 );
        var offset2 = yoffset  + (X * 4 * 8);

        yoffset2 = yoffset + (rowSize * 7);
        var offset3 = yoffset2 + (X * 4 * 8)  + ( 7*4 );
        var offset4 = yoffset2 + (X * 4 * 8) ;

        var ii,jj,kk, ll;
        ii = data[ offset  ]; //right top
        jj = data[ offset2 ]; //left  top
        kk = data[ offset3 ]; //right below
        ll = data[ offset4 ]; //left below

        analyze.rt = ii;
        analyze.lt = jj;
        analyze.rb = kk;
        analyze.lb = ll;

        blocks[ bp ] = analyze;
        bp++;
      }
      yoffset+= ( rowSize * 8 );
      //yoffset2+= ( rowSize * 8 );
    }

    return blocks;
  }


  getTop3UsedColors( analyze ) {

    var colorCounts = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    var i;

    var top1=0, top2=0, top3=0;
    var top1ix=-1, top2ix=-1, top3ix=-1;

    // mark down how often color indexes are counted
    for( i=0; i<64; i++) /*64 pixels in the buffer, 8x8 image */ {

      var index = analyze.buffer1[ i ];
      colorCounts[index]++;

    }

    //find the most often happening color index
    for( i=0; i<16; i++) {
      var s = colorCounts[i];
      if( s > top1 ) {
        top1 = s;
        top1ix = i;
      }
    }
    //find the next most often happening  color index
    for( i=0; i<16; i++) {
      var s = colorCounts[i];
      if( s > top2 && top1ix != i ) {
        top2 = s;
        top2ix = i;
      }
    }
    //find the next most often happening  color index
    for( i=0; i<16; i++) {
      var s = colorCounts[i];
      if( s > top3 && top1ix != i && top2ix != i ) {
        top3 = s;
        top3ix = i;
      }
    }

    var max = 64;

    //
    //var p1,p2,p3; TODO, how to quantify the percentages when they don't add up to 100
    //
    //  idea 1 -> bunch "other colors", up to third color, but then it could be top 1 color
    //    and ideally, you want it as background color
    //    which could be ok-ish
    //
    //  idea 2 -> bunch to top color.

    return {
      c1: {
        index: top1ix,
        percent: ( top1 / max ) * 100
      },
      c2: {
        index: top2ix,
        percent: ( top2 / max ) * 100
      },
      c3: {
        index: top3ix,
        percent: ( top3 / max ) * 100
      }
    };
  }

  matchChar( buffer0, buffer1, cindex ) {

    var i, count = 0;

    for( i=0; i<64; i++ ) {
      if( buffer0[i] > 0 ) {
        if( buffer1[i] == cindex ) {
          count++;
        }
        else {
          count--;
        }
      }
      else {
        if( buffer1[i] != cindex ) {
          count++;
        }
        else {
          count--;
        }
      }
    }

    return count;
  }

  bestMatchingChar( buffer, cindex ) {
    var scores = [];

    var i;
    for( i=0; i<this.match.length; i++ ) {
      scores[ i ] = this.matchChar( this.match[ i ], buffer, cindex );
    }

    var top = -9999;
    var topIndex=0;

    for( i=0; i<this.match.length; i++ ) {
      if( scores[ i ] > top ) {
        top = scores[ i ];
        topIndex = i;
      }
    }
    return topIndex;

  }


  convertBitmap8x8ToChar_dither( analyze, options ) {

    var max = 64;
    var top = this.getTop3UsedColors( analyze );

    var mode3col = false;
    var mode2col = false;
    var mode1col = false;

    var dither = 0x5c; //102 =squares,98,37=percent, 104=hhsquares, 0x5c vhsquares
    var dithercol = analyze.buffer2[32];


    if( top.c2.percent > 15 ) {
      mode2col = true;
    }
    else {
      mode1col = true;
    }

    if( mode1col ) {
      return {
        c: dither,
        ccol: dithercol,
        bcol: top.c1.index,
        lc:-1,
        lcol:-1
      }
    }
    else {

      var bmc2 = this.bestMatchingChar( analyze.buffer1, top.c2.index );

      return {
        c: dither,
        ccol: dithercol,
        bcol: top.c1.index,
        lc: bmc2,
        lcol:top.c2.index
      }

    }
  }


  convertBitmap8x8ToChar_dither0( analyze, options ) {

    var max = 64;
    var top = this.getTop3UsedColors( analyze );

    var mode3col = false;
    var mode2col = false;
    var mode1col = false;

    var dither = 0x5c; //102 =squares,98,37=percent, 104=hhsquares, 0x5c vhsquares
    var dithercol = analyze.buffer2[32];


    if( top.c2.percent > 15 ) {
      mode2col = true;
    }
    else {
      mode1col = true;
    }

    if( mode1col ) {
      return {
        c: dither,
        ccol: dithercol,
        bcol: top.c1.index,
        lc:-1,
        lcol:-1
      }
    }
    else {

      var bmc2 = this.bestMatchingChar( analyze.buffer1, top.c2.index );

      return {
        c: dither,
        ccol: dithercol,
        bcol: top.c1.index,
        lc: bmc2,
        lcol:top.c2.index
      }

    }
  }

  convertBitmap8x8ToChar_std( analyze, options ) {

    var max = 64;
    var top = this.getTop3UsedColors( analyze );

    var mode3col = false;
    var mode2col = false;
    var mode1col = false;

    var dither = 37; //102 =squares,104,98,37=percent
    if( ! options.dither ) {
      dither = 32;
    }
    var dithercol = analyze.buffer2[32];

    if( top.c3.percent > 5 ) {
      mode3col = true;
    }
    else {
      if( top.c2.percent > 15 ) {
        mode2col = true;
      }
      else {
        mode1col = true;
      }
    }

    if( mode1col ) {


      return {
        c: dither,
        ccol: dithercol,
        bcol: top.c1.index,
        lc:-1,
        lcol:-1
      }
    }

    if( mode2col ) {

      var bmc = this.bestMatchingChar( analyze.buffer1, top.c1.index );

/*      return {
        c: 0x57,
        ccol: 2,
        bcol: 0,
        lc:-1,
        lcol:-1
      }
*/
      return {
        c: bmc,
        ccol: top.c1.index,
        bcol: top.c2.index,
        lc:-1,
        lcol:-1
      }

    }

    var bmc1 = this.bestMatchingChar( analyze.buffer1, top.c1.index );
    var bmc3 = this.bestMatchingChar( analyze.buffer1, top.c3.index );
/*    return {
      c: 0x57,
      ccol: 3,
      bcol: 0,
      lc:   -1,
      lcol: -1
    }
*/

return {
  c: bmc1,
  ccol: top.c1.index,
  bcol: top.c2.index,
  lc:   bmc3,
  lcol: top.c3.index
}


  }



  convertBitmap8x8ToChar_std0( analyze, options ) {

    var max = 64;
    var top = this.getTop3UsedColors( analyze );

    var mode3col = false;
    var mode2col = false;
    var mode1col = false;

    var dither = 37; //102 =squares,104,98,37=percent
    if( ! options.dither ) {
      dither = 32;
    }
    var dithercol = analyze.buffer2[32];

    var bmc1 = this.bestMatchingChar( analyze.buffer1, top.c1.index );

    return {
      c: bmc1,
      ccol: top.c1.index,
      bcol: null,
      lc:   null,
      lcol: null
    }


  }

  convertToPetscii( blocks, w, h, paintInterface, options ) {

    var rowSize = w*4;
    var yoffset = 0;
    var yoffset3 = rowSize * 4;
    var yoffsetmin = 0;

    var CW = paintInterface.screenCols();
    var CH = paintInterface.screenRows();

    var doubleBuffer = paintInterface.screen.doubleBuffer;

    if( options.dither && doubleBuffer ) {
      this.convertBitmap8x8ToChar = this.convertBitmap8x8ToChar_dither;
    }
    else {
      this.convertBitmap8x8ToChar = this.convertBitmap8x8ToChar_std;

      if(! doubleBuffer ) {
        this.convertBitmap8x8ToChar = this.convertBitmap8x8ToChar_std0;
      }
    }

    if( doubleBuffer ) {

      var bp=0;
      for( var Y=0; Y<CH; Y++ ) {
        for( var X=0; X<CW; X++) {

          var analyze = blocks[ bp ]; bp++;

          var myChar = this.convertBitmap8x8ToChar( analyze, options );

          paintInterface.setCharBGColor( X, Y, myChar.bcol );
          paintInterface.setCharCode( X, Y,  myChar.c);//102 =squares,104,98,37=percent
          paintInterface.setCharColor( X, Y,  myChar.ccol );

          if( myChar.lc != -1)  {

            paintInterface.setDBCharCode( X, Y, myChar.lc );//102,104,98=down, 104=down squeres
            paintInterface.setDBCharColor( X, Y, myChar.lcol );

          }
          else {
            paintInterface.setDBCharCode( X, Y, 32 );//102,104,98=down, 104=down squeres
            paintInterface.setDBCharColor( X, Y, 0 );
          }
        }
      }
    }
    else {
      var bp=0;
      for( var Y=0; Y<CH; Y++ ) {
        for( var X=0; X<CW; X++) {

          var analyze = blocks[ bp ]; bp++;

          var myChar = this.convertBitmap8x8ToChar( analyze, options );

          paintInterface.setCharBGColor( X, Y, myChar.bcol );
          paintInterface.setCharCode( X, Y,  myChar.c);//102 =squares,104,98,37=percent
          paintInterface.setCharColor( X, Y,  myChar.ccol );

        }
      }
    }
  }

  convertToPreviewImage( data, w , h, colors ) {

    var yoffset = 0;
    var yoffsetmin = 0;
    var rowSize = w*4;

    var yflip=1;
    for( var y=0; y<h; y++ ) {

      var xflip=0;
      for( var x=0; x<w; x++) {

        var offset = yoffset + (x * 4);

        var r,g,b,i,j,c;

        i = data[ offset + 0];
        j = data[ offset + 1];

        if( yflip || xflip ) {
          c = colors[i];
        }
        else {
          c = colors[j];
        }

        data[ offset + 0]= c.r;
        data[ offset + 1]= c.g;
        data[ offset + 2]= c.b;

        xflip = 1-xflip;
      }
      yoffset+= ( rowSize );
      yflip = 1-yflip;

    }

  }


  convertToDebugImage2( data, w , h, colors ) {

    var yoffset = 0;
    var yoffsetmin = 0;
    var rowSize = w*4;
    //var hsvColors = this.hsvColors( colors );
    var yflip=1;
    for( var y=0; y<h; y++ ) {

      var xflip=0;
      for( var x=0; x<w; x++) {

        var offset = yoffset + (x * 4);

        var hsv = this.RGBtoHSV( data[ offset + 0], data[ offset + 1], data[ offset + 2] );
        var c;

        hsv = this.normalize( hsv, data[ offset + 0], data[ offset + 1], data[ offset + 2] );
        c = this.HSVtoRGB( hsv.h, hsv.s, hsv.v  );

        data[ offset + 0]= c.r;
        data[ offset + 1]= c.g;
        data[ offset + 2]= c.b;

        xflip = 1-xflip;
      }
      yoffset+= ( rowSize );
      yflip = 1-yflip;

    }

  }


  clampToPalette( data, w , h, colors, options ) {

    var yoffset = 0;
    var yoffsetmin = 0;
    var rowSize = w*4;
    var hsvColors = this.hsvColors( colors );

    for( var y=0; y<h; y++ ) {

      for( var x=0; x<w; x++) {

        var offset = yoffset + (x * 4);

        var r,g,b;

        r = data[ offset + 0];
        g = data[ offset + 1];
        b = data[ offset + 2];

        var cols = this.clampColorToPalette( r, g , b, colors, hsvColors, options );

        data[ offset + 0]= cols[0];
        data[ offset + 1]= cols[1];
        data[ offset + 2]= 0;

      }
      yoffset+= ( rowSize );
    }
  }

  hsvColors( colors ) {

    var hsvColors = [];

    for( var i=0; i<16; i++ ) {

      var c = colors[ i ];

      hsvColors[ i ] = this.RGBtoHSV(c.r,c.g,c.b);

    }

    return hsvColors;
  }

  clamp01( x ) {
    if( x < 0 ) { return 0;}
    if( x > 1 ) { return 1;}
    return x;
  }

  normalize( hsv, r, g, b, options ) {

    var sfact = options.saturationContrast;//(256- b)/43;
    var sextra = Math.abs( (1-(sfact))/2 );

    var vfact;
    var vextra;


    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    //console.log( "v1: " + v);

    //add contrast

    if(options.contrast < 1 ) {
      v = ( ((v -.5) * options.contrast)+.5);
      if( v < 0 || v > 1 ) {
        console.log("oopsi");
      }

      v = this.clamp01( ((v -.5) * options.contrast)+.5);
    }
    else
    {
      vfact = options.contrast;//(256- b)/43;
      vextra = Math.abs( (1-(vfact))/2 );

      v = this.clamp01( (v * vfact)-vextra );
    }
    s = this.clamp01( (s * sfact)-sextra );

    s = this.clamp01( s * options.saturationMultiply );

    //console.log( "v2: " + v);


    return {
      h: h, s: s, v: v
    }
    /*

      example 2x

      0 -> 0   (0-.5) clamp-> 0
      1 -> 1   (2-.5) clamp-> 1
      .5 -> .5 (3 - 2.5 )
      .4 -> .3 (.8-.5)
      .6 -> .8 (1.2 - .5)
    */

  }

  clampColorToPalette( r, g, b, colors, hsvcolors, options ) {
    var bestMatch = 0;
    var bestDist = {all:999999};
    var bestMatch2 = 0;
    var bestDist2 = {all:999999};

    var hsvCurrent = this.RGBtoHSV(r,g,b);
    var rgbCurrent;
    rgbCurrent = { r:r, g:g, b:b };
    hsvCurrent = this.normalize( hsvCurrent, r,g,b, options ); //TODO outcomment
    //-----------------------------------------------------------------------
    rgbCurrent = this.HSVtoRGB( hsvCurrent.h, hsvCurrent.s, hsvCurrent.v );

    for( var i=0; i<16; i++ ) {
      var hsv_from_palette = hsvcolors[i];
      var rgb_from_palette = colors[i];

      var distances = this.getColorDistance(
          hsvCurrent, rgbCurrent,
          hsv_from_palette, rgb_from_palette );

      if( distances.all < bestDist.all ) {
        bestDist = distances;
        bestMatch = i;
      }
    }

    for( var i=0; i<16; i++ ) {
      var hsv_from_palette = hsvcolors[i];
      var rgb_from_palette = colors[i];

      var distances = this.getColorDistance(
          hsvCurrent, rgbCurrent,
          hsv_from_palette, rgb_from_palette );

      if( distances.all < bestDist2.all && i!= bestMatch) {
        bestDist2 = distances;
        bestMatch2 = i;
      }
    }

    if( bestDist2.all < bestDist.all * 2.5 ) {
      //second best  target color not much bigger distance from source color
    }
    else {
      bestMatch2 = bestMatch;
    }

    //return [0,0];
    return [bestMatch,bestMatch2];

  }

  getColorDistance( hsv0, rgb0, hsv, rgb ) {

    var dh = Math.abs(hsv0.h - hsv.h) ;// * 92;
    if(dh>180)  {dh=dh-180;}
    //if(dh>180)  {console.log(" error " + (hsv0.h - hsv.h));}
    dh=dh / 180;

    var ds = Math.abs(hsv0.s - hsv.s) / 4 ;
    var dv = Math.abs(hsv0.v - hsv.v) / 2;

    var dr = Math.abs(rgb0.r - rgb.r)*1.0;
    var dg = Math.abs(rgb0.g - rgb.g)*2.3;
    var db = Math.abs(rgb0.b - rgb.b)*1.1;

    dh*=2;
    ds*=0.5;
    dv*=1;

    var dHSV  = Math.sqrt( (dh*dh )+ (ds * ds) + (dv * dv) );
    var d  = Math.sqrt( dr * dr + dg * dg + db * db );

    return {all:(dHSV + d)/2, h:0, s:0, v:0}  ;

  }


}
