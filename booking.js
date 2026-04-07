const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting APSRTC Automation: Service 5706 | Seat 12 | Female | 19-March-2026...");

  try {
    await page.goto('https://www.apsrtconline.in/oprs-web/', { waitUntil: 'networkidle' });

    // 1. Enter Cities


    await page.fill('#fromPlaceName', 'PALAMANERU');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');

    await page.fill('#toPlaceName', 'CHENNAI');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');

    // 2. Date Selection: 19-March-2026
    await page.click('#txtJourneyDate');
    while (true) {
      const month = await page.locator('.ui-datepicker-month').first().innerText();
      const year = await page.locator('.ui-datepicker-year').first().innerText();
      if (month.includes('April') && year.includes('2026')) break;
      await page.click('.ui-datepicker-next');
      await page.waitForTimeout(500);
    }
    await page.locator('.ui-datepicker-group-first >> a.ui-state-default:has-text("14")').click();

    // 3. Search
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    // 4. Target Service 5706
    console.log("Searching for Service 5706...");
    const busRow = page.locator('.rSetForward', { hasText: '5709' });
    const selectButton = busRow.locator('input[name="SrvcSelectBtnForward"]');
    await selectButton.waitFor({ state: 'visible', timeout: 20000 });
    await selectButton.click({ force: true });

    // 5. Boarding Points
    // await page.waitForSelector('#ForwardBoardId', { timeout: 10000 });
    // await page.selectOption('#ForwardBoardId', { index: 1 });
    await page.click('#fwLtBtn');

    // 6. Target Seat Number 12
    console.log("Selecting Seat Number 12...");
    const seat12 = page.locator('li.availSeatClassS[title*="Seat:35"]');
    await seat12.waitFor({ state: 'visible', timeout: 10000 });
    await seat12.click();

    // 7. Passenger Details (Updated to Female)
    await page.fill('#mobileNo', '9876543210');
    await page.fill('#email', 'kwer@example.com');
    await page.selectOption('#genderCodeIdForward0', '25'); // 25 = FEMALE
    await page.fill('#passengerNameForward0', 'wer');
    await page.fill('#passengerAgeForward0', '22');
    await page.selectOption('#concessionIdsForward0', '1347688949874');

    console.log("SUCCESS: Reached Payment! Check your browser.");

    // Plays a beep sound in the terminal to alert you
    process.stdout.write('\x07');

    await page.click('#BookNowBtn');

  } catch (error) {
    console.error("Automation error:", error);
  }

  // Keep open for payment (5 minutes)

  await browser.close();
})();
