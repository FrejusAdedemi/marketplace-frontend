import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { canManageProducts } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    images: [''],
    attributes: ['{}'],
    is_sponsored: [false],
    is_active: [true]
  });

  productId: string | null = null;
  isEditMode = false;

  checkingAccess = true;
  accessDenied = false;
  loading = false;
  submitting = false;
  error = '';

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    this.checkAccess();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let attributes: Record<string, unknown> = {};
    const rawAttributes = this.form.controls.attributes.value.trim();
    if (rawAttributes) {
      try {
        attributes = JSON.parse(rawAttributes);
      } catch {
        this.error = 'Le champ "Caractéristiques" doit contenir du JSON valide.';
        return;
      }
    }

    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      description: value.description,
      price: value.price,
      category: value.category,
      images: value.images
        ? value.images
            .split(',')
            .map((image) => image.trim())
            .filter(Boolean)
        : [],
      attributes,
      is_sponsored: value.is_sponsored,
      is_active: value.is_active
    };

    this.submitting = true;
    this.error = '';

    const request =
      this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, payload)
        : this.productService.createProduct(payload);

    request.subscribe({
      next: (product) => {
        this.submitting = false;
        const id = product?._id ?? this.productId;
        this.router.navigate(['/products', id]);
      },
      error: () => {
        this.submitting = false;
        this.error = this.isEditMode
          ? 'Erreur lors de la mise à jour du produit.'
          : 'Erreur lors de la création du produit.';
      }
    });
  }

  private checkAccess(): void {
    if (!this.authService.isLoggedIn()) {
      this.checkingAccess = false;
      this.accessDenied = true;
      return;
    }

    this.authService.getMe().subscribe({
      next: (user) => {
        this.checkingAccess = false;

        if (!canManageProducts(user?.role)) {
          this.accessDenied = true;
          return;
        }

        if (this.isEditMode && this.productId) {
          this.loadProduct(this.productId);
        }
      },
      error: () => {
        this.checkingAccess = false;
        this.accessDenied = true;
      }
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: (product.images ?? []).join(', '),
          attributes: JSON.stringify(product.attributes ?? {}),
          is_sponsored: product.is_sponsored,
          is_active: product.is_active
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger le produit à modifier.';
        this.loading = false;
      }
    });
  }
}
