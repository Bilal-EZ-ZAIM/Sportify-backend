const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. ${role}s only.` });
    }

    next();
  };
};

module.exports = roleMiddleware;




// app.get(
//   "/livreur/dashboard",
//   validateToken,
//   roleMiddleware("livreur"),
//   (req, res) => {
//     res.send("Welcome to the livreur dashboard");
//   }
// );
