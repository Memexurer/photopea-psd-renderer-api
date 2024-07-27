var input = INPUT

var lays = app.activeDocument.layers;

for (var i = 0; i < lays.length; i++) {
  if (input[lays[i].name]) {
    lays[i].textItem.contents = input[lays[i].name];
  }
}
