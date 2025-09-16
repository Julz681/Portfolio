function ItemsTemplate(i, j) {
    return `
  
    <div class="item">
    <div class="dish_wrap">
    <div class="itemDescription">
      <p class="itemName" id="itemName-${i}-${j}">${menues[i].dishes[j].dishName}</p>
      <br />
      <p id="itemDescription-${i}-${j}">${menues[i].dishes[j].dishDescription}</p>
      <br />
      <p class="itemPrice" id="itemPrice-${i}-${j}">${menues[i].dishes[j].dishPrice} €</p>
    </div>
    <div>
      <img class="itemPicture" id="itemPicture-${i}-${j}" src="${menues[i].dishes[j].picture}" alt="${menues[i].dishes[j].dishName}" />
    </div>
    </div>
    <div class="Warenkorb">
      <a class="addToCart" onclick="handleAddToBasket(${i}, ${j})"> <span class="material-symbols-outlined"> add </span> <span>&nbsp Zum Warenkorb hinzufügen </span> </a>
    </div>
  </div>
  
  `;
  }
  
  function dividerTemplate(categoryIndex) {
    let dividerSrc = menues[categoryIndex].divider;
    return `<img src="${dividerSrc}" alt="Divider für Kategorie ${menues[categoryIndex].category}" class="sectionPictureDivider">`;
  }
  
  function ItemInCartTemplate(i) {
    let item = basket[i];
  
    let symbol =
      item.dishAmount > 1
        ? `<a onclick="reduceAmountInBasket(${i})" id="reduceAmount"><span class="material-symbols-outlined"> remove </span></a>`
        : `<a onclick="removeItemInBasket(${i})" id="removeItem"><span class="material-symbols-outlined"> delete </span></a>`;
  
    return `
      <div class="itemInCart">
        <div class="itemInfo">
          <p class="itemName">${item.dishName}</p>
          <p class="itemPrice">${item.dishPrice} €</p>
        </div>
        <div class="itemOptions">
          <input type="text" placeholder="Anmerkung hinzufügen">
          <div class="itemAmount">
            ${symbol}
            <p id="basketItemCount">${item.dishAmount}</p>
            <a onclick="addAmountInBasket(${i})"><span class="material-symbols-outlined"> add </span></a>
          </div>
        </div>
      </div>
    `;
  }
  