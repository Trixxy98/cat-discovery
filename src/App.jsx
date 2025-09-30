import React, { useState, useEffect } from 'react';
import CatCard from './components/CatCard';
import Results from './components/Results';
import './styles.css';

const TOTAL_CATS = 10;

function App() {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState([]);
  const [dislikedCats, setDislikedCats] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    try {
      console.log('Fetching cats from The Cat API...');
      

      const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=15&size=med&mime_types=jpg,png');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const catData = await response.json();
      console.log('The Cat API response:', catData);

      const catsWithUrls = catData.map((cat, index) => {
   
        let tags = ['cat'];
        
        if (cat.breeds && cat.breeds.length > 0) {
          const breed = cat.breeds[0];
          tags.push(breed.name.toLowerCase());
          if (breed.temperament) {
            tags.push(...breed.temperament.split(', ').slice(0, 2).map(t => t.toLowerCase()));
          }
        } else {

          const fallbackTags = [
            ['playful', 'energetic', 'young'],
            ['calm', 'gentle', 'adult'],
            ['curious', 'alert', 'bright'],
            ['sleepy', 'relaxed', 'cozy'],
            ['elegant', 'graceful', 'sleek'],
            ['fluffy', 'soft', 'cuddly'],
            ['striking', 'bold', 'confident'],
            ['sweet', 'friendly', 'social'],
            ['mysterious', 'quiet', 'independent'],
            ['mischievous', 'funny', 'entertaining']
          ];
          tags.push(...fallbackTags[index % fallbackTags.length]);
        }
        
        return {
          id: cat.id || `cat-${index}-${Date.now()}`,
          url: cat.url,
          tags: tags.slice(0, 4)
        };
      });

      console.log('Processed cats with unique tags:', catsWithUrls);
      setCats(catsWithUrls);
      
    } catch (error) {
      console.error('Error fetching from The Cat API:', error);
      
   
      const fallbackCats = [
        {
          id: 'fallback-1',
          url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
          tags: ['bengal', 'spotted', 'wild', 'active']
        },
        {
          id: 'fallback-2',
          url: 'https://cdn2.thecatapi.com/images/1q8.jpg',
          tags: ['tabby', 'orange', 'striped', 'friendly']
        },
        {
          id: 'fallback-3',
          url: 'https://cdn2.thecatapi.com/images/3pj.jpg',
          tags: ['siamese', 'blueeyes', 'elegant', 'vocal']
        },
        {
          id: 'fallback-4',
          url: 'https://cdn2.thecatapi.com/images/6f2.jpg',
          tags: ['black', 'mysterious', 'sleek', 'independent']
        },
        {
          id: 'fallback-5',
          url: 'https://cdn2.thecatapi.com/images/9u1.jpg',
          tags: ['white', 'fluffy', 'pure', 'gentle']
        },
        {
          id: 'fallback-6',
          url: 'https://cdn2.thecatapi.com/images/a7a.jpg',
          tags: ['gray', 'tabby', 'classic', 'curious']
        },
        {
          id: 'fallback-7',
          url: 'https://cdn2.thecatapi.com/images/ahr.jpg',
          tags: ['calico', 'colorful', 'unique', 'sassy']
        },
        {
          id: 'fallback-8',
          url: 'https://cdn2.thecatapi.com/images/b6a.jpg',
          tags: ['tuxedo', 'formal', 'blackandwhite', 'social']
        },
        {
          id: 'fallback-9',
          url: 'https://cdn2.thecatapi.com/images/c3a.jpg',
          tags: ['persian', 'fluffy', 'luxurious', 'quiet']
        },
        {
          id: 'fallback-10',
          url: 'https://cdn2.thecatapi.com/images/d7q.jpg',
          tags: ['mainecoon', 'large', 'majestic', 'loyal']
        }
      ];
      
      console.log('Using fallback cats');
      setCats(fallbackCats);
    } finally {
      setLoading(false);
    }
  };

  const analyzePreferences = () => {
    if (likedCats.length === 0) {
      return {
        topTags: [],
        totalLiked: 0,
        totalSeen: cats.length,
        preferredTypes: [],
      };
    }


    const tagCounts = {};
    likedCats.forEach(cat => {
      cat.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

 
    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    const preferences = {
      topTags: topTags,
      totalLiked: likedCats.length,
      totalSeen: cats.length,
      preferredTypes: topTags.slice(0, 3).map(tag => `${tag} cats`),
    };

    return preferences;
  };

  const handleSwipe = (direction) => {
    if (currentIndex >= cats.length) return;

    const currentCat = cats[currentIndex];
    
    if (direction === 'right') {
      setLikedCats(prev => [...prev, currentCat]);
    } else {
      setDislikedCats(prev => [...prev, currentCat]);
    }

    if (currentIndex === cats.length - 1) {
      setShowResults(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const resetApp = () => {
    setCurrentIndex(0);
    setLikedCats([]);
    setDislikedCats([]);
    setShowResults(false);
    fetchCats();
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading cute kitty for your discovery...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const preferences = analyzePreferences();
    return (
      <Results 
        likedCats={likedCats} 
        preferences={preferences}
        onReset={resetApp} 
      />
    );
  }

  if (cats.length === 0) {
    return (
      <div className="app loading">
        <div className="loader">
          <p>No cats found. Please check your connection.</p>
          <button onClick={fetchCats} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Find Your Favourite Kitty</h1>
        <p>Swipe right for cats you like, left to pass</p>
        <div className="progress">
          {currentIndex + 1} / {cats.length}
        </div>
        
      </div>
      
      <div className="cards-container">
        {cats.slice(currentIndex, currentIndex + 3).map((cat, index) => (
          <CatCard
            key={cat.id}
            cat={cat}
            zIndex={cats.length - currentIndex - index}
            onSwipe={handleSwipe}
            isActive={index === 0}
          />
        ))}
      </div>

      <div className="actions">
        <button 
          className="btn dislike-btn"
          onClick={() => handleSwipe('left')}
          aria-label="Dislike"
        >
          ✕
        </button>
        <button 
          className="btn like-btn"
          onClick={() => handleSwipe('right')}
          aria-label="Like"
        >
          ♥
        </button>
      </div>
    </div>
  );
}

export default App;