const myform = document.getElementById("myform");
const btn1 = document.getElementById("btn");
const itemlist = document.getElementById("item");
let totalValue = 0;

const totalElement = document.createElement("li");
totalElement.textContent = "Total Value of Selling: " + totalValue;
itemlist.appendChild(totalElement);

myform.addEventListener("submit", (e) => {
  e.preventDefault();
  const selling = document.getElementById("sellingid").value;
  const product = document.getElementById("productid").value;

  if (selling == "" || product == "") {
    alert("Please Enter All");
  } else {
    showOnScreen(selling, product);

    let obj = {
      selling: selling,
      product: product,
    };

    axios
      .post(
        "https://crudcrud.com/api/68bb7b1d96f340708dcdb35414994da8/appointmentData",
        obj
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    displayTotalValue();
  }
});

function showOnScreen(sell, pro) {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(sell + " - " + pro));

  /// delete button

  var delbtn = document.createElement("button");
  delbtn.className = "btn btn-danger btn-sm float-right delete";
  delbtn.appendChild(document.createTextNode("Delete"));
  li.appendChild(delbtn);
  itemlist.appendChild(li);

  totalValue += parseFloat(sell);
}

function updateTotalValue(sell) {
  totalValue -= parseFloat(sell);
}

function displayTotalValue() {
  totalElement.textContent = "Total Value of Selling: " + totalValue;
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      "https://crudcrud.com/api/68bb7b1d96f340708dcdb35414994da8/appointmentData"
    )
    .then((res) => {
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        showOnScreen(res.data[i].selling, res.data[i].product);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

itemlist.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    if (confirm("Are u Sure?")) {
      var li = e.target.parentElement;
      itemlist.removeChild(li);
      var details = li.childNodes[0].textContent.split(" - ");
      var deleteValue = parseFloat(details[0]);
      updateTotalValue(deleteValue);

      axios
        .get(
          "https://crudcrud.com/api/68bb7b1d96f340708dcdb35414994da8/appointmentData"
        )
        .then((res) => {
          console.log(res);

          const itemToDelete = res.data.find(
            (item) => item.product === details[1]
          );

          if (itemToDelete) {
            const item = itemToDelete._id;

            axios
              .delete(
                `https://crudcrud.com/api/68bb7b1d96f340708dcdb35414994da8/appointmentData/${item}`
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    displayTotalValue();
  }
});
