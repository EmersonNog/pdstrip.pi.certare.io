**Inventhus**

Construção e gestão do desenvolvimento do aplicativo ONU

Migração de dados (firestore):
https://firebase.google.com/docs/firestore/manage-data/move-data

Comandos firebase pela linha de comando CLI:
https://firebase.google.com/docs/cli

---

## Pacote de Icones

https://www.figma.com/file/n1KvT9IuUujTKBOE81aHEx/UI-Icon-set-tetrisly-com?node-id=0%3A1090

---

## Conta do GMail

**email**: inventhusdev@gmail.com
**senha**: 

---

## Conta de Acesso ao Sistema

**email**: seu-email
**senha**: 123456

---

## COMANDOS

```bash

$ npm install -g ionic cordova
$ ionic start inventhusapp sidemenu
$ ionic generate page home
$ ionic generate provider home
$ ionic generate pipe StringToDate
$ ionic serve -lcs
$ ionic serve --port 8100 --livereload-port 35729 --dev-logger-port 53703 -c
```

---

## EXECUCAO

```bash
$ ionic cordova platform add ios
$ ionic cordova platform add android
$ ionic cordova run android --target=ce0517157c9cd70202 --release --prod
$ ionic cordova run ios --target=87ca7435cb02ea2ffeff6d10b44b9f3132642ac6
$ ionic cordova run browser
```

---

## BUILD PARA MOBILE

```bash
$ ionic cordova build android --release --prod
$ ionic cordova build ios --release --prod
```

---

## BUILD PARA WEB COM PLUGINS CORDOVA

```bash
$ ionic cordova platform add browser --save
$ ionic cordova build browser --release --prod
```

---

## BUILD PARA WEB
```bash
$ npm run build --prod
$ npm run ionic:build --prod
$ npm run build --aot --uglifyjs --minifyjs --minifycss
```

### BUILD (LIMPAR CACHE)
```bash
$ ionic build --prod && npm run postbuild
$ ionic build --minifyjs --minifycss && npm run postbuild
```

---

## DEPLOY PARA O FIREBASE HOSTING
```bash
$ npm install -g firebase-tools
$ firebase login
$ firebase init
$ firebase deploy
$ firebase deploy --only hosting
$ firebase use --add pav-detect
```

---

## Otimizar imagens
https://tinypng.com/

---

## FONTES

1. Acesse o [site](https://icomoon.io/app)
2. Importe os arquivos SVG
3. Selecione todos
4. Selecione as configurações conforme a imagem font-conf.png na pasta extra do projeto
5. Clique em "Generate Font F"
6. Clique em "Download"
7. Copie as fontes para a pasta do projeto: assets/fonts
8. Importe os arquivos icomoon.ionicons.scss e icomoon.scss no arquivo variables.scss
9. Para montar o arquivo icomoon.ionicons.scss, verifique o style.css gerado pelo site

---

## FACEBOOK

```bash
# Gerar keystore para o projeto
keytool -genkey -v -keystore extra/inventhusapp.keystore -alias inventhusapp -keyalg RSA -validity 10000
# senha: inventhusapp@123

# Visualizar a hash da keystore e inserir no facebook developers
keytool -exportcert -alias inventhusapp -keystore extra/inventhusapp.keystore | openssl sha1 -binary | openssl base64

ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="133124344124758" --variable APP_NAME="inventhusapp"
npm install --save @ionic-native/facebook
```

---

## Cache Ionic Browser
[Arquivos JS gerados: 0.js, 1.js, etc...](https://forum.ionicframework.com/t/bundled-files-and-cache-busting-lazy-loading/109114/9)
[Arquivos css e js gerados e atualizados no index.html](https://gist.github.com/meirmsn/9b37d6c500654b9a487e0c0a72583ef2)

---

## Referências

[Split Pane - Implementação](http://masteringionic.com/blog/2017-04-01-implementing-the-ionic-splitpane-component/)
[Split Pane - Ionic Oficial](https://ionicframework.com/docs/api/components/split-pane/SplitPane/)
[Split Pane - Ionic Blog](http://blog.ionicframework.com/ionic-2-2-0-is-out/)
[Telas Responsivas - Grid](http://blog.ionicframework.com/build-awesome-desktop-apps-with-ionics-new-responsive-grid/)
[Telas Desktop - Ionic Oficial](https://ionicframework.com/docs/developer-resources/desktop-support/)
[Locale PT-BR - Angular](https://github.com/angular/angular/issues/20197)
[Subscription](https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription)
