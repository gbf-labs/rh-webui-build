// const API_URL = 'http://192.168.0.166:8080'; // API local server
let API_URL = 'http://10.8.2.9';  //vpn IP API Prod Server
// const API_URL = 'http://10.8.2.13:8080';  //vpn IP API Dev Server
// let API_URL = 'http://10.8.2.109:8080';  //vpn IP API Staging Server
// const API_URL = '172.25.144.56'; //local IP API Server
const GOOGLE_API_KEY = 'AIzaSyCwO2_2rCfI6CD1puwsBXYFuw498iC3u4g';
const SALT = '1080PFULLHD20188';
const AUTOREFRESH_INTERVAL = 180000;

API_URL = 'http://'+window.location.hostname+':8080';
export default {
    API_URL,
    GOOGLE_API_KEY,
    SALT,
    AUTOREFRESH_INTERVAL
}