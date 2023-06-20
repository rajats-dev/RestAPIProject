const myform = document.getElementById("myform");
const btn1 = document.getElementById("btn");
const itemlist = document.getElementById("item");
let totalValue = 0;

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
        "https://crudcrud.com/api/eaad93e6a9734fec807cea2826af389a/appointmentData",
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

  li.setAttribute("data-selling", sell);

  itemlist.appendChild(li);

  totalValue += parseFloat(sell);
}

function updateTotalValue(sell) {
  totalValue -= parseFloat(sell);
}

function displayTotalValue() {
  var totalElement = document.createElement("li");
  // Remove previous total value element if it exists
  if (totalElement) {
    totalElement.remove();
  }

  // Create a new total value element
  totalElement = document.createElement("p");
  totalElement.setAttribute("id", "totalValue");
  totalElement.textContent = "Total Value of Selling: " + totalValue;
  itemlist.appendChild(totalElement);
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      "https://crudcrud.com/api/eaad93e6a9734fec807cea2826af389a/appointmentData"
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
      var sellingValue = li.getAttribute("data-selling");
      updateTotalValue(sellingValue);

      axios
        .get(
          "https://crudcrud.com/api/eaad93e6a9734fec807cea2826af389a/appointmentData"
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
                `https://crudcrud.com/api/eaad93e6a9734fec807cea2826af389a/appointmentData/${item}`
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
