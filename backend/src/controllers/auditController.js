import Audit from '../models/Audit.js';

export const getAuditTrail = async (req, res) => {
  try {
    const { documentId } = req.params;
    const audits = await Audit.find({ documentId })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    res.json({ audits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAuditTrail = async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.userId }).sort({
      timestamp: -1,
    });

    res.json({ audits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
