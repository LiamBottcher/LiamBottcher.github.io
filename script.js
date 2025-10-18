// This script fetches your GitHub repositories and displays them as project cards

// Wait for the HTML to fully load before running our code
document.addEventListener('DOMContentLoaded', function() {
  
  // Your GitHub username
  const username = 'LiamBottcher';
  
  // GitHub API endpoint - this URL returns your public repos as JSON
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  
  // Get the container where we'll add project cards
  const projectsContainer = document.querySelector('.projects');
  
  // async function lets us use 'await' - it makes handling promises easier
  async function fetchGitHubRepos() {
    try {
      // Show a loading message while fetching
      projectsContainer.innerHTML = '<p style="text-align: center; width: 100%;">Loading projects from GitHub...</p>';
      
      // fetch() makes an HTTP request and returns a Promise
      // await pauses execution until the Promise resolves
      const response = await fetch(apiUrl);
      
      // Check if the request was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Convert the response to JSON format (also returns a Promise)
      const repos = await response.json();
      
      // Clear the loading message
      projectsContainer.innerHTML = '';
      
      // Filter out forked repos and sort by last updated
      const myRepos = repos
        .filter(repo => !repo.fork) // Only show repos you created (not forked)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Newest first
      
      // Loop through each repository and create a card
      myRepos.forEach(repo => {
        createProjectCard(repo);
      });
      
    } catch (error) {
      // If anything goes wrong, show an error message
      console.error('Error fetching repos:', error);
      projectsContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #f87171;">Failed to load projects. Please try again later.</p>';
    }
  }
  
  // Function to create a project card from repository data
  function createProjectCard(repo) {
    // Create a new div element
    const card = document.createElement('div');
    
    // Add the 'project-card' class (uses your existing CSS)
    card.className = 'project-card';
    
    // Build the HTML content for the card
    // Template literals (backticks) let us embed variables with ${}
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description available.'}</p>
      <div style="margin-top: 10px;">
        <a href="${repo.html_url}" target="_blank">GitHub</a>
        ${repo.homepage ? `| <a href="${repo.homepage}" target="_blank">Live Demo</a>` : ''}
      </div>
      
    `;
    
    // Add the card to the projects container
    projectsContainer.appendChild(card);
  }
  
  // Start fetching repos when the page loads
  fetchGitHubRepos();
  
});
