// 1. Initialize data from LocalStorage
let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];

// 2. DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalSpentEl = document.getElementById('totalSpent');
const categoryBreakdownEl = document.getElementById('categoryBreakdown');

// Set today's date as default in the form
document.getElementById('expDate').valueAsDate = new Date();

// 3. Form Submission
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('expName').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    const category = document.getElementById('expCategory').value;
    const date = document.getElementById('expDate').value;

    const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(newExpense);
    saveData();
    expenseForm.reset();
    document.getElementById('expDate').valueAsDate = new Date(); // Reset date to today
    
    updateDashboard();
});

// 4. Save to LocalStorage
function saveData() {
    localStorage.setItem('myExpenses', JSON.stringify(expenses));
}

// 5. Delete Expense
window.deleteExpense = function(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveData();
    updateDashboard();
}

// 6. Core Function: Update UI and Calculate Analytics
function updateDashboard() {
    // Reset HTML containers
    expenseList.innerHTML = '';
    categoryBreakdownEl.innerHTML = '';

    let totalAmount = 0;
    
    // Object to hold total spent per category
    // Example format: { "Food": 1500, "Transport": 500 }
    let categoryTotals = {}; 

    // Loop through expenses to build table and aggregate data
    expenses.forEach(exp => {
        // Add to total
        totalAmount += exp.amount;

        // Add to category totals (Analytics Logic)
        if (categoryTotals[exp.category]) {
            categoryTotals[exp.category] += exp.amount;
        } else {
            categoryTotals[exp.category] = exp.amount;
        }

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.name}</td>
            <td>${exp.category}</td>
            <td>₹${exp.amount.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${exp.id})">Remove</button></td>
        `;
        expenseList.appendChild(row);
    });

    // Update Total Spent UI
    totalSpentEl.innerText = `₹${totalAmount.toFixed(2)}`;

    // Generate Category Breakdown UI
    if (expenses.length === 0) {
        categoryBreakdownEl.innerHTML = '<p class="empty-msg">No data to analyze yet.</p>';
        return;
    }

    // Convert the categoryTotals object into an array and sort it by amount (highest first)
    const sortedCategories = Object.keys(categoryTotals).sort((a, b) => {
        return categoryTotals[b] - categoryTotals[a];
    });

    // Render the analytics breakdown
    sortedCategories.forEach(category => {
        const amount = categoryTotals[category];
        const percentage = ((amount / totalAmount) * 100).toFixed(1);

        const catDiv = document.createElement('div');
        catDiv.className = 'category-row';
        catDiv.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-amount">₹${amount.toFixed(2)} (${percentage}%)</span>
        `;
        categoryBreakdownEl.appendChild(catDiv);
    });
}

// 7. Initial Load
updateDashboard();
