// Temporary script to create admin user
fetch('https://duuplufbkzynrhmtshlm.supabase.co/functions/v1/create-admin-user', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dXBsdWZia3p5bnJobXRzaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NzgwMzYsImV4cCI6MjA2OTI1NDAzNn0.cLrIyi_cyTrRfFdGcRR_TVxg8TknIIqQb5TmXPpDnOc',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));