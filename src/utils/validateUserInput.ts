import UserDTO from '../types/UserDTO';
import InputField from '../types/InputField';

const requiredUserFields: InputField[] = [
    {name: 'username', type: 'string'},
    {name: 'age', type: 'number'},
    {name: 'hobbies', type: 'object', subtype: 'string'}
];

const validateUserInput = (userInput: UserDTO, requiredUserFields: InputField[]): boolean => {
    let isUserInputValid = true;

    requiredUserFields.forEach((requiredField) => {
        if (!Object.prototype.hasOwnProperty.call(userInput, requiredField.name)
            || !userInput[requiredField.name]
            || !(typeof userInput[requiredField.name] === requiredField.type)
        ) {
            isUserInputValid = false;
        }

        if (typeof userInput[requiredField.name] === 'object') {
            const complexInput: string[] = userInput[requiredField.name] as string[];
            complexInput.forEach((element) => {
                if (typeof element !== requiredField.subtype) {
                    isUserInputValid = false;
                }
            });
        }
    });

    return isUserInputValid;
}

export {validateUserInput, requiredUserFields};
