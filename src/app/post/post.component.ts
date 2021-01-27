import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blogItemGet } from '../classes/blogItemGet';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post = new blogItemGet;
  postId: number;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe((params) => {
      this.postId = params['id'];
      this.getPost(this.postId);
    });
   }

  ngOnInit(): void {
  }

  getPost(id: number){
    this.blogService.getById(id).subscribe((dataPost: blogItemGet) => {
      dataPost.content = dataPost.content.replace(/\n/g,"<br>")
      
      this.post = dataPost;
    })
  }
}
