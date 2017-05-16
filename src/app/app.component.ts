import { Component } from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login-page/login-page';
import { UserProvider } from '../providers/user-provider';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any;
  dbOptions = {name: 'nwponto.db',location: 'default'};

  constructor(
  platform: Platform, 
  statusBar: StatusBar, 
  public splashScreen: SplashScreen,
  private sqlite: SQLite,
  public userProv: UserProvider) {

    platform.ready().then(() => {
      this.hideSplashScreen();
      this.rootPage = LoginPage;
      //criando banco
      this.sqlite.create(this.dbOptions)
        .then((db: SQLiteObject) => {
          //criando tabela
            db.executeSql('CREATE TABLE IF NOT EXISTS user (name VARCHAR(255), email VARCHAR(50), CPF VARCHAR(50), address VARCHAR(50), password VARCHAR(50), photo VARCHAR(255), office VARCHAR(50), id VARCHAR(255) PRIMARY KEY);', {})
              .then(() => {
              })
              .catch(e => {
              });
          })
          .catch(e => {
            //erro ao abrir banco
          });
          statusBar.styleDefault();
          // splashScreen.hide();
    });
  }
    hideSplashScreen() {
        if (this.splashScreen) {
          setTimeout(() => {
            this.splashScreen.hide();
          }, 10000);
        }
      }
}

