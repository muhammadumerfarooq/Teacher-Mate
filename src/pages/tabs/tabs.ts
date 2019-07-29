import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

// import { TimelinePage } from '../timeline/timeline';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = 'TimelinePage';
  tab2Root: any = 'CreatePostPage';
  tab3Root: any = 'BroadcasterPage';
  tab4Root: any = 'BroadcastsListPage'
  mySelectedIndex: number;
  show : boolean = true;
  constructor(navParams: NavParams, private homeservice: HomeServiceProvider) {
    
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    if (this.homeservice.user == 'parents'){
      this.show = false;
    }else{
      this.show = true;
    }

  }
}
