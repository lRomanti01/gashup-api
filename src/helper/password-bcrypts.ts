import bcrypt from 'bcrypt';

const encrypt = async(password: string) => {
    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(password, salt)
    return pass 
}

export { encrypt }