import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Register } from '../pages/register/register';
import { LoginPage } from '../pages/login-page/login-page';
import { TasksPage } from '../pages/tasks-page/tasks-page';
import { ConfigurationPage } from '../pages/configuration-page/configuration-page';
import { NotificationPage } from '../pages/notification-page/notification-page';
import { TimeCard } from '../pages/time-card/time-card';
import { TutorialPage } from '../pages/tutorial-page/tutorial-page';
import { UserProvider } from '../providers/user-provider';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Register,
    LoginPage,
    TasksPage,
    ConfigurationPage,
    NotificationPage,
    TimeCard,
    TutorialPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Register,
    LoginPage,
    TasksPage,
    ConfigurationPage,
    NotificationPage,
    TimeCard,
    TutorialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    HTTP,
    Camera,
    SQLite,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
