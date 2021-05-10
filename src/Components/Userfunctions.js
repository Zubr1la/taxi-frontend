import axios from 'axios';

export const login = user => {
    return axios
        .post('/api/login', {
            username : user.userName,
            password : user.password
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const validation = () => {
    return axios
        .get('/api/validation')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const logoutFunc = () => {
    return axios
        .get('/api/logout')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getDrives = () => {
    return axios
        .get('/api/drive/list')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getActiveDrive = () => {
    return axios
        .get('/api/drive/listdriverdrive')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getOrderedDrive = () => {
    return axios
        .get('/api/drive/listuserdrive')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getUserDataById = (id) => {
    return axios
        .post('/api/getuser', {
            _id : id,
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getBalance = () => {
    return axios
        .get('/api/money/getbalance')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getMoneyInfo = () => {
    return axios
        .get('/api/money/checkdata')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getMessagesReceived = () => {
    return axios
        .get('/api/message/listreceivedtmessages')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

export const getMessagesSent = () => {
    return axios
        .get('/api/message/listsentmessages')
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err)
        })
};

