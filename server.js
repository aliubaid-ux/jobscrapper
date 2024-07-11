const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/scrape', (req, res) => {
  const { country, jobTitle } = req.body;

  // Replace this with your actual scraping logic
  const jobs = [
    { title: 'Job 1', company: 'Company 1', location: 'Location 1' },
    { title: 'Job 2', company: 'Company 2', location: 'Location 2' },
    // ...
  ];

  res.json(jobs);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
