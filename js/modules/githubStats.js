/**
 * githubStats.js
 * Fetches and displays GitHub repository statistics
 */

const REPO_OWNER = 'Sato-Isolated';
const REPO_NAME = 'Antimatter-Dimensions-Save-Editor';
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

export function initGithubStats() {
  fetchGitHubStats();
}

// Fetch GitHub repository statistics
async function fetchGitHubStats() {
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      throw new Error(`GitHub API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update stats in the UI
    updateGitHubStats(data);
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    // Set default values if the API call fails
    updateGitHubStats({
      stargazers_count: '-',
      forks_count: '-',
      open_issues_count: '-'
    });
  }
}

// Update GitHub stats in the UI
function updateGitHubStats(data) {
  const starsElement = document.getElementById('githubStars');
  const forksElement = document.getElementById('githubForks');
  const issuesElement = document.getElementById('githubIssues');
  
  if (starsElement) starsElement.textContent = data.stargazers_count;
  if (forksElement) forksElement.textContent = data.forks_count;
  if (issuesElement) issuesElement.textContent = data.open_issues_count;
}