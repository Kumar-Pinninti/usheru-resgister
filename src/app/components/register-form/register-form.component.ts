import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registrationForm: FormGroup;
  countries: string[] = [];

  errorMessage: string = '';
  toastMessage: string = '';

  showToast: boolean = false;
  isSuccess: boolean = false;
  isSubmitting: boolean = false;
  isUsernameAvailable: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]{1,20}$')]],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCountries();
    this.setupUsernameValidation();
  }

  // to load countries which intercepted by mock backend interceptor
  loadCountries() {
    this.http.get<string[]>('api/countries').subscribe(
      (countries) => {
        this.countries = countries;
      },
      (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load countries. Please try again later.';
      }
    );
  }
  
  // to check usernmae exists or not which intercepted by mock backend interceptor
  setupUsernameValidation() {
    this.registrationForm.get('username')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(username => this.http.get<boolean>(`api/username-available/${username}`))
    ).subscribe(
      (isAvailable) => {
        this.isUsernameAvailable = isAvailable;
        if (!isAvailable) {
          this.registrationForm.get('username')?.setErrors({ 'taken': true });
        }
      },
      (error) => {
        console.error('Error checking username availability:', error);
        this.errorMessage = 'Failed to check username availability. Please try again.';
      }
    );
  }

  // on submitting form
  onSubmit() {
    if (this.registrationForm.valid && this.isUsernameAvailable) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.http.post('api/register', this.registrationForm.value).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.showToastMessage('Registration successful!', true);
          this.registrationForm.reset();
        },
        (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
          this.isSubmitting = false;
        }
      );
    }
  }
  
  // click close to hide toast
  hide() {
    this.showToast = false;
    this.isSubmitting = false;
  }

  // to show toast message after successful submission
  showToastMessage(message: string, success: boolean) {
    this.toastMessage = message;
    this.isSuccess = success;
    this.showToast = true;
    
    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
      this.isSubmitting = false;
    }, 3000);
  }
}
