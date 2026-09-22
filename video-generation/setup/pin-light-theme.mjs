export default async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('eitri-theme', 'light'));
};
