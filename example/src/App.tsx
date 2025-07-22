import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Coordinate,
  searchCoordinate,
  SearchLocationResultItem,
  searchLocations,
  updatedLocationResultsListener,
} from 'react-native-mk-local-search';

export default function App() {
  const [results, setResults] = useState<SearchLocationResultItem[]>([]);
  const [coordinate, setCoordinate] = useState<null | Coordinate>(null);

  useEffect(() => {
    const subscription = updatedLocationResultsListener((data) => {
      setResults(data);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onChangeText = async (text: string) => {
    await searchLocations(text);
  };

  const onItemPress = async (title: string, subtitle: string) => {
    try {
      let searchedCoordinate = await searchCoordinate(subtitle);

      if (!searchedCoordinate) {
        searchedCoordinate = await searchCoordinate(`${title} ${subtitle}`);
      }

      setCoordinate(searchedCoordinate);
    } catch (e) {
      // If coordinate is not found, error occurs with [Error: Coordinate is not found].
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={onChangeText} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {results.map((result, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onItemPress(result.title, result.subtitle);
              }}
              key={index}
              style={styles.itemContainer}
            >
              <Text style={styles.title}>{result.title}</Text>
              <Text style={styles.subtitle}>{result.subtitle}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!!coodinate && (
        <Text style={styles.coodinate}>
          {`latitude is ${coodinate.latitude}, longitude is ${coodinate.longitude}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    marginTop: 100,
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#707070',
    fontSize: 16,
    paddingBottom: 8,
  },
  scroll: {
    maxHeight: 260,
    width: '100%',
  },
  scrollContainer: {
    paddingTop: 20,
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
  },
  coodinate: {
    marginTop: 48,
  },
});
