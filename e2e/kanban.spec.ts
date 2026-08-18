import { test, expect, Page, Locator } from '@playwright/test';

async function dragTo(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error('Could not measure source/target element for drag');
  }

  const sourceCenter = { x: sourceBox.x + sourceBox.width / 2, y: sourceBox.y + sourceBox.height / 2 };
  const targetCenter = { x: targetBox.x + targetBox.width / 2, y: targetBox.y + targetBox.height / 2 };

  await page.mouse.move(sourceCenter.x, sourceCenter.y);
  await page.mouse.down();
  await page.mouse.move(sourceCenter.x + 5, sourceCenter.y, { steps: 5 });
  await page.mouse.move(targetCenter.x, targetCenter.y, { steps: 15 });
  await page.mouse.up();
}

function cardByTitle(page: Page, title: string) {
  return page.locator('[data-testid^="task-card-"]', { hasText: title });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('creates, edits, and deletes a task end to end', async ({ page }) => {
  // Create
  await page.getByRole('button', { name: 'Add task to To Do' }).click();
  const createForm = page.getByTestId('task-form');
  await createForm.getByLabel('Title').fill('Ship Playwright suite');
  await createForm.getByRole('button', { name: 'Add ticket' }).click();

  await expect(page.getByTestId('column-todo')).toContainText('Ship Playwright suite');

  // Edit — change status, which should move the card to a new column
  const cardBeforeEdit = cardByTitle(page, 'Ship Playwright suite');
  await cardBeforeEdit.getByRole('button', { name: 'Edit Ship Playwright suite' }).click();
  const editForm = page.getByTestId('task-form');
  await editForm.getByRole('button', { name: 'Done' }).click();
  await editForm.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByTestId('column-done')).toContainText('Ship Playwright suite');
  await expect(page.getByTestId('column-todo')).not.toContainText('Ship Playwright suite');

  // Delete
  const cardBeforeDelete = cardByTitle(page, 'Ship Playwright suite');
  await cardBeforeDelete.getByRole('button', { name: 'Delete Ship Playwright suite' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByText('Ship Playwright suite')).toHaveCount(0);
});

test('drags a task from To Do to In Progress', async ({ page }) => {
  await page.getByRole('button', { name: 'Add task to To Do' }).click();
  const form = page.getByTestId('task-form');
  await form.getByLabel('Title').fill('Drag me over');
  await form.getByRole('button', { name: 'Add ticket' }).click();

  const card = cardByTitle(page, 'Drag me over');
  await expect(card).toBeVisible();

  await dragTo(page, card, page.getByTestId('column-inprogress'));

  await expect(page.getByTestId('column-inprogress')).toContainText('Drag me over');
  await expect(page.getByTestId('column-todo')).not.toContainText('Drag me over');
});

test('reorders tasks within the same column via drag', async ({ page }) => {
  const form = page.getByTestId('task-form');

  await page.getByRole('button', { name: 'Add task to To Do' }).click();
  await form.getByLabel('Title').fill('First created');
  await form.getByRole('button', { name: 'Add ticket' }).click();

  await page.getByRole('button', { name: 'Add task to To Do' }).click();
  await form.getByLabel('Title').fill('Second created');
  await form.getByRole('button', { name: 'Add ticket' }).click();

  const todoColumn = page.getByTestId('column-todo');
  await expect(todoColumn.locator('[data-testid^="task-card-"]').first()).toContainText('Second created');

  await dragTo(page, cardByTitle(page, 'First created'), cardByTitle(page, 'Second created'));

  await expect(todoColumn.locator('[data-testid^="task-card-"]').first()).toContainText('First created');
});