/**
 * Check if the current user owns the specified event.
 *
 * @param {String} owner - The ID of the owner (user ID).
 * @param {String} eventOwner - The ID of the event's owner.
 * @throws {Error} If the user does not own the event.
 */
const checkEventOwnership = (owner, eventOwner) => {
  console.log(owner.toString(), eventOwner.toString());

  if (owner.toString() !== eventOwner.toString()) {
    throw new Error("Unauthorized: You do not own this event");
  }
};

module.exports = checkEventOwnership;
