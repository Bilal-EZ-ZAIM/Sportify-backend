/**
 * Check if the current user owns the specified event.
 *
 * @param {String} owner - The ID of the owner (user ID).
 * @param {String} eventOwner - The ID of the event's owner.
 * @throws {Error} If the user does not own the event.
 */
const checkEventOwnership = (owner, eventOwner) => {
  if (owner.toString() !== eventOwner.toString()) {
    throw new Error("You do not have permission to update this item");
  }
};

module.exports = checkEventOwnership;
