import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { CartPage } from "../pages/CartPage.page";
import { ProductPage } from "../pages/ProductPage.page";

test.describe("Testing the cart page", async () => {
  test.beforeEach("Login to the website", async ({ page }) => {
    const login_page = new LoginPage(page);
    const product_page = new ProductPage(page);

    await login_page.goto();
    await login_page.login("standard_user", "secret_sauce");
    await login_page.assertLoginSuccessful();
    await product_page.expectProductPageLoadSuccessful();
  });

  test.describe("Testing the add to cart and remove function", async () => {
    test("Adding and removing item to cart", async ({ page }) => {
      const cart_page = new CartPage(page);

      await cart_page.addToCart();
      await cart_page.expectAddToCartButtons("hidden");
      await cart_page.expectRemoveButtons("visible");

      await cart_page.removeItem();
      await cart_page.expectAddToCartButtons("visible");
      await cart_page.expectRemoveButtons("hidden");
    });

    test("Cart page Testing", async ({ page }) => {
      const cart_page = new CartPage(page);

      await cart_page.addToCart();
      await cart_page.goToCart();
      await cart_page.expectCartPage();
      await cart_page.expectCartItems();

      await cart_page.goToProductPage();
      await cart_page.removeItem();
      await cart_page.goToCart();
      await cart_page.expectCartPage();
      await cart_page.expectRemovedItems();
    });
  });

  test.describe("Testing the cart badge", async () => {
    test("testing cart badge in the product page", async ({ page }) => {
      const cart_page = new CartPage(page);

      await cart_page.addToCart();
      await cart_page.expectCartBadge("added");
      await cart_page.reloadPage();
      await cart_page.expectCartBadge("added");

      await cart_page.removeItem();
      await cart_page.expectCartBadge("removed");
    });

    test("testing the cart badge in the cart page", async ({ page }) => {
      const cart_page = new CartPage(page);

      await cart_page.addToCart();
      await cart_page.goToCart();
      await cart_page.expectCartBadge("added");
      await cart_page.reloadPage();
      await cart_page.expectCartBadge("added");

      await cart_page.removeItem();
      await cart_page.expectCartBadge("removed");
    });
  });
});
