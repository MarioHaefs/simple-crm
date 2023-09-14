import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})


export class NewsComponent {
  news: any[] = [];


  constructor(private http: HttpClient) { }

  
  ngOnInit(): void {
    this.fetchNews();
  }


  /**
   * fetch news from NewsAPI
   */
  fetchNews() {
    const url = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=76096daff2d347f3b8b5af8a42e538a5';

    this.http.get<any>(url).subscribe(data => {
      this.news = data.articles;
    });
  }


  /**
   * if API dont deliver img "news.jpg" will be shown
   */
  onImageError(event: any) {
    event.target.src = "/assets/img/news.jpg";
  }

}

