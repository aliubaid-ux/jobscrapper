const form = document.querySelector('form');
const countrySelect = document.querySelector('#country');
const jobTitleInput = document.querySelector('#job_title');
const jobListingsDiv = document.querySelector('#job-listings');
const errorMessageDiv = document.querySelector('#error-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const country = countrySelect.value;
  const jobTitle = jobTitleInput.value;
  fetch('/api/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ country, jobTitle })
  })
  .then(response => response.json())
  .then((data) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    jobListingsDiv.appendChild(table);

    const headers = ['Job Title', 'Company', 'Location'];
    const headerRow = document.createElement('tr');
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach((job) => {
      const row = document.createElement('tr');
      const titleCell = document.createElement('td');
      titleCell.textContent = job.title;
      row.appendChild(titleCell);
      const companyCell = document.createElement('td');
      companyCell.textContent = job.company;
