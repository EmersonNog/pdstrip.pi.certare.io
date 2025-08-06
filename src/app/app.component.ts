import { Component, ViewChild } from "@angular/core";
import { Events, MenuController, Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AuthService } from "../providers/auth/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { User } from "../models/user";
import { UserService } from "../providers/user/user.service";
import { ISubscription } from "rxjs/Subscription";
import { Constants } from "../environments/constants";
import { TranslateService } from "@ngx-translate/core";
import "rxjs/add/operator/take";
import { GenericComponentsProvider } from "../providers/generic-components/generic-components";
import { environment } from "../environments/environment";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  browserLang = "pt";

  @ViewChild(Nav) nav: Nav;
  rootPage = Constants.HOME_PAGE.name;

  currentUser: User;
  subscription: ISubscription;

  public static photo;

  pagesAll = [];
  pagesAdminAll = [];

  managerGroups = [];
  labelLogout = "";

  versao = environment.version;
  isDev = environment.production ? "" : " - dev";

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public afa: AngularFireAuth,
    public menu: MenuController,
    public events: Events,
    public authService: AuthService,
    public userService: UserService,
    private genericComponents: GenericComponentsProvider,
    public translate: TranslateService
  ) {
    this.configureTranslate(this.translate);

    // console.log('APP-COMPONENT');

    const searchParam = this.getParam();
    if (searchParam) {
      console.log("TOKEN A-C", searchParam);
      this.rootPage = Constants.AUTH_EXT_PAGE.name;
    } else {
      this.userService
        .getUserLocal()
        .then((userID) => {
          this.events.subscribe("user", (value) => {
            this.currentUser = value;
          });
          if (userID) {
            this.userService
              .byId(userID)
              .take(1)
              .subscribe((user: User) => {
                console.log("user", user);

                if (user) {
                  if (user.status) {
                    this.events.publish("user", user);
                    this.currentUser = user;
                    this.rootPage = Constants.HOME_PAGE.name;
                  } else {
                    this.userService.removeUserLocal();
                    this.nav.setRoot(Constants.LOGIN_PAGE.name);
                  }
                }
              });
          } else {
            this.rootPage = Constants.LOGIN_PAGE.name;
          }
        })
        .catch((error) => {
          console.log("Info: Usuário não logado. " + JSON.stringify(error));
          this.rootPage = Constants.LOGIN_PAGE.name;
        });
    }

    this.initializeApp();
    this.setTextos("pt");
  }

  configureTranslate(translate) {
    translate.addLangs(["pt", "en", "fr", "es"]);
    translate.setDefaultLang("pt");

    this.browserLang = translate.getBrowserLang();
    console.log("browserLang", this.browserLang);
    translate.use(
      this.browserLang.match(/pt|en|fr|es/) ? this.browserLang : "pt"
    );
  }

  traduzTextos(langSelect) {
    console.log("ll", langSelect);
    this.translate.use(langSelect);
    this.setTextos(langSelect);

    this.events.publish("change_lang", langSelect);
  }

  setTextos(langSelect) {
    this.pagesAll = [];
    this.pagesAdminAll = [];

    this.traduz(`menu.${Constants.HOME_PAGE.id}`).then((text) => {
      Constants.HOME_PAGE["label"] = text;
      this.pagesAll.push(Constants.HOME_PAGE);
    });
    this.traduz(`menu.${Constants.AREAS_EXAMES_PAGE.id}`).then((text) => {
      Constants.AREAS_EXAMES_PAGE["label"] = text;
      // this.pagesAll.push(Constants.AREAS_EXAMES_PAGE);
    });
    this.traduz(`menu.${Constants.PROFILE_PAGE.id}`).then((text) => {
      Constants.PROFILE_PAGE["label"] = text;
      // this.pagesAll.push(Constants.PROFILE_PAGE);
    });
    this.traduz(`menu.${Constants.USERS_PAGE.id}`).then((text) => {
      Constants.USERS_PAGE["label"] = text;
      // this.pagesAdminAll.push(Constants.USERS_PAGE);
    });
    this.traduz(`menu.${Constants.IMPORT_DATA_PAGE.id}`).then((text) => {
      Constants.IMPORT_DATA_PAGE["label"] = text;
      this.pagesAdminAll.push(Constants.IMPORT_DATA_PAGE);
    });
    this.traduz("menu.logout").then((text) => {
      this.labelLogout = text;
    });
  }

  private traduz(key: string) {
    return new Promise<any>((resolve, reject) => {
      this.translate
        .get(key)
        .take(1)
        .subscribe((text) => {
          resolve(text);
        });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.name, { groups: this.managerGroups });
    this.menu.close();
  }

  goLogout() {
    this.genericComponents
      .showConfirm(
        this.translate.instant("menu.logout"),
        this.translate.instant("menu.logout_desc"),
        () => {
          this.menu.close();
          this.authService.logout().then(() => {
            this.userService.removeUserLocal();
            this.nav.setRoot(Constants.LOGIN_PAGE.name);
          });
        }
      )
      .present();
  }

  private getParam() {
    const getParam = this.getParamGetURL();

    if (getParam) return getParam;

    return undefined;
  }

  private getParamGetURL() {
    // console.log('url', document.URL);
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams) {
        let singleURLParam = splitParams[i].split("=");
        if (singleURLParam[0] == "token") {
          let content = singleURLParam[1];
          content = content.replace(/\+/g, "%20");
          return decodeURIComponent(content);
        }
      }
    }

    return undefined;
  }
}
