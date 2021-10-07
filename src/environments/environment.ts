export const environment = {

    production: true,
    version: require('../../package.json').version,
    // version: '1.1.1',

    middleware_cors: 'https://certareinventhus.com.br/ws.php',
    // middleware_cors: 'http://localhost/middleware_cors/ws.php',
    // middleware_cors: 'https://us-central1-pav-detect.cloudfunctions.net/requisicao_cors',

    dev: {
        apiKey: "AIzaSyCJRFe087LiR4Vca0lZcBVp-V6V7IwnBjg",
        authDomain: "pav-detect-dev.firebaseapp.com",
        databaseURL: "https://pav-detect-dev-default-rtdb.firebaseio.com",
        projectId: "pav-detect-dev",
        storageBucket: "pav-detect-dev.appspot.com",
        messagingSenderId: "363085076310",
        appId: "1:363085076310:web:1624c6c943f28fe6ce68f7",
        measurementId: "G-934X55YFC9"
    },
    prod: {
        apiKey: "AIzaSyCJRFe087LiR4Vca0lZcBVp-V6V7IwnBjg",
        authDomain: "pav-detect-dev.firebaseapp.com",
        databaseURL: "https://pav-detect-dev-default-rtdb.firebaseio.com",
        projectId: "pav-detect-dev",
        storageBucket: "pav-detect-dev.appspot.com",
        messagingSenderId: "363085076310",
        appId: "1:363085076310:web:1624c6c943f28fe6ce68f7",
        measurementId: "G-934X55YFC9"
    }
};
