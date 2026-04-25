fetch('http://localhost:5000/api/hackathons')
  .then(res => res.json())
  .then(data => {
      console.log('Total Hackathons:', data.length);
      const domains = [...new Set(data.map(h => h.domain))];
      console.log('Available Domains:', domains);
      const modes = [...new Set(data.map(h => h.mode))];
      console.log('Available Modes:', modes);
  });
