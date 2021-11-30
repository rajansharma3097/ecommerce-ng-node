import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartData!: CartModelServer;
  cartTotal: number = 0;
  subTotal: number = 0;
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => {
      this.cartData = data;
    });
    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }

  changeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.updateCartItems(id, increaseQuantity);
  }
}
