/**
 * CashClarity - Personal Financial Projection App
 * A vanilla JavaScript application for managing personal finances and projections
 */

class CashClarity {
    constructor() {
        // Application state
        this.currentCash = 0;
        this.incomes = [];
        this.bills = [];

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application - set up event listeners and load saved data
     */
    init() {
        this.setupEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    }

    /**
     * Set up all event listeners for the application
     */
    setupEventListeners() {
        // Current cash update
        document.getElementById('update-cash-btn').addEventListener('click', () => {
            this.updateCurrentCash();
        });

        // Income management
        document.getElementById('add-income-btn').addEventListener('click', () => {
            this.addIncome();
        });

        // Bill management
        document.getElementById('add-bill-btn').addEventListener('click', () => {
            this.addBill();
        });

        // Online fee checkbox toggle
        document.getElementById('bill-online-fee').addEventListener('change', (e) => {
            const feeAmountInput = document.getElementById('bill-online-fee-amount');
            feeAmountInput.disabled = !e.target.checked;
            if (!e.target.checked) {
                feeAmountInput.value = '';
            }
        });

        // Projection calculation
        document.getElementById('calculate-projections-btn').addEventListener('click', () => {
            this.calculateAndDisplayProjections();
        });

        // Enter key support for inputs
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.closest('#income-form')) {
                    this.addIncome();
                } else if (e.target.closest('#bill-form')) {
                    this.addBill();
                } else if (e.target.id === 'current-cash') {
                    this.updateCurrentCash();
                }
            }
        });
    }

    /**
     * Update the current cash amount from user input
     */
    updateCurrentCash() {
        const cashInput = document.getElementById('current-cash');
        const amount = parseFloat(cashInput.value) || 0;
        this.currentCash = amount;
        this.updateCashDisplay();
        this.saveToStorage();
        cashInput.value = '';
    }

    /**
     * Update the cash display element
     */
    updateCashDisplay() {
        const cashDisplay = document.getElementById('cash-display');
        cashDisplay.textContent = this.formatCurrency(this.currentCash);

        // Update styling based on amount
        cashDisplay.className = this.currentCash >= 0 ? 'amount-positive' : 'amount-negative';
    }

    /**
     * Add a new income source
     */
    addIncome() {
        const nameInput = document.getElementById('income-name');
        const amountInput = document.getElementById('income-amount');
        const frequencySelect = document.getElementById('income-frequency');
        const nextDateInput = document.getElementById('income-next-date');

        // Validate inputs
        if (!nameInput.value.trim() || !amountInput.value || !nextDateInput.value) {
            alert('Please fill in all income fields');
            return;
        }

        const income = {
            id: Date.now(), // Simple ID generation
            name: nameInput.value.trim(),
            amount: parseFloat(amountInput.value),
            frequency: frequencySelect.value,
            nextDate: nextDateInput.value
        };

        this.incomes.push(income);
        this.updateIncomeDisplay();
        this.saveToStorage();

        // Clear form
        nameInput.value = '';
        amountInput.value = '';
        nextDateInput.value = '';
    }

    /**
     * Remove an income source by ID
     */
    removeIncome(id) {
        this.incomes = this.incomes.filter(income => income.id !== id);
        this.updateIncomeDisplay();
        this.saveToStorage();
    }

    /**
     * Update the income list display
     */
    updateIncomeDisplay() {
        const incomeList = document.getElementById('income-list');

        if (this.incomes.length === 0) {
            incomeList.innerHTML = '<div class="empty-state">No income sources added yet</div>';
            return;
        }

        incomeList.innerHTML = this.incomes.map(income => `
            <div class="item">
                <div class="item-info">
                    <div class="item-name">${income.name}</div>
                    <div class="item-details">
                        ${this.formatCurrency(income.amount)} • ${this.formatFrequency(income.frequency)} • Next: ${this.formatDate(income.nextDate)}
                    </div>
                </div>
                <div class="item-amount amount-positive">${this.formatCurrency(income.amount)}</div>
                <div class="item-actions">
                    <button class="btn-danger" onclick="app.removeIncome(${income.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Add a new bill
     */
    addBill() {
        const nameInput = document.getElementById('bill-name');
        const amountInput = document.getElementById('bill-amount');
        const dueDateInput = document.getElementById('bill-due-date');
        const prioritySelect = document.getElementById('bill-priority');
        const graceDaysInput = document.getElementById('bill-grace-days');
        const onlineFeeCheckbox = document.getElementById('bill-online-fee');
        const onlineFeeAmountInput = document.getElementById('bill-online-fee-amount');
        const lateFeeInput = document.getElementById('bill-late-fee');
        const canPayLateCheckbox = document.getElementById('bill-can-pay-late');

        // Validate inputs
        if (!nameInput.value.trim() || !amountInput.value || !dueDateInput.value) {
            alert('Please fill in bill name, amount, and due date');
            return;
        }

        const bill = {
            id: Date.now(),
            name: nameInput.value.trim(),
            amount: parseFloat(amountInput.value),
            dueDate: dueDateInput.value,
            priority: prioritySelect.value,
            graceDays: parseInt(graceDaysInput.value) || 0,
            hasOnlineFee: onlineFeeCheckbox.checked,
            onlineFeeAmount: onlineFeeCheckbox.checked ? (parseFloat(onlineFeeAmountInput.value) || 0) : 0,
            lateFee: parseFloat(lateFeeInput.value) || 0,
            canPayLate: canPayLateCheckbox.checked
        };

        this.bills.push(bill);
        this.updateBillsDisplay();
        this.saveToStorage();

        // Clear form
        nameInput.value = '';
        amountInput.value = '';
        dueDateInput.value = '';
        graceDaysInput.value = '';
        onlineFeeCheckbox.checked = false;
        onlineFeeAmountInput.value = '';
        onlineFeeAmountInput.disabled = true;
        lateFeeInput.value = '';
        canPayLateCheckbox.checked = false;
    }

    /**
     * Remove a bill by ID
     */
    removeBill(id) {
        this.bills = this.bills.filter(bill => bill.id !== id);
        this.updateBillsDisplay();
        this.saveToStorage();
    }

    /**
     * Update the bills list display
     */
    updateBillsDisplay() {
        const billsList = document.getElementById('bills-list');

        if (this.bills.length === 0) {
            billsList.innerHTML = '<div class="empty-state">No bills added yet</div>';
            return;
        }

        billsList.innerHTML = this.bills.map(bill => `
            <div class="item priority-${bill.priority}">
                <div class="item-info">
                    <div class="item-name">${bill.name}</div>
                    <div class="item-details">
                        Due: ${this.formatDate(bill.dueDate)} • Priority: ${this.capitalizeFirst(bill.priority)} •
                        Grace: ${bill.graceDays} days ${bill.canPayLate ? '• Can pay late' : ''} ${bill.hasOnlineFee ? '• Online fee: ' + this.formatCurrency(bill.onlineFeeAmount) : ''} ${bill.lateFee > 0 ? '• Late fee: ' + this.formatCurrency(bill.lateFee) : ''}
                    </div>
                </div>
                <div class="item-amount amount-negative">-${this.formatCurrency(bill.amount)}</div>
                <div class="item-actions">
                    <button class="btn-danger" onclick="app.removeBill(${bill.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Calculate and display financial projections
     */
    calculateAndDisplayProjections() {
        const timeframe = document.getElementById('projection-timeframe').value;
        const endDate = this.getEndDate(timeframe);

        // Calculate different scenarios
        const bestCase = this.calculateProjection(endDate, 'best');
        const realistic = this.calculateProjection(endDate, 'realistic');
        const worstCase = this.calculateProjection(endDate, 'worst');

        this.displayProjections([
            { name: 'Best Case (All bills on time)', data: bestCase, type: 'best' },
            { name: 'Realistic (Some late fees)', data: realistic, type: 'realistic' },
            { name: 'Worst Case (All late fees)', data: worstCase, type: 'worst' }
        ]);
    }

    /**
     * Calculate projection for a specific scenario
     */
    calculateProjection(endDate, scenario) {
        const timeline = [];
        let currentBalance = this.currentCash;
        const today = new Date();
        const end = new Date(endDate);

        // Get all events (bills and income) within the timeframe
        const events = this.getEventsInTimeframe(today, end, scenario);

        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Add starting balance
        timeline.push({
            date: this.formatDate(today.toISOString().split('T')[0]),
            action: 'Starting Balance',
            amount: 0,
            balance: currentBalance,
            type: 'balance'
        });

        // Process each event
        events.forEach(event => {
            if (event.type === 'income') {
                currentBalance += event.amount;
                timeline.push({
                    date: this.formatDate(event.date),
                    action: `Income: ${event.name}`,
                    amount: event.amount,
                    balance: currentBalance,
                    type: 'income'
                });
            } else if (event.type === 'bill') {
                let billAmount = event.amount;
                let actionText = `Bill: ${event.name}`;

                // Apply scenario-specific logic
                if (scenario === 'realistic' && event.priority === 'low' && Math.random() > 0.7) {
                    billAmount += event.lateFee;
                    actionText += ' (Late)';
                } else if (scenario === 'worst') {
                    billAmount += event.lateFee;
                    if (event.hasOnlineFee) {
                        billAmount += event.onlineFeeAmount;
                    }
                    actionText += ' (Late + Fees)';
                } else if (event.hasOnlineFee && scenario !== 'best') {
                    billAmount += event.onlineFeeAmount;
                    actionText += ' (Online Fee)';
                }

                currentBalance -= billAmount;
                timeline.push({
                    date: this.formatDate(event.date),
                    action: actionText,
                    amount: -billAmount,
                    balance: currentBalance,
                    type: 'bill'
                });
            }
        });

        return timeline;
    }

    /**
     * Get all events (bills and income) within a timeframe
     */
    getEventsInTimeframe(startDate, endDate, scenario) {
        const events = [];

        // Add bills
        this.bills.forEach(bill => {
            const billDate = new Date(bill.dueDate);
            if (billDate >= startDate && billDate <= endDate) {
                // For realistic and worst case, consider grace period
                let actualDate = billDate;
                if (scenario === 'realistic' && bill.graceDays > 0 && bill.priority === 'low') {
                    actualDate = new Date(billDate.getTime() + (bill.graceDays * 24 * 60 * 60 * 1000));
                } else if (scenario === 'worst' && bill.graceDays > 0) {
                    actualDate = new Date(billDate.getTime() + (bill.graceDays * 24 * 60 * 60 * 1000));
                }

                if (actualDate <= endDate) {
                    events.push({
                        ...bill,
                        date: actualDate.toISOString().split('T')[0],
                        type: 'bill'
                    });
                }
            }
        });

        // Add income
        this.incomes.forEach(income => {
            const incomeDate = new Date(income.nextDate);

            // Generate recurring income based on frequency
            let currentIncomeDate = new Date(incomeDate);
            while (currentIncomeDate <= endDate) {
                if (currentIncomeDate >= startDate) {
                    events.push({
                        ...income,
                        date: currentIncomeDate.toISOString().split('T')[0],
                        type: 'income'
                    });
                }

                // Calculate next occurrence
                if (income.frequency === 'weekly') {
                    currentIncomeDate.setDate(currentIncomeDate.getDate() + 7);
                } else if (income.frequency === 'bi-weekly') {
                    currentIncomeDate.setDate(currentIncomeDate.getDate() + 14);
                } else if (income.frequency === 'monthly') {
                    currentIncomeDate.setMonth(currentIncomeDate.getMonth() + 1);
                } else {
                    // One-time income, break after first occurrence
                    break;
                }
            }
        });

        return events;
    }

    /**
     * Display the projection results
     */
    displayProjections(scenarios) {
        const projectionsDisplay = document.getElementById('projections-display');

        if (scenarios.length === 0) {
            projectionsDisplay.innerHTML = '<div class="empty-state">No projections calculated</div>';
            return;
        }

        projectionsDisplay.innerHTML = scenarios.map(scenario => {
            const finalBalance = scenario.data.length > 0 ? scenario.data[scenario.data.length - 1].balance : this.currentCash;
            const balanceClass = finalBalance >= 0 ? 'balance-positive' : 'balance-negative';

            return `
                <div class="projection-scenario">
                    <h3>${scenario.name} - Final Balance: <span class="${balanceClass}">${this.formatCurrency(finalBalance)}</span></h3>
                    <div class="projection-timeline">
                        ${scenario.data.map(item => `
                            <div class="timeline-item">
                                <div class="timeline-date">${item.date}</div>
                                <div class="timeline-action">${item.action}</div>
                                <div class="timeline-amount ${item.amount >= 0 ? 'amount-positive' : 'amount-negative'}">
                                    ${item.amount !== 0 ? this.formatCurrency(item.amount) : ''}
                                </div>
                                <div class="timeline-balance ${item.balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                                    ${this.formatCurrency(item.balance)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Get end date based on timeframe selection
     */
    getEndDate(timeframe) {
        const today = new Date();
        const endDate = new Date(today);

        switch (timeframe) {
            case 'next-payday':
                // Find next payday (earliest income date)
                const nextPayday = this.getNextPayday();
                return nextPayday || new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)); // Default to 2 weeks
            case '30-days':
                endDate.setDate(today.getDate() + 30);
                break;
            case '60-days':
                endDate.setDate(today.getDate() + 60);
                break;
        }

        return endDate.toISOString().split('T')[0];
    }

    /**
     * Get the next payday date
     */
    getNextPayday() {
        const today = new Date();
        let nextPayday = null;

        this.incomes.forEach(income => {
            const incomeDate = new Date(income.nextDate);
            if (incomeDate > today && (!nextPayday || incomeDate < nextPayday)) {
                nextPayday = incomeDate;
            }
        });

        return nextPayday ? nextPayday.toISOString().split('T')[0] : null;
    }

    /**
     * Save application data to localStorage
     */
    saveToStorage() {
        const data = {
            currentCash: this.currentCash,
            incomes: this.incomes,
            bills: this.bills
        };
        localStorage.setItem('cashClarity', JSON.stringify(data));
    }

    /**
     * Load application data from localStorage
     */
    loadFromStorage() {
        const data = localStorage.getItem('cashClarity');
        if (data) {
            const parsed = JSON.parse(data);
            this.currentCash = parsed.currentCash || 0;
            this.incomes = parsed.incomes || [];
            this.bills = parsed.bills || [];
        }
    }

    /**
     * Update all displays
     */
    updateDisplay() {
        this.updateCashDisplay();
        this.updateIncomeDisplay();
        this.updateBillsDisplay();
    }

    /**
     * Utility function to format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
    }

    /**
     * Utility function to format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Utility function to format frequency
     */
    formatFrequency(frequency) {
        const frequencies = {
            'weekly': 'Weekly',
            'bi-weekly': 'Bi-weekly',
            'monthly': 'Monthly',
            'one-time': 'One-time'
        };
        return frequencies[frequency] || frequency;
    }

    /**
     * Utility function to capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the application when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CashClarity();
});

// Set default date to today for date inputs
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('income-next-date').value = today;
    document.getElementById('bill-due-date').value = today;
});