import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

interface MusicContextType {
  currentSong: any;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeatOne: boolean;
  playSong: (song: any, playlist: any[]) => Promise<void>;
  pauseSong: () => Promise<void>;
  resumeSong: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeatOne: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    }
    configureAudio();
  }, []);

  const playSong = async (song: any, newPlaylist: any[]) => {
    try {
      if (currentSong?.id === song.id && soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setPlaylist(newPlaylist);
      const { sound } = await Audio.Sound.createAsync(song.source, {
        shouldPlay: true,
        isLooping: isRepeatOne,
      });

      soundRef.current = sound;
      setCurrentSong(song);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish && !status.isLooping) {
            await playNext(newPlaylist, song);
          }
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const playNext = async (currentList?: any[], current?: any) => {
    const list = currentList || playlist;
    const song = current || currentSong;

    if (!list.length || !song) return;

    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * list.length);
      } while (list.length > 1 && list[nextIndex].id === song.id);
    } else {
      const currentIndex = list.findIndex((s) => s.id === song.id);
      nextIndex = (currentIndex + 1) % list.length;
    }

    await playSong(list[nextIndex], list);
  };

  const playPrevious = async () => {
    if (!playlist.length || !currentSong) return;

    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    await playSong(playlist[prevIndex], playlist);
  };

  const pauseSong = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSong = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeatOne = async () => {
    const newRepeatState = !isRepeatOne;
    setIsRepeatOne(newRepeatState);
    if (soundRef.current) {
      await soundRef.current.setIsLoopingAsync(newRepeatState);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        isShuffle,
        isRepeatOne,
        playSong,
        pauseSong,
        resumeSong,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeatOne,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
