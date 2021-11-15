import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: ProductModelServer[] = [];
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((prods) => {
      this.products = prods.products;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddProduct(prodId: number) {}
}
