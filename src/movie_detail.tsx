import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './movie_detail.css';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: any }>();
  const [movie, setMovie] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = 'a074f2b9d0aa3bae4f17e5c07cfed046';
    const baseUrl = 'https://api.themoviedb.org/3';

    axios.get(`${baseUrl}/movie/${id}`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      }
    })
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  if (!movie) {
    return null;
  }

  return (
    <div className="container">
      <Typography variant="h4">{movie.title}</Typography>

      <Paper elevation={3} className="paper">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="poster"
        />
        <div>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          <p><strong>Genres:</strong> {movie.genres.map((genre: any) => genre.name).join(', ')}</p>
        </div>
      </Paper>

      <Typography variant="body1"><strong>Overview:</strong> {movie.overview}</Typography>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Link to={`/detail/${+id - 1}`} style={{ textDecoration: 'none' }}>
          <Button variant="outlined">Previous</Button>
        </Link>
        <Link to={`/detail/${+id + 1}`} style={{ textDecoration: 'none' }}>
          <Button variant="outlined">Next</Button>
        </Link>
        
        <Button variant="outlined" onClick={() => navigate('/search')}>Close</Button>
      </div>
    </div>
  );
};

export default DetailView;
