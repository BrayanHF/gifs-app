import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagHistory: string[] = [];
  private apiKey: string = 'jOMpB25WVz6HZKLTSLpAYESMWgEstkA1';
  private serverUrl: string = 'https://api.giphy.com/v1/gifs';
  public gifList: Gif[] = [];
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  public get tagHistory() {
    return [...this._tagHistory];
  }

  public async searchTag(tag: string): Promise<void> {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '12')
      .set('q', tag);
    this.http
      .get<SearchResponse>(`${this.serverUrl}/search`, { params })
      .subscribe((request) => {
        this.gifList = request.data;
      });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();
    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
    if (this._tagHistory.length === 0) return;
    this.searchTag(this._tagHistory[0]);
  }
}
