//Portionen berechnen

const recipes = {
    "recipe_today.html": {
        normalPortion: 2,
        portionValues: [200, 100, 2, 24, 2, "n.B.", "n.B."],
    },
    "pancakes.html": {
        normalPortion: 1,
        portionValues: [3, 100, 200, 150, 1, 2, "n.B.", "n.B."],
  },
  "chicken.html": {
    normalPortion: 2,
    portionValues: [2, 1, 120, 100, 50, 60, "n.B.", "n.B.", "n.B."],
},
}

function updateIngredients() {
    const input = document.getElementById('input').value;
    const table = document.getElementById('in_table');
    const recipeName = window.location.pathname.split('/').pop();
    const recipe = recipes[recipeName];
  
  
    const { normalPortion, portionValues } = recipe;
  
    for (let i = 0; i < table.rows.length; i++) {
      const cell = table.rows[i].cells[0];
      const portionValue = portionValues[i];
  
      if (typeof portionValue === 'number') {
        let result = (portionValue / normalPortion) * input;
  
        if ([0.5, 1, 1.5, 2, 2.5].includes(portionValue)) {
          result = Math.round(result * 2) / 2;
        }
  
        cell.innerHTML = (result % 1 === 0) ? result : result.toFixed(2);
      } else {
        cell.innerHTML = portionValue;
      }
    }
  }
  
  document.querySelector('.portion_btn').addEventListener('click', updateIngredients);


  // Kontrolle der Eingabe
    document.querySelector(".portion_btn").addEventListener("click", function () {
    const inputField = document.querySelector("input");
    const newPortions = parseInt(inputField.value);
  
    if (isNaN(newPortions) || newPortions < 1 || newPortions > 25) {
      alert("Bitte geben Sie einen Wert zwischen 1 und 25 ein!");
      inputField.value = Math.max(1, Math.min(newPortions || 1, 30));
      return;
    }
  });