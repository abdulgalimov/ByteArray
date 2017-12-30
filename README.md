# ByteArray for JS

```js
var utf8Text = 'test text';
var cyrillicText = 'кирилица';
var emojiText = '👍😀🇷🇺';
var packSize = 1 + 4 + utf8Text.length + 2*cyrillicText.length + 2*emojiText.length;
//
//
//
console.log('------- Write Data');
var writer = new ByteArray(packSize);
writer.littleEndian = true;// or false
writer.setInt8(10);
writer.setUint32(70000);
writer.writeUTF8Text(utf8Text);
writer.writeUTF16Text(cyrillicText);
writer.writeUTF16Text(emojiText);
//
console.log('info:', writer.length, writer.position, writer.bytesAvailable);
console.log('buffer:', new Uint8Array(writer.buffer));
writer.position = 0;
console.log('bytes:', writer.readBytes(writer.bytesAvailable));
//
//
//
console.log('------- Read Data');
var reader = new ByteArray(writer.buffer);
reader.littleEndian = writer.littleEndian;
console.log('info:', reader.length, reader.position, reader.bytesAvailable);
console.log(reader.getInt8()); // 10
console.log(reader.getUint32()); // 70000
console.log(reader.readUTF8Text(utf8Text.length)); // test text
console.log(reader.readUTF16Text(cyrillicText.length)); // кирилица
console.log(reader.readUTF16Text(emojiText.length)); // 👍😀🇷🇺
```