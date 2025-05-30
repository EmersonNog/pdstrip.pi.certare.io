export const environment = {

    production: true,
    version: require('../../package.json').version,
    // version: '1.1.1',

    middleware_cors: 'https://certareinventhus.com.br/ws.php',
    // middleware_cors: 'http://localhost/middleware_cors/ws.php',
    // middleware_cors: 'https://us-central1-sistema-onu.cloudfunctions.net/requisicao_cors',

    dev: {
        apiKey: "AIzaSyC41HFkJU_wYPRnKNnWZNLi4i9P0Zv6QxE",
        authDomain: "dev-pdstrip-pi-certare-io.firebaseapp.com",
        databaseURL: "https://dev-pdstrip-pi-certare-io-default-rtdb.firebaseio.com",
        projectId: "dev-pdstrip-pi-certare-io",
        storageBucket: "dev-pdstrip-pi-certare-io.firebasestorage.app",
        messagingSenderId: "610309676442",
        appId: "1:610309676442:web:da682ed5c749af6ea96e23",
        measurementId: "G-Y4SP7LQWDJ"
    },
    prod: {
        apiKey: "AIzaSyAC0xbnk2KOkGumVrt4kD5lm-NQY4vDfbs",
        authDomain: "pdstrip-pi-certare-io.firebaseapp.com",
        databaseURL: "https://pdstrip-pi-certare-io-default-rtdb.firebaseio.com",
        projectId: "pdstrip-pi-certare-io",
        storageBucket: "pdstrip-pi-certare-io.firebasestorage.app",
        messagingSenderId: "497176178387",
        appId: "1:497176178387:web:a6f351445a85625b04ae26",
        measurementId: "G-V32L964FG6"
    }
};
