// Get elements

const itemForm = document.getElementById("itemForm");

const itemInput = document.getElementById("itemInput");

const itemList = document.querySelector(".item-list");

const clearBtn = document.getElementById("clear-list");

const feedback = document.querySelector(".feedback"); //esto está oculto

let itemData = JSON.parse(localStorage.getItem("list")) || [];

if (itemData.length > 0) {
  itemData.forEach(singleItem => {
    itemList.insertAdjacentHTML(
      //insert a json html
      "beforeend",
      ` <div class="item my-3">
    
    <h5 class="item-name text-capitalize">${singleItem}</h5>
                <div class="item-icons">
                <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                </div>
                </div>`
    );
    hanldeItem(singleItem);
  });
}
// form submission

itemForm.addEventListener("submit", event => {
  event.preventDefault(); //esto hace que no recargue la pagina cuando le pego al add item y esta vacio (no se si es lo mismo para cuando esta completo)

  const textValue = itemInput.value;

  if (textValue === "") {
    showFeedback("Please enter valid value", "danger"); //danger es una clase de bootstrap
  } else {
    // add item
    addItem(textValue);
    //clear form
    itemInput.value = "";
    // add to item array
    itemData.push(textValue);
    //local storage
    localStorage.setItem("list", JSON.stringify(itemData));
    //add event listeners to icons. Es importante saber que sólo accedemos a los icons acá porque los estamos creando
    //esta sería una callback, porque SOLO pasa cuando hago un submit del form
    hanldeItem(textValue);
  }
});

// show feedback function

function showFeedback(text, action) {
  //feedback está hidden en el css
  feedback.classList.add("showItem", `alert-${action}`);
  //alert action agrega una clase de bootstrap que según cuál se el valor que recibe es verde o rojo
  feedback.innerHTML = `<p>${text}</p>`;

  setTimeout(() => {
    feedback.classList.remove("showItem", `alert-${action}`);
  }, 3000);
  //esta funcion hace que se muestre el cartel de danger por solo tres segundos
}

//add item

function addItem(value) {
  //crear un div, agregarle dos clases y despues tengo el html
  // template strings y se agrega dinámicamente. Lo que hace es crearlo en el html y que quede harcodeado, para despues reemplazar los valores
  const div = document.createElement("div");
  div.classList.add("item", "my-3");
  //acá le paso todo el template literal
  div.innerHTML = ` <h5 class="item-name text-capitalize">${value}</h5>
                <div class="item-icons">
                <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                </div>`;
  itemList.appendChild(div);
}

function hanldeItem(textValue) {
  //es importante que ésta función sólo va a correr cuando el submit del form esta pasando, si no no
  const items = itemList.querySelectorAll(".item"); //traigo los items que fui agregando
  items.forEach(item => {
    //recorro la lista de arrays y chequeo que sea sólo para el último item que agregué
    if (item.querySelector(".item-name").textContent === textValue) {
      // ---Complete event listener----
      item.querySelector(".complete-item").addEventListener("click", () => {
        item.querySelector(".item-name").classList.toggle("completed"); //tacha la tarea seleccionada
        this.classList.toggle("visibility"); //this refiere al botón
      });

      // ---Edit event listener---
      item.querySelector(".edit-item").addEventListener("click", () => {
        //get the input value of the textValue
        itemInput.value = textValue;
        itemList.removeChild(item); //acá eliminamos el item del DOM

        itemData = itemData.filter(function(item) {
          return item !== textValue; // acá eliminamos el item del Array
        });
        localStorage.setItem("list", JSON.stringify(itemData));
      });

      // ---Delete event listener---
      item.querySelector(".delete-item").addEventListener("click", () => {
        itemList.removeChild(item); //acá eliminamos el item del DOM

        itemData = itemData.filter(function(item) {
          return item !== textValue; // acá eliminamos el item del Array
        });
        localStorage.setItem("list", JSON.stringify(itemData));

        showFeedback("item deleted", "success");
      });
    }
  });
}

clearBtn.addEventListener("click", () => {
  itemData = [];
  localStorage.removeItem("list");

  const items = itemList.querySelectorAll(".item");
  if (items.length > 0) {
    items.forEach(function(item) {
      itemList.removeChild(item);
    });
  }
});
