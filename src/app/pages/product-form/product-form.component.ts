import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    images: '',
    stock: 0,
    attributes: '{}'
  };

  successMessage = '';
  errorMessage = '';

  constructor(private productService: ProductService) {}

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    let parsedAttributes: any = {};

    try {
      parsedAttributes = JSON.parse(this.product.attributes || '{}');
    } catch {
      this.errorMessage = 'Les attributs doivent être au format JSON valide.';
      return;
    }

    const payload = {
      name: this.product.name.trim(),
      description: this.product.description.trim(),
      price: Number(this.product.price),
      category: this.product.category.trim(),
      images: this.product.images
        ? this.product.images.split(',').map((img) => img.trim()).filter(Boolean)
        : [],
      attributes: {
        ...parsedAttributes,
        stock: Number(this.product.stock)
      }
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.successMessage = 'Produit créé avec succès.';
        this.errorMessage = '';

        this.product = {
          name: '',
          description: '',
          price: 0,
          category: '',
          images: '',
          stock: 0,
          attributes: '{}'
        };
      },
      error: (error) => {
        console.error('Erreur création produit :', error);
        this.errorMessage = 'Erreur lors de la création du produit.';
        this.successMessage = '';
      }
    });
  }
}