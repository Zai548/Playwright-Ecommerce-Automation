import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { ProductPage } from "../pages/ProductPage.page";
import { CartPage } from "../pages/CartPage.page";
import { CheckOutPageStepOne } from "../pages/Checkout Page/CheckOutPageStepOne.page";
import { CheckOutPageStepTwo } from "../pages/Checkout Page/CheckOutPageStepTwo.page";
import { CheckOutPageComplete } from "../pages/Checkout Page/CheckoutPageComplete.page";

test("Testing the a complete end-to-end process of the website", async ({
  page,
}) => {
  const login_page = new LoginPage(page);
  const product_page = new ProductPage(page);
  const cart_page = new CartPage(page);
  const checkout_first = new CheckOutPageStepOne(page);
  const checkout_second = new CheckOutPageStepTwo(page);
  const checkout_complete = new CheckOutPageComplete(page);
  await test.step("Login to the website", async () => {
    //Go to the webiste
    await login_page.goto();

    //Check if the website loads successfully
    await login_page.expectLoginPage();

    //Login to the website
    await login_page.login("standard_user", "secret_sauce");

    //Check if the product page loads successfully
    await product_page.expectProductPageLoadSuccessful();
    await product_page.expectCartBadge("remove");
    await product_page.expectAddToCartButtons("visible");
    await product_page.expectRemoveButtons("hidden");
  });

  await test.step("Add to cart items", async () => {
    //Add to cart items
    await product_page.addToCart();

    //Check if the add to card buttons and cart badge is updated
    await product_page.expectCartBadge("added");
    await product_page.expectAddToCartButtons("hidden");
    await product_page.expectRemoveButtons("visible");

    //go to cart page
    await product_page.goToCart();

    //Check if the cart page loads successfully
    await cart_page.expectCartPageLoadsSuccessfully();
    await cart_page.expectCartItems();
    await cart_page.expectRemoveButtons("visible");
  });

  await test.step("Complete the checkout step one process", async () => {
    //Proceed to step one
    await cart_page.checkout();

    //Check if the checkout step one loads successfully
    await checkout_first.expectFirstPageCheckout();

    //Fill up the fields
    await checkout_first.fillUpInformation("John", "Doe", "2242");

    //Proceed to check out step two
    await checkout_first.continue();
  });

  await test.step("Complete the checkout step two process", async () => {
    //Check if the checkout step two loads successfully
    await checkout_second.expectSecondPageCheckout();
    await checkout_second.expectSubTotalPrice();
    await checkout_second.expectTaxPrice();
    await checkout_second.expectTotalPrice();

    //Complete the checkout process
    await checkout_second.finnish();

    //Check if the checkout complete page loads successfully
    await checkout_complete.expectLastPageCheckout();
  });

  await test.step("Go back to product page and logout the account", async () => {
    //Go back to product page
    await checkout_complete.backToHome();

    //Check if the product page loads successfully
    await product_page.expectProductPageLoadSuccessful();
    await product_page.expectCartBadge("remove");
    await product_page.expectAddToCartButtons("visible");
    await product_page.expectRemoveButtons("hidden");

    //logout the account
    await login_page.logout();

    //Check if the login page loads successfully
    await login_page.expectLoginPage();
  });
});
