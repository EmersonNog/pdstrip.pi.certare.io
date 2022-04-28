export const environment = {

    production: true,
    version: require('../../package.json').version,
    // version: '1.1.1',

    middleware_cors: 'https://certareinventhus.com.br/ws.php',
    // middleware_cors: 'http://localhost/middleware_cors/ws.php',
    // middleware_cors: 'https://us-central1-sistema-onu.cloudfunctions.net/requisicao_cors',

    dev: {
        apiKey: "AIzaSyDUn1ohuP4A_0Xlt33vFfrfRb_qjhfOULY",
        authDomain: "sistema-onu.firebaseapp.com",
        databaseURL: "https://sistema-onu-default-rtdb.firebaseio.com",
        projectId: "sistema-onu",
        storageBucket: "sistema-onu.appspot.com",
        messagingSenderId: "842894212507",
        appId: "1:842894212507:web:bcca5676d5f89cd2da353e",
        measurementId: "G-XDN4SZ24J7"
    },
    prod: {
        apiKey: "AIzaSyDUn1ohuP4A_0Xlt33vFfrfRb_qjhfOULY",
        authDomain: "sistema-onu.firebaseapp.com",
        databaseURL: "https://sistema-onu-default-rtdb.firebaseio.com",
        projectId: "sistema-onu",
        storageBucket: "sistema-onu.appspot.com",
        messagingSenderId: "842894212507",
        appId: "1:842894212507:web:bcca5676d5f89cd2da353e",
        measurementId: "G-XDN4SZ24J7"
    }
};
