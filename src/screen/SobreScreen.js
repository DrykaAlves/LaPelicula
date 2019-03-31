import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, BackHandler } from 'react-native';
import {LPButton} from '../component/LPButton';
import {StackActions, NavigationActions} from 
'react-navigation';

export default class SobreScreen extends Component {


  // configurar opções de navegação por abas
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Sobre',
    tabBarIcon: ({focused, tintCalor}) =>
    {
      if (focused) {
        return (
          <Image source={require('../img/cadastrar_ativo.png')}
          style={{width: 26, height: 26}} />
        );
      } else {
        return (
          <Image source={require('../img/cadastrar_inativo.png')}
          style={{width: 26, height: 26}} />
        );
      }
    }
  });

    constructor(props) {
        super(props);
        this.state = {};

        this.voltar = this.voltar.bind(this);
        this.sair = this.sair.bind(this);
    }

    voltar() {
        // passando para próxima tela        
        this.props.navigation.goBack();
    }

    sair(){
      // sair do App
      BackHandler.exitApp();
    }


  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.textTitulo}>Sobre</Text>

        <Text style={styles.text}>Projeto La Pelicula</Text>
        <Text style={styles.text}>Versão: 1.0 - 2019</Text>
        <Text style={styles.text}>Acadêmica Adriana L F Alves</Text>
        <Text style={styles.text}>Professor Roberson J F Alves</Text>

        <View style={styles.viewLinha}>          
          <LPButton titulo="Voltar" onPress={() => { this.voltar() }} />  
          <LPButton titulo="Sair" onPress={() => {this.sair() }} /> 
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
    backgroundColor: 'white'
  },
  text:{
    fontSize: 18,
    color: '#808080',
    textAlign: 'center'
  },
  textTitulo:{
    fontSize: 26,
    color: '#808080',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  viewLinha: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10
  },
});