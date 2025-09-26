# 💰 CashClarity - Personal Financial Projection App

CashClarity is a simple, vanilla JavaScript application designed to help you manage and project your personal finances. Built with educational purposes in mind, this app uses clean, readable code that beginners can easily understand and modify.

## 🚀 Quick Start

1. **Clone or download** this repository to your computer
2. **Open `index.html`** in any modern web browser
3. **Start managing** your finances immediately - no installation required!

## 📁 Project Structure

```
claudeCashClarity/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js              # Core application logic and functionality
└── README.md           # This documentation file
```

## ✨ Features

### 💸 Current Cash Management
- Set and update your current cash on hand
- Visual indicators for positive/negative balances
- Persistent storage across browser sessions

### 💼 Income Sources
- Add multiple income sources (salary, freelance, etc.)
- Support for different frequencies:
  - Weekly
  - Bi-weekly
  - Monthly
  - One-time payments
- Automatic recurring income calculations
- Set next expected payment dates

### 📋 Bill Management
- Comprehensive bill tracking with:
  - **Name** and **amount**
  - **Due dates** with visual priority indicators
  - **Priority levels** (High, Medium, Low)
  - **Grace periods** (days you can pay late)
  - **Online payment fees** (optional)
  - **Late fees** (fixed amounts)
  - **Pay-late capability** flags

### 📊 Financial Projections
Three projection scenarios:
1. **Best Case**: All bills paid on time, no extra fees
2. **Realistic**: Some late payments on low-priority bills
3. **Worst Case**: All possible late fees and online fees applied

Projection timeframes:
- Until next payday
- Next 30 days
- Next 60 days

## 🛠️ How to Use

### Setting Up Your Financial Data

1. **Enter Current Cash**:
   ```
   Input your current available money → Click "Update"
   ```

2. **Add Income Sources**:
   ```
   Enter income name (e.g., "Salary")
   → Enter amount (e.g., 3000)
   → Select frequency (Monthly)
   → Choose next payment date
   → Click "Add Income"
   ```

3. **Add Bills**:
   ```
   Enter bill name (e.g., "Rent")
   → Enter amount (e.g., 1200)
   → Set due date
   → Choose priority level
   → Set grace period (days)
   → Add online/late fees if applicable
   → Click "Add Bill"
   ```

### Running Projections

1. Click **"Calculate Projections"**
2. Choose your desired timeframe
3. Review the three scenarios displayed
4. Use the information to make informed financial decisions

## 🔧 Customization Guide

### Adding New Income Frequencies

In `app.js`, locate the `getEventsInTimeframe` method around line 300:

```javascript
// Add your custom frequency here
if (income.frequency === 'quarterly') {
    currentIncomeDate.setMonth(currentIncomeDate.getMonth() + 3);
}
```

### Modifying Projection Logic

The projection calculations are in the `calculateProjection` method (line 250). You can customize:

- **Realistic scenario probability**: Change `Math.random() > 0.7` to adjust how often low-priority bills are paid late
- **Fee application logic**: Modify when online fees and late fees are applied
- **Priority handling**: Adjust how different priority levels affect payment timing

### Styling Customization

In `styles.css`, key areas to customize:

- **Colors**: Search for color codes (e.g., `#3498db`) to change the theme
- **Spacing**: Modify padding and margin values
- **Typography**: Change font families in the `body` selector
- **Responsive breakpoints**: Adjust `@media` queries for different screen sizes

### Adding New Features

To add new bill properties:

1. **Update HTML form** in `index.html` (around line 60)
2. **Modify the `addBill` method** in `app.js` (around line 150)
3. **Update the display** in `updateBillsDisplay` method (around line 200)
4. **Adjust projections** if the new property affects calculations

## 📐 How Projections Work

### Calculation Process

1. **Timeline Generation**: Creates a chronological list of all financial events (bills and income) within the selected timeframe

2. **Scenario Application**:
   - **Best Case**: Bills paid exactly on due date, no additional fees
   - **Realistic**: 30% chance low-priority bills are paid late (within grace period)
   - **Worst Case**: All bills paid at the end of grace period with maximum fees

3. **Balance Tracking**: Starting from current cash, each event updates the running balance

4. **Fee Calculation**:
   ```javascript
   // Example fee calculation logic
   let totalBillCost = baseBillAmount;
   if (payingLate) totalBillCost += lateFee;
   if (payingOnline) totalBillCost += onlineFee;
   ```

### Formula Examples

**Next Payday Calculation**:
```javascript
// Find earliest upcoming income date
const nextPayday = incomes
    .map(income => new Date(income.nextDate))
    .filter(date => date > today)
    .sort((a, b) => a - b)[0];
```

**Recurring Income Generation**:
```javascript
// Generate weekly income instances
while (currentDate <= endDate) {
    addIncomeEvent(currentDate);
    currentDate.setDate(currentDate.getDate() + 7);
}
```

## 💾 Data Storage

CashClarity uses browser `localStorage` to save your data:

- **Location**: Browser's local storage (not sent to any server)
- **Persistence**: Data survives browser restarts
- **Privacy**: All data stays on your computer
- **Clearing**: Use browser settings to clear stored data

### Storage Structure
```javascript
{
    currentCash: 1500.00,
    incomes: [
        {
            id: 1635123456789,
            name: "Salary",
            amount: 3000,
            frequency: "monthly",
            nextDate: "2024-02-01"
        }
    ],
    bills: [
        {
            id: 1635123456790,
            name: "Rent",
            amount: 1200,
            dueDate: "2024-01-31",
            priority: "high",
            graceDays: 5,
            lateFee: 50
        }
    ]
}
```

## 🎯 Future Enhancement Ideas

### Easy Additions
- **Bill categories** (Housing, Utilities, Entertainment)
- **Export to CSV** functionality
- **Monthly/yearly summaries**
- **Savings goals** tracking

### Intermediate Features
- **Recurring bills** (not just one-time)
- **Percentage-based late fees** (instead of fixed amounts)
- **Multiple currencies** support
- **Dark/light theme** toggle

### Advanced Features
- **Bank account integration** (via APIs like Plaid)
- **Graphical charts** for visualizations
- **Budget vs. actual** tracking
- **Debt payoff** calculators

## 🏗️ Code Architecture

### Main Class: `CashClarity`

**Key Methods**:
- `init()`: Sets up event listeners and loads data
- `addIncome()` / `addBill()`: Manage financial items
- `calculateProjection()`: Core projection logic
- `saveToStorage()` / `loadFromStorage()`: Data persistence

### Event-Driven Design
The app uses standard DOM events:
```javascript
// Example event listener setup
document.getElementById('add-bill-btn')
    .addEventListener('click', () => this.addBill());
```

### Modular Structure
Each major feature is contained in its own methods, making it easy to:
- **Debug** specific functionality
- **Add features** without breaking existing code
- **Understand** how each part works independently

## 🐛 Troubleshooting

### Common Issues

**Data Not Saving**:
- Check if your browser allows localStorage
- Try refreshing the page
- Clear browser cache and try again

**Projections Not Calculating**:
- Ensure you have both income and bills added
- Check that dates are in the future
- Verify amounts are valid numbers

**Styling Issues**:
- Ensure `styles.css` is in the same folder as `index.html`
- Check browser console for any error messages
- Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Browser Compatibility
- **Chrome**: Fully supported
- **Firefox**: Fully supported
- **Safari**: Fully supported
- **Edge**: Fully supported
- **Internet Explorer**: Not supported (uses modern JavaScript)

## 📝 Contributing & Learning

### Making Your First Modification

1. **Change a color**: Edit a hex color code in `styles.css`
2. **Add a field**: Add a new input to the bill form
3. **Modify text**: Change button labels or section titles
4. **Adjust logic**: Modify the realistic scenario probability

### Code Learning Path

1. **Start with HTML** (`index.html`): Understand the structure
2. **Explore CSS** (`styles.css`): See how styling works
3. **Dive into JavaScript** (`app.js`): Learn the interactive logic
4. **Add features**: Start with small additions and work up

### Best Practices Demonstrated

- **Separation of concerns**: HTML structure, CSS styling, JS behavior
- **Readable code**: Descriptive variable names and comments
- **Error handling**: Input validation and user feedback
- **Responsive design**: Works on desktop and mobile
- **Progressive enhancement**: Works without JavaScript for basic viewing

---

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed for personal and educational purposes.

---

**Built with ❤️ for learning and personal finance management**