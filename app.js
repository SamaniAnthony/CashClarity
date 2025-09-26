//What is today
//How much money do we have on hand 
//Do we have any overdue bills?
// When is the next bill due? 
// When is the next payday?

//Also need prioritization of sorts for each bill type 
let bills =[
    {
        name: "Rent",
        amount: 3125,
        dueDate: 1, 
        status: "paid" // pending, overdue - sub categories for late payments. 60 days etc  
    },
    {
        name: "Food",
        amount: 2500,
        dueDate: 1,
        status: "pending"    
    }
];

function cashProjection(cashOnHand, bills) {
    //we will need to check for any overdue bills or amounts.  
    let projectedAvaialableBalance = cashOnHand - bills; 
    return projectedAvaialableBalance;
}

let cashOnHand = 0;
let payday = {
    date: null,
    amount: 0
};
//TO DO: Need to make it iterate automatically based on income frequency. Dropdown preferably.
function setPayday(paydate, amount){
    payday.date = new Date(paydate);
    payday.amount = amount;
};

function setCashOnHand(amount) {
    cashOnHand = amount;
};
//TO DO: add late fees and related info.
function addBill(name, amount, dueDate) {
    bills.push({
        name, 
        amount, 
        dueDate: new Date(dueDate)
    })
};
console.log(bills);
