import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { ProductPage } from "../pages/ProductPage.page";

test.describe("Testing the product/inventory page", async () => {
  test.beforeEach(
    "Login to website and check if the product/inventory page loads successfully",
    async ({ page }) => {
      const login_page = new LoginPage(page);
      const product_page = new ProductPage(page);

      await login_page.goto();
      await login_page.login("standard_user", "secret_sauce");
      await login_page.assertLoginSuccessful();
      await product_page.expectProductPageLoadSuccessful();
    },
  );

  test.describe("Inventory/Product sorting ", async () => {
    test("Products should be sorted by Ascending Names", async ({ page }) => {
      const product_page = new ProductPage(page);

      await product_page.expectProductsByNameAsc();
    });

    test("Products should be sorted by Descending Names", async ({ page }) => {
      const product_page = new ProductPage(page);

      await product_page.expectProductsByNameDesc();
    });

    test("Products should be sorted by Ascending Prices", async ({ page }) => {
      const product_page = new ProductPage(page);

      await product_page.expectProductsByPriceAsc();
    });

    test("Products should be sorted by Descending Price", async ({ page }) => {
      const product_page = new ProductPage(page);

      await product_page.expectProductsByPriceDesc();
    });
  });

  test("Product details page opens correctly", async ({ page }) => {
    const product_page = new ProductPage(page);

    await product_page.expectProductDetailsLoadSuccessfully();
  });
});
