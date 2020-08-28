'use strict';
// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return{
    storeItem: function(newItem) {
      let items = [];
      if(localStorage.getItem('items') === null) {
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getStoredItems: function() {
      if(localStorage.getItem('items') !== null) {
        return JSON.parse(localStorage.getItem('items'));
      }
      return [];
    },
    updateStoredItem: function(updItem) {
      const items = JSON.parse(localStorage.getItem('items'));
      items.forEach(item => {
        if(item.id === updItem.id) {
          item.name = updItem.name;
          item.calories = updItem.calories;
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteStoredItem: function(id) {
      const items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item,index) => {
        if(item.id === id) {
          items.splice(index, 1);
        };
      })
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteAllStoredItems: function() {
      localStorage.clear();
    }
  }
})();

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // State
  const data = {
    // items: [
    //   // {id: 0, name: 'Mars', calories: 500},
    //   // {id: 1, name: 'Bounty', calories: 400},
    //   // {id: 2, name: 'Twix', calories: 300}
    // ],
    items: StorageCtrl.getStoredItems(),
    currentItem: null,
    totalCalories: 0
  }
  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    logData: function(){
      return data;
    },
    addItem: function(name, calories) {
      let ID;
      // Create id
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);
      const newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    getTotalCalories: function() {
      let sum = 0;
      for(let item of data.items) {
        sum += item.calories;
      }
      data.totalCalories = sum;
      return data.totalCalories;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;   
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(item => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      const ids = data.items.map((item) => item.id);
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    deleteAllItems: function() {
      data.items.length = 0;
    }
  }
})();


// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn'
  }
  // Public methods
  return {
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      document.querySelector(UISelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      document.querySelector(UISelectors.itemList).insertAdjacentElement
      ('beforeend', li);
    },
    updateListItem: function(updatedItem) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn Node List into array
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${updatedItem.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      id = `item-${id}`;
      const items = document.querySelectorAll(UISelectors.listItems);
      const itemsArr = Array.from(items);
      itemsArr.forEach(item => {
        if(item.getAttribute("id") === id) {
          item.remove();
        }
      })
    },
    deleteAllItems: function() {
      document.querySelector(UISelectors.itemList).remove();
    },
    clearInputFields: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = 
      ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
      ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();    
    },
    showEditState() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getUISelectors: function() {
      return UISelectors;
    },
    showWarningAlert: function() {
      alert("You have not put values to both inputs!");
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    displayTotalCalories: function(totCal) {
      document.querySelector(UISelectors.totalCalories).textContent = totCal;
    },
    clearEditState: function() {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getUISelectors();
    document.querySelector(UISelectors.addBtn).addEventListener
      ('click', itemAddSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener
      ('click', (e) => {
        e.preventDefault();  
        UICtrl.clearEditState();
      });
    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })  
    document.querySelector(UISelectors.itemList).addEventListener
    ('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener
    ('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener
    ('click', itemDeleteSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener
    ('click', itemsDeleteSubmit)
  }
  // Add item submit
  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    // Check for name and calorie input
    if(input.name === "" || input.calories === "") {
      UICtrl.showWarningAlert();
      return;
    }
    // Add item
    const newItem = ItemCtrl.addItem(input.name, input.calories);
    UICtrl.addListItem(newItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayTotalCalories(totalCalories);
    StorageCtrl.storeItem(newItem);
    UICtrl.clearInputFields();
  }
  // Click edit item
  const itemEditClick = function(e) {
    e.preventDefault();
    if(e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split("-"); // ['item', '0']
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
  }
  // Item update submit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);
    StorageCtrl.updateStoredItem(updatedItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayTotalCalories(totalCalories);
    UICtrl.clearEditState();
  }
  // Item delete submit
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    StorageCtrl.deleteStoredItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayTotalCalories(totalCalories);
    UICtrl.clearEditState();
  }
  // Items delete submit
  const itemsDeleteSubmit = function(e) {
    e.preventDefault();
    ItemCtrl.deleteAllItems();
    UICtrl.deleteAllItems();
    StorageCtrl.deleteAllStoredItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayTotalCalories(totalCalories);
    UICtrl.clearEditState();
  }
  // Public methods
  return {
    init: function(){
      // Clear edit state / set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      // Check if any items present
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      
      const totalCalories = ItemCtrl.getTotalCalories();
      // Display total Calories
      UICtrl.displayTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();