import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['buyer'],
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/store']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.error = null;
    this.loading = true;
    const payload = {
      email: this.form.value.email,
      name: this.form.value.name || undefined,
      password: this.form.value.password,
      role: this.form.value.role as 'buyer' | 'admin',
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.router.navigateByUrl(this.auth.isAdmin() ? '/admin/products' : '/store');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.message || 'Registration failed.';
      },
      complete: () => (this.loading = false),
    });
  }
}
