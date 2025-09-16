let spaghetti = [2, 200, 100, 2, 24, 2];
let pancakes = [1, 3, 100, 200, 150, 1, 2];
let chicken = [2, 2, 1, 120, 100, 50, 60];
let salat = [4, 1, 1, 1, 500, 2, 200, 1, 125, 1];

function rechne_positionen(rezept, init) {
  let menge = 0;
  if (init == true) {
    menge = rezept[0];
    document.getElementById("portionen").value = menge;
  } else {
    menge = document.getElementById("portionen").value;
  }

  if (menge <= 0) {
    menge = rezept[0];
    document.getElementById("portionen").value = menge;
  }

  if (menge >= 20) {
    menge = 20;
    document.getElementById("portionen").value = menge;
  }

  for (let index = 1; index < rezept.length; index++) {
    let id = "pos-" + index;
    document.getElementById(id).innerHTML = parseFloat(
      ((rezept[index] / rezept[0]) * menge).toFixed(3)
    );
  }
}
