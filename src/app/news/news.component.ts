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
    const url = 'https://api.currentsapi.services/v1/latest-news?category=technology,business&language=en&apiKey=9GjhwQ_zvDyVu_SWeQiBjqF3qAknDuTbL_sWLtFrjX47Mpz9';

    this.http.get<any>(url).subscribe(data => {
      this.news = data.news;
    });
  }


  /**
   * if API dont deliver img "news.jpg" will be shown
   */
  onImageError(event: any) {
    event.target.src = "/assets/img/news.jpg";
  }

}

