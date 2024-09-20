import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
function Register() {
  return (
      <div class="bg-gradient-primary appStyle">
        <div class="container p-1">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <div class="row">
                <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
                <div class="col-lg-7">
                  <div class="p-5">
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                    </div>
                    <form class="user">
                      <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="text"
                            class="form-control form-control-user"
                            id="exampleFirstName"
                            placeholder="First Name"
                          ></input>
                        </div>
                        <div class="col-sm-6">
                          <input
                            type="text"
                            class="form-control form-control-user"
                            id="exampleLastName"
                            placeholder="Last Name"
                          ></input>
                        </div>
                      </div>
                      <div class="form-group">
                        <input
                          type="email"
                          class="form-control form-control-user"
                          id="exampleInputEmail"
                          placeholder="Email Address"
                        ></input>
                      </div>
                      <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="password"
                            class="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                          ></input>
                        </div>
                        <div class="col-sm-6">
                          <input
                            type="password"
                            class="form-control form-control-user"
                            id="exampleRepeatPassword"
                            placeholder="Repeat Password"
                          ></input>
                        </div>
                      </div>
                      <a  class="btn btn-primary btn-user btn-block">
                        Register Account
                      </a>
                      <hr></hr>
                      <a class="btn btn-google btn-user btn-block">
                        <i class="fab fa-google fa-fw"></i> Register with Google
                      </a>
                      <a class="btn btn-facebook btn-user btn-block">
                        <i class="fab fa-facebook-f fa-fw"></i> Register with Facebook
                      </a>
                    </form>
                    <hr></hr>
                   
                    <div class="text-center">
                      <a class="small"><Link to="/">Already have an account? Login!</Link></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Register;
