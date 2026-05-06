import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { ProductPage } from "../pages/ProductPage.page";
import { CartPage } from "../pages/CartPage.page";
import { CheckOutPageStepOne } from "../pages/Checkout Page/CheckOutPageStepOne.page";
import { CheckOutPageStepTwo } from "../pages/Checkout Page/CheckOutPageStepTwo.page";
import { CheckOutPageComplete } from "../pages/Checkout Page/CheckoutPageComplete.page";

test.describe("Testing the checkout function", async () => {
  test.beforeEach("Login to the website", async ({ page }) => {
    const login_page = new LoginPage(page);
    const product_page = new ProductPage(page);
    const cart_page = new CartPage(page);
    const checkout_stepone = new CheckOutPageStepOne(page);

    await login_page.goto();
    await login_page.login("standard_user", "secret_sauce");
    await login_page.assertLoginSuccessful();
    await product_page.expectProductPageLoadSuccessful();

    await product_page.addToCart();
    await product_page.goToCart();
    await cart_page.expectCartPageLoadsSuccessfully();
    await cart_page.expectCartItems();
    await cart_page.checkout();
    await checkout_stepone.expectFirstPageCheckout();
  });

  test.describe("Testing the step one of the check out process", async () => {
    test("Proceed without filling up the first name", async ({ page }) => {
      const checkout_stepone = new CheckOutPageStepOne(page);

      await checkout_stepone.fillUpInformation("", "ASDFG", "12345");
      await checkout_stepone.continue();
      await checkout_stepone.expectErrorMessage("firstname");
    });

    test("Proceed without filling up the last name", async ({ page }) => {
      const checkout_stepone = new CheckOutPageStepOne(page);

      await checkout_stepone.fillUpInformation("QWERTY", "", "12345");
      await checkout_stepone.continue();
      await checkout_stepone.expectErrorMessage("lastname");
    });

    test("Proceed without filling up the zip code", async ({ page }) => {
      const checkout_stepone = new CheckOutPageStepOne(page);

      await checkout_stepone.fillUpInformation("QWERTY", "ASDFG", "");
      await checkout_stepone.continue();
      await checkout_stepone.expectErrorMessage("zipcode");
    });
  });

  test("Testing the whole check out process", async ({ page }) => {
    const checkout_stepone = new CheckOutPageStepOne(page);
    const checkout_steptwo = new CheckOutPageStepTwo(page);
    const checkout_complete = new CheckOutPageComplete(page);
    const product_page = new ProductPage(page);

    //Filling up the information field
    await checkout_stepone.fillUpInformation("QWERTY", "ASDFG", "12345");
    await checkout_stepone.continue();

    //Checking if the next step loads successfully
    await checkout_steptwo.expectSecondPageCheckout();

    //Check if the prices is correct
    await checkout_steptwo.expectSubTotalPrice();
    await checkout_steptwo.expectTaxPrice();
    await checkout_steptwo.expectTotalPrice();
    await checkout_steptwo.finnish();

    //Check if complete page loads successfully
    await checkout_complete.expectLastPageCheckout();
    await checkout_complete.backToHome();

    //Check if the product page loads successfully after completing the check out process
    await product_page.expectProductPageLoadSuccessful();
  });
});
