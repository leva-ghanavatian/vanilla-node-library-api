const userModel = require("../models/User");
const rentModel = require("../models/Rent");
const { ConflictError } = require("../helpers/errors");

const deleteUser = async (userId) => {
    // Check if they have any active rents using your Rent model
    const activeRents = await rentModel.find({ 
        filter: { userId, active: true }, 
        limit: 1 
    });

    if (activeRents.length > 0) {
        throw new ConflictError("Cannot delete user with active rentals.");
    }

    return userModel.deleteUser(userId);
};

module.exports = { deleteUser };