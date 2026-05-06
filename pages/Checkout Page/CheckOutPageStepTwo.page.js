import { expect } from "@playwright/test";

export class CheckOutPageStepTwo {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageTitle = page.getByText("Checkout: Overview");
    this.products = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.productDesc = page.locator('[data-test="inventory-item-desc"]');
    this.pageQtyLabel = page.locator('[data-test="cart-quantity-label"]');
    this.cartDesc = page.locator('[data-test="cart-desc-label"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finnishButton = page.locator('[data-test="finish"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.totalPriceLabel = page.locator('[data-test="total-info-label"]');
    this.subTotalPrice = page.locator('[data-test="subtotal-label"]');
    this.taxPrice = page.locator('[data-test="tax-label"]');
    this.totalPrice = page.locator('[data-test="total-label"]');
  }

  //Test Actions
  async finnish() {
    await this.finnishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  //Assertions
  //Check if the checkout page step two loaded succesfully
  async expectSecondPageCheckout() {
    //Check if the user is in the right page
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/checkout-step-two.html",
    );

    //Check if the page title is visible
    await expect(this.pageTitle).toBeVisible();

    //Check if the items is there
    await expect(this.products).toHaveCount(3);
    await expect(this.productNames).toHaveCount(3);
    await expect(this.productDesc).toHaveCount(3);
    await expect(this.productPrices).toHaveCount(3);

    //Check if the items is in the cart is correct
    //Expected item names
    const expectedNames = [
      "Sauce Labs Backpack",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Onesie",
    ];

    //Get the item names in the cart
    const itemNames = await this.productNames.allTextContents();

    //The items in the cart must be exact item that is added to cart
    await expect(itemNames).toEqual(expectedNames);

    //Check if the item description in the cart is correct
    //Expected item descriptions
    const expectedDesc = [
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    ];

    //Get the item desc in the cart
    const itemDesc = await this.productDesc.allTextContents();

    //The item desc in the cart must be exact item desc that is added to cart
    await expect(itemDesc).toEqual(expectedDesc);

    //Check if the item price is in the cart is correct
    //Expected item prices
    const expectedPrices = ["$29.99", "$49.99", "$7.99"];

    //Get the item prices in the cart
    const itemPrices = await this.productPrices.allTextContents();

    //The item prices in the cart must be exact item prices that is added to cart
    await expect(itemPrices).toEqual(expectedPrices);

    //Check if the Payment Information is visible
    await expect(this.paymentInfoLabel).toBeVisible();

    //Check if the Shipping Information is visible
    await expect(this.shippingInfoLabel).toBeVisible();

    //Check if the Price Total is visible
    await expect(this.totalPriceLabel).toBeVisible();
  }

  //Check if the sub total price is correct
  async expectSubTotalPrice() {
    // Get the item prices in the cart
    const itemPrices = await this.productPrices.allTextContents();

    // Get the expected subtotal price as a number
    const expectedSubTotalPrice = itemPrices
      .map((price) => Number(price.replace("$", "")))
      .reduce((total, price) => total + price, 0);

    //Get the total price
    const SubPriceText = await this.subTotalPrice.allTextContents();
    const SubTotalPrice = SubPriceText.map((price) =>
      Number(price.replace("Item total: $", "")),
    );

    //Check if the expected price and the printed price are the same
    await expect(SubTotalPrice).toEqual([expectedSubTotalPrice]);
  }

  //Check if the 8% tax is correct
  async expectTaxPrice() {
    // Get the item prices in the cart
    const itemPrices = await this.productPrices.allTextContents();

    // Get the expected subtotal price as a number
    const expectedSubTotalPrice = itemPrices
      .map((price) => Number(price.replace("$", "")))
      .reduce((total, price) => total + price, 0);

    // Get the expected tax, 8%, rounded to 2 decimals
    const expectedTax = Number((expectedSubTotalPrice * 0.08).toFixed(2));

    // Get the printed tax
    const taxText = await this.taxPrice.textContent();
    const actualTax = Number(taxText.replace("Tax: $", ""));

    //Check if the expected tax and printed tax are the same
    await expect(actualTax).toEqual(expectedTax);
  }

  //Check if the total price is correct
  async expectTotalPrice() {
    // Get the item prices in the cart
    const itemPrices = await this.productPrices.allTextContents();

    // Get the expected subtotal price as a number
    const expectedSubTotalPrice = itemPrices
      .map((price) => Number(price.replace("$", "")))
      .reduce((total, price) => total + price, 0);

    // Get the expected tax, 8%, rounded to 2 decimals
    const expectedTax = Number((expectedSubTotalPrice * 0.08).toFixed(2));

    // Get the expected total price
    const expectedTotalPrice = Number(
      (expectedSubTotalPrice + expectedTax).toFixed(2),
    );

    //Get the printed total price
    const totalPriceText = await this.totalPrice.allTextContents();
    const totalPrice = totalPriceText.map((totalPrice) =>
      Number(totalPrice.replace("Total: $", "")),
    );

    //Check if the expected total price and expected total price are the same
    expect(totalPrice).toEqual([expectedTotalPrice]);
  }
}
