import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, 
  AsyncStorage, StyleSheet } 
from 'react-native';

import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
}
  from 'react-navigation';

//criando um objeto para representar o banco de dados
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lapelicula.db'});

import LoginScreen from './src/screen/LoginScreen';
import ListaFilmesScreen from './src/screen/ListaFilmesScreen';
import FilmeScreen from './src/screen/FilmeScreen';
import SobreScreen from './src/screen/SobreScreen';
import CameraScreen from './src/screen/CameraScreen';
import ListaFilmesHttpScreen from './src/screen/ListaFilmesHttpScreen';



class LoginLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.bootstrapAsync = this.bootstrapAsync.bind(this);

    this.bootstrapAsync();

    db.transaction(function (tx) {
      tx.executeSql('SELECT name FROM sqlite_master WHERE type = \'table\' AND name = \'filme\'',

        [], function (txp, res) {
          if (res.rows.length == 0) {

            txp.executeSql('CREATE TABLE IF NOT EXISTS filme(codigo INTEGER PRIMARY KEY AUTOINCREMENT, descricao VARCHAR(200), imagem blob)', []);

            txp.executeSql('INSERT INTO filme(descricao) VALUES(\'filme 01\')', []);
            txp.executeSql('INSERT INTO filme(descricao) VALUES(\'filme 02\')', []);
            txp.executeSql('INSERT INTO filme(descricao) VALUES(\'filme 03\')', []);
          }
        })
    });

  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync() {
    let logado = 'false';
    AsyncStorage.getItem('logado').then((value) => {
      logado = value;
    });

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(logado == 'true' ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// criar um navegador Tab
const AppTab = createBottomTabNavigator({
  Home: { screen: ListaFilmesScreen },
  Filme: { screen: FilmeScreen },
  Omdb: { screen: ListaFilmesHttpScreen },
  Sobre: { screen: SobreScreen },
}, {
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#CCCCCC',
      style: {
        backgroundColor: '#570076'
      },
      indicatorStyle: {
        backgroundColor: null
      }
    }
  });

// criando navegador Stack
const AppStack = createStackNavigator(
  {
    Login: LoginScreen,
    Camera: CameraScreen,
  }
);

// criando navegador Switch
const AppSwitch = createSwitchNavigator({
  LoginLoading: LoginLoadingScreen,
  App: AppTab,
  Auth: AppStack
}, {
    initialRouteName: 'LoginLoading'
  });

// container principal da aplicação
const App = createAppContainer(AppSwitch);
export default App;