import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import * as faker from 'faker/locale/en_CA';
import * as uuid from 'uuid';

import { FeathersService } from '@app/services/feathers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  messages: string[] = [];

  form = this.fb.group({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    province: faker.address.state(),
    postalCode: faker.address.zipCode(),
    email: faker.internet.email(),
    password: uuid.NIL
  });

  constructor(private fb: FormBuilder, private router: Router, private feathers: FeathersService) { }

  signup() {
    this.feathers.service('users')
      .create(this.form.value)
      .then(() => this.messages.push('User created.'))
      .catch(err => this.messages.push('Could not create user!'))
      .then(() => (this.feathers.authenticate({
        strategy: 'local',
        email: this.form.value.email,
        password: this.form.value.password
      })))
      .then(() => this.router.navigateByUrl('/chat'))
      .catch(err => this.messages.unshift('Wrong credentials!'));
  }
}
