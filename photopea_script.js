var input = INPUT

var lays = app.activeDocument.layers;

for (var i = 0; i < lays.length; i++) {
  if (lays[i].name === "title") {
    lays[i].textItem.contents = input["title"];
  }

  if (lays[i].name === "subtitle") {
    lays[i].textItem.contents = input["subtitle"];
  }
}
