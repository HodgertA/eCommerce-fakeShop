export default function isLoggedIn(accessToken) {
    if(accessToken && accessToken!=="null") {
        return true;
    }
    else {
        return false;
    }
}