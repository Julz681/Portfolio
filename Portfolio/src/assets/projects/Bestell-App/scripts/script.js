let basket = [];

function init() {
  for (let i = 0; i < menues.length; i++) {
    setCategoryIndex(i);
    renderDividers(i);
  }

  toggleEmptyBasket();
  toggleDeliveryInformation();
  calculateCurrentSum();
  calculateTotalSum();
}

function setCategoryIndex(categoryIndex) {
  let categoryRef;
  switch (categoryIndex) {
    case 0:
      categoryRef = document.getElementById("favorite");
      break;
    case 1:
      categoryRef = document.getElementById("saladBox");
      break;
    case 2:
      categoryRef = document.getElementById("pizzaBox");
      break;
    case 3:
      categoryRef = document.getElementById("pastaBox");
      break;
    case 4:
      categoryRef = document.getElementById("drinkBox");
      break;
    case 5:
      categoryRef = document.getElementById("dessertBox");
      break;
    default:
      return;
  }

  renderDishes(categoryRef, categoryIndex);
}

function renderDishes(categoryRef, categoryIndex) {
  categoryRef.innerHTML = "";
  let dishes = menues[categoryIndex].dishes;
  for (let j = 0; j < dishes.length; j++) {
    categoryRef.innerHTML += ItemsTemplate(categoryIndex, j);
  }
}

function renderDividers(categoryIndex) {
  let dividerRef = document.getElementById(`divider-${categoryIndex}`);
  if (dividerRef) {
    dividerRef.innerHTML = dividerTemplate(categoryIndex);
  }
}

function addItemToCart(i, j) {
  let dishNameRef = menues[i].dishes[j].dishName;
  let dishPriceRef = menues[i].dishes[j].dishPrice;
  let itemInBasket = basket.find((item) => item.dishName === dishNameRef);

  if (itemInBasket) {
    itemInBasket.dishAmount += 1;
  } else {
    basket.push({
      dishName: dishNameRef,
      dishPrice: dishPriceRef,
      dishAmount: 1,
    });
  }

  calculateEverySum();
}

function removeItemInBasket(i) {
  basket.splice(i, 1);

  updateBasketView();
}

function addAmountInBasket(i) {
  let dishNameRef = basket[i].dishName;
  let itemInBasket = basket.find((item) => item.dishName === dishNameRef);

  itemInBasket.dishAmount += 1;
  updateBasketView();
}

function reduceAmountInBasket(i) {
  let dishNameRef = basket[i].dishName;

  let itemInBasket = basket.find((item) => item.dishName === dishNameRef);

  itemInBasket.dishAmount -= 1;
  updateBasketView();
}

function updateBasketView() {
  let basketRef = document.getElementById("basketContent");
  basketRef.innerHTML = "";

  for (let i = 0; i < basket.length; i++) {
    basketRef.innerHTML += ItemInCartTemplate(i);
  }

  toggleEmptyBasket();
  calculateEverySum();
}

function showBasket() {
  myBasketRef = document.getElementById("shoppingBasket");
  myShowBasketButtonRef = document.getElementById("showBasketButton");

  myBasketRef.classList.toggle("d_BasketNow");
  myShowBasketButtonRef.classList.toggle("d_none");
}

function toggleEmptyBasket() {
  let myEmptyBasket = document.getElementById("emptyBasket");
  let myFinishOrderSection = document.getElementById("finishOrder");
  let myCardContentRef = document.getElementById("basketContent");
  

  if (basket.length === 0) {
    myEmptyBasket.classList.remove("d_none");
    myFinishOrderSection.classList.add("d_none");
    myCardContentRef.classList.add("d_none");
  } else {
    myEmptyBasket.classList.add("d_none");
    myFinishOrderSection.classList.remove("d_none");
    myCardContentRef.classList.remove("d_none");
    
  }
}

function toggleDeliveryInformation() {
  let myDeliveryInformationRef = document.getElementById("deliveryFeeAndValue");
  let deliveryOption = document.querySelector(
    'input[name="shippingType"]:checked'
  );

  if (deliveryOption && deliveryOption.value === "delivery") {
    myDeliveryInformationRef.classList.remove("d_none");
  } else {
    myDeliveryInformationRef.classList.add("d_none");
  }

  toggleDeliveryFee();
}

function toggleDeliveryFee() {
  let deliveryFeeRef = document.getElementById("finalDeliveryFeeStatus");
  let deliveryLocationRef = document.getElementById("deliveryPickup");
  let deliveryOption = document.querySelector(
    'input[name="shippingType"]:checked'
  );

  if (deliveryOption && deliveryOption.value === "delivery") {
    deliveryFeeRef.classList.remove("d_none");
    deliveryLocationRef.classList.add("d_none");
  } else {
    deliveryFeeRef.classList.add("d_none");
    deliveryLocationRef.classList.remove("d_none");
  }

  updateBasketView();
}

function handleAddToBasket(i, j) {
  addItemToCart(i, j);
  updateBasketView();
  calculateEverySum();
}

function calculateEverySum() {
  calculateCurrentSum();
  calculateTotalSum();
  calculateTotalSum1();
}

function calculateCurrentSum() {
  let currentSumRef = document.getElementById("currentOrderSum");
  let currentSum = 0;

  currentSumRef.innerHTML = "";

  for (let item of basket) {
    currentSum += item.dishAmount * item.dishPrice;
  }

  currentSumRef.innerHTML = currentSum.toFixed(2);
  return currentSum;
}

function calculateTotalSum() {
  let totalSumRef = document.getElementById("totalOrderSum");
  let totalSum = 0;
  let deliveryOption = document.querySelector(
    'input[name="shippingType"]:checked'
  );

  totalSumRef.innerHTML = "";

  if (deliveryOption && deliveryOption.value === "delivery") {
    calculateSumWithDeliveryFee(totalSumRef, totalSum);
  } else {
    calculateSumWithoutDeliveryFee(totalSumRef, totalSum);
  }
}


function calculateTotalSum1() {
  let totalSumRef = document.getElementById("totalOrderSum1");
  let totalSum = 0;
  let deliveryOption = document.querySelector(
    'input[name="shippingType"]:checked'
  );

  totalSumRef.innerHTML = "";

  if (deliveryOption && deliveryOption.value === "delivery") {
    calculateSumWithDeliveryFee(totalSumRef, totalSum);
  } else {
    calculateSumWithoutDeliveryFee(totalSumRef, totalSum);
  }
}




function calculateSumWithDeliveryFee(totalSumRef, totalSum) {
  let deliveryFee = 1.9;
  for (let item of basket) {
    totalSum += item.dishAmount * item.dishPrice;
  }
  totalSum = totalSum += deliveryFee;
  totalSumRef.innerHTML = totalSum.toFixed(2);
  return totalSum;
}

function calculateSumWithoutDeliveryFee(totalSumRef, totalSum) {
  let deliveryFee = 0;
  for (let item of basket) {
    totalSum += item.dishAmount * item.dishPrice;
  }
  totalSum = totalSum += deliveryFee;
  totalSumRef.innerHTML = totalSum.toFixed(2);
  return totalSum;
}






function sendOrder() {
  let totalSumRef = document.getElementById("totalOrderSum1").innerText;
  let basketContentRef = document.getElementById("basketContent");
  let myFinishOrderSectionRef = document.getElementById("finishOrder");
  let myEmptyBasket = document.getElementById("emptyBasket");
  

  if (totalSumRef <= 15) {
    document.getElementById("mbw").style.display="unset";
  } else {
    clearBasketAndSendOrder(
      basketContentRef,
      myFinishOrderSectionRef,
      myEmptyBasket,
      
    );
  }
}
 

function clearBasketAndSendOrder(
  basketContentRef,
  myFinishOrderSectionRef,
  myEmptyBasket,
  
  
  
) {
  basketContentRef.innerHTML = "";
  myFinishOrderSectionRef.innerHTML = "";

  for (let i = 0; i < basket.length; i++) {
    delete basket[i];
  }
  myEmptyBasket.classList.remove("d_none");
  window.location.href = "done.html";
  
  
}







