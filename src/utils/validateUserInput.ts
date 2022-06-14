import UserDTO from '../types/UserDTO';

const requiredUserFields: string[] = ['username', 'age', 'hobbies'];

const validateUserInput = (userInput: UserDTO, requiredUserFields: string[]): boolean => {
    let isUserInputValid = true;

    requiredUserFields.forEach((requiredField) => {
        if (!Object.prototype.hasOwnProperty.call(userInput, requiredField) || !userInput[requiredField]) {
            isUserInputValid = false;
        }
    });

    return isUserInputValid;
}

export {validateUserInput, requiredUserFields};
