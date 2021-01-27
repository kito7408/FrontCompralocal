import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { blogItemGet } from '../classes/blogItemGet';
import { blogItemPost } from '../classes/blogItemPost';
import { BlogService } from '../services/blog.service';
import { UserService } from '../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  // list: Array<Number>;
  posts = new Array<any>();
  thereMore: boolean;
  listRows: number;
  itemsPerRow: number;
  filemsg: string;
  postImg: File;
  newPost = new blogItemPost;
  posting: boolean;
  successAlert: boolean;
  successMessage: string;
  errorAlert: boolean;
  errorMessage: string;

  @ViewChild('closeAddPostModal') closeAddPostModal: ElementRef;

  constructor(
    public userService: UserService,
    private blogService: BlogService
  ) { 
    // this.list = [0];
    this.listRows = 1;
    this.itemsPerRow = 3;
    this.thereMore = false;
    this.posting = false;
    this.listAll();
  }

  ngOnInit(): void {
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

  closeModal() {
    this.newPost = new blogItemPost;
  }

  selectFile(event) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.filemsg = 'Debes seleccionar una imagen';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.filemsg = "Solo se aceptan imagenes";
      return;
    }

    this.postImg = <File>event.target.files[0];
    
    this.filemsg = '';
  }

  addPost() {
    if (this.filemsg == '' && this.postImg) {
      this.posting = true;
      this.newPost.image = this.postImg;
      this.newPost.userId = this.userService.userInfo.id;

      this.blogService.save(this.newPost).subscribe((data:any) => {
        this.listAll();
        this.closeAddPostModal.nativeElement.click();
        this.closeModal();
        this.posting = false;
        this.successEvent('Post publicado correctamente');
      }, (error) => {
        console.log(error);
        this.errorEvent('Error al publicar el post');
      });
    }
  }

  listAll(){
    this.blogService.getAll().subscribe((data: any) => {
      this.posts = data;
      this.posts.forEach(element => {   
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
      this.posts[0].last = true;
      if ((this.listRows * 3) < this.posts.length) {
        this.thereMore = true;
      } else {
        this.thereMore = false;
      }
    });
  }

  successEvent(msg: string) {
    this.successAlert = true;
    this.successMessage = msg;
    setTimeout(() => {
      this.successAlert = false;
      this.successMessage = '';
    }, 3000);
  }

  errorEvent(msg: string) {
    this.errorAlert = true;
    this.errorMessage = msg
    setTimeout(() => {
      this.errorAlert = false;
      this.errorMessage = '';
    }, 3000);
  }

}
