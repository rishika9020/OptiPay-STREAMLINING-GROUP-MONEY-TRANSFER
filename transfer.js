class Bank {
    constructor() {
        this.name = '';
        this.netAmount = 0;
        this.types = new Set();
    }
}

function getMinIndex(listOfNetAmounts, numBanks) {
    let min = Infinity;
    let minIndex = -1;
    for (let i = 0; i < numBanks; i++) {
        if (listOfNetAmounts[i].netAmount === 0) continue;

        if (listOfNetAmounts[i].netAmount < min) {
            minIndex = i;
            min = listOfNetAmounts[i].netAmount;
        }
    }
    return minIndex;
}

function getSimpleMaxIndex(listOfNetAmounts, numBanks) {
    let max = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < numBanks; i++) {
        if (listOfNetAmounts[i].netAmount === 0) continue;

        if (listOfNetAmounts[i].netAmount > max) {
            maxIndex = i;
            max = listOfNetAmounts[i].netAmount;
        }
    }
    return maxIndex;
}

function getMaxIndex(listOfNetAmounts, numBanks, minIndex, input, maxNumTypes) {
    let max = -Infinity;
    let maxIndex = -1;
    let matchingType = '';

    for (let i = 0; i < numBanks; i++) {
        if (listOfNetAmounts[i].netAmount === 0) continue;

        if (listOfNetAmounts[i].netAmount < 0) continue;

        // TODO: see complexity of intersection

        const v = new Array(maxNumTypes);
        const ls = listOfNetAmounts[minIndex].types.values();
        const rs = listOfNetAmounts[i].types.values();
        const lsIterator = ls[Symbol.iterator]();
        const rsIterator = rs[Symbol.iterator]();

        let lsValue = lsIterator.next();
        let rsValue = rsIterator.next();
        let index = 0;

        while (!lsValue.done && !rsValue.done) {
            if (lsValue.value === rsValue.value) {
                v[index] = lsValue.value;
                index++;
                lsValue = lsIterator.next();
                rsValue = rsIterator.next();
            } else if (lsValue.value < rsValue.value) {
                lsValue = lsIterator.next();
            } else {
                rsValue = rsIterator.next();
            }
        }

        const commonTypes = v.slice(0, index);

        if (commonTypes.length !== 0 && max < listOfNetAmounts[i].netAmount) {
            max = listOfNetAmounts[i].netAmount;
            maxIndex = i;
            matchingType = commonTypes[0];
        }
    }

    // if there is NO such max which has a common type with any remaining banks then maxIndex has -1
    // also return the common payment type
    return [maxIndex, matchingType];
}

function printAns(ansGraph, numBanks, input) {
    console.log('\nThe transactions for minimum cash flow are as follows:\n\n');
    for (let i = 0; i < numBanks; i++) {
        for (let j = 0; j < numBanks; j++) {
            if (i === j) continue;

            if (ansGraph[i][j][0] !== 0 && ansGraph[j][i][0] !== 0) {
                if (ansGraph[i][j][0] === ansGraph[j][i][0]) {
                    ansGraph[i][j][0] = 0;
                    ansGraph[j][i][0] = 0;
                } else if (ansGraph[i][j][0] > ansGraph[j][i][0]) {
                    ansGraph[i][j][0] -= ansGraph[j][i][0];
                    ansGraph[j][i][0] = 0;

                    console.log(input[i].name + ' pays Rs ' + ansGraph[i][j][0] + ' to ' + input[j].name + ' via ' + ansGraph[i][j][1]);
                } else {
                    ansGraph[j][i][0] -= ansGraph[i][j][0];
                    ansGraph[i][j][0] = 0;

                    console.log(input[j].name + ' pays Rs ' + ansGraph[j][i][0] + ' to ' + input[i].name + ' via ' + ansGraph[j][i][1]);
                }
            } else if (ansGraph[i][j][0] !== 0) {
                console.log(input[i].name + ' pays Rs ' + ansGraph[i][j][0] + ' to ' + input[j].name + ' via ' + ansGraph[i][j][1]);
            } else if (ansGraph[j][i][0] !== 0) {
                console.log(input[j].name + ' pays Rs ' + ansGraph[j][i][0] + ' to ' + input[i].name + ' via ' + ansGraph[j][i][1]);
            }

            ansGraph[i][j][0] = 0;
            ansGraph[j][i][0] = 0;
        }
    }
    console.log('\n');
}

function minimizeCashFlow(numBanks, input, indexOf, numTransactions, graph, maxNumTypes) {
    // Find net amount of each bank
    const listOfNetAmounts = Array.from({ length: numBanks }, () => new Bank());

    for (let b = 0; b < numBanks; b++) {
        listOfNetAmounts[b].name = input[b].name;
        listOfNetAmounts[b].types = input[b].types;

        let amount = 0;

        // Incoming edges (column traverse)
        for (let i = 0; i < numBanks; i++) {
            amount += graph[i][b];
        }

        // Outgoing edges (row traverse)
        for (let j = 0; j < numBanks; j++) {
            amount += -graph[b][j];
        }

        listOfNetAmounts[b].netAmount = amount;
    }

    const ansGraph = Array.from({ length: numBanks }, () => Array.from({ length: numBanks }, () => [0, '']));

    let numZeroNetAmounts = 0;

    for (let i = 0; i < numBanks; i++) {
        if (listOfNetAmounts[i].netAmount === 0) numZeroNetAmounts++;
    }

    while (numZeroNetAmounts !== numBanks) {
        const minIndex = getMinIndex(listOfNetAmounts, numBanks);
        const [maxIndex, matchingType] = getMaxIndex(listOfNetAmounts, numBanks, minIndex, input, maxNumTypes);

        if (maxIndex === -1) {
            ansGraph[minIndex][0][0] += Math.abs(listOfNetAmounts[minIndex].netAmount);
            ansGraph[minIndex][0][1] = Array.from(input[minIndex].types)[0];

            const simpleMaxIndex = getSimpleMaxIndex(listOfNetAmounts, numBanks);
            ansGraph[0][simpleMaxIndex][0] += Math.abs(listOfNetAmounts[minIndex].netAmount);
            ansGraph[0][simpleMaxIndex][1] = Array.from(input[simpleMaxIndex].types)[0];

            listOfNetAmounts[simpleMaxIndex].netAmount += listOfNetAmounts[minIndex].netAmount;
            listOfNetAmounts[minIndex].netAmount = 0;

            if (listOfNetAmounts[minIndex].netAmount === 0) numZeroNetAmounts++;

            if (listOfNetAmounts[simpleMaxIndex].netAmount === 0) numZeroNetAmounts++;
        } else {
            const transactionAmount = Math.min(Math.abs(listOfNetAmounts[minIndex].netAmount), listOfNetAmounts[maxIndex].netAmount);

            ansGraph[minIndex][maxIndex][0] += transactionAmount;
            ansGraph[minIndex][maxIndex][1] = matchingType;

            listOfNetAmounts[minIndex].netAmount += transactionAmount;
            listOfNetAmounts[maxIndex].netAmount -= transactionAmount;

            if (listOfNetAmounts[minIndex].netAmount === 0) numZeroNetAmounts++;

            if (listOfNetAmounts[maxIndex].netAmount === 0) numZeroNetAmounts++;
        }
    }

    printAns(ansGraph, numBanks, input);
}

// Correct
console.log('\n\t\t\t\t********************* Welcome to CASH FLOW MINIMIZER SYSTEM ***********************\n\n\n');
console.log('This system minimizes the number of transactions among multiple banks in different corners of the world that use different modes of payment. There is one world bank (with all payment modes) to act as an intermediary between banks that have no common mode of payment.\n\n');
console.log('Enter the number of banks participating in the transactions.\n');
const numBanks = parseInt(readline());
const input = [];
const indexOf = {};

console.log('Enter the details of the banks and transactions as stated:');
console.log('Bank name, the number of payment modes it has, and the payment modes.');
console.log('Bank name and payment modes should not contain spaces.\n');

let maxNumTypes;

for (let i = 0; i < numBanks; i++) {
    if (i === 0) {
        console.log('World Bank:');
    } else {
        console.log(`Bank ${i}:`);
    }

    const bank = new Bank();
    bank.name = readline();
    indexOf[bank.name] = i;

    const numTypes = parseInt(readline());

    if (i === 0) maxNumTypes = numTypes;

    for (let j = 0; j < numTypes; j++) {
        const type = readline();
        bank.types.add(type);
    }

    input.push(bank);
}

console.log('Enter the number of transactions.\n');
const numTransactions = parseInt(readline());
const graph = Array.from({ length: numBanks }, () => Array.from({ length: numBanks }, () => 0));

console.log('Enter the details of each transaction as stated:');
console.log('Debtor Bank, creditor Bank, and amount.');
console.log('The transactions can be in any order.\n');

for (let i = 0; i < numTransactions; i++) {
    console.log(`${i}th transaction:`);
    const [s1, s2, amount] = readline().split(' ');

    graph[indexOf[s1]][indexOf[s2]] = parseInt(amount);
}

minimizeCashFlow(numBanks, input, indexOf, numTransactions, graph, maxNumTypes);
