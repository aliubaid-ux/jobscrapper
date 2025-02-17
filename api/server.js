app.post('/api/scrape', async (req, res) => {
  const { country, jobTitle } = req.body;
  let url;

  switch (country) {
    case 'Dubai':
      url = 'https://dubai.dubizzle.com/jobs/';
      break;
    case 'Saudia':
      url = 'https://saudia.careerjet.com.ar/jobs/';
      break;
    case 'US':
      url = 'https://www.indeed.com/jobs?q=' + jobTitle;
      break;
    default:
      url = 'https://www.indeed.com/jobs?q=' + jobTitle;
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the job listings to load
    await page.waitForSelector('.job-listing');

    // Extract the job listings
    const jobListings = await page.$$eval('.job-listing', (listings) => {
      return listings.map((listing) => {
        const title = listing.querySelector('.job-title').textContent;
        const company = listing.querySelector('.company').textContent;
        const location = listing.querySelector('.location').textContent;
        return { title, company, location };
      });
    });

    // Close the browser
    await browser.close();

    res.json(jobListings);
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to scrape job listings' });
  }
});
