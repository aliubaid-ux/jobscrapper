import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const country = req.body.country;
  const jobTitle = req.body.job_title;
  let url = 'https://www.indeed.com/jobs';
  if (country) {
    url += `?l=${country}`;
  }
  if (jobTitle) {
    url += `&q=${jobTitle}`;
  }
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
      res.status(200).json(jobs);
    })
   .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to scrape jobs' });
    });
}
