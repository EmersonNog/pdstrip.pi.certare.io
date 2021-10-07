import { DateUtil } from "../util/date.util";

export class User {
  id: string;
  dateOfBirth: Date;
  devices: any;
  name: string;
  email: string;
  profile: string;
  phone: string;
  photo: string;
  sex: string;
  cargo: string;
  status: boolean;
  isDev: boolean;
  grupos: any[];

  constructor()
  constructor(obj: any)
  constructor(obj?: any) {
    if(obj && obj.id){
      this.id = obj && obj.id || '';
    } else{
      this.id = obj && obj.$key || '';
    }

    this.name = obj && obj.name || '';
    this.photo = obj && obj.photo || 'assets/imgs/user.svg';
    this.email = obj && obj.email || '';
    this.phone = obj && obj.phone || '';
    this.sex = obj && obj.sex || 'Masculino';
    this.dateOfBirth = obj && obj.dateOfBirth || new Date().toISOString();
    this.status = obj && obj.status || false;
    this.isDev = obj && obj.isDev || false;
    this.profile = obj && obj.profile || 'user';
    this.cargo = obj && obj.cargo || '';
    this.grupos = obj && obj.grupos || [];
  }

  isAdmin() {
    return this.profile && this.profile === 'admin';
  }

}
