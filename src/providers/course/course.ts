import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
   AngularFirestoreCollection
 // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
// import { Storage } from '@ionic/storage';
// import { ClassServiceProvider } from '../class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { storage } from 'firebase';
import { File } from '@ionic-native/file';
// import { ProfileServiceProvider } from '../profile-service/profile-service';
import { HomeServiceProvider } from '../home-service/home-service';

/*
  Generated class for the CourseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class Topics {
  value:string;
 //  subtopics: Array<Subtopics>;
   fileurl: string;
   filename:string;
   filetext:string;
   filetype:string;
  filepath:string;
  filestatus:string;
   constructor(){
//     this.subtopics = new Array<Subtopics>();
     this.filename = '';
     this.filepath='';
     this.filetext= '';
     this.filetype='';
     this.fileurl='';
     this.filestatus = '';

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
  coursesdropdown: Array<Boolean> = [];

  constructor( private homeservice:HomeServiceProvider,private fileservice: File,private fileChooser: FileChooser, private filePath: FilePath, private fileOpener: FileOpener,private afs:AngularFirestore,private loaderservice:LoaderserviceProvider) {
  /* this.afs.collection<Courses>('courses', ref=>{
     
     return ref.where("classname","==",this.homeservice.classroom).where("classteacher","==",this.homeservice.classteacher);
   }).snapshotChanges().forEach(snap=>{
     this.allcourses = new Array<Courses>(); 
     this.coursesdropdown = new Array<Boolean>();

     snap.forEach(snapshot=>{
      
       if (snapshot.payload.doc.exists){
         console.log(snapshot.payload.doc.data() as Courses)
         let tempcourse: Courses = snapshot.payload.doc.data() as Courses;
         let courses: Courses =new  Courses();

         courses.classname = tempcourse.classname;
         courses.classteacher = tempcourse.classteacher;
         courses.creationdate = tempcourse.creationdate;

          let i = 0;
          let chap =0;
          while (i>-1){
            if (tempcourse.Chapters[i] != undefined && tempcourse.Chapters[i] != null){
              courses.Chapters.push( new Chapters());
              courses.Chapters[chap].value = tempcourse.Chapters[i].value;
             
              let top = 0;
              let j = 0;
              while (j>-1){
                if (tempcourse.Chapters[i].Topics[j]!=null && tempcourse.Chapters[i].Topics[j]!=undefined){
                  courses.Chapters[chap].Topics.push(new Topics());
                  courses.Chapters[chap].Topics[top] = tempcourse.Chapters[i].Topics[j]; 
                  top++;
                }
                else{
                  break;
                }
                j++;
              }
              chap++; 
              
            }else{
              break;
            }
            i++;
          }


          this.allcourses.push(courses);
          this.coursesdropdown.push(false);
       }
     })
   })*/

   
  }

  getcourses(){

    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
      
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
duration: 500
    });

   
      this.loaderservice.loading.present().then(()=>{
          

    this.afs.collection<Courses>('courses', ref=>{
     
      return ref.where("classname","==",this.homeservice.classroom).where("classteacher","==",this.homeservice.classteacher);
    }).snapshotChanges().take(1).forEach(snap=>{
      this.allcourses = new Array<Courses>(); 
      this.coursesdropdown = new Array<Boolean>();
      snap.forEach(snapshot=>{
       
        if (snapshot.payload.doc.exists){
          console.log(snapshot.payload.doc.data() as Courses)
          let tempcourse: Courses = snapshot.payload.doc.data() as Courses;
          let courses: Courses =new  Courses();
 
          courses.classname = tempcourse.classname;
          courses.classteacher = tempcourse.classteacher;
          courses.creationdate = tempcourse.creationdate;
 
           let i = 0;
           let chap =0;
           while (i>-1){
             if (tempcourse.Chapters[i] != undefined && tempcourse.Chapters[i] != null){
               courses.Chapters.push( new Chapters());
               courses.Chapters[chap].value = tempcourse.Chapters[i].value;
              
               let top = 0;
               let j = 0;
               while (j>-1){
                 if (tempcourse.Chapters[i].Topics[j]!=null && tempcourse.Chapters[i].Topics[j]!=undefined){
                   courses.Chapters[chap].Topics.push(new Topics());
                   courses.Chapters[chap].Topics[top] = tempcourse.Chapters[i].Topics[j]; 
                   top++;
                 }
                 else{
                   break;
                 }
                 j++;
               }
               chap++; 
               
             }else{
               break;
             }
             i++;
           }
 
 
           this.allcourses.push(courses);
           this.coursesdropdown.push(false);

        }
      })
    })
  });
  }
  insert_course(courses: Courses){
   
    const course= Object.assign({}, courses);
    course.Chapters = Object.assign({},course.Chapters);
    return new Promise((resolve,reject)=>{
      
    for (let i=0;i<courses.Chapters.length;i++)
    {
      course.Chapters[i] =  Object.assign({},courses.Chapters[i]);
      
      course.Chapters[i].Topics =  Object.assign({},courses.Chapters[i].Topics);
      for (let j=0;j<courses.Chapters[i].Topics.length;j++)
      {
        course.Chapters[i].Topics[j] =  Object.assign({},courses.Chapters[i].Topics[j]); 
  
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
       
           
        this.afs.collection<Courses>('courses').doc(course.creationdate).set(course).then(res=>{
          this.loaderservice.dismissloading();

          
          return resolve('inserted');

        }).catch(err=>{
          this.loaderservice.dismissloading();
       
          
          return reject('error'); 
        });
     
      })
     
    }, 2000);
  });

  }

  update_course(courses: Courses){
   
    const course= Object.assign({}, courses);
    course.Chapters = Object.assign({},course.Chapters);
    return new Promise((resolve,reject)=>{
      
    for (let i=0;i<courses.Chapters.length;i++)
    {
      course.Chapters[i] =  Object.assign({},courses.Chapters[i]);
      
      course.Chapters[i].Topics =  Object.assign({},courses.Chapters[i].Topics);
      for (let j=0;j<courses.Chapters[i].Topics.length;j++)
      {
        course.Chapters[i].Topics[j] =  Object.assign({},courses.Chapters[i].Topics[j]); 
        // objectcourse.Chapters[i].Topics[j].subtopics =  Object.assign({},course.Chapters[j].Topics[j].subtopics);
        // for (let k=0;k<objectcourse.Chapters[j].Topics[j].subtopics.length;k++)
        // {
        //   objectcourse.Chapters[i].Topics[j].subtopics[k] =  Object.assign({},course.Chapters[j].Topics[j].subtopics[k]);
        // }
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
       
           
        this.afs.collection<Courses>('courses').doc(course.creationdate).update(course).then(res=>{
          this.loaderservice.dismissloading();

          this.getcourses();         
          return resolve('updated');

        }).catch(err=>{
          this.loaderservice.dismissloading();
       
          
          return reject('error'); 
        });
     
      })
     
    }, 2000);
  });

  }

  delete_course(creationdate:string){
   return new Promise((resolve,reject)=>{
     
    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
      
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

    });

    setTimeout(() => {
              
      this.loaderservice.loading.present().then(()=>{
       
           
        this.afs.collection<Courses>('courses').doc(creationdate).delete().then(res=>{
          this.loaderservice.dismissloading();

          this.getcourses();         
          return resolve('de;eted');

        }).catch(err=>{
          this.loaderservice.dismissloading();
       
          
          return reject('error'); 
        });
     
      })
     
    }, 500);
  });

  }

  makeFileIntoBlob(_imagePath:string, name:string, type:string) {
    // var window;
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


    uploadfiletopic(resolvedFilePath: string, filename:string, filetxt:string, filetype:string) {
      
      return new Promise((resolve, reject) => {
  
        this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
  
          content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
  
        });
        setTimeout(() => {
          this.loaderservice.loading.present().then(() => {
  
            // this.fileChooser.open().then(file => {
            //   this.filePath.resolveNativePath(file).then(resolvedFilePath => {
  

                this.makeFileIntoBlob(resolvedFilePath, filetxt, "application/pdf").then((fileblob) => {
  
                  const id = this.afs.createId();
                
                  const pictures = storage().ref('blob/' + id + filename);
                  pictures.put(fileblob, { contentType: "application/"+filetype }).then(val => {
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
  
              
          })
        }, 2000);
  
      });
  
    }
  
  }

  

