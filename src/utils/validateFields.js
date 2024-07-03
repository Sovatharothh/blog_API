const validateFields = (fields) => {
    const missingFields = [];

    for (let field of fields) {
        if (!field.value) {
            missingFields.push(field.name);
        }
    }

    if (missingFields.length > 0) {
        const errorMessage = missingFields.join(', ') + (missingFields.length > 1 ? ' are ' : ' is ') + 'required';
        return { error: true, message: errorMessage };
    }

    return { error: false };
};

module.exports = validateFields;
