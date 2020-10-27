import React from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = React.useState([]);

  React.useEffect(() => {
    api.get('/repositories')
      .then(response => setRepositories(response.data))
      .catch(err => console.error(err));
  }, []);

  async function handleLikeRepository(id) {
    try {
      const result = await api.post(`/repositories/${id}/like`);
      const repositoriesUpdated = repositories.map(r => r.id === id ? result.data : r);
      setRepositories([...repositoriesUpdated]);
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#7159c1" />

      <FlatList
        pagingEnabled={false}
        style={styles.container}
        data={repositories}
        keyExtractor={(r) => r.id}
        renderItem={({ item: r, index }) => (

          <View key={r.id} style={[styles.repositoryContainer, index === (repositories.length - 1) ? { marginBottom: 60 } : null]}>

            <Text style={styles.repository}>{r.title}</Text>

            <View style={styles.techsContainer}>
              {r.techs.map(tech => (
                <Text key={tech} style={styles.tech}>
                  {tech}
                </Text>
              ))}
            </View>


            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${r.id}`}
              >
                {r.likes} {r.likes > 1 ? "curtidas" : "curtida"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(r.id)}
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${r.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>

          </View>

        )} />

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
    paddingTop: 15,
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 4
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  tech: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    alignItems: 'stretch',
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: 'center',
    fontWeight: "bold",
    marginRight: 0,
    padding: 15,
    borderRadius: 6,
    backgroundColor: "#7159c1",
  },
});
