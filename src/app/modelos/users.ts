
export class Users {
  usuId: number;
  usuNames: string;
  usuAddress: string;
  usuPhone: string;
  usuEmail: string;
  usuDocumentId: string;
  usuPassword: string;
  usuTdocId: number;
  usuRolId: number;
  usuIsActive: boolean;
  documentType: any;

  constructor() {
    this.usuId = 0;
    this.usuNames = '';
    this.usuAddress = '';
    this.usuPhone = '';
    this.usuEmail = '';
    this.usuDocumentId = '';
    this.usuPassword = '';
    this.usuTdocId = 0;
    this.usuRolId = 0;
    this.usuIsActive = true;
    this.documentType = null;
  }
}