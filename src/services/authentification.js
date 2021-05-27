const accounts = [
    {
        email:"uyarbera@gmail.com",
        password:"bera"
    },
    {
        email:"berauyar@gmail.com",
        password:"areb"
    }
]

const getAccount = (email, password) => {
    return accounts.find(acc => {
        if(acc.email === email && acc.password === password){
            setLocalStorage(acc.email, acc.password);
            return acc;
        }
    })
}

function setLocalStorage(email, password){
    localStorage.email=email
    localStorage.password=password
}

const logout = () => {
    localStorage.clear();
    return null;
}

export { getAccount, logout}