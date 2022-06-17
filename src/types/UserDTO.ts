type UserDTO = {
    username: string,
    age: number,
    hobbies: string[]
    [index: string]: string | number | string[]
}

export default UserDTO;