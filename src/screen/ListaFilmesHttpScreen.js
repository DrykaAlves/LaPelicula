import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { LPButton } from '../component/LPButton';

class Filmes extends Component {

  render() {
    return (

      <View style={styles.container}>
        <View style={styles.viewLinha}>
          <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>Título: {this.props.data.Title}</Text>
          <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>Ano: {this.props.data.Year}</Text>
        </View>
      </View>

    );
  }
}

export default class ListaFilmesHttpScreen extends Component {


    //configurando opções de navegação
    static navigationOptions = ({ navigation }) => ({
      tabBarLabel: 'Filmes Omdb',
      tabBarIcon: ({ focused, tintColor }) => {
        if (focused) {
          return (
            <Image source={require('../img/site_ativo.png')}
              style={{ width: 26, height: 26 }} />
          );
        } else {
          return (
            <Image source={require('../img/site_inativo.png')}
              style={{ width: 26, height: 26 }} />
          );
        }
      }
    });

  constructor(props) {

    super(props);

    this.state = {
      recuperaHttp: '',
      filmes: [],
    };

    this.recuperaHttp = this.recuperaHttp.bind(this);

  }


  recuperaHttp() {

    let site = 'http://www.omdbapi.com/?s=' + this.state.pesquisa + '&apikey=35d8729b';
    fetch(site, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', 'content-type': 'multipart/form-data'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        let ret = responseJson['Search'] == undefined ? [] : responseJson['Search'];
        this.setState({ filmes: ret })

      })
  }

  render() {

    return (

      <View style={styles.container}>

        <Text style={styles.text}>Localiza:</Text>

        <View style={styles.imput2}>
          <TextInput style={styles.imput}
            multiline={true} placeholder='Pesquise um titulo...'
            onChangeText={(valor) => this.setState({ pesquisa: valor })} />
        </View>

        <View>
          <LPButton titulo='Localizar' onPress={() => this.recuperaHttp()} />
        </View>

        <View style={{ padding: 10, backgroundColor: 'white'}}>
          <FlatList data={this.state.filmes} keyExtractor={item => item.Title.toString()} renderItem={({ item }) => <Filmes data={item}></Filmes>}></FlatList>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },
  viewLinha: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
  },
  imput: {
    backgroundColor: '#e2ebee',
    borderColor: '#587c87',
    borderRadius: 5,
    borderWidth: 3,
    padding: 20,
    marginTop: 50
  },
  imput2: {
    backgroundColor: '#e2ebee',
    borderColor: '#587c87',
    borderRadius: 5,
    padding: 10,
    width: 255,
  },

});