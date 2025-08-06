import { InAppBrowser } from "@ionic-native/in-app-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from "angularfire2/storage";

import { MyApp } from "./app.component";

import { AuthService } from "../providers/auth/auth.service";
import { UserService } from "../providers/user/user.service";

import { environment } from "../environments/environment";
import { CameraService } from "../providers/camera/camera.service";
import { Camera } from "@ionic-native/camera";
import { ComponentsModule } from "../components/components.module";
import { BrowserProvider } from "../providers/browser/browser";

import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";

import { SelectSearchableModule } from "ionic-select-searchable";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import { IonicStorageModule } from "@ionic/storage";
import { GenericComponentsProvider } from "../providers/generic-components/generic-components";
import { ImageDetectProvider } from "../providers/image-detect/image-detect";
import { HttpHelperProvider } from "../providers/http-helper/http-helper";
import { AssetsJsonProvider } from "../providers/assets-json/assets-json";
import { RodoviaProvider } from "../providers/rodovia/rodovia";
import { LoadingSpinnerComponentModule } from "../components/loading-spinner/loading-spinner.module";
import { AuthExtProvider } from "../providers/auth-ext/auth-ext";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { EstradaProvider } from "../providers/estrada/estrada";
import { SreProvider } from "../providers/sre/sre";
import { AcidentesProvider } from "../providers/acidentes/acidentes";
import { RotasProvider } from "../providers/rotas/rotas";
import { PontoSecaoProvider } from "../providers/ponto-secao/ponto-secao";
import { ModalFiltrosPage } from "../pages/modal-filtros/modal-filtros";
import { ImportCsvPage } from "../pages/import-csv/import-csv";

registerLocaleData(localePt, "pt-BR");

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [MyApp, ModalFiltrosPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(
      environment.production ? environment.prod : environment.dev
    ),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    SelectSearchableModule,
    LoadingSpinnerComponentModule,
    IonicStorageModule.forRoot(),
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, ModalFiltrosPage],
  providers: [
    StatusBar,
    SplashScreen,
    // {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: "pt-BR" },
    Camera,
    InAppBrowser,
    AuthService,
    UserService,
    CameraService,
    BrowserProvider,
    GenericComponentsProvider,
    ImageDetectProvider,
    HttpHelperProvider,
    HTTP,
    AssetsJsonProvider,
    RodoviaProvider,
    AuthExtProvider,
    RodoviaProvider,
    EstradaProvider,
    SreProvider,
    AcidentesProvider,
    RotasProvider,
    PontoSecaoProvider,
  ],
})
export class AppModule {}
