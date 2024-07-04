import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const GitHubProfileFinder = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (username) {
      setLoading(true);
      try {
        const token =
          "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";
        const headers = {
          Authorization: `token ${token}`,
        };

        // Fetch user profile
        const profileResponse = await axios.get(
          `https://api.github.com/users/${username}`,
          { headers }
        );
        const profileData = profileResponse.data;
        setProfile(profileData);

        // Fetch user repositories
        const reposResponse = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          { headers }
        );
        const reposData = reposResponse.data;
        setRepos(reposData);

        setError(""); // Reset error state if successful
      } catch (error) {
        setError("User not found or API request failed.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setProfile(null);
      setRepos([]);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProfile();
  };

  const handleViewProfile = () => {
    if (profile) {
      window.open(profile.html_url, "_blank");
    }
  };

  return (
    <div className="github-profile-finder">
      <h1>GitHub Profile Finder</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter GitHub username"
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : profile ? (
        <div className="profile">
          <img src={profile.avatar_url} alt={profile.name} />
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
          <div className="view-profile-button">
            <button onClick={handleViewProfile}>View Profile</button>
          </div>
          <h3>Repositories:</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-profile">Enter a GitHub username to search.</div>
      )}
    </div>
  );
};

export default GitHubProfileFinder;
