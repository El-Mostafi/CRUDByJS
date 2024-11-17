let content=`
<table class="myTable">
    <tr>
        <th>ID</th>
        <th>TITLE</th>
        <th>PRICE</th>
        <th>TAXES</th>
        <th>ADS</th>
        <th>DISCOUNT</th>
        <th>TOTAL</th>
        <th>CATEGORY</th>
        <th>UPDATE</th>
        <th>DELETE</th>
    </tr>`;
const section2 =document.getElementById("section2");
const ids = ["price", "taxes", "ads", "discount"]; 
const create = document.getElementById("create");
const update = document.getElementById("update");
const total= document.getElementById("total");
const count = parseInt(document.getElementById("count").value) || 0;
const category= document.getElementById("category");
const search= document.getElementById("search");
let typeOfSearch="title";
let itemIndex;
let item;
let listeItems = new Array();
let totalPrice=0;
let price=0;
let taxes=0;
let ads=0;
let discount=0;
ids.forEach(id => {
  const element = document.getElementById(id);
  element.oninput= () => {
    price = parseFloat(document.getElementById("price").value) || 0;
    taxes = parseFloat(document.getElementById("taxes").value) || 0;
    ads = parseFloat(document.getElementById("ads").value) || 0;
    discount = parseFloat(document.getElementById("discount").value) || 0;
    totalPrice = price + taxes+ads-discount;
    if(price && taxes && ads){
        total.innerHTML=`Total: ${totalPrice}`;
        total.style.background="green";
    }
    else{
        total.innerHTML=`Total: `;
        total.style.background="red";
        totalPrice=0;
    }
  };
});
window.onload = () => {
  listeItems = JSON.parse(localStorage.getItem("Items")) || [];
  for (let i = 0; i < listeItems.length; i++) {
    const temp = listeItems[i];
    content += `
    <tr>
        <td>${i + 1}</td>
        <td>${temp.title}</td>
        <td>${temp.price}</td>
        <td>${temp.taxes}</td>
        <td>${temp.ads}</td>
        <td>${temp.discount}</td>
        <td>${temp.totalPrice}</td>
        <td>${temp.category}</td>
        <td><button style="width:80%" onclick="updateItem(${i})">Update</button></td>
        <td><button style="width:80%" onclick="deleteItem(${i})">Delete</button></td>
    </tr>`;
  }
document.getElementById("deletAll").innerHTML = `Delete All (${listeItems.length})`;
  section2.innerHTML = content;
};
function createItem(){
  const title = document.getElementById("title").value;
  const count = parseInt(document.getElementById("count").value) || 0;
  const category= document.getElementById("category").value;
  if(totalPrice && count && category && title){
      item = {
      title: title,
      price: price,
      taxes: taxes,
      ads: ads,
      discount: discount,
      totalPrice: totalPrice,
      category: category
    };
    for(let i = 0; i <count; i++) {
      listeItems.push(item);
      localStorage.setItem("Items", JSON.stringify(listeItems));
      content+=`
      <tr>
          <td>${listeItems.length}</td>
          <td>${item.title}</td>
          <td>${item.price}</td>
          <td>${item.taxes}</td>
          <td>${item.ads}</td>
          <td>${item.discount}</td>
          <td>${item.totalPrice}</td>
          <td>${item.category}</td>
          <td><button style="width:80%" onclick="updateItem(${listeItems.length})">Update</button></td>
          <td><button style="width:80%" onclick="deleteItem(${listeItems.length})">Delet</button></td>
      </tr>`;
    }
document.getElementById("deletAll").innerHTML = `Delete All (${listeItems.length})`;
clearFields(); 

  }
  section2.innerHTML=content;
};
function updateItem(index) {
  itemIndex=index;
  let myItem=listeItems[itemIndex];
  document.getElementById("title").value=myItem.title;
  document.getElementById("price").value=myItem.price;
  document.getElementById("taxes").value=myItem.taxes;
  document.getElementById("ads").value=myItem.ads;
  document.getElementById("discount").value=myItem.discount;
  document.getElementById("count").value="";
  document.getElementById("count").setAttribute("readonly",true);
  document.getElementById("category").value=myItem.category;
  create.setAttribute("hidden",true);
  update.removeAttribute("hidden");
  totalPrice = myItem.price + myItem.taxes+myItem.ads-myItem.discount;
  total.innerHTML=`Total: ${totalPrice}`;
  total.style.background="green";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}
function confirmUpdate(){
  const title = document.getElementById("title").value;
  const category= document.getElementById("category").value;
  price = parseFloat(document.getElementById("price").value) || 0;
  taxes = parseFloat(document.getElementById("taxes").value) || 0;
  ads = parseFloat(document.getElementById("ads").value) || 0;
  discount = parseFloat(document.getElementById("discount").value) || 0;
  totalPrice = price + taxes+ads-discount;
  if(totalPrice && category && title){
    console.log(title,totalPrice,category);
      item = {
      title: title,
      price: price,
      taxes: taxes,
      ads: ads,
      discount: discount,
      totalPrice: totalPrice,
      category: category
    };
    listeItems[itemIndex]=item;
    localStorage.setItem("Items", JSON.stringify(listeItems));
    const row = section2.querySelectorAll("tr")[itemIndex + 1]; 
    row.innerHTML = `
      <td>${itemIndex + 1}</td>
      <td>${item.title}</td>
      <td>${item.price}</td>
      <td>${item.taxes}</td>
      <td>${item.ads}</td>
      <td>${item.discount}</td>
      <td>${item.totalPrice}</td>
      <td>${item.category}</td>
      <td><button style="width:80%" onclick="updateItem(${itemIndex})">Update</button></td>
      <td><button style="width:80%" onclick="deleteItem(${itemIndex})">Delete</button></td>
    `;
    document.getElementById("count").removeAttribute("readonly");
    clearFields();
  }
}
function deleteItem(index){
  listeItems.splice(index,1);
  localStorage.setItem("Items", JSON.stringify(listeItems));
  const row = section2.querySelectorAll("tr")[index + 1]; 
  row.remove();
  const rows = section2.querySelectorAll("tr");
  for (let i = 1; i < rows.length; i++) { 
    rows[i].children[0].textContent = i; 
    rows[i].children[8].innerHTML = `<button style="width:80%" onclick="updateItem(${i - 1})">Update</button>`;
    rows[i].children[9].innerHTML = `<button style="width:80%" onclick="deleteItem(${i - 1})">Delete</button>`;
  }
  document.getElementById("deletAll").innerHTML = `Delete All (${listeItems.length})`;
  clearFields();

};
function searchByTitle(){
  typeOfSearch="title"
};
function searchByCat(){
  typeOfSearch="category"
};
search.oninput=()=>{
  const rows = section2.querySelectorAll("tr");
  if(search.value){
    if(typeOfSearch=="title"){
      for (let i = 1; i < rows.length; i++) { 
        if(!rows[i].children[1].textContent.includes(search.value)){
          rows[i].setAttribute("hidden", "true");
        } 
      }
    }
    else{
      for (let i = 1; i < rows.length; i++) { 
        if(!rows[i].children[7].textContent.includes(search.value)){
          rows[i].setAttribute("hidden", "true");
        } 
      }
    }
  }
  else{
    for (let i = 1; i < rows.length; i++) { 
      if(rows[i].hasAttribute("hidden")){
        rows[i].removeAttribute("hidden");
      } 
    }
  }
};
function deletAll(){
  listeItems=[];
  localStorage.setItem("Items", JSON.stringify(listeItems));
  content=`
<table class="myTable">
    <tr>
        <th>ID</th>
        <th>TITLE</th>
        <th>PRICE</th>
        <th>TAXES</th>
        <th>ADS</th>
        <th>DISCOUNT</th>
        <th>TOTAL</th>
        <th>CATEGORY</th>
        <th>UPDATE</th>
        <th>DELETE</th>
    </tr>`;
    clearFields();
    
    document.getElementById("deletAll").innerHTML = `Delete All (${listeItems.length})`;
    section2.innerHTML=content;
}
function clearFields(){
  document.getElementById("title").value="";
    document.getElementById("category").value="";
    document.getElementById("price").value="";
    document.getElementById("taxes").value="";
    document.getElementById("ads").value="";
    document.getElementById("count").value="";
    document.getElementById("discount").value="";
    search.value="";
    total.innerHTML=`Total: `;
    total.style.background="red";
    totalPrice=0;
    document.getElementById("count").removeAttribute("readonly");
    create.removeAttribute("hidden");
    update.setAttribute("hidden",true);
}