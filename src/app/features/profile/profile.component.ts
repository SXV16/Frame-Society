import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('imageFileInput') imageFileInput!: ElementRef;
  
  user: any;
  bio: string = '';
  profile_picture_url: string = '';
  
  loading: boolean = true;
  saving: boolean = false;
  uploading: boolean = false;
  
  errorMsg: string = '';
  successMsg: string = '';

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch user from auth/session or backend
    this.http.get<any>(`${environment.apiBaseUrl}/users/me`).subscribe({
       next: (res) => {
         this.user = res;
         this.bio = res.bio || '';
         this.profile_picture_url = res.profile_picture_url || '';
         this.loading = false;
       },
       error: (err) => {
         this.errorMsg = 'Failed to load profile';
         this.loading = false;
       }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.errorMsg = '';
    this.successMsg = '';
    
    this.auth.updateProfile({ bio: this.bio, profile_picture_url: this.profile_picture_url })
      .subscribe({
        next: () => {
          this.successMsg = 'Profile saved successfully';
          this.saving = false;
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Failed to save';
          this.saving = false;
        }
      });
  }

  openFilePicker(): void {
    this.imageFileInput.nativeElement.click();
  }

  onFilesSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('files', file);

      this.http.post<{ urls: string[] }>(`${environment.apiBaseUrl}/upload`, formData)
        .subscribe({
          next: (res) => {
            if (res.urls && res.urls.length) {
              this.profile_picture_url = res.urls[0];
            }
            this.uploading = false;
          },
          error: (err) => {
            this.errorMsg = 'Image upload failed';
            this.uploading = false;
          }
        });
    }
  }
}
