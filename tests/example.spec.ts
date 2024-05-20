import { test, expect,Page} from '@playwright/test';


test('has title', async ({ page },testInfo) => {
  console.log(testInfo.title)
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Test App/);
  await test.info().attach('screenshot', {
    body:await page.screenshot(),
    contentType:'image/png'
  })
});

test('test-api', async ({ request }) => {
const data =  await request.get('/api');
const datajson = await data.json();
console.log(datajson);
expect(data.ok()).toBeTruthy();
console.log(data)
  // ...
});