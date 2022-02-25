class ImgUploader {

	constructor ( control ) {
		this.control = control;
	}

	handleEvent(evt) {
		console.log("handleEvent " + evt.type);
		switch(evt.type) {
		case "change":
			console.log("--------------handle upload event");
			console.log(evt);
			this.handleUpload( evt );

		break;
		}
	}

	handleUpload(e){

		var reader = new FileReader();

		var thisFileName = e.target.files[0].name;
		var isBrush = this.isBrush;
		var isTraceImage = this.isTraceImage;
		var isImport = this.isImport;
		var isPetsciiImage = this.isPetsciiImage;
		var isPetsciiMovie = this.isPetsciiMovie;
		var _this = this;

		if(  isPetsciiImage  ) { //PETSCII
			reader.onload = function(event){

				console.log("reader onload " + thisFileName);


				var bytes = new Uint8Array(event.target.result);//petscii
				console.log( bytes );//petscii

				_this.control.onLoad( bytes );

			}

			console.log("read " + e.target.files[0]);
			console.log(e.target.files[0]);
			reader.readAsArrayBuffer(e.target.files[0]); //petscii
		}
		if(  isPetsciiMovie  ) { //PETSCII Movie
			reader.onload = function(event){

				console.log("mreader onload " + thisFileName);


				var bytes = new Uint8Array(event.target.result);//petscii
				console.log( bytes );//petscii

				_this.control.onLoadMovie( bytes );

			}

			console.log("read " + e.target.files[0]);
			console.log(e.target.files[0]);
			reader.readAsArrayBuffer(e.target.files[0]); //petscii
		}
		else if( isTraceImage ) {
			console.log("load image");
			this.handleImageUpload( e );
		}
		else if( isImport ) {
			console.log("load Import");
			this.handleImportUpload( e );
		}

	}

	handleImportUpload(e){

		var reader = new FileReader();
		var thisFileName = e.target.files[0].name;

		var _this = this;
		reader.onload = function(event){

			console.log("reader onload " + thisFileName);

			var img = new Image();

			img.onload = function(){


				console.log("image onload ");

				_this.control.onBitmapImport( img );

			}

			console.log( event.target.result );
			img.src = event.target.result;
		}

		console.log("read " + e.target.files[0]);
		console.log(e.target.files[0]);
		reader.readAsDataURL(e.target.files[0]); //this is the original


	}

	handleImageUpload(e){

		var reader = new FileReader();
		var thisFileName = e.target.files[0].name;

		var _this = this;
		reader.onload = function(event){

			console.log("reader onload " + thisFileName);

			var img = new Image();

			img.onload = function(){


				console.log("image onload ");

				_this.control.setImage( img );

			}

			console.log( event.target.result );
			img.src = event.target.result;
		}

		console.log("read " + e.target.files[0]);
		console.log(e.target.files[0]);
		reader.readAsDataURL(e.target.files[0]); //this is the original

		//reader.readAsArrayBuffer(e.target.files[0]); //petscii
	}
}




class ImportExport  {


    constructor( _imageLoader, _imageSaver, _control ) {

		this.imageLoader = _imageLoader;
		this.imageSaver = _imageSaver;
		this.imgUploader = new ImgUploader( _control );
		//this.clipBoardImporter = new CLIPBOARD_CLASS(true, _bus);

	}

	downloadURI(uri, name) {

		  var link = document.getElementById( this.imageSaver );

		  link.download = name;
		  link.href = uri;
		  link.click();
		  //https://stackoverflow.com/questions/8863940/how-to-force-chrome-display-a-save-as-dialog-when-i-click-a-download-link
		  //http://danml.com/download.html

	}

	dataPresentation( byte, format ) {
		if( format == 'decimal' ) {
			return byte;
		}
		else if( format == 'hexadecimal' ) {
			var hex = byte.toString( 16 ).toUpperCase();
			if (hex.length < 2) {
				hex = "0" + hex;
			}
			return "$" + hex;
		}
		else if( format == 'chexadecimal' ) {
			var hex = byte.toString( 16 );
			if (hex.length < 2) {
				hex = "0" + hex;
			}
			return "0x" + hex;
		}

		return "?undefined?" + byte
	}


	printbasic( dataPresentation, bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii ) {

		var lineNr = 5000;
		var firstOnLine = true;
		var bytes = "";
		var onLineCount = 17;
		var onLineCounter = 0;

		var byteArrayList = [ bytes0, bytes1 ];

		bytes = lineNr + " REM PETSCII DATA: " + name + ", " + cW + "x" + cH + ", COLDATA=" + saveColors + ", DBUFFER=" + doublePetscii;
		lineNr++;


		for( var h=0; h<2; h++ ) {

				var bytesArr = byteArrayList[ h ];
				if( bytesArr == null ) {
					return null;
				}

				if( h==1 ) {
					bytes = bytes + "\n" + lineNr + " REM "+name+" BUFFER 2 ------";
					lineNr++;
					firstOnLine = true;
					onLineCounter = 0;
				}

				for( var i=0; i<bytesArr.length; i++ ) {
					var byte = bytesArr[ i ];
					if( firstOnLine ) {
						bytes = bytes + "\n" + lineNr + " DATA ";
						lineNr++;
					}

					if( !firstOnLine ) { bytes = bytes + ","; }
					bytes = bytes + this.dataPresentation( byte, dataPresentation );

					firstOnLine = false;

					onLineCounter = onLineCounter + 1;
					if( onLineCounter >= onLineCount ) {
						onLineCounter = 0;
						firstOnLine = true;
					}
				}

		}

		console.log( bytes );

		/*
		var imageTxtOut = document.getElementById( "exporttxt" ); //this.imageLoader );
		var imageTxtOutData = document.getElementById( "exporttxtdata" ); //this.imageLoader );
		imageTxtOut.removeAttribute("hidden");
		imageTxtOutData.value = bytes;

		booter.releaseRMB();
		*/
	}

	print( dataPresentation, bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii ) {
		this.printc(
			dataPresentation, bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii
		);
	}

	printc( dataPresentation, bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii )
	{

		var lineNr = 5000;
		var firstOnLine = true;
		var bytes = "";
		var onLineCount = 17;
		var onLineCounter = 0;

		var byteArrayList = [ bytes0, bytes1 ];

		bytes = "// PETSCII DATA: " + name + ", " + cW + "x" + cH + ", COLDATA=" + saveColors + ", DBUFFER=" + doublePetscii;
		lineNr++;
		var interLaceColor = 0;

		for( var h=0; h<2; h++ ) {

				var bytesArr = byteArrayList[ h ];
				if( bytesArr == null ) {
					if( h == 1 ) { break; }
					return null;
				}

				if( h==1 ) {
					bytes = bytes + "\n// "+name+" BUFFER 2 ------\n";
					lineNr++;
					firstOnLine = true;
					onLineCounter = 0;
				}

				for( var i=0; i<bytesArr.length; i+=(1) ) {  //+interLaceColor) ) {
					var byte = bytesArr[ i ];
					if( firstOnLine ) {
						bytes = bytes + ",\n  ";
						lineNr++;
					}

					if( !firstOnLine ) { bytes = bytes + ","; }
					bytes = bytes + this.dataPresentation( byte, dataPresentation );

					firstOnLine = false;

					onLineCounter = onLineCounter + 1;
					if( onLineCounter >= onLineCount ) {
						onLineCounter = 0;
						firstOnLine = true;
					}
				}

				/*if( interLaceColor ) {
					for( var i=1; i<bytesArr.length; i+=2 ) {
						var byte = bytesArr[ i ];
						if( firstOnLine ) {
							bytes = bytes + ",\n  ";
							lineNr++;
						}

						if( !firstOnLine ) { bytes = bytes + ","; }
						bytes = bytes + this.dataPresentation( byte, dataPresentation );

						firstOnLine = false;

						onLineCounter = onLineCounter + 1;
						if( onLineCounter >= onLineCount ) {
							onLineCounter = 0;
							firstOnLine = true;
						}
					}
				}*/
		}

		document.getElementById( 'exporttxt' ).removeAttribute("hidden");
		document.getElementById( 'mainconsole' ).setAttribute('hidden','true');
		document.getElementById( "exporttxtdata" ).value = bytes;
		document.getElementById( "exporttxtdata" ).focus();
		document.getElementById( "exporttxtdata" ).select()
	}


compress( bytes ) {

	/*
		literal run: xx1 aa bb dd aa dd
		repeat run short: xx2 aa bb dd aa dd
		repeat run long : xx3 xx4 xx5 aa bb dd aa dd

		xx1 = 0  -> 8 character uncompressed
		xx2 = 8  -> 254 (8 to 254 chars RLE)
		xx3 = 255 xx4=ln xx5=hn (255 to 65535 chars RLE)

	*/

	var tmp = [];

	var i=0, cnt, c;
	while( i < bytes.length )  {

			c = bytes[ i ];

			cnt=1;i++;
			while( cnt<255 && bytes[i] == c && i<bytes.length) {
				cnt++;i++;
			}

			if( cnt<16 ) {
				var j;
				tmp.push(0);
				for( j=0; j<cnt; j++) {
					tmp.push( c );
				}
				for( ; j<16; j++) {
					tmp.push( bytes[i++] );
				}
			}
			else {
				tmp.push(cnt);
				tmp.push( c );
			}

		}
	}


	rleEncode( bytes ) {

		/*
			literal run: xx1 aa bb dd aa dd
			repeat run short: xx2 aa bb dd aa dd
			repeat run long : xx3 xx4 xx5 aa bb dd aa dd

			xx1 = 0  -> 8 character uncompressed
			xx2 = 8  -> 254 (8 to 254 chars RLE)
			xx3 = 255 xx4=ln xx5=hn (255 to 65535 chars RLE)

		*/

		var tmp = [];

		var i=0, cnt, c, start;
		while( i < bytes.length )  {

			c = bytes[ i ];
			start = i;

			cnt=1;i++;
			while( cnt<255 && bytes[i] == c && i<bytes.length) {
				cnt++;i++;
			}

			if( cnt<8 ) {
				i = start;
				tmp.push(0);tmp.push(255);tmp.push(255);tmp.push(0);
				tmp.push(0)

				for( j=0; j<cnt; j++) {
					tmp.push( c );
				}
				for( ; j<4; j++) {
					tmp.push( bytes[i++] );
				}
			}
			else {
				tmp.push(cnt);
				tmp.push( c );
			}

		}

	var scrArray = new Int8Array( tmp.length );

	for( var j=0; j<tmp.length; j++) {
		scrArray[ j ] = tmp[ j ];
	}

	return scrArray;

}


makeBinArrayFrames( frames,name, cW, cH,
											saveColors,
											singleBGCol,
											mulicolBG,
											doublePetscii,
										 	compressionFlags ) {

		/*

				Frame has potentially buffers a frame looks like this:
				[
					bytes0, bytes
				]

				Buffer Explenations

				bytes0[y,x,type]
					type = 0 -> char
					type = 1 -> char color
					type = 2 -> dirty flag
					type = 3 -> bg color

				bytes1[y,x,type] (double buffer)
					type = 0 -> char
					type = 1 -> char color
					type = 2 -> dirty flag

				scenarios
					-->single bg, single layer
							char,col

					-->multi bg, single layer
						char, col, bgcol

					-->multi bg, multi layer
						char, col, bgcol
						char2, col2
		*/

		var header = new Int8Array( 16 );

		header[0] = 'M'.charCodeAt(0);
		header[1] = 'P'.charCodeAt(0);
		header[2] = 'E'.charCodeAt(0);
		header[3] = 'T'.charCodeAt(0);
		header[4] = 'S'.charCodeAt(0);
		header[5] = 'C'.charCodeAt(0);
		header[6] = 'I'.charCodeAt(0);
		header[7] = 'I'.charCodeAt(0);

		header[8] = cW;
		header[9] = cH;
		var mode = 0;
		if( saveColors )        { mode +=1 } //if any color information is stored
		if( mulicolBG  ) 				{ mode +=2 }
		if( doublePetscii ) 		{ mode +=4 }
		header[10] = mode;
		header[11] = 0; //single bgcolor
		if( !mulicolBG ) {
				header[11] = singleBGCol;
		}

		var len = frames.length;

		header[12] = 'N'.charCodeAt(0);
		if( compressionFlags.compress ) {
			header[12] = 'R'.charCodeAt(0);
		}
		header[13] = 0;
		header[14] = 0;
		header[15] = 0;

		console.log("Header prepared " , header );

		var barrays=[];
		barrays.push( header );

		if( true ) {

			console.log("Export: MultiBG:"+mulicolBG+" + Double Petscii: " + doublePetscii);
			console.log("---------------------------------");

			var typeNames = [] ;
			typeNames.push("char code");
			typeNames.push("color codes (combined)");
			typeNames.push("db char code");
			typeNames.push("db color code");

			//Normalize
			//When a char cannot be seen, then make FG color 0
			//for both layers
			for( var i=0; i<frames.length; i++) {

				var l0Bytes = frames[i][0];
				var l1Bytes = frames[i][1];

				for( var r=0; r<l0Bytes.length; r++) { /* ROW LOOP */
					var rowChar = l0Bytes[r];
					var rowCharDB = l1Bytes[r];

					for( var c=0; c<rowChar.length; c++) { /* INNER COLUMN LOOP */

						var mybyteCh= rowChar[c][0];
						var mybyteChDB= rowCharDB[c][0];

						if( mybyteCh == 32 ) {
							rowChar[c][1] = 0;
						}

						if( mybyteChDB == 32 ) {
							rowCharDB[c][1] = 0;
						}

					}
				}

				for( var bytetype0=0; bytetype0<4; bytetype0++) {

					var bytetype;
					var bytetype2 = -1;
					var bytes;

					if( bytetype0 == 0 ) { //char
						bytetype = 0;
						bytes=frames[i][0]
					}
					else if( bytetype0 == 1 ) { //col + bgcol
						bytetype = 1;
						if( mulicolBG ) {
							bytetype2 = 3;
						}
						bytes=frames[i][0]
					}
					else if( bytetype0 == 2 ) { //char2
						bytetype = 0;
						bytes=frames[i][1];
						if( !doublePetscii ) { continue; }
					}
					else if( bytetype0 == 3 ) { //col2
						bytetype = 1;
						bytes=frames[i][1];
						if( !doublePetscii ) { continue; }
					}

					/*
							bytes0[y,x,type]
								type = 0 -> char
								type = 1 -> char color
								type = 2 -> dirty flag
								type = 3 -> bg color
					*/
					var scrArray = new Int8Array( cW * cH );
					var aix = 0;
					for( var r=0; r<bytes.length; r++) { /* ROW LOOP */
						var row = bytes[r];

						for( var c=0; c<row.length; c++) { /* INNER COLUMN LOOP */

							var mybyte= row[c][bytetype];
							if( bytetype2 > -1 ) {
								mybyte += (row[c][bytetype2] * 16);
							}

							scrArray[ aix++ ] = mybyte;

						}
					}

					//do compression here, if enabled
					//{
					//}
					barrays.push( scrArray );

				}

			}
		}



/*
		var rleArr = this.rleEncode( scrArray );
		var ln = rleArr.length & 0xF;
		var hn = rleArr.length >> 4;
		rleheader[ 0 ] = hn;
		rleheader[ 1 ] = ln;
		barrays.push( rleheader );
		barrays.push( rleArr );
*/
		return barrays;

	}

	makeBlobSingleScreen( bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii ) {

		var header = new Int8Array( 12 );
		header[0] = 'H'.charCodeAt(0);
		header[1] = 'P'.charCodeAt(0);
		header[2] = 'E'.charCodeAt(0);
		header[3] = 'T'.charCodeAt(0);
		header[4] = 'S'.charCodeAt(0);
		header[5] = 'C'.charCodeAt(0);
		header[6] = 'I'.charCodeAt(0);
		header[7] = 'I'.charCodeAt(0);


		header[8] = cW;
		header[9] = cH;
		var mode = 0;
		if( saveColors )        { mode +=1 } //if any color information is stored
		if( mulicolBG  ) 				{ mode +=2 }
		if( doublePetscii ) 		{ mode +=4 }
		header[10] = mode;
		header[11] = 0; //single bgcolor
		if( !mulicolBG ) {
				header[11] = singleBGCol;
		}

		console.log("Header prepared " , header );

		var blob;
		if( bytes1 != null ) {
			blob = new Blob( [header,bytes0, bytes1] , {type: "application/png"});
		}
		else {
			blob = new Blob( [header,bytes0] , {type: "application/png"});
		}


		return blob;

	}

	save( bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii ) {

		var blob = this.makeBlobSingleScreen( bytes0, bytes1, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii );

		var objectUrl = URL.createObjectURL(blob);
		this.downloadURI( objectUrl , name );

	}

	msave( frames, name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii ) {

		var blobs = [];

		blobs =
				this.makeBinArrayFrames(
					frames,
					name, cW, cH, saveColors, singleBGCol, mulicolBG, doublePetscii,
				 	{compress: false}
				);

		var megaBlob = new Blob( blobs, {type: "application/png"} );
		var objectUrl = URL.createObjectURL(megaBlob);
		this.downloadURI( objectUrl , name );

	}

	mload() {

		//var ImgUploader = this.imgUploader;
		var imageLoader = document.getElementById( this.imageLoader );
		this.imgUploader.isBrush = false;
		this.imgUploader.isTraceImage = false;
		this.imgUploader.isImport = false;
		this.imgUploader.isPetsciiImage = false;
		this.imgUploader.isPetsciiMovie = true;

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();
		console.log( "clicked" );

	}


	load() {

		//var ImgUploader = this.imgUploader;
		var imageLoader = document.getElementById( this.imageLoader );
		this.imgUploader.isBrush = false;
		this.imgUploader.isTraceImage = false;
		this.imgUploader.isImport = false;
		this.imgUploader.isPetsciiImage = true;
		this.imgUploader.isPetsciiMovie = false;

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();
		console.log( "clicked" );

	}

	loadTraceImage() {

		console.log("Loading trace image");

		var imageLoader = document.getElementById( this.imageLoader );
		this.imgUploader.isBrush = false;
		this.imgUploader.isTraceImage = true;
		this.imgUploader.isImport = false;
		this.imgUploader.isPetsciiImage = false;
		this.imgUploader.isPetsciiMovie = false;

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();
		console.log( "clicked" );

	}


	importBitmap() {

		console.log("importing bitmap");
		//var ImgUploader = this.imgUploader;
		var imageLoader = document.getElementById( this.imageLoader );
		this.imgUploader.isBrush = false;
		this.imgUploader.isTraceImage = false;
		this.imgUploader.isImport = true;
		this.imgUploader.isPetsciiImage = false;
		this.imgUploader.isPetsciiMovie = false;

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();
		console.log( "clicked" );

	}

	loadBrush() {

		console.log("loadbrush");
		//var ImgUploader = this.imgUploader;
		var imageLoader = document.getElementById( this.imageLoader );
		this.imgUploader.isBrush = true;
		this.imgUploader.isTraceImage = false;
		this.imgUploader.isImport = false;

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();
		console.log( "clicked" );

	}

}


function CLIPBOARD_CLASS( autoresize, _bus ) {
	var _self = this;
	this.bus = _bus;
	//var canvas = document.getElementById(canvas_id);
	//var ctx = document.getElementById(canvas_id).getContext("2d");

	//handlers
	document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

	//on paste
	this.paste_auto = function (e) {
		//console.log("PASTE!");
		console.log( e );
		//console.log( e.clipboardData.getData( "application/octet-stream" ) );

		if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (!items) return;

			//access data directly
			var is_image = false;
			for (var i = 0; i < items.length; i++) {
				console.log( items );
				if (items[i].type.indexOf("image") !== -1) {
					//image
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);
					this.paste_createImage(source);
					is_image = true;
				}
			}
			if(is_image == true){
				e.preventDefault();
			}
		}
	};
	//draw pasted image to canvas

	var BUS = this.bus;
	this.paste_createImage = function (source) {
		var pastedImage = new Image();
		pastedImage.onload = function () {

			console.log("image onPaste " + pastedImage.src );

			var sig = [];
			sig[0] = "PAINT";
			sig[1] = "IMPORTIMAGE";
			sig.data = { img: pastedImage, name: 'copy-paster.png' };
			BUS.post( sig );

		};
		pastedImage.src = source;
	};
}
