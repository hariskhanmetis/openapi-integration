import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  isEditMode = false;
  selectedUserId: number | null = null;
  private userSubscription!: Subscription;

  constructor(private apiService: ApiService, formBuilder: FormBuilder) {
    this.userForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.apiService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  addUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    const newUser = this.userForm.value;
  
    this.apiService.addUser(newUser).subscribe(() => {
      const addedUser = { id: this.users.length + 1, ...newUser }; 
      this.users.push(addedUser); 
      this.userForm.reset();
    });
  }
  
  editUser(user: any): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.setValue({
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone
    });
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    const updatedUser = this.userForm.value;

    this.apiService.updateUser(this.selectedUserId, updatedUser).subscribe(() => {
      const index = this.users.findIndex(user => user.id === this.selectedUserId);
      this.users[index] = { ...updatedUser, id: this.selectedUserId };
      
      this.isEditMode = false;
      this.selectedUserId = null;
      this.userForm.reset();
    });
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user=> user.id !== id);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      console.log('Unsubscribed from API');
    }
  }
}
