const { getDatabase } = require('./dbConnect');

async function findByAccId(accountId) {
    try {
        const db = await getDatabase();
        // Find the record by accountId
        return await db.collection('accounts').findOne({ accountId: accountId });
    } catch (error) {
        console.error('Error finding records by account id:', error);
        throw error;
    }
}

async function findTotalBalance(userId) {
    try {
        const db = await getDatabase();
        // Find the total balance of an user
        return await db.collection('accounts').aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
        ]).toArray();
    } catch (error) {
        console.error('Error finding the total balance of an user:', error);
        throw error;
    }
}

async function updateBalance(record) {
    try {
        const db = await getDatabase();
        // Update the balance
        const result = await db.collection('accounts').updateOne({ accountId: record.accountId },
            { $set: { balance: record.balance } });
        return result;
    } catch (error) {
        console.error('Error while updating balance:', error);
        throw error;
    }
}

module.exports = { findByAccId, findTotalBalance, updateBalance };
