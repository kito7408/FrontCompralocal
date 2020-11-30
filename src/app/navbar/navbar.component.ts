import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { User } from '../classes/user';
import { ProductPost } from '../classes/productPost';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryPost } from '../classes/categoryPost';
import { CategoryGet } from '../classes/categoryGet';
import { Supplier } from '../classes/supplier';
import { CartGet } from '../classes/cartGet';
import { Subcategory } from '../classes/subCategory';

import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { CategoriaService } from '../services/categoria.service';
import { SupplierService } from '../services/supplier.service';
import { CartService } from '../services/cart.service';
import { SubcategoryService } from '../services/subcategory.service';

import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { CartPost } from '../classes/cartPost';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;           //for localstorage
  newUser = new User;   //for forms
  newProduct = new ProductPost;
  newCategoria = new CategoryPost;
  newSubcategoria = new Subcategory;
  newSupplier = new Supplier;
  imagen: File;
  usersTest: User[];
  repass: string;
  prodImg: File;
  filemsg: string;
  searchText: string;
  categorias: CategoryGet[];
  subcategorias: Subcategory[];
  suppliers: Supplier[];
  // cart: CartGet[];
  // cartPrice: number;
  // cartQuantity: number;
  successAlert: boolean;
  errorAlert: boolean;
  successMessage: string;
  errorMessage: string;

  private socialUser: SocialUser;
  private loggedIn: boolean;

  @ViewChild('closeLoginModal') closeLoginModal: ElementRef;
  @ViewChild('closeRegModal') closeRegModal: ElementRef;
  @ViewChild('closeAddUserModal') closeAddUserModal: ElementRef;
  @ViewChild('closeAddProductModal') closeAddProductModal: ElementRef;
  @ViewChild('closeAddSupplierModal') closeAddSupplierModal: ElementRef;
  @ViewChild('closeAddCategoriaModal') closeAddCategoriaModal: ElementRef;
  @ViewChild('closeAddSubCategoriaModal') closeAddSubCategoriaModal: ElementRef;

  @Output() prodEvent = new EventEmitter;

  constructor(
    private userService: UserService,
    private prodService: ProductService,
    private route: ActivatedRoute,
    private routes: Router,
    private suppService: SupplierService,
    private catService: CategoriaService,
    private authService: AuthService,
    public cartService: CartService,
    private sbcService: SubcategoryService
  ) {
    this.successAlert = false;
    this.errorAlert = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.filemsg = '';
    this.searchText = '';
    this.newUser.userTypeId = 2;
    this.getCategorias();
    this.getSuppliers();
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.updateCart();
    } else {
      if (localStorage.getItem('cartLocal')) {
        this.cartService.cartInfo = JSON.parse(localStorage.getItem('cartLocal'));
        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.cartService.cartInfo.forEach(item => {
          this.cartService.cartTotalPrice += item.totalPrice;
          this.cartService.cartQuantity += item.quantity;
        });
      }
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((result) => {
      console.log("socialuser",result);
      this.socialUser = result;
      this.loggedIn = (result != null);
    });
  }

  updateCart() {
    this.cartService.getByUserId(this.user.id).subscribe((dataCart: CartGet[]) => {
      
      this.cartService.cartInfo = dataCart;
      this.cartService.cartQuantity = 0;
      this.cartService.cartTotalPrice = 0;
      this.cartService.cartInfo.forEach(item => {
        this.cartService.cartTotalPrice += item.totalPrice;
        this.cartService.cartQuantity += item.quantity;
      });
    });
  }

  cartLocalToDB() {
    localStorage.removeItem('cartLocal');
    if (this.cartService.cartInfo && this.cartService.cartInfo.length > 0) {
      var cartLocalToSave = new Array<CartPost>();
      this.cartService.cartInfo.forEach(item => {
        var cl = new CartPost;
        cl.isBuyed = item.isBuyed;
        cl.productId = item.productId;
        cl.quantity = item.quantity;
        cl.totalPrice = item.totalPrice;
        cl.userId = this.user.id;
        cartLocalToSave.push(cl);
      });

      this.cartService.saveMany(cartLocalToSave).subscribe((data) => {
        // console.log("save many", data);
        this.updateCart();
      });
    } else {
      this.updateCart();
    }
  }

  login() {
    this.userService.login(this.newUser.username, this.newUser.password)
      .subscribe((data: any) => {
        this.actionsOnLogin(data.data);
      }, (error) => {
        console.log(error);
        this.errorEvent('El usuario es invalido');
      });
  }

  actionsOnLogin(dataUser) {
    localStorage.setItem('user', JSON.stringify(dataUser));
    // localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
    this.user = dataUser;
    this.cartLocalToDB();
    this.newUser.username = '';
    this.newUser.password = '';
    this.closeLoginModal.nativeElement.click();
    this.closeModal();
    this.successEvent('Bienvenido ' + dataUser.name);
  }

  logout() {
    localStorage.removeItem('user');
    this.cartService.cartInfo = new Array<CartGet>();
    this.user = null;
    this.closeModal();
    if (this.loggedIn) {
      this.signOut();
    }
  }

  register() {
    if (this.newUser.password == this.repass) {
      this.userService.save(this.newUser).subscribe((data: any) => {
        if (!this.user) {
          localStorage.setItem('user', JSON.stringify(data.data));
          this.user = data.data;
          this.cartLocalToDB();
        }
        this.closeRegModal.nativeElement.click();
        this.closeAddUserModal.nativeElement.click();
        this.closeModal();

        this.successEvent('Nuevo usuario registrado.');

      }, (error) => {
        console.log(error);
        this.errorEvent('Error al registrar nuevo usuario.')
      })
    } else {
      this.errorEvent('La contraseña repetida no es igual a la original.')
    }
  }

  closeModal() {
    this.newUser = new User;
    this.repass = '';
    this.newUser.userTypeId = 2;
    this.newProduct = new ProductPost;
    this.newSupplier = new Supplier;
    this.newCategoria = new CategoryPost;
    this.newSubcategoria = new Subcategory;
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

    this.prodImg = <File>event.target.files[0];
    this.filemsg = '';
  }

  addProd() {
    if (this.filemsg == '' && this.prodImg) {
      this.newProduct.image = this.prodImg;
      this.newProduct.numSellOnWeek = 0;
      this.newProduct.isTrent = false;
      this.prodService.save(this.newProduct).subscribe((data: any) => {
        this.listAll();
        this.closeAddProductModal.nativeElement.click();
        this.closeModal();
        this.successEvent('Producto agregado correctamente')
      }, (error) => {
        console.log(error);
        this.errorEvent('Error al agregar producto');
      })
    }
  }

  addSupplier() {
    this.suppService.save(this.newSupplier).subscribe((data: any) => {
      this.getSuppliers();
      this.closeModal();
      this.closeAddSupplierModal.nativeElement.click();
      this.successEvent('Proveedor creado correctamente')
    }, (error) => {
      console.log(error);
      this.errorEvent('Error al crear proveedor')
    });
  }

  addCategoria() {
    this.catService.save(this.newCategoria).subscribe((data: any) => {
      this.getCategorias();
      this.closeModal();
      this.closeAddCategoriaModal.nativeElement.click();
      this.successEvent('Categoría agregada correctamente')
    }, (error) => {
      console.log(error);
      this.errorEvent('Error al agregar categoría');
    });
  }

  addSubcategoria() {
    this.sbcService.save(this.newSubcategoria).subscribe((data: any) => {
      this.getCategorias();
      this.closeModal();
      this.closeAddSubCategoriaModal.nativeElement.click();
      this.successEvent('Subcategoria agregada correctamente')
    }, (error) => {
      this.errorEvent('Error al agregar subcategoria')
    })
  }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      this.categorias = data;
    });
  }

  getSubcategoriasByCategoria(id: number) {
    this.sbcService.getByCategoryId(id).subscribe((data: Subcategory[]) => {
      this.subcategorias = data;
    })
  }

  getSuppliers() {
    this.suppService.getAll().subscribe((data: Supplier[]) => {
      this.suppliers = data;
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data: SocialUser) => {
      this.userService.getByUsername(data.email).subscribe((userData) => {
        this.actionsOnLogin(userData);
      });
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data: SocialUser) => {
      this.userService.getByUsername(data.email).subscribe((userData) => {
        this.actionsOnLogin(userData);
      });
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  goToProducto(id: number) {
    this.routes.navigate(['/products/' + id]);
  }

  goToCart() {
    this.routes.navigate(['/cart']);
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

  //Event Emitters
  listProdCat(categoriaId: number) {
    this.routes.navigate(['/products'])
    this.prodService.filterType = 1;
    this.prodService.filter = String(categoriaId);
    this.prodEvent.emit();;
  }

  listProdSubCat(subcategoriaId: number) {
    this.routes.navigate(['/products'])
    this.prodService.filterType = 2;
    this.prodService.filter = String(subcategoriaId);
    this.prodEvent.emit();
  }

  listProdSearch() {
    this.routes.navigate(['/products'])
    this.prodService.filterType = 3;
    this.prodService.filter = this.searchText;
    this.prodEvent.emit();
  }

  listAll() {
    this.routes.navigate(['/products'])
    this.prodService.filterType = 0;
    this.prodService.filter = '';
    this.prodEvent.emit();
  }
}
