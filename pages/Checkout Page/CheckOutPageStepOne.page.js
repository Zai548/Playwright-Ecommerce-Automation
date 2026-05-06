import { expect } from "@playwright/test";

export class CheckOutPageStepOne {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageTitle = page.getByText("Checkout: Your Information");
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.zipCodeField = page.getByPlaceholder("Zip/Postal Code");
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');

    //Error Messages
    this.firstNameErrorMessage = page.getByText(
      "Error: First Name is required",
    );
    this.lastNameErrorMessage = page.getByText("Error: Last Name is required");
    this.zipCodeErrorMessage = page.getByText("Error: Postal Code is required");
  }

  //Test Actions
  //Fill up the input fields
  async fillUpInformation(firstname, lastname, zipcode) {
    await this.firstNameField.fill(firstname);
    await this.lastNameField.fill(lastname);
    await this.zipCodeField.fill(zipcode);
  }

  //Press continue button
  async continue() {
    await this.continueButton.click();
  }

  //Press cancel button
  async cancel() {
    await this.cancelButton.click();
  }

  //Assertions
  //Check if the checkout page step one loads successfully
  async expectFirstPageCheckout() {
    //Check if the user is in the right page
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/checkout-step-one.html",
    );

    //Check if the page title is visible
    await expect(this.pageTitle).toBeVisible();

    //Check if the input fields are visible
    await expect(this.firstNameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    await expect(this.zipCodeField).toBeVisible();

    //Check if the buttons are visible
    await expect(this.cancelButton).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }

  //Check if the error message is visible if the input fields is empty
  async expectErrorMessage(field) {
    if (field == "firstname") {
      await expect(this.firstNameErrorMessage).toBeVisible();
    } else if (field == "lastname") {
      await expect(this.lastNameErrorMessage).toBeVisible();
    } else if (field == "zipcode") {
      await expect(this.zipCodeErrorMessage).toBeVisible();
    }
  }
}
