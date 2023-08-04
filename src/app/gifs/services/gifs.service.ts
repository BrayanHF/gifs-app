import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagHistory: string[] = [];

  constructor() {}

  public get tagHistory() {
    return [...this._tagHistory];
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();
    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);
  }
}
