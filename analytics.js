const Database = require("@replit/database");
const db = new Database();

module.exports = (req, res, next) => {
  db.get("analytics").then(({ value: analytics }) => {
    analytics = JSON.parse(analytics || "[]");
    if (analytics.includes(req.headers["x-forwarded-for"] || req.socket.remoteAddress)) return next();
    db.set("analytics", JSON.stringify([
      ...analytics,
      ...[
        req.headers["x-forwarded-for"] || req.socket.remoteAddress 
      ]
    ])).then(() => next());
  });
};