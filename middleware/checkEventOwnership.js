/**
 * Check if the current user owns the specified event.
 *
 * @param {String} owner - The ID of the owner (user ID).
 * @param {String} eventOwner - The ID of the event's owner.
 * @throws {Error} If the user does not own the event.
 */
const checkEventOwnership = (owner, eventOwner) => {
  if (owner.toString() !== eventOwner.toString()) {
    throw new Error("Vous n'avez pas la permission d'effectuer cette action sur cet événement");

  }
};

module.exports = checkEventOwnership;
