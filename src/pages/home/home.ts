import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TasksPage } from '../tasks-page/tasks-page';
import { ConfigurationPage } from '../configuration-page/configuration-page';
import { NotificationPage } from '../notification-page/notification-page';
import { TimeCard } from '../time-card/time-card';
import { TutorialPage } from '../tutorial-page/tutorial-page';
import { UserProvider } from '../../providers/user-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user = {};

  constructor(
    public navCtrl: NavController, 
    params: NavParams,
    public userProv: UserProvider) {
      // this.user = params.get('user');
      console.log(this.userProv.response);
       this.user = this.userProv.userObj;
  }

    pushTaskPage(){
    // push another page onto the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.push(TasksPage, {
    });
  }
  pushTutorialPage(){
    this.navCtrl.push(TutorialPage, {
    });
  }
  pushTimeCard(){
    this.navCtrl.push(TimeCard, {
    });
  }
  pushNotificationPage(){
    this.navCtrl.push(NotificationPage, {
    });
  }
  pushConfigurationPage(){
    this.navCtrl.push(ConfigurationPage, {
      user: this.user,
    });
  }

}
