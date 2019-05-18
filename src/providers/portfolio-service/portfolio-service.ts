import { Injectable } from '@angular/core';

/*
  Generated class for the PortfolioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class portfolio{
creationdate:string;
foliotypes: Array<portfoliotype>; 
constructor(){
this.creationdate = new Date().getTime().toString();
this.foliotypes = new Array<portfoliotype>();
}

}

export class portfoliotype{
percent:number;
name:string;
constructor(){
  this.name =  '';
  this.percent = 0;
}
}

@Injectable()
export class PortfolioServiceProvider {

  constructor() {
    console.log('Hello PortfolioServiceProvider Provider');
  }

}
