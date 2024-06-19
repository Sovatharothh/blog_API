const validateRequiredFields = (...fields) => (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        const missingFieldsMessage = missingFields.map(field => `Please input your ${field}`).join(', ');
        return res.status(400).json({ status: 400, message: missingFieldsMessage });
    }
    next();
};

module.exports = {
    validateRequiredFields,
};
