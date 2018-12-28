// Buget APP


// Budget Controller
const budgetController = (function(){
  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(curr){
      sum += curr.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp'
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
      }

      // Push into data structure
      data.allItems[type].push(newItem);

      // Return new element
      return newItem;
    },

    calculateBudget: function() {
      // Calc total income and budget
      calculateTotal('inc');
      calculateTotal('exp');

      // calc the budget: inc - exp
      data.budget = data.totals.inc - data.totals.exp;

      // calc the % of income that we spent
      if (data.totals.inc) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };

})();


// UI Controller
var UIController = (function() {

  const DOMStrings = {
    iType: '.add__type',
    iDesc: '.add__description',
    iValue: '.add__value',
    addBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses==percentage',
    percentageLabel: '.budget__expenses--percentage'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.iType).value, // will be inc or exp
        description: document.querySelector(DOMStrings.iDesc).value, // will be string
        value: parseFloat(document.querySelector(DOMStrings.iValue).value) // will be num
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder
    if (type === 'inc') {
      element = DOMStrings.incomeContainer;

      html = '<div class = "item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    } else if (type === 'exp') {
      element = DOMStrings.expenseContainer;

      html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21 %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

      //replace holder with Data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.iDesc + ', ' + DOMStrings.iValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
      document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
    },

    getDOMStrings: function () {
      return DOMStrings;
    }
  };
})();


// APP Controller
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (e) {

      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const updateBudget = function() {

    // calc the budget
    budgetCtrl.calculateBudget();

    // return the budget
    var budget = budgetCtrl.getBudget();
    // display in the UI
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = function () {
    var input, newItem;

    // 1. Get field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add item to the budgetController
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // Clear the fields
      UICtrl.clearFields();

      // 4. calculate the budget
      updateBudget();
    }

    // 5. display the budget on the UI
      
  };

  return {
    init: function() {
      console.log('started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);


controller.init();





















// end