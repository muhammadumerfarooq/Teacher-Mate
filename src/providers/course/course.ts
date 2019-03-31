import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
   AngularFirestoreCollection
 // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { ClassServiceProvider } from '../class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { storage } from 'firebase';
import { File } from '@ionic-native/file';

/*
  Generated class for the CourseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class Topics {
  value:string;
   subtopics: Array<Subtopics>;
   fileurl: string;
   filename:string;
   filetext:string;
   filetype:string;
  filepath:string;
   constructor(){
     this.subtopics = new Array<Subtopics>();
     this.filename = '';
     this.filepath='';
     this.filetext= '';
     this.filetype='';
     this.fileurl='';

   }
 }
 export class Subtopics{
   value:string;
   fileurl: string;
   filename:string;
   filetext:string;
   filetype:string;
  filepath:string;
   constructor(){
     this.value = '';
     this.filename = '';
     this.filepath='';
     this.filetext= '';
     this.filetype='';
     this.fileurl='';
     
   }
 }
 export class Courses {
  creationdate: string;
  Chapters:Array<Chapters>;
  classname: string;
  classteacher: string;

   constructor(){
     this.Chapters = new Array<Chapters>();
     this.classname = '';
     this.classteacher = '';
     this.creationdate = '';
   }
 }

 export class Chapters{
  value:string;
  Topics: Array<Topics>;
  constructor(){
    this.value = '';
    this.Topics = new Array<Topics>();
  }
  }

@Injectable()
export class CourseProvider {
  
  allcourses: Array<Courses> = [];

  constructor( private fileservice: File,private fileChooser: FileChooser, private filePath: FilePath, private fileOpener: FileOpener,private afs:AngularFirestore, private classervice: ClassServiceProvider, private loaderservice:LoaderserviceProvider) {
   this.afs.collection<Courses>('courses').snapshotChanges().forEach(snap=>{
     this.allcourses = new Array<Courses>(); 

     snap.forEach(snapshot=>{
       if (snapshot.payload.doc.exists){
          this.allcourses.push(snapshot.payload.doc.data() as Courses);
       }
     })
   })
  }

  insert_course(course: Courses){
   
    const objectcourse= Object.assign({}, course);
    objectcourse.Chapters = Object.assign({},course.Chapters);
    
    for (let i=0;i<objectcourse.Chapters.length;i++)
    {
      objectcourse.Chapters[i] =  Object.assign({},course.Chapters[i]);
      
      objectcourse.Chapters[i].Topics =  Object.assign({},course.Chapters[i].Topics);
      for (let j=0;j<objectcourse.Chapters[i].Topics.length;j++)
      {
        objectcourse.Chapters[i].Topics[j] =  Object.assign({},course.Chapters[i].Topics[j]); 
        objectcourse.Chapters[i].Topics[j].subtopics =  Object.assign({},course.Chapters[j].Topics[j].subtopics);
        for (let k=0;k<objectcourse.Chapters[j].Topics[j].subtopics.length;k++)
        {
          objectcourse.Chapters[i].Topics[j].subtopics[k] =  Object.assign({},course.Chapters[j].Topics[j].subtopics[k]);
        }
      }
    }
    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
      
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

    });

    setTimeout(() => {
              
      this.loaderservice.loading.present().then(()=>{
        this.afs.collection<Courses>('courses').doc(course.creationdate).set({objectcourse}).then(res=>{
          this.loaderservice.dismissloading();

          debugger

        }).catch(err=>{
          this.loaderservice.dismissloading();
          debugger
        
        });

      });

    }, 2000);
  }

  makeFileIntoBlob(_imagePath, name, type) {
    var window;
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      this.fileservice.resolveLocalFilesystemUrl(_imagePath).then((fileEntry: any) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: type });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });


      });

    });
  }


    uploadfiletopic(resolvedFilePath: string, filename:string, filetxt:string) {

      return new Promise((resolve, reject) => {
  
        this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
  
          content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
  
        });
        setTimeout(() => {
          this.loaderservice.loading.present().then(() => {
  
            this.fileChooser.open().then(file => {
              this.filePath.resolveNativePath(file).then(resolvedFilePath => {
  

                this.makeFileIntoBlob(resolvedFilePath, filetxt, "application/pdf").then((fileblob) => {
  
                  const id = this.afs.createId();
                  
                  const pictures = storage().ref('blob/' + id + filename);
                  pictures.put(fileblob, { contentType: "application/pdf" }).then(val => {
                    console.log(val);
                    
                    pictures.getDownloadURL().then((val)=>{
                      let value:string = val;
                      this.loaderservice.dismissloading();
                      return resolve(value);
                    }).catch(err=>{
                      this.loaderservice.dismissloading();
                      return reject('error');
                    });

                  }).catch(err => {
                    this.loaderservice.dismissloading();
                    return reject('error');
                  });//
                }).catch(err => {
                  this.loaderservice.dismissloading();
                  return reject('error');
  
                });
  
              }).catch(err => {
                alert(JSON.stringify(err));
              });
            }).catch(err => {
              alert(JSON.stringify(err));
            });
          })
        }, 2000);
  
      });
  
    }
  
  }

  

