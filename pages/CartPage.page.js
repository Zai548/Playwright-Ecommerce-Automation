import { expect } from "@playwright/test";

export class CartPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.removeCartBackpack = page.locator(
      '[data-test="remove-sauce-labs-backpack"]',
    );
    this.removeCartOnsie = page.locator(
      '[data-test="remove-sauce-labs-onesie"]',
    );
    this.removeCartJacket = page.locator(
      '[data-test="remove-sauce-labs-fleece-jacket"]',
    );
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.products = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.productDesc = page.locator('[data-test="inventory-item-desc"]');
    this.pageTitle = page.getByText("Your Cart");
    this.pageQtyLabel = page.locator('[data-test="cart-quantity-label"]');
    this.cartDesc = page.locator('[data-test="cart-desc-label"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.checkOutButton = page.locator('[data-test="checkout"]');
  }

  //Test Actions
  //Go back to product page from cart page
  async goToProductPage() {
    await this.continueShoppingButton.click();
  }

  //Reload the page
  async reloadPage() {
    await this.page.reload();
  }

  //Remove items from the cart
  async removeItem() {
    //remove items from the cart
    await this.removeCartBackpack.click();
    await this.removeCartJacket.click();
    await this.removeCartOnsie.click();
  }

  //Proceed to checkout
  async checkout() {
    //Click the checkout button
    await this.checkOutButton.click();
  }

  //Assertions
  //Checks the remove button
  async expectRemoveButtons(condition) {
    //Remove button for the items that is added to cart must be visible
    if (condition == "visible") {
      await expect(this.removeCartBackpack).toBeVisible();
      await expect(this.removeCartJacket).toBeVisible();
      await expect(this.removeCartOnsie).toBeVisible();
    } else if (condition == "hidden") {
      await expect(this.removeCartBackpack).toBeHidden();
      await expect(this.removeCartJacket).toBeHidden();
      await expect(this.removeCartOnsie).toBeHidden();
    }
  }

  //Check if the cart page loads successfully
  async expectCartPageLoadsSuccessfully() {
    //User must be in the cart page
    await expect(this.page).toHaveURL("https://www.saucedemo.com/cart.html");

    //Page title must be showing
    await expect(this.pageTitle).toBeVisible();

    //Cart quantity header must be showing
    await expect(this.pageQtyLabel).toBeVisible();

    //Cart description header must be showing
    await expect(this.cartDesc).toBeVisible();

    //Cart continue shopping button must be visible
    await expect(this.continueShoppingButton).toBeVisible();

    //Cart check out button must be visible
    await expect(this.checkOutButton).toBeVisible();
  }

  //Check if the items is in the cart
  async expectCartItems() {
    //There must be 3 items in cart
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

    //The remove button for each items that is in the cart must be visible
    await expect(this.removeCartBackpack).toBeVisible();
    await expect(this.removeCartJacket).toBeVisible();
    await expect(this.removeCartOnsie).toBeVisible();
  }

  //Check if the items is removed from the cart
  async expectRemovedItems() {
    //There must be no item in the cart
    await expect(this.products).toHaveCount(0);
    await expect(this.productNames).toHaveCount(0);
    await expect(this.productDesc).toHaveCount(0);
    await expect(this.productPrices).toHaveCount(0);
  }

  //Check if the cart badges updates
  async expectCartBadge(condition) {
    if (condition == "added") {
      //The cart badge must be showing and its according number when the item is added to cart
      await expect(this.cartBadge).toBeVisible();
      await expect(await this.cartBadge.allTextContents()).toEqual(["3"]);
    } else if (condition == "removed") {
      //The cart badge must be gone after removing the items
      await expect(this.cartBadge).toBeHidden;
      await expect(await this.cartBadge.allTextContents()).toEqual([]);
    }
  }
}
