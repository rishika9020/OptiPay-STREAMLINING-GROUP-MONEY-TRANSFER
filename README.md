# OptiPay: STREAMLINING GROUP MONEY TRANSFER 

## Description
OptiPay is a web-based application developed in C++ that aims to streamline group money transfers among multiple banks with different payment modes. The goal of this project is to minimize the number of transactions required to settle outstanding debts between banks, including an intermediary world bank with all payment modes.

## How it Works
The web application follows the same principles as the original C++ program to minimize cash flow:

1. Input Bank Details: Users enter the number of participating banks and their respective names, along with the number of payment modes they support. The application then records the payment modes for each bank.

2. Transaction Details: Users provide the number of transactions and the corresponding details (debtor bank, creditor bank, and amount) for each transaction.

3. Calculate Net Amounts: The application calculates the net amount for each bank, considering both incoming and outgoing transactions.

4. Minimize Cash Flow: Using a series of optimizations, the application identifies the minimum number of transactions needed to settle all debts. It aims to find transactions with common payment modes to minimize the overall number of transactions.

5. Display Results: Finally, the application displays the transactions required for minimizing the cash flow, along with the payment modes used in each transaction.

## How to Use
1. Launch the web application using a web browser.
2. Enter the required bank and transaction details through the provided input fields.
3. Click the "Minimize Cash Flow" button to process the data and obtain the optimized transactions.
4. View the output, which will display the transactions required to minimize cash flow.

## Sample Input
```
5
A 2 t1 t2
B 1 t1
C 1 t1
D 1 t2
E 1 t2
4
B A 300
C A 700
D B 500
E B 500
```

## Sample Output
```
The transactions for minimum cash flow are as follows:

Bank E pays Rs 500 to Bank A via t2
Bank D pays Rs 200 to Bank A via t2
Bank D pays Rs 300 to Bank B via t2
```

## Note
Please note that the web version of OptiPay functions in the same way as the original C++ program, providing a user-friendly interface for inputting data and displaying the optimized transactions. The web project aims to offer a more accessible and convenient way to utilize the cash flow minimization functionality.
