import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blogItemGet } from '../classes/blogItemGet';
import { BlogService } from '../services/blog.service';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post = new blogItemGet;
  postId: number;
  posts = new Array<any>();
  thereMore: boolean;
  listRows: number;
  itemsPerRow: number;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {
    this.listRows = 1;
    this.itemsPerRow = 4;
    this.thereMore = false;
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
      this.getPost(this.postId);
    });
  }

  ngOnInit(): void {
  }

  getPost(id: number) {
    this.blogService.getById(id).subscribe((dataPost: blogItemGet) => {
      dataPost.author = dataPost.author.replace(/\n/g, "<br>");
      dataPost.content = dataPost.content.replace(/\n/g, "<br>");
      this.post = dataPost;
      this.listAll();
    })
  }

  listAll() {
    this.blogService.getExcept(this.postId).subscribe((data: any) => {
      this.posts = data;
      this.posts.forEach(element => {
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
      
      if ((this.listRows * this.itemsPerRow) < this.posts.length) {
        this.thereMore = true;
      } else {
        this.thereMore = false;
      }
    });
  }

  showMore(){
    // this.list.push(this.listRows);
    this.listRows++;
    if ((this.listRows * this.itemsPerRow) < this.posts.length) {
      this.thereMore = true;
    } else {
      this.thereMore = false;
    }
  }
}
