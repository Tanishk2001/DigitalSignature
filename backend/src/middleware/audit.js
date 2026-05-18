import Audit from '../models/Audit.js';

export const auditLog = async (userId, action, details, ipAddress) => {
  try {
    const audit = new Audit({
      userId,
      action,
      details,
      ipAddress,
      timestamp: new Date(),
    });
    await audit.save();
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

export const auditMiddleware = (req, res, next) => {
  req.auditLog = async (action, details) => {
    const ipAddress = req.ip || req.connection.remoteAddress;
    await auditLog(req.userId, action, details, ipAddress);
  };
  next();
};

export default auditMiddleware;
