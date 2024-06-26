const validateFields = (fields) => {
    const missingFields = [];

    for (let fields of fields){
        if(!fields.value){
            missingFields.push(fields.name);
        }
    }

    if (missingFields.length > 0){
        const errorMessage = missingFields.join(', ') + missingFields.length > 1 ? ' are ' : ' is ' +  'required';
        return { error: true, message: errorMessage};
    }

    return { error: false };

};

module.exports = validateFields;