import Cookies from 'js-cookie';

export const checkToken = () => {
    if (Cookies.get('token')) {
        const token = JSON.parse(Cookies.get('token'));
        console.log(token);
        if (token.expiry_date && new Date(token.expiry_date).getTime() > new Date().getTime()) {
            return true;
        }
    }
    return false;
};
