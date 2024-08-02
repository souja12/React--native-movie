import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Movie } from './types';

const TMDB_API_KEY = '96b4dad9f211b1aa79335a6fa1124515';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
      setMovie(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMovieTrailer = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
      const trailers = response.data.results.filter((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailers.length > 0) {
        setTrailer(trailers[0].key);
        console.log('key',trailers[0].key);
        
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieTrailer();
  }, []);

  if (!movie) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.poster} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.year}>{new Date(movie.release_date).getFullYear()}</Text>
      <Text style={styles.plot}>{movie.overview}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  poster: {
    width: '100%',
    height: 500,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  year: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  plot: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: (Dimensions.get('window').width / 16) * 9,
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
});

export default DetailsScreen;
