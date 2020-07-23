import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as LocalForage from 'localforage';

import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../../../shared/services/global.service';


interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private instance: LocalForage;

  private instanceName: string = 'Muse';

  public loginForm: FormGroup;
  public loginError: string = null;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private globalService: GlobalService
  ) {

    this.instance = LocalForage.createInstance({
      driver: LocalForage.LOCALSTORAGE,
      name: this.instanceName,
    });
  }

  ngOnInit(): void {
    this.loadLoginForm();
  }

  public loadLoginForm(loginForm?: LoginForm) {
    this.loginForm = this.fb.group(
      {
        username: [_.get(loginForm, 'username', ''), Validators.required],
        password: [_.get(loginForm, 'password', ''), Validators.required],
      },
    );
  }

  /**
   * On User Login
   *
   *
   * @memberof LoginComponent
   */
  public onSubmit() {
    this.isLoading = true;

    this.authService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => this.isLoading = false),
      )
      .subscribe(
        response => this.process(response),
        error => this.loginError = error.error
      );
  }

  /**
 * Process access token
 *
 * @private
 * @param {any} response
 * @returns {boolean}
 *
 * @memberof LoginComponent
 */
  private process(response): boolean {

    const token = response.data.access_token;

    if (_.isNil(token)) {
      this.loginError = 'Unable to login. Please try again!';
      return false;
    }

    LocalForage.setItem('id_token', token).then(() => {
      this.globalService.setToken();
      this.router.navigate(['/album/artists']);
    }).catch(e => {
      this.loginError = e.error.message;
      console.log(this.loginError);
    });

  }

}
