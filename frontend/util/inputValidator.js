export function isValidEmail(email){
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return email.length <= 254 && regex.test(email);
}

function hasSequentialDigits(password) {
    for (let i = 0; i < password.length - 2; i++) {
        if (/\d/.test(password[i]) && /\d/.test(password[i+1]) && /\d/.test(password[i+2])) {
            let d1 = parseInt(password[i]);
            let d2 = parseInt(password[i+1]);
            let d3 = parseInt(password[i+2]);
            if ((d2 === d1 + 1 && d3 === d2 + 1) || (d2 === d1 - 1 && d3 === d2 - 1)) {
                return true;
            }
        }
    }
    return false;
}

export function isStrongPassword(password){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+]).{8,}$/
    return regex.test(password) && !hasSequentialDigits(password);
}

export function isValidName(name){
    const regex = /^[a-zA-Z ]+$/
    return name.trim().length != 0 && regex.test(name);
}
