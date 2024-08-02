import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Movie } from './types';

const TMDB_API_KEY = 'c80427d323b58fe4f7a344f4010ca276';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState({
    nowPlaying: [] as Movie[],
    upcoming: [] as Movie[],
    allTimeHits: [] as Movie[],
    bestMovies: [] as Movie[],
    newMovies: [] as Movie[],
    searchResults: [] as Movie[],
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'Home'>>();

  const fetchMovies = async (category: string, setCategory: (movies: Movie[]) => void) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}`
      );
      if (response.status === 200) {
        setCategory(response.data.results);
      } else {
        Alert.alert('Error', `Failed to fetch ${category} movies. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Failed to fetch ${category} movies. Please check your network connection.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialMovies = async () => {
    await fetchMovies('now_playing', (data) => setMovies((prev) => ({ ...prev, nowPlaying: data })));
    await fetchMovies('upcoming', (data) => setMovies((prev) => ({ ...prev, upcoming: data })));
    await fetchMovies('popular', (data) => setMovies((prev) => ({ ...prev, allTimeHits: data })));
    await fetchMovies('top_rated', (data) => setMovies((prev) => ({ ...prev, bestMovies: data })));
    await fetchMovies('now_playing', (data) => setMovies((prev) => ({ ...prev, newMovies: data })));
  };

  const searchMovies = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchTerm}`
      );
      if (response.status === 200) {
        setMovies((prev) => ({ ...prev, searchResults: response.data.results }));
      } else {
        Alert.alert('Error', `Failed to search movies. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to search movies. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate('Details', { movieId: item.id.toString() })}
    >
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        placeholderTextColor="#000"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchMovies}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#e74c3c" />}

      {movies.searchResults.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            horizontal
            data={movies.searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Now Playing</Text>
      <FlatList
        horizontal
        data={movies.nowPlaying}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />

      <Text style={styles.sectionTitle}>Upcoming Movies</Text>
      <FlatList
        horizontal
        data={movies.upcoming}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />

      <Text style={styles.sectionTitle}>All Time Hits</Text>
      <FlatList
        horizontal
        data={movies.allTimeHits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />

      <Text style={styles.sectionTitle}>Best Movies</Text>
      <FlatList
        horizontal
        data={movies.bestMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />

      <Text style={styles.sectionTitle}>New Movies</Text>
      <FlatList
        horizontal
        data={movies.newMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  movieItem: {
    marginRight: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  title: {
    marginTop: 5,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
