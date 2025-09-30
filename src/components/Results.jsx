import React from 'react';

const Results = ({ likedCats, preferences, onReset }) => {
  return (
    <div className="results">
      <div className="results-content">
        <h1>Your Kitty Preference Profile</h1>
        
        <div className="preference-summary">
          <div className="stats-card">
            <h2>📊 Your Statistics</h2>
            <p>You liked <strong>{preferences.totalLiked} over {preferences.totalSeen}</strong> cats</p>
          </div>

          {preferences.preferredTypes.length > 0 && (
            <div className="preference-card">
              <h2>❤️ Your Preferred Cat Types</h2>
              <div className="preferred-types">
                {preferences.preferredTypes.map((type, index) => (
                  <div key={index} className="type-badge">
                    {type}
                  </div>
                ))}
              </div>
              <h2>🏷️ Your Favorite Tags</h2>
              <div className="tags-list">
                {preferences.topTags.map(tag => (
                  <span key={tag} className="tag large">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          
          {likedCats.length === 0 && (
            <div className="no-preferences">
              <h2>🤔 No Clear Preferences Yet</h2>
              <p>You didn't like any cats this time. Try again to discover your preferences!</p>
            </div>
          )}
        </div>

        {likedCats.length > 0 && (
          <div className="liked-cats-section">
            <h2>Cat that you liked({likedCats.length})</h2>
            <div className="cats-grid">
              {likedCats.map(cat => (
                <div key={cat.id} className="liked-cat-card">
                  <img 
                    src={cat.url} 
                    alt={`Liked cat ${cat.tags.join(' ')}`}
                    loading="lazy"
                  />
                  <div className="cat-tags">
                    {cat.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag small">#{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button className="reset-btn" onClick={onReset}>
          Discover More Kitty Preferences
        </button>
      </div>
    </div>
  );
};

export default Results;