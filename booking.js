const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting APSRTC Automation: Service 5706 | Seats 2 & 3 | 10-April-2026...");

  try {
    await page.goto('https://www.apsrtconline.in/oprs-web/', { waitUntil: 'networkidle' });

    // 1. Enter Cities
    await page.fill('#fromPlaceName', 'CHENNAI');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');

    await page.fill('#toPlaceName', 'PALAMANERU');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');

    // 2. Date Selection: 10-April-2026
    await page.click('#txtJourneyDate');
    while (true) {
      const month = await page.locator('.ui-datepicker-month').first().innerText();
      const year = await page.locator('.ui-datepicker-year').first().innerText();
      if (month.includes('April') && year.includes('2026')) break;
      await page.click('.ui-datepicker-next');
      await page.waitForTimeout(500);
    }
    await page.locator('.ui-datepicker-group-first >> a.ui-state-default:has-text("10")').click();

    // 3. Search
    await page.click('#searchBtn');

    // 4. Select Service 5706
    console.log("Searching for Service 5706...");
    const busRow = page.locator('.rSetForward', { hasText: '5706' });
    const selectButton = busRow.locator('input[name="SrvcSelectBtnForward"]');
    await selectButton.waitFor({ state: 'visible', timeout: 20000 });
    await selectButton.click({ force: true });

    // 5. Boarding Points
    await page.waitForSelector('#ForwardBoardId', { timeout: 10000 });
    await page.selectOption('#ForwardBoardId', { index: 1 });
    await page.click('#fwLtBtn');

    // 6. Select Seats 2 and 3
    console.log("Selecting Seats 2 and 3...");

    const seat2 = page.locator('li.availSeatClassS[title*="Seat:2"]');
    const seat3 = page.locator('li.availSeatClassS[title*="Seat:3"]');

    await seat2.waitFor({ state: 'visible', timeout: 10000 });
    await seat2.click();

    await seat3.waitFor({ state: 'visible', timeout: 10000 });
    await seat3.click();

    // 7. Passenger Details

    // Common details
    await page.fill('#mobileNo', '9876543210');
    await page.fill('#email', 'karthik.mits@example.com');

    // Seat 2 → Female
    await page.selectOption('#genderCodeIdForward0', '25'); // Female
    await page.fill('#passengerNameForward0', 'Passenger Female');
    await page.fill('#passengerAgeForward0', '22');
    await page.selectOption('#concessionIdsForward0', '1347688949874');

    // Seat 3 → Male
    await page.selectOption('#genderCodeIdForward1', '26'); // Male
    await page.fill('#passengerNameForward1', 'Passenger Male');
    await page.fill('#passengerAgeForward1', '24');
    await page.selectOption('#concessionIdsForward1', '1347688949874');

    console.log("SUCCESS: Both seats selected and details filled!");

    process.stdout.write('\x07'); // Beep

    await page.click('#BookNowBtn');

  } catch (error) {
    console.error("Automation error:", error);
  }

  await browser.close();

})();
