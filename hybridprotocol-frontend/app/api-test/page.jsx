'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [apiInfo, setApiInfo] = useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      // Test health check
      const health = await apiService.healthCheck();
      setApiStatus('Connected! ✅');
      
      // Get API info
      const info = await apiService.getApiInfo();
      setApiInfo(info);
      
      // Get newsletters
      const newsletterData = await apiService.getNewsletters();
      setNewsletters(newsletterData);
      
      // Get podcasts
      const podcastData = await apiService.getPodcastEpisodes();
      setPodcasts(podcastData);
      
    } catch (err) {
      setApiStatus('Failed to connect ❌');
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>API Connection Test</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Connection Status</h5>
          <p className="card-text">{apiStatus}</p>
          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>

      {apiInfo && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">API Information</h5>
            <pre>{JSON.stringify(apiInfo, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Newsletters ({newsletters.length})</h5>
              {newsletters.length > 0 ? (
                <ul className="list-group">
                  {newsletters.map((newsletter, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{newsletter.title}</strong>
                      <br />
                      <small>{newsletter.excerpt}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No newsletters found</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Podcast Episodes ({podcasts.length})</h5>
              {podcasts.length > 0 ? (
                <ul className="list-group">
                  {podcasts.map((podcast, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{podcast.title}</strong>
                      <br />
                      <small>{podcast.description}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No podcast episodes found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 