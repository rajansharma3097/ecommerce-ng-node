import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
})
export class ThankyouComponent implements OnInit {
  message!: string;
  orderId!: number;
  products!: ProductResponseModel[];
  cartTotal!: number;
  constructor(private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation);
    setTimeout(() => {
      const state = navigation?.extras.state as {
        message: string;
        products: ProductResponseModel[];
        orderId: number;
        total: number;
      };

      this.message = state.message;
      this.products = state.products;
      this.orderId = state.orderId;
      this.cartTotal = state.total;
    }, 100);
  }

  ngOnInit(): void {}
}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
