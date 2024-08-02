// src/components/VideoPlayer.tsx
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <Video
      source={{ uri: videoUrl }}
      style={styles.video}
      controls={true}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width / 16) * 9,
  },
});

export default VideoPlayer;
