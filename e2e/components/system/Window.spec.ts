import { expect, test } from "@playwright/test";
import {
  DESKTOP_SELECTOR,
  TEST_APP_TITLE_TEXT,
  WINDOW_TITLEBAR_SELECTOR,
} from "e2e/constants";
import {
  clickCloseWindow,
  clickMaximizeWindow,
  clickMinimizeWindow,
  disableWallpaper,
  doubleClickWindowTitlebar,
  doubleClickWindowTitlebarIcon,
  dragWindowToDesktop,
  loadTestApp,
  windowIsHidden,
  windowIsMaximized,
  windowIsOpaque,
  windowIsTransparent,
  windowTitlebarIsVisible,
  windowTitlebarTextIsVisible,
  windowsAreVisible,
} from "e2e/functions";

test.beforeEach(disableWallpaper);
test.beforeEach(loadTestApp);

// TODO: Check if window animation is indeed happening, and wait for it
// Q: Click titlebar to make sure it's focused and also for auto wait? Do in FE also.
test.beforeEach(windowsAreVisible);
test.beforeEach(windowTitlebarIsVisible);

test("has title", async ({ page }) =>
  windowTitlebarTextIsVisible(TEST_APP_TITLE_TEXT, { page }));

test("has minimize", async ({ page }) => {
  await windowIsOpaque({ page });
  await clickMinimizeWindow({ page });
  await windowIsTransparent({ page });
});

test.describe("has maximize", () => {
  test("on click button", async ({ page }) => {
    await clickMaximizeWindow({ page });
    await windowIsMaximized({ page });
  });

  test("on double click titlebar", async ({ page }) => {
    await doubleClickWindowTitlebar({ page });
    await windowIsMaximized({ page });
  });
});

test.describe("has close", () => {
  test("on click button", async ({ page }) => {
    await clickCloseWindow({ page });
    await windowIsHidden({ page });
  });

  test("on double click icon", async ({ page }) => {
    await doubleClickWindowTitlebarIcon({ page });
    await windowIsHidden({ page });
  });
});

test("has drag", async ({ page }) => {
  const windowTitlebarElement = page.locator(WINDOW_TITLEBAR_SELECTOR);
  const initialBoundingBox = await windowTitlebarElement.boundingBox();

  await dragWindowToDesktop({ page });

  const finalBoundingBox = await windowTitlebarElement.boundingBox();

  expect(initialBoundingBox?.x).not.toEqual(finalBoundingBox?.x);
  expect(initialBoundingBox?.y).not.toEqual(finalBoundingBox?.y);

  const mainBoundingBox = await page.locator(DESKTOP_SELECTOR).boundingBox();

  expect(finalBoundingBox?.y).toEqual(mainBoundingBox?.y);
  expect(finalBoundingBox?.x).toEqual(mainBoundingBox?.x);
});

// TODO: has context menu
// TODO: has resize
// TODO: has keyboard shortcuts (Ctrl+Shift+Arrows & Ctrl+Alt+F4)