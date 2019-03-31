import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground, 
  Picker,
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
import { FlatList } from 'react-native-gesture-handler';
var db = openDatabase({ name: 'lapelicula.db' });


//Component de Filmes
class Filmes extends Component {
  render() {
    return (
      <View style={styles.container}>
        
        <TouchableHighlight onPress={() => ''} underlayColor="blue" >

          <ImageBackground resizeMode="cover" source={{ uri: this.props.data.imagem }} style={{ height: 100 }}>
            <View style={{ 
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingLeft: 5,
              paddingBottom: 5,
              flexDirection: 'row',
              borderColor: '#587c87',
            }}>

              <Text style={{ fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}>Cod {this.props.data.codigo} - {this.props.data.descricao}</Text>

              <View style={{padding: 5, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={this.props.onPress}>
                  <View>
                    <Image source={require('../img/edit.png')} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{padding: 5, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={this.props.onPress}>
                  <View>
                    <Image source={require('../img/delete.png')} />
                  </View>
                </TouchableOpacity>
              </View>
              
            
            </View>


          </ImageBackground>
        </TouchableHighlight>
      </View>
    );
  }
}

export default class ListaFilmeScreen extends Component {

  //configurando opções de navegação
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image source={require('../img/home_ativo.png')}
            style={{ width: 26, height: 26 }} />
        );
      } else {
        return (
          <Image source={require('../img/home_inativo.png')}
            style={{ width: 26, height: 26 }} />
        );
      }
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      codigo: null,
      descricao: '',
      uri: null,
      filmes: [],
      ordem: 'descricao'
    };
    this.buscarFilmes();
    this.editarFilme = this.editarFilme.bind(this);
  }

  buscarFilmes(ordena) {
    //buscar os dados dos filmes na base

    let query = (ordena == null || ordena == '' || ordena == undefined) ? 'SELECT * FROM filme ORDER BY descricao' : 'SELECT * FROM filme ORDER BY ' + ordena;

    db.transaction(tx => {
      tx.executeSql(query, [],
        (tx, res) => {
          //tratar o resultado
          var temp = [];
          
          //percorre todos os registros 
          for (let i = 0; i < res.rows.length; i++) {            
            temp.push(res.rows.item(i));
          }
          //seta os filmes para exibir na lista
          this.setState({ filmes: temp });
        });
    });
  }


  excluirFilme(codigo) {

    // Excluir fime
    db.transaction(tx => {
      tx.executeSql('DELETE FROM filme WHERE codigo = ' + codigo, [],
        (tx, res) => {
          if (res.rowsAffected != 0) {
            alert('O filme foi exluído da sua lista!')
          }
        });
    });

    this.buscarFilmes();

  }

  ordenaFilme(ordenacao) {
    this.setState({ ordem: ordenacao });
    this.buscarFilmes(ordenacao);
  }

  editarFilme() {
    
    //Editar filme
    db.transaction(tx => {
      tx.executeSql('UPDATE filme SET descricao = ?, imagem = ? WHERE codigo = ?', [this.state.descricao, this.state.uri, this.state.codigo]);
    })

    this.buscarFilmes();
  }

  render() {
    return (

      <View style={styles.container}>

      <View style={styles.viewLinha}>
        <Text style={styles.text}>Ordenar por:</Text> 
        <Picker
          selectedValue={this.state.ordem}
          style={{height: 20, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.ordenaFilme(itemValue)
          }>
          <Picker.Item label="Descrição" value="descricao" />
          <Picker.Item label="Código" value="codigo" />
        </Picker>
      </View>

        <FlatList
          data={this.state.filmes}
          keyExtractor={item => item.codigo.toString()}
          renderItem={({ item }) => <Filmes onClick={() => this.openModal(item.codigo)} onPress={() => this.excluirFilme(item.codigo)} data={item}></Filmes>}>
          extraData={this.state}
        ></FlatList>



      </View>

    )
  }

  // quando o componente foi criado/montado
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.buscarFilmes();
    });
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  viewLinha: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10
  },


});
