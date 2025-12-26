export const driverOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "driver") {
    return res.status(403).json({ error: "Driver access only" });
  }
  next();
};
