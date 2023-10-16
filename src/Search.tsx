import React, { useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Button, Select, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './search.css';
import MenuItem from '@mui/material/MenuItem';
interface Movie {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  poster_path: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'rank'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const apiKey = 'a074f2b9d0aa3bae4f17e5c07cfed046';
    const baseUrl = 'https://api.themoviedb.org/3';

    axios.get(`${baseUrl}/search/movie`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        query: query,
        page: 1
      }
    })
    .then(response => {
      setResults(response.data.results);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const handleSort = (sortBy: 'title' | 'rank') => {
    setSortBy(sortBy);
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    
    const sortedResults = [...results].sort((a, b) => {
      if (sortBy === 'title') {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      } else if (sortBy === 'rank') {
        return sortOrder === 'asc' ? a.popularity - b.popularity : b.popularity - a.popularity;
      }
      return 0;
    });

    setResults(sortedResults);
  };

  return (
    <div >
      <nav className="nav">
        <ul >
          <li>
            <Link to="/" className="link">Popular Movies</Link>
          </li>
          <li>
            <Link to="/search" className="link">Search</Link>
          </li>
        </ul>
      </nav>
      <h1 className="searchHeader">Movie Search</h1>
      <div className="searchBox">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a movie..."
          className="inputField"
        />
        <Button variant="contained" onClick={handleSearch} className="searchButton">Search</Button>
      </div>
      <div className="sortBox">
        <FormControl variant="outlined" className="sortByDropdown">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as 'title' | 'rank')}
            label="Sort By"
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="rank">Rank</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => handleSort(sortBy)}>
          {sortOrder}
        </Button>
      </div>
      <ImageList className="imageList" cols={6}>
        {results.map((item) => (
          item.poster_path != null && (
            <ImageListItem key={item.id} className='img'>
              <img
                src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
                alt={item.title}
                loading="lazy"
                onClick={() => { navigate(`/detail/${item.id}`) }}
              />
              <p className='he'>{item.title}</p>
            </ImageListItem>
          )
        ))}
      </ImageList>
    </div>
  );
};

export default SearchComponent;
