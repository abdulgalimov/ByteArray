/**
 * Created by Zaur abdulgalimov@gmail.com on 29.12.17.
 */


var ByteArray = (function() {
  var ByteArray = function(source, byteOffset, byteLength) {
    var buffer;
    if (source instanceof ArrayBuffer) {
      buffer = source;
    } else {
      var bytes = new Uint8Array(source);
      buffer = bytes.buffer;
    }
    this._data = new DataView(buffer, byteOffset, byteLength);
    //
    var maxLength = this._data.byteLength;
    var self = this;
    Object.defineProperties(this, {
      length: {get: function() {return maxLength;}},
      bytesAvailable: {get: function() {return maxLength-self._position;}},
      buffer: {get: function() {return self._data.buffer;}}
    });
    this._position = 0;
    this._littleEndian = false;
  };
  Object.defineProperties(ByteArray.prototype, {
    position: {
      get: function() {return this._position;},
      set: function(value) {this._position = value;}
    },
    littleEndian: {
      get: function() {return this._littleEndian;},
      set: function(value) {this._littleEndian = !!value;}
    }
  });

  ByteArray.prototype.toString = function() {
    var s = '';
    for (var i=0; i<this.length; i++) {
      if (s) s += '.';
      s += this._data.getUint8(i);
    }
    return s;
  };
  ByteArray.prototype.toArray = function() {
    var a = [];
    for (var i=0; i<this.length; i++) {
      a.push(this._data.getUint8(i));
    }
    return a;
  };

  ByteArray.prototype.setPosition = function(value) {
    this._position = value;
    return this;
  };

  ByteArray.prototype.getInt8 = function() {
    var value = this._data.getInt8(this._position);
    this._position++;
    return value;
  };
  ByteArray.prototype.getUint8 = function() {
    var value = this._data.getUint8(this._position);
    this._position++;
    return value;
  };
  ByteArray.prototype.setInt8 = function(value) {
    this._data.setInt8(this._position, value);
    this._position++;
    return this;
  };
  ByteArray.prototype.setUint8 = function(value) {
    this._data.setUint8(this._position, value);
    this._position++;
    return this;
  };

  ByteArray.prototype.getInt16 = function() {
    var value = this._data.getInt16(this._position, this._littleEndian);
    this._position+=2;
    return value;
  };
  ByteArray.prototype.getUint16 = function() {
    var value = this._data.getUint16(this._position, this._littleEndian);
    this._position+=2;
    return value;
  };
  ByteArray.prototype.setInt16 = function(value) {
    this._data.setInt16(this._position, value, this._littleEndian);
    this._position += 2;
    return this;
  };
  ByteArray.prototype.setUint16 = function(value) {
    this._data.setUint16(this._position, value, this._littleEndian);
    this._position += 2;
    return this;
  };

  ByteArray.prototype.getInt32 = function() {
    var value = this._data.getInt32(this._position, this._littleEndian);
    this._position+=4;
    return value;
  };
  ByteArray.prototype.getUint32 = function() {
    var value = this._data.getUint32(this._position, this._littleEndian);
    this._position+=4;
    return value;
  };
  ByteArray.prototype.setInt32 = function(value) {
    this._data.setInt32(this._position, value, this._littleEndian);
    this._position += 4;
    return this;
  };
  ByteArray.prototype.setUint32 = function(value) {
    this._data.setUint32(this._position, value, this._littleEndian);
    this._position += 4;
    return this;
  };

  ByteArray.prototype.getFloat32 = function() {
    var value = this._data.getFloat32(this._position, this._littleEndian);
    this._position+=4;
    return value;
  };
  ByteArray.prototype.setFloat32 = function(value) {
    this._data.setFloat32(this._position, value, this._littleEndian);
    this._position += 4;
    return this;
  };

  ByteArray.prototype.getFloat64 = function() {
    var value = this._data.getFloat64(this._position, this._littleEndian);
    this._position+=8;
    return value;
  };
  ByteArray.prototype.setFloat64 = function(value) {
    this._data.setFloat64(this._position, value, this._littleEndian);
    this._position += 8;
    return this;
  };

  ByteArray.prototype.readBytes = function(byteLength) {
    byteLength = byteLength||this.bytesAvailable;
    var bytes = new Uint8Array(this._data.buffer, this._position, byteLength);
    this._position += byteLength;
    return bytes;
  };
  ByteArray.prototype.writeBytes = function(source) {
    if (source instanceof ArrayBuffer || source instanceof Array) {
      source = new Uint8Array(source);
    } else if (source instanceof ByteArray) {
      source = new Uint8Array(source.buffer);
    }
    var len = source.byteLength||source.length;
    for (var i=0; i<len; i++) {
      this.setUint8(source[i]);
    }
    return this;
  };


  ByteArray.prototype.readUTF8Text = function(textLength) {
    textLength = textLength||this.bytesAvailable;
    var bytes = new Uint8Array(this._data.buffer, this._position, textLength);
    this._position += textLength;
    return String.fromCharCode.apply(null, bytes);
  };
  ByteArray.prototype.writeUTF8Text = function(string) {
    for (var i=0; i<string.length; i++) {
      this.setInt8(string.charCodeAt(i));
    }
    return this;
  };


  ByteArray.prototype.readUTF16Text = function(textLength) {
    textLength = textLength||(this.bytesAvailable/2);
    var s = '';
    for (var i=0; i<textLength; i++) {
      var code = this.getUint16();
      s += '\\u'+('0000'+code.toString(16)).slice(-4);
    }
    //
    s = JSON.parse('"' + s.replace(/"/g, '\\"') + '"');
    return s;
  };
  ByteArray.prototype.writeUTF16Text = function(string) {
    for (var i=0; i<string.length; i++) {
      this.setUint16(string.charCodeAt(i));
    }
    return this;
  };

  ByteArray.prototype.writeByte = ByteArray.prototype.setInt8;
  ByteArray.prototype.readByte = ByteArray.prototype.getInt8;
  ByteArray.prototype.writeUnsignedByte = ByteArray.prototype.setUint8;
  ByteArray.prototype.readUnsignedByte = ByteArray.prototype.getUint8;

  ByteArray.prototype.writeShort = ByteArray.prototype.setInt16;
  ByteArray.prototype.readShort = ByteArray.prototype.getInt16;
  ByteArray.prototype.writeUnsignedShort = ByteArray.prototype.setUint16;
  ByteArray.prototype.readUnsignedShort = ByteArray.prototype.getUint16;

  ByteArray.prototype.writeInt = ByteArray.prototype.setInt32;
  ByteArray.prototype.readInt = ByteArray.prototype.getInt32;
  ByteArray.prototype.writeUnsignedInt = ByteArray.prototype.setUint32;
  ByteArray.prototype.readUnsignedInt = ByteArray.prototype.getUint32;

  try {
    var isBrowser = this === window;
  } catch (e) {
    module.exports = ByteArray;
  }
  return ByteArray;
})();