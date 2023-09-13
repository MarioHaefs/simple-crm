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

  fetchNews() {
    const url = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=76096daff2d347f3b8b5af8a42e538a5';

    this.http.get<any>(url).subscribe(data => {
      this.news = data.articles;
      console.log('Single News', data.articles);

    });
  }


  onImageError(event: any) {
    event.target.src = "/assets/img/news.jpg";
  }

}

