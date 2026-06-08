import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    images: '',
    attributes: '{}'
  };

  successMessage = '';
  errorMessage = '';

  constructor(private productService: ProductService) {}

  submit(): void {
    let parsedAttributes = {};

    try {
      parsedAttributes = JSON.parse(this.product.attributes);
    } catch {
      this.errorMessage = 'Les attributs doivent être au format JSON valide.';
      return;
    }

    const payload = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      category: this.product.category,
      images: this.product.images
        ? this.product.images.split(',').map((img) => img.trim())
        : [],
      attributes: parsedAttributes
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.successMessage = 'Produit créé avec succès.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création du produit.';
        this.successMessage = '';
      }
    });
  }
}