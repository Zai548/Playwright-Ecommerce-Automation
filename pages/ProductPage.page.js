import { expect } from "@playwright/test";

export class ProductPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.productList = page.locator('[data-test="inventory-list"]');
    this.products = page.locator('[data-test="inventory-item"]');
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDesc = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButtons = page.getByRole("button", { name: "Add to cart" });
    this.productSorter = page.locator('[data-test="product-sort-container"]');
    this.pageTitle = page.getByText("Products", { exact: true });
    this.openProduct = page.getByText("Sauce Labs Backpack", { exact: true });
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
    this.addToCartBackpack = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]',
    );
    this.addToCartOnesie = page.locator(
      '[data-test="add-to-cart-sauce-labs-onesie"]',
    );
    this.addToCartJacket = page.locator(
      '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
    );
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
  }

  //Test Actions
  //Reload the page
  async reloadPage() {
    await this.page.reload();
  }

  async getProductNames() {
    return await this.productName.allTextContents();
  }

  async getProductPrices() {
    const priceTexts = await this.productPrice.allTextContents();

    return priceTexts.map((priceText) => {
      return Number(priceText.replace("$", ""));
    });
  }

  //Go to shopping cart page
  async goToCart() {
    await this.cartButton.click();
  }

  //Make the items added to cart
  async addToCart() {
    //Add items to cart
    await this.addToCartBackpack.click();
    await this.addToCartJacket.click();
    await this.addToCartOnesie.click();
  }

  //Remove items from the cart
  async removeItem() {
    //remove items from the cart
    await this.removeCartBackpack.click();
    await this.removeCartJacket.click();
    await this.removeCartOnsie.click();
  }

  //Assertions
  //Product List loads
  async expectProductPageLoadSuccessful() {
    // 1. User should be in the product page
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html",
    );

    // 2. The page title should be to be visible
    await expect(this.pageTitle).toBeVisible();

    // 3. The product list should be visible
    await expect(this.productList).toBeVisible();

    // 4. The page should display 6 products
    await expect(this.products).toHaveCount(6);

    // 5. Each product should have Name, Description, Price, and add to cart button
    await expect(this.productName).toHaveCount(6);
    await expect(this.productDesc).toHaveCount(6);
    await expect(this.productPrice).toHaveCount(6);
    await expect(this.addToCartButtons).toHaveCount(6);

    // 6. Product sorter should be visible
    await expect(this.productSorter).toBeVisible();
  }

  //Sort by name Ascending
  async expectProductsByNameAsc() {
    //Sort the products to A-Z Name
    await this.productSorter.selectOption("az");

    //Expected sorted list
    const expectedNames = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Onesie",
      "Test.allTheThings() T-Shirt (Red)",
    ];

    //Get the current list of the products
    const productNames = await this.getProductNames();

    //The current product list should be the same to the expected list
    await expect(productNames).toEqual(expectedNames);
  }

  //Sort by name Descending
  async expectProductsByNameDesc() {
    //Sort the products to Z-A Name
    await this.productSorter.selectOption("za");

    //Expected sorted list
    const expectedNames = [
      "Test.allTheThings() T-Shirt (Red)",
      "Sauce Labs Onesie",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Bike Light",
      "Sauce Labs Backpack",
    ];

    //Get the current list of the products
    const productNames = await this.getProductNames();

    //The current product list should be the same to the expected list
    await expect(productNames).toEqual(expectedNames);
  }

  //Sort by Price Ascending
  async expectProductsByPriceAsc() {
    //Sort the products to Low-High Price
    await this.productSorter.selectOption("lohi");

    //Expected sorted list
    const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];

    //Get the current list of the products
    const productPrices = await this.getProductPrices();

    //The current product list should be the same to the expected list
    await expect(productPrices).toEqual(expectedPrices);
  }

  //Sort by Price Descending
  async expectProductsByPriceDesc() {
    //Sort the products to High-Low Price
    await this.productSorter.selectOption("hilo");

    //Expected sorted list
    const expectedPrices = [49.99, 29.99, 15.99, 15.99, 9.99, 7.99];

    //Get the current list of the products
    const productPrices = await this.getProductPrices();

    //The current product list should be the same to the expected list
    await expect(productPrices).toEqual(expectedPrices);
  }

  //Product Details Page Loads Successfully
  async expectProductDetailsLoadSuccessfully() {
    //Open one product
    await this.openProduct.click();

    //The user should be in the specific product details page
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory-item.html?id=4",
    );

    //The product name should be the same with opened product
    await expect(await this.productName.allTextContents()).toEqual([
      "Sauce Labs Backpack",
    ]);

    //The product description should be the same with the opened products
    await expect(await this.productDesc.allTextContents()).toEqual([
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
    ]);

    //The product price should be the same with the opened product
    await expect(await this.productPrice.allTextContents()).toEqual(["$29.99"]);

    //The add to cart button should be visible
    await expect(this.addToCartButtons).toBeVisible();
  }

  //Checks the add to cart buttons
  async expectAddToCartButtons(condition) {
    //Add to cart button for the items that is added to cart must not be visible
    if (condition == "visible") {
      await expect(this.addToCartBackpack).toBeVisible();
      await expect(this.addToCartJacket).toBeVisible();
      await expect(this.addToCartOnesie).toBeVisible();
    } else if (condition == "hidden") {
      await expect(this.addToCartBackpack).toBeHidden();
      await expect(this.addToCartJacket).toBeHidden();
      await expect(this.addToCartOnesie).toBeHidden();
    }
  }

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
