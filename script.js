'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calcPrintBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `${acc.balance}€`
}

const calcDisplaySummary = function(account) {
  const incomes = account.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expense = account.movements
  .filter(mov => mov < 0)
  .reduce((mov, acc) => mov + acc,0);
  labelSumOut.textContent = `${Math.abs(expense)}€`

  const interest = account.movements
  .filter(deposit => deposit > 0)
  .map(deposit => deposit * account.interestRate / 100)
  .filter((int, i, arr) => {
    // console.log(arr);
    return int >= 1.0;
  })
  .reduce((acc, mov) => acc + mov, 0)
  labelSumInterest.textContent = `${interest}€`
}

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  })
}
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcPrintBalance(acc);
  
  // Display Summary
  calcDisplaySummary(acc);
}

// Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome msg
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault(); // prevents reloading the page
  const amount = Number(inputTransferAmount.value);
  const receiverAcct = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 &&
    receiverAcct &&
    amount <= currentAccount.balance &&
    receiverAcct?.username !== currentAccount.username) {
      // Doing the Xfer
      currentAccount.movements.push(-amount);
      receiverAcct.movements.push(amount);

      // Update UI
      updateUI(currentAccount);
    }
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.10)) {
      // Add movement
      currentAccount.movements.push(amount);

      // Update UI
      updateUI(currentAccount);
    }
    inputLoanAmount.value = ''
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin) {
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      console.log(index);

      // Hide UI
      containerApp.style.opacity = 0;

      // Delete Account
      accounts.splice(index, 1);
  }

  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////

/*

let arr = ['a','b','c','d','e'];

// SLICE ---------- does not remove elements
console.log(arr.slice(2));    // Returns c, d, e
console.log(arr.slice(2,4));  // Returns c, d
console.log(arr.slice(-2));   // Returns d, e
console.log(arr.slice(-1));   // Last element of the array
console.log(arr.slice(1,-2)); // Returns b, c
console.log(arr.slice());     // Shallow Copy
console.log([...arr]);        // Shallow Copy

// SPLICE --------- removes elements
// console.log(arr.splice(2));   // Returns c, d, e
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE -------- reverses the array
arr = ['a','b','c','d','e'];
const arr2 = ['j','i','h','g','f'];
console.log(arr2.reverse());  // mutates the array
console.log(arr2);

// CONCAT ---------- joins two arrays
const letters = arr.concat(arr2);
console.log(letters);         // full alphabet, from two joined arrays
console.log([...arr, ...arr2]); // gives same result as concat method

// JOIN
console.log(letters.join(' - ')); // returns array as string

// ----------------- New 'at' Method

const arr = [23, 11, 64];
console.log(arr[0]);        // returns first element in array
console.log(arr.at(0));     // returns first element in array

// getting last element in array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('ryan'.at(0));  // returns 'r'
console.log('ryan'.at(-1)); // returns 'n'

// LOOPING ARRAYS

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if(movement > 0) {
    console.log(`Movement ${i+1} You deposited ${movement}.`);
  } else {
    console.log(`Movement ${i+1} You withdrew ${Math.abs(movement)}.`);
  }
};

console.log('----- forEach -----');
movements.forEach(function(mov, i, arr) {
  if(mov > 0) {
    console.log(`Movement ${i+1} You deposited ${mov}.`);
  } else {
    console.log(`Movement ${i+1} You withdrew ${Math.abs(mov)}.`);
  }
});

// In a for / of loop
// first element is index, second is value

// In a forEach loop --- CANNOT BE BROKEN
// first element is value, second is index, third is array name

// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...

// Looping over maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(val, i, arr) {
  console.log(`${i}: ${val}`);
})

// Looping over sets
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(val, _, arr) {
  console.log(`${val}: ${val}`);
  // no key and no value, so these will be the same
});

// Coding Challenge 1

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function(arr1, arr2) {
  // 1. Removes cats
  const dogsJuliaNew = arr1.slice();
  dogsJuliaNew.splice(0,1);
  dogsJuliaNew.splice(-2);
  // 2. Create array with both data
  const allDogs = [...dogsJuliaNew,...arr2];
  // 3. Determine Adult / Puppy
  allDogs.forEach(function(age, dog, arr) {
    let pupOrAdult;
    if (age < 3) {
      pupOrAdult = 'puppy';
    } else {
      pupOrAdult = 'adult';
    }
    console.log(`Dog ${dog+1}: ${pupOrAdult} (${age} years old)`);
  })
}

checkDogs(dogsJulia, dogsKate);
console.log('------------------');
checkDogs(dogsJulia2, dogsKate2);


// MAP METHOD

const eurToUSD = 1.1;

// const movementsUSD = movements.map(function(mov) {
//   return mov * eurToUSD;
// })

// in an Arrow Function
const movementsUSD = movements.map(mov => mov * eurToUSD);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for(const mov of movements) movementsUSDfor.push(mov * eurToUSD);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i) => `Movement ${i+1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}.`)

console.log(movementsDescriptions);


const deposits = movements.filter(mov => mov > 0)
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0)
console.log(withdrawals);

console.log(movements);

// accumulation --> snow-ball effect
// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`iteration #${i}: ${acc}`);
//   return acc + cur;
// }, 0);
const balance = movements.reduce((acc,cur) => acc + cur)
console.log(balance);

let balance2 = 0;
for(const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const maxVal = movements.reduce((max, cur) => max > cur ? max : cur, movements[0])
console.log(maxVal);

const dogs1 = [5, 2, 4, 1, 15, 8, 3];
const dogs2 = [16, 6, 10, 5, 6, 1, 4];

// edited

const calcAverageHumanAge = function(ages) {
  // console.log('dog ages',ages);
  
  // 1.
  const humanAges = ages.map((age) => age <= 2 ? age * 2 : 16 + age * 4)
  // console.log('human ages',humanAges);

  // 2.
  const adultDogs = humanAges.filter((age) => age >= 18)
  // console.log('adult dog ages',adultDogs);

  // 3.
  const averageAges = adultDogs.reduce((acc, cur) => (acc + cur) / adultDogs.length)
  // console.log('avg age',averageAges)

}

const calcAverageHumanAge2 = ages =>
  ages
  .map((age) => age <= 2 ? age * 2 : 16 + age * 4)
  .filter((age) => age >= 18)
  .reduce((acc, cur, i, arr) => (acc + cur) / arr.length)

// 4.
console.log('');
console.log('--------------- DATA 2 ---------------');
const avg1 = calcAverageHumanAge(dogs1);


console.log('');
console.log('///////// Coding Challenge 4 ///////////');
const avg2 = calcAverageHumanAge(dogs2);

console.log(calcAverageHumanAge2(dogs1));

const eurToUSD = 1.1;

// PIPELINE & METHOD CHAINING
const totalBalanceUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUSD
  })
  // .map(mov => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov, 0)

// console.log(totalBalanceUSD);

// Find Method -- returns the first method that matches that Condition

const firstWithdrawal = movements.find(mov => mov < 0)

// console.log(movements)
// console.log(firstWithdrawal);;

// console.log(accounts);

const account = accounts.find(acc => acc.owner === "Jessica Davis")
// console.log(account);

console.log(movements);

// INCLUDES method
// only checks for EQUALITY
console.log(movements.includes(-130));
console.log(movements.some(mov => mov === -130));

// SOME method
// can include CONDITIONS
const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

// EVERY method
// every array element meets the condition; returns TRUE
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// FLAT method, removes nesting
const arr = [[1, 2, 3], [4, 5, 6], 7, 8]
console.log(arr.flat());

// FLAT method, removes nesting
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat().flat());

// .flat(depth) 
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements)
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, cur) => acc + cur, 0)
console.log(overallBalance);

// chaining methods
const overallBalanceChain = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalanceChain);

// flatMap method
const overallBalanceFlatMap = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalanceFlatMap);

// Strings [mutates the array]
const owners = ['Ryan','Zack','Adam','Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// console.log(movements.sort());  <<< does not work

// return < 0, -- A, B  (keep order)
// return > 0, -- B, A (switch order)

/////////////////////////////// Ascending sort
// movements.sort((a,b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a,b) => a - b);
console.log(movements);

/////////////////////////////// Descending sort
// movements.sort((a,b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a,b) => b - a);

console.log(movements);

// empty arrays + fill method
const arr = [1,2,3,4,5,6,7];
console.log(new Array(1,2,3,4,5,6,7));

const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5))
x.fill(1, 3, 5)
x.fill(1);
console.log(x);

arr.fill(23, 2, 6)
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1)
console.log(z);

const diceRolls100 = Array.from({length: 100}, (x) => Math.floor(Math.random() * 7))
console.log(diceRolls100);

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // const movementsUI2 = [...document.querySelectorAll('.movements__value')];  << not mapped at all. best to use Array.from
});

*/

/*

Which array method to use?

Mutate the original array
-- Add to the original:
  .push       end
  .unshift    start
-- Remove from the original:
  .pop        end
  .shift      start
  .splice     any
-- Others:
  .reverse
  .sort
  .fill

A New Array
-- Computed from original:
  .map        loop
-- Filtered using condition:
  .filter
-- Portion of original:
  .slice
-- Adding original to other:
  .concat
-- Flattening the original:
  .flat
  .flatMap

An Array Index
-- Based on value:
  .indexOf
-- Based on test condition:
  .findIndex

An Array Element
-- Based on test condition:
  .find

Know if array includes
-- Based on value:
  .includes
-- Based on test condtion:
  .some
  .every

A new string
-- Based on operator string:
  .join

To transform to value
-- Based on accumulator
  .reduce
  (merges all elements to a single value of any time)

To just loop the array
-- Based on callback
  .forEach
  (does not create a new array, just loops over it)

/////////////////////////////////
// Array Exercise

// 1.

const bankDespositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDespositSum);

// 2.
// const numDeposits1000 = accounts
//  .flatMap(acc => acc.movements)
//  .filter(mov => mov >= 1000)
//  .length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => cur >= 1000 ? ++count : count, 0);

console.log(numDeposits1000);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const {deposits, withdrawals} = accounts
  .flatMap(acc => acc.movements)
  .reduce((sums, cur) => {
    // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
    return sums;
  }, {deposits: 0, withdrawals: 0});

console.log(deposits, withdrawals);

// 4.
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {

  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an','the','but','or','on','in','with','and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map((firstLetter, _, word) => exceptions.includes(firstLetter) || firstLetter === word[0] ? firstLetter : capitalize(firstLetter))
    .join(' ');
  return capitalize(titleCase);
}

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is too, but a little longer'));
console.log(convertTitleCase('and here is another EXAMPLE, and so is This oNE'));

*/


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
const foodFormula = function(weight) {
  const recommendedFood = weight * 0.75 * 28;
  return recommendedFood;
}

const formula = function (allDogs) {
  const ownersEatTooMuch = [];
  const ownersEatTooLittle = [];
  allDogs.forEach(function (dog, i) {
    const recommendedFood = foodFormula(dog.weight)
    dog.recommendedFood = recommendedFood;
    console.log(`Dog ${i+1}: ${dog.weight} kg, ${recommendedFood} g of food, currently eats ${dog.curFood} g of food.`);
    // console.log(dog);

    // 2.
    if (dog.owners.includes('Sarah')) {
      console.log(dogEvaluation(dog));
    } else {
      // 3. & 4.
      console.log(dogEvaluation(dog));
    }

    // 3.
    dog.curFood > dog.recommendedFood ? ownersEatTooMuch.push(...dog.owners) : ownersEatTooLittle.push(...dog.owners)
  })
  console.log(ownersEatTooMuch);
  console.log(ownersEatTooLittle);
  console.log(`There are`);
}

// 4.
const dogEvaluation = function(dog) {
  return `${dog.owners.join(' and ')}'s dog eats ${dog.curFood > dog.recommendedFood ? 'too much' : 'too little'}.`
}

formula(dogs);

// 3.
const ownersEatTooMuch = dogs
.filter(dog => dog.curFood > dog.recommendedFood)
.flatMap(dog => dog.owners)

const ownersEatTooLittle = dogs
.filter(dog => dog.curFood < dog.recommendedFood)
.flatMap(dog => dog.owners)

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 5.
const ownersEatJustRight = dogs
.reduce((count, dog) => dog.curFood === dog.recommendedFood ? ++count : count, 0);

console.log(ownersEatJustRight > 0)

// 6.
const okayFood = dogs.reduce((count, dog) => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1) ? ++count : count, 0)

console.log(okayFood > 0);

// 7.
const okayFoodDogs = dogs.filter(dog => dog.curFood < dog.recommendedFood)
.flatMap(dog => dog)

console.log(okayFoodDogs);

// 8.
console.log(dogs.slice(0,-1).sort(function(a,b) {
  if (a.recommendedFood > b.recommendedFood) return 1
  if (a.recommendedFood < b.recommendedFood) return -1
}));