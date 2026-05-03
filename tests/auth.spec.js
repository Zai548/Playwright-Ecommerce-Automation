import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";

test.describe("Login Testing", async () => {
  test("Login Successfully", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("standard_user", "secret_sauce");
    await login_page.assertLoginSuccessful();
  });

  test("Invalid Login: Wrong Password", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("standard_user", "abcd123");
    await login_page.assertLoginFail();
  });

  test("Invalid Login: Wrong Username", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("abcd123", "secret_sauce");
    await login_page.assertLoginFail();
  });

  test("Invalid Login: Wrong Username and Password", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("secret_sauce", "standard_user");
    await login_page.assertLoginFail();
  });

  test("Locked out user", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("locked_out_user", "secret_sauce");
    await login_page.assertLockedOutUser();
  });

  test("Logout flow", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.login("standard_user", "secret_sauce");
    await login_page.assertLoginSuccessful();
    await login_page.logout();
    await login_page.assertLogout();
  });
});
