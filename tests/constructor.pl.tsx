import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients'
  });
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Добавляет булку и начинку в конструктор', async ({ page }) => {
    const ingredients = page.getByTestId('ingredients-content');

    const bun = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    const filling = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая котлета' });

    await expect(bun).toBeVisible();

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-bun-1')
    ).toContainText('Тестовая булка (верх)');

    await expect(
      page.getByTestId('constructor-bun-2')
    ).toContainText('Тестовая булка (низ)');

    await expect(filling).toBeVisible();

    await filling.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Тестовая котлета');
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Открывает окно с данными ингредиента и закрывает по крестику', async ({
    page
  }) => {
    const ingredients = page.getByTestId('ingredients-content');

    const bun = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    await bun.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Тестовая булка' })
    ).toBeVisible();

    await expect(
      modal.getByText('150', { exact: true })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/ingredients\/test-bun$/);

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toHaveCount(0);

    await expect(page).toHaveURL('/');
  });

  test('Закрывает модальное окно по клику на оверлей', async ({
    page
  }) => {
    const ingredients = page.getByTestId('ingredients-content');

    const bun = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    await bun.getByRole('link').click();

    const modal = page.locator('#modals');
    const overlay = page.getByTestId('modal-overlay');

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(overlay).toBeVisible();

    await overlay.click({
      position: { x: 10, y: 10 }
    });

    await expect(overlay).toHaveCount(0);

    await expect(page).toHaveURL('/');
  });
});

test.describe('Оформление заказа', () => {
  test('Создаёт заказ, показывает номер и очищает конструктор', async ({
    page,
    context
  }) => {
    await page.routeFromHAR('tests/hars/order.har', {
      notFound: 'fallback'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    const userResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/auth/user') &&
        response.request().method() === 'GET' &&
        response.status() === 200
    );

    await page.goto('/');

    await userResponse;

    await expect(
      page.getByText('Тестовый пользователь', { exact: true })
    ).toBeVisible();

    const ingredients = page.getByTestId('ingredients-content');

    const bun = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    const filling = ingredients
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая котлета' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await filling.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-bun-1')
    ).toContainText('Тестовая булка');

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Тестовая котлета');

    const orderRequest = page.waitForRequest(
      (request) =>
        request.url().endsWith('/api/orders') &&
        request.method() === 'POST'
    );

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const request = await orderRequest;

    expect(request.postDataJSON()).toEqual({
      ingredients: ['test-bun', 'test-main', 'test-bun']
    });

    await expect(
      page.getByTestId('order-number')
    ).toHaveText('54321');

    await expect(
      page.getByTestId('constructor-bun-1')
    ).toHaveCount(0);

    await expect(
      page.getByTestId('constructor-bun-2')
    ).toHaveCount(0);

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Выберите начинку');

    await expect(
      page.getByTestId('constructor')
    ).toContainText('Выберите булки');

    await page
      .locator('#modals')
      .getByRole('button', { name: 'Закрыть' })
      .click();

    await expect(
      page.getByTestId('order-number')
    ).toHaveCount(0);

    await expect(
      page.getByTestId('modal-overlay')
    ).toHaveCount(0);
  });
});