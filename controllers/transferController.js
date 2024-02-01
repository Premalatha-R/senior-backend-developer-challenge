const accounts = require('../models/accounts');

exports.transferAmount = async (req, res, next) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    // Validate input values
    const validationError = await checkValidation(req.body);
    if (validationError.errorMessage) {
      return res.status(400).json({ errorCode: 'VALERR', errorMessage: validationError.errorMessage });
    }

    // Fetch source and destination accounts
    const sourceAccount = await accounts.findByAccId(fromAccountId);
    const destAccount = await accounts.findByAccId(toAccountId);

    // Check if both accounts exists or not
    if (!sourceAccount || !destAccount) {
      return res.status(400).json({ errorCode: 'NOTFOUND', errorMessage: 'Account is not found' });
    }

    // Transfer between accounts belonging to the same user is not allowed.
    if (sourceAccount.userId == destAccount.userId) {
      return res.status(400).json({ errorCode: 'SAMEUSER', errorMessage: 'Transfer between accounts belonging to the same user is not allowed' });
    }

    // Check balance in source account
    if (sourceAccount.balance < amount) {
      return res.status(400).json({ errorCode: 'INSUFBAL', errorMessage: 'Insufficient balance to make transfer' });
    }

    // The balance in the ‘BasicSavings’ account type should never exceed Rs. 50,000
    if (destAccount.type === 'BasicSavings' && destAccount.balance + amount > 50000) {
      return res.status(400).json({ errorCode: 'MAXLIMIT', errorMessage: 'The balance in the BasicSavings account type should never exceed Rs. 50,000' });
    }

    // Update the balance in both accounts
    sourceAccount.balance -= amount;
    destAccount.balance += amount;

    await Promise.all([accounts.updateBalance(sourceAccount), accounts.updateBalance(destAccount)]);

    // Find the total balance of destination user
    const total = await accounts.findTotalBalance(destAccount.userId);

    res.status(200).json({
      newSrcBalance: sourceAccount.balance,
      totalDestBalance: total[0].totalBalance,
      transferedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

const checkValidation = (data) => {
  const { fromAccountId, toAccountId, amount } = data;
  let validationError = {};

  // Check if required fields are present or not
  if (!fromAccountId || !toAccountId || !amount) {
    validationError["errorMessage"] = 'Missing required field(s)';
    if (amount == 0) {
      validationError["errorMessage"] = 'Amount must be a positive number';
    }
  }

  // Check if amount is a number and > 0
  else if (typeof amount !== 'number' || amount <= 0) {
    validationError["errorMessage"] = 'Amount must be a positive number';
  }

  return validationError;
};
