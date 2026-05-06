import { expect } from "@playwright/test";

export class CheckOutPageComplete {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageTitle = page.getByText("Checkout: Complete!");
    this.checkIcon = page.locator('[data-test="pony-express"]');
    this.thankyouMessage = page.getByText("Thank you for your order!");
    this.message = page.getByText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
    );
    this.backToHomeButton = page.locator('[data-test="back-to-products"]');
  }

  //Test Actions
  async backToHome() {
    await this.backToHomeButton.click();
  }

  //Assertions
  //Check if the page loads successfully
  async expectLastPageCheckout() {
    //The user must be in the finish stage of check out
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/checkout-complete.html",
    );

    //Check if the page title is visible
    await expect(this.pageTitle).toBeVisible();

    //Check if the Thank you message is visible
    await expect(this.thankyouMessage).toBeVisible();

    //Check if the complete message is visible
    await expect(this.message).toBeVisible();

    //Check if the Back home button is visible
    await expect(this.backToHomeButton).toBeVisible();
  }
}
