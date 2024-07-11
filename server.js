const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());

app.post('/scrape', (req, res) => {
  const country = req.body.country;
  const jobTitle = req.body.job_title;
  const url = `https://www.indeed.com/jobs?q=${jobTitle}&l=${country}`;
  axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const jobs = [];
      $('div.jobsearch-SerpJobCard').each((index, element) => {
        const title = $(element).find('h2.jobTitle').text();
        const company = $(element).find('span.company').text();
        const location = $(element).find('span.location').text();
        jobs.push({ title, company, location });
      });
      res.json(jobs);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to scrape jobs' });
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
