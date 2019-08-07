import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the CreatePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class comments {
  comment: string;
  date: string;
  useremail: string;
  userurl: string;
}
export class likes {
  useremail: string;
  date: string;
  userurl: string;
}
export class post {
  filetype: string;
  img: string;
  title: string;
  description: string;
  classid: string;
  teacheremail: string;
  likes: Array<likes>;
  comments: Array<comments>;
  publisheddate: String;
  userurl:string;
  filename:String;
  constructor(){
    this.filename="";
    this.filetype="";
    this.classid="";
    this.title="";
    this.description="";
    this.teacheremail = "";
    this.comments = new Array<comments>();
    this.likes = new Array<likes>();
    this.img = "";
    this.userurl = "";
    
  }
}

@IonicPage()
@Component({
  selector: 'page-create-post',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {
  mypost = new post();
  pdfSrc: any;
  Video = '';
  filename = {
    name: '',
    fullpath: '',
    filetype: ''
  };
  constructor(private cropservice:Crop,private homeservice:HomeServiceProvider, private fileChooser: FileChooser, private filePath: FilePath, private fileOpener: FileOpener, private storage: Storage, private modalctrl: ModalController, private camera: Camera, private image: ImagePicker, public navCtrl: NavController, public navParams: NavParams, private alertctrl: AlertController, private loader: LoaderserviceProvider) {
  this.mypost.filetype = '';
   this.filename.name = "";
   this.filename.fullpath = "";
  this.filename.filetype = "";

    this.mypost.title = '';
    this.mypost.classid = '';
    this.mypost.description = '';
    this.mypost.likes = new Array<likes>();
    this.mypost.img = '';
    this.mypost.userurl = this.homeservice.userprofile.imgurl;

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,

    });
    this.loader.loading.present().then(() => {
      setTimeout(() => {
        this.storage.get('classteacher').then((teacheremail) => {

          this.mypost.teacheremail = teacheremail;
          this.mypost.comments = new Array<comments>();
          this.loader.dismissloading();
        });
        this.storage.get('classroom').then(val => {
          this.mypost.classid = val;
        }).catch((err => {

        }));
      }, 1000);

    }).catch(() => {
      this.loader.dismissloading();
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePostPage');
  }

  imagesoption() {
    // this.multipleimages();
  }

  /*multipleimages(){

    try{
      const options = {
        quality: 80,    
        outputType: 1 ,
        maximumImagesCount: 10
    };  
      this.mypost = new Array<post>();
  //  console.log(this.image.hasReadPermission);

    this.image.getPictures(options).then(results=>{
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        this.presentAlert('images',results[i]);
        let base64Image = 'data:image/jpg;base64,' + results[i];
        let imagedata = new post();
        imagedata.img = base64Image;
        this.mypost.push(imagedata);
//
    }
    }).catch(err=>{
      this.presentAlert('error2',err);
    })
  }
  catch(exception ){
    this.presentAlert('error1',exception);
  }
  }
*/
  picutreoption() {
    let pictuealrt = this.alertctrl.create({
      title: 'Choose Image/Camera',
      buttons: [
        {
          text: 'Choose From Gallery',
          handler: data => {
            console.log('Choose From Gallery clicked');
            this.takePicture(0);
          }
        },

        {
          text: 'Camera',
          handler: data => {
            console.log('Camera');
            console.log(data);
            this.takePicture(1);
          }
        }
      ],

    });
    pictuealrt.present();
  }
  deleteimage(){
    this.mypost.img = '';
    this.mypost.filetype = '';
  }

  takePicture(sourceType: number) {

    try {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: sourceType,
      }


      this.camera.getPicture(options)
        .then((data) => {


          console.log(data)
          let base64Image = 'data:image/jpg;base64,' + data;


          this.mypost.img = (base64Image);
          this.mypost.filetype = 'img';
       //   this.cropimage();
        }).catch(err => {
          this.presentAlert('error', 'Error while taking image from gallery');
        })
    }
    catch (exception) {
      this.presentAlert('error', exception);
    }
  }

  cropimage() {
    this.cropservice
      .crop(this.mypost.img, { quality: 100 })
      .then((newImage) => {
        let base64Image = 'data:image/jpeg;base64,' + newImage;
        console.log(newImage)
        this.mypost.img = (base64Image);
      }).catch(error => {
        console.error("Error cropping image", error)
        this.presentAlert('error', error);
      })
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  submitbtn() {
    console.log(new Date().getTime().toString())
    this.mypost.publisheddate = new Date().getTime().toString();
    var post = this.mypost;
 if (this.mypost.title==""||this.mypost.title==undefined){
this.presentAlert("Feed Title Should not be empty"," Error!")
 }else if (this.mypost.description==""||this.mypost.description==undefined){
  this.presentAlert("Feed Description Should not be empty"," Error!")
 }
 else if (this.mypost.filetype==""||this.mypost.filetype==undefined){
  this.presentAlert("Feed Must Contains File/Image"," Error!")

}
else{
    var modalPage = this.modalctrl.create('SubmitPostPage', { post: post });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        this.presentAlert('Success', ' post created');

        this.mypost.title = '';
        this.mypost.description = '';
        this.mypost.img = '';
        this.mypost.filetype = '';

      } else if (data == false) {
        this.presentAlert('Error', ' post not created');
      } else if (data == 'back') {

      }
    });
    modalPage.present();
  }
  }

  chosefile() {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {

        this.mypost.img = resolvedFilePath;
        this.mypost.filetype = 'pdf';
    
        this.filename.name = this.getfilename(resolvedFilePath);
        this.filename.fullpath = resolvedFilePath;
        this.filename.filetype = this.getfiletype(resolvedFilePath);

        this.mypost.filename = this.filename.name 
      //  this.presentAlert(this.filename.filetype, '');
       // this.presentAlert(filename + " ", fileext + " ");
        /* this.fileOpener.open(resolvedFilePath, 'application/pdf').then(file => {
           alert(file);
           this.pdfSrc = resolvedFilePath;
           alert("It worked!")
         }).catch(err => {
           alert(JSON.stringify(err));
         });
         */
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  getfilename(filestring) {

    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    
    // this.presentAlert(file.split('.')[0], file.split('.')[1]);
   // console.log(file.split('.'));
    
    return file;
  }
  getfiletype(filestring){
    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    
   // this.presentAlert(file.split('.')[0], file.split('.')[1]);
    let filetype = file.split('.');
    return file.split('.')[filetype.length-1];
  }
openfile(){

  let fileMIMEType=this.getMIMEtype(this.filename.filetype);

  this.fileOpener.open(this.filename.fullpath, fileMIMEType).then(file => {

    this.pdfSrc = this.filename.fullpath;
    
  }).catch(err => {
    alert(JSON.stringify(err));
  });
}

getMIMEtype(extn){
  let ext=extn.toLowerCase();
  let MIMETypes={
    'txt' :'text/plain',
    'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc' : 'application/msword',
    'pdf' : 'application/pdf',
    'jpg' : 'image/jpeg',
    'bmp' : 'image/bmp',
    'png' : 'image/png',
    'xls' : 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'rtf' : 'application/rtf',
    'ppt' : 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }
  return MIMETypes[ext];
}

  }

