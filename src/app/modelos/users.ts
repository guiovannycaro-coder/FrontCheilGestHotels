export class Users {
  usuId: number;
  usuNames: string;
  usuAddress: string;
  usuPhone: string;
  usuEmail: string;
  usuDocumentId: string;
  usuPassword: string;
  usuTdocId: number | null;
  usuRolId:string;
  usuIsActive: boolean;

  constructor() {
    this.usuId = 0;
    this.usuNames = '';
    this.usuAddress = '';
    this.usuPhone = '';
    this.usuEmail = '';
    this.usuDocumentId = '';
    this.usuPassword = '';
    this.usuTdocId = null;
    this.usuRolId = '';
    this.usuIsActive = true;
  }
}