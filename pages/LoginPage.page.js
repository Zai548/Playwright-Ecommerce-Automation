import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.loginButton = page.locator('[data-test="login-button"]');
    this.burgerIcon = page.getByRole("button", { name: "Open Menu" });
    this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');

    //Error Messages
    this.loginError = page.getByText(
      "Epic sadface: Username and password do not match any user in this service",
    );
    this.lockedUserError = page.getByText(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  }

  //Go to website
  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  //Test Actions
  //Account login
  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  //Logout account
  async logout() {
    await this.burgerIcon.click();
    await this.logoutButton.click();
  }

  //Assertions
  //Check if the login page loads successfully
  async expectLoginPage() {
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
  //Assert if successfully login
  async assertLoginSuccessful() {
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html",
    );
  }

  //Assert Login failed
  async assertLoginFail() {
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    await expect(this.loginError).toBeVisible();
  }

  //Assert Locked out User
  async assertLockedOutUser() {
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    await expect(this.lockedUserError).toBeVisible();
  }

  //Assert if successfully logout
  async assertLogout() {
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
  }
}
