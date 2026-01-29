export function isValidEmail(email){
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return email.length <= 254 && regex.test(email);
}

export function isStrongPassword(password){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+]).{8,}$/
    return regex.test(password);
}

export function isValidName(name){
    const regex = /^[a-zA-Z ]+$/
    return name.trim().length != 0 && regex.test(name);
}
