export class Hotels {
  hotId: number;
  hotName: string;
  hotDescription: string;
  hotAddress: string;
  hotPhone: string;
  hotEmail: string;
  hotCityId: number;
  hotRating: number;
  hotRateSign: string;
  hotImages: string;
  hotIsActive: boolean;
  city: any;

  constructor() {
    this.hotId = 0;
    this.hotName = '';
    this.hotDescription = '';
    this.hotAddress = '';
    this.hotPhone = '';
    this.hotEmail = '';
    this.hotCityId = 0;
    this.hotRating = 0;
    this.hotRateSign = '';
    this.hotImages = '';
    this.hotIsActive = true;
    this.city = null;
  }
}