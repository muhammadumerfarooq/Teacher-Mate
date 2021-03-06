import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { LoaderserviceProvider } from '../providers/loaderservice/loaderservice';
import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { SignupServiceProvider } from '../providers/signup-service/signup-service';
import { ChatpublicServiceProvider } from '../providers/chatpublic-service/chatpublic-service';
import { FCM } from '@ionic-native/fcm';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { File } from '@ionic-native/file'; 
import { VideoPlayer } from '@ionic-native/video-player';
import { PostProvider } from '../providers/post/post';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { NativeAudio } from '@ionic-native/native-audio';
import { NotificationsServiceProvider } from '../providers/notifications-service/notifications-service';
import { StudentProvider } from '../providers/student/student';
import { HttpModule } from '@angular/http';
import { CourseProvider } from '../providers/course/course';
import { ClassServiceProvider } from '../providers/class-service/class-service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { QuizServiceProvider } from '../providers/quiz-service/quiz-service';
import { TeachersServiceProvider } from '../providers/teachers-service/teachers-service';
import { RequestServiceProvider } from '../providers/request-service/request-service';
import { AnswerServiceProvider } from '../providers/answer-service/answer-service';
import { StudentresultsServiceProvider } from '../providers/studentresults-service/studentresults-service';
import { PortfolioServiceProvider } from '../providers/portfolio-service/portfolio-service';
import { StudentmarksServiceProvider } from '../providers/studentmarks-service/studentmarks-service';
import { StudentPortfolioServiceProvider } from '../providers/student-portfolio-service/student-portfolio-service';
//import { StudentPortfolioPageModule } from '../pages/student-portfolio/student-portfolio.module';
//import { CreatePortfolioPageModule } from '../pages/create-portfolio/create-portfolio.module';
// import { ProgressBarComponentModule } from '../pages/progress-bar/progress-bar.module';
// import { ProgressBarComponent } from '../pages/progress-bar/progress-bar';
// import { Chart } from 'chart.js';
import { SharedModule } from '../pages/shared-modules';
import { PortfolioListProvider } from '../providers/portfolio-list/portfolio-list';
import { SearchProvider } from '../providers/search/search';
//import { ComponentsModule } from '../components/components.module';
// import { TeacherloginPage } from '../pages/teacherlogin/teacherlogin';
// import { ParentloginPage } from '../pages/parentlogin/parentlogin';

export const firebaseConfig = {
  apiKey: "AIzaSyDKzlwtZRCthJWAcMFLvUIzujESFHctJug",
  authDomain: "wired-coffee-4f603.firebaseapp.com",
  databaseURL: "https://wired-coffee-4f603.firebaseio.com",
  projectId: "wired-coffee-4f603",
  storageBucket: "wired-coffee-4f603.appspot.com",
  messagingSenderId: "765787238011"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    
   // ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(HomePage),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
   // AngularFirestoreModule.enablePersistence({experimentalTabSynchronization: false}),
  //  AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularCropperjsModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  
  ],
  providers: [
    
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoaderserviceProvider,
    LoginserviceProvider,
    HomeServiceProvider,
    ChatServiceProvider, 
    SignupServiceProvider,
    ChatpublicServiceProvider,
    FCM,
    ImagePicker,
    Crop,
    Camera,
    File,
    VideoPlayer,
    PostProvider,
    ProfileServiceProvider,
    FileChooser,
    FileOpener,
    FilePath,
    FileTransfer,
    DocumentViewer,
    NativeAudio,
    NotificationsServiceProvider,
    StudentProvider,
    CourseProvider,
    ClassServiceProvider,
    QuizServiceProvider,
    TeachersServiceProvider,
    RequestServiceProvider,
    AnswerServiceProvider,
    StudentresultsServiceProvider,
    PortfolioServiceProvider,
    StudentmarksServiceProvider,
    StudentPortfolioServiceProvider,
    PortfolioListProvider,
    SearchProvider,
    
  ]
})
export class AppModule {}
