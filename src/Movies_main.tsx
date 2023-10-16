import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Button, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Movies_maincss.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
}

const MovieComponent: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = 'a074f2b9d0aa3bae4f17e5c07cfed046';
    const baseUrl = 'https://api.themoviedb.org/3';

    const fetchPopularMovies = async () => {
      try {
        let loadedMovies: Movie[] = [];
        for (let page = 1; page <= 5; page++) {
          const response = await axios.get(`${baseUrl}/movie/popular`, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              page: page,
            }
          });
          loadedMovies = [...loadedMovies, ...response.data.results];
        }
        setMovies(loadedMovies);
        setFilteredMovies(loadedMovies);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPopularMovies();
  }, []);

  const handleSort = () => {
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setFilteredMovies(sortedMovies);
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleGenreSelect = (event: any) => {
    const selectedGenres = event.target.value as number[];
    setSelectedGenres(selectedGenres);
    if (selectedGenres.length === 0) {
      setFilteredMovies(movies);
    } else {
      const filteredMovies = movies.filter(movie =>
        movie.genre_ids.some(genreId => selectedGenres.includes(genreId))
      );
      setFilteredMovies(filteredMovies);
    }
  };

  return (
    <div className="container">
      <h1>Popular Movies</h1>
      <FormControl fullWidth variant="outlined" className="genre-select">
        <InputLabel id="genre-select-label">Genres</InputLabel>
        <Select
          labelId="genre-select-label"
          id="genre-select"
          multiple
          value={selectedGenres}
          onChange={handleGenreSelect}
          label="Genres"
          renderValue={(selected) => (
            <div>
              {(selected as number[]).map((value) => (
                <Chip key={value} label={value.toString()}  />
              ))}
            </div>
          )}
        >
          {[
            { id: 28, name: 'Action' },
            { id: 12, name: 'Adventure' },
            { id: 16, name: 'Animation' },
            { id: 35, name: 'Comedy' },
            // Add more genres as needed
          ].map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleSort} variant="outlined" color="primary" className="sort-button">
        Sort by Title ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
      </Button>
      <ImageList className="image-list" cols={6}>
        {filteredMovies.map((item) => (
          item.poster_path != null && (
            <ImageListItem key={item.id} className='img'>
              <img
                src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
                alt={item.title}
                loading="lazy"
                onClick={() => { navigate(`/detail/${item.id}`) }}
              />
              <p className="movie-title">{item.title}</p>
            </ImageListItem>
          )
        ))}
      </ImageList>
    </div>
  );
};

export default MovieComponent;
