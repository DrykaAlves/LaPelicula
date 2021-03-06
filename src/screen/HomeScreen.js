import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler, Image } from 'react-native';
import { LPButton } from '../component/LPButton';

export default class HomeScreen extends Component {

  // configurar opções de navegação por abas
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Home',
    tabBarIcon: ({focused, tintCalor}) =>
    {
      if (focused) {
        return (
          <Image source={require('../img/home_ativo.png')}
          style={{width: 26, height: 26}} />
        );
      } else {
        return (
          <Image source={require('../img/home_inativo.png')}
          style={{width: 26, height: 26}} />
        );
      }
    }
  });

 
  constructor(props) {
    super(props);
    this.state = {};

    this.proxima = this.proxima.bind(this);
    this.sair = this.sair.bind(this);
}


proxima(){
    // passando para a proxima tela
    this.props.navigation.navigate('Login');
}

sair(){
  // sair do App
  BackHandler.exitApp();
}

  render() {
    return (
      <View style={styles.container}>
        <Text>Tela Principal</Text>
        <LPButton titulo="Proxima tela" onPress={() => {this.proxima() }} />
        <LPButton titulo="Sair" onPress={() => {this.sair() }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});