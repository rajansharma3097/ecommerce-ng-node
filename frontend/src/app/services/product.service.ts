import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.server_url;
  constructor(private http: HttpClient) {}

  getAllProducts(limit = 10) {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: limit.toString(),
      },
    });
  }

  /** GET SINGLE PRODUCT FROM SERVER */
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(
      this.SERVER_URL + '/products/' + id
    );
  }

  /** GET PRODUCTS FROM ONE CATEGORY */
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(
      this.SERVER_URL + 'products/cateory/' + catName
    );
  }
}
