import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;

  products: Product[] = [];
  showProductDetail:boolean = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    description: '',
    category: {
      id: '',
      name: ''
    }
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  today = new Date(2020, 3, 14);
  date = new Date(2021, 1, 21)

  constructor(private storeService: StoreService, 
              private productService: ProductsService) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.loadMore();
  }

  onAddToShoppingCart(product: Product){
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productService.getProduct(id).subscribe(data => {
      
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMsg => {
      this.statusDetail = 'error';
      Swal.fire({
        title:errorMsg,
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'De acuerdo'
      })
    });
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  readAndUpdate(id:string) {
    this.productService.getProduct(id)
    .pipe(
      switchMap((product) => this.productService.update(product.id, { title: 'change' })
      )
    )
    .subscribe(data => {
      console.log(data);
    })
    this.productService.fetchReadAndUpdate(id, {title: 'change'})
    .subscribe(response => {
      const read = response[0];
      const update = response[1];
    })
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'Nueva descripción',
      images: [`https://placeimg.com/640/480/any?random=${Math.random}`],
      price: 1000,
      categoryId: 2,


    }
    this.productService.create(product).subscribe(data => {
      this.products.unshift(data);
    });
  }


  updateProduct(){
    const changes: UpdateProductDTO = {
      title: 'change title',
    }
    const id= this.productChosen.id;
    this.productService.update(id,changes).subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct(){
    const id= this.productChosen.id;
    this.productService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.productService.getAllProducts(this.limit,this.offset).subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
