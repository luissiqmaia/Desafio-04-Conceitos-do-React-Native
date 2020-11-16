import React from "react";
import api from './services/api';

import {
  Alert,
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
    async function loadRepositories() {
      try {
        const response = await api.get('/repositories');
        setRepositories(response.data);
      }
      catch (err) {
        Alert.alert('Lista de repositórios!',
          'Desculpe, não foi possível obter a lista de repositórios.');
      }
    }

    loadRepositories();
  }, []);


  async function handleAddRepository() {
    try {
      const dateNow = new Date(Date.now());

      const date = dateNow.toLocaleDateString('pt-BR');
      let time = `${dateNow.toLocaleTimeString('pt-BR')}.${dateNow.getMilliseconds('pt-BR')}`;

      const result = await api.post('/repositories', {
        url: "https://github.com/luishenrique",
        title: `Desafio React-Native ${date} ${time}`,
        techs: ["React-Native", "Node.js"],
      });

      const repository = result.data;
      setRepositories([...repositories, repository]);

    } catch (err) {
      console.error(err);
    }
  }

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

  async function handleRemoveRepository(id) {
    try {
      const repository = await api.delete(`/repositories/${id}`);

      if (repository.status === 204)
        setRepositories(repositories.filter(r => r.id !== id));
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

            <View style={styles.viewButtons}>
              <TouchableOpacity
                styyle={styles.buttonLike}
                onPress={() => handleLikeRepository(r.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${r.id}`}
              >
                <Text style={styles.buttonLikeText}>Curtir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                styyle={styles.buttonRemove}
                onPress={() => handleRemoveRepository(r.id)}
              >
                <Text style={styles.buttonRemoveText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>

        )} />
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => handleAddRepository()}
      >
        <Text style={styles.buttonAddText}>Adicionar</Text>
      </TouchableOpacity>
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
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonLike: {
  },
  buttonLikeText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    textAlign: 'center',
    fontWeight: "bold",
    padding: 15,
    borderRadius: 6,
    backgroundColor: "#7159c1",
    width: 130
  },
  buttonRemove: {
  },
  buttonRemoveText: {
    color: "#fff",
    fontSize: 14,
    textAlign: 'center',
    fontWeight: "bold",
    marginRight: 0,
    padding: 15,
    borderRadius: 6,
    backgroundColor: "#ca4949",
    width: 130
  },
  buttonAdd: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: "#7159c1",
    paddingVertical: 15,
  },
  buttonAddText: {
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',
    fontWeight: "bold",
    marginRight: 0,
    padding: 15,
    borderRadius: 6,
    backgroundColor: "#3f3f3f",
  }
});
