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
  Modal,
  TextInput
} from 'react-native';
import { LPButton } from '../component/LPButton';
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
              <TouchableOpacity onPress={this.props.onClick}>
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
      modalVisible: false,
      codigo: null,
      descricao: '',
      uri: null,
      filmes: [],
      ordem: 'descricao'
    };
    this.buscarFilmes();
    this.editarFilme = this.editarFilme.bind(this);
    this.abrirCamera = this.abrirCamera.bind(this);
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

  abrirModal(codigo) {

    // abrir janela modal
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM filme WHERE codigo = ' + codigo, [],
        (tx, res) => {
          this.setState({ modalVisible: true });
          if (res.rows.item(0).length > 0 || res.rows.item(0) != undefined ) {
            
            this.setState({ codigo: codigo });

            this.setState({ uri: res.rows.item(0).imagem });
            
            this.setState({ descricao: res.rows.item(0).descricao });
          }
        });
    });

  }

  fecharModal() {
    this.setState({ modalVisible: false });
  }

  abrirCamera() {
    this.props.navigation.navigate('Camera', { codigo : this.state.codigo, uri: this.state.uri});
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
      tx.executeSql('UPDATE filme SET imagem = ?, descricao = ? WHERE codigo = ?', [this.state.uri, this.state.descricao, this.state.codigo]);
    })

    this.fecharModal();
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
            <Picker.Item style={styles.picker} label="Descrição" value="descricao" />
            <Picker.Item style={styles.picker} label="Código" value="codigo" />
          </Picker>
        </View>

          <FlatList
            data={this.state.filmes}
            keyExtractor={item => item.codigo.toString()}
            renderItem={({ item }) => <Filmes onClick={() => this.abrirModal(item.codigo)} onPress={() => this.excluirFilme(item.codigo)} data={item}></Filmes>}>
            extraData={this.state}
          ></FlatList>

        <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()}>
        <View style={styles.containerModal}>
          <View style={styles.janelaModal}>
            <View style={styles.areaFoto}>
              <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image source={{ uri: this.state.uri }} style={{ backgroundColor: 'grey', justifyContent: 'center',  marginBottom: 30, alignItems: 'flex-start', width: 130, height: 130 }} />
              </View>
              <View style={{ width: 50, heigth: 50 }}>
                <TouchableOpacity onPress={() => { this.abrirCamera() }}>
                  <View>
                    <Image source={require('../img/captura.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.areaInput}>
              <TextInput style={styles.inputText}
                multiline={true} placeholder='Descrição'
                onChangeText={(valor) => this.setState({ descricao: valor })}>{this.state.descricao}</TextInput>
            </View>
            <View style={styles.areaBotao}>
              <View style={{ flex: 1 }}>
                <LPButton titulo='Salvar' onPress={() => this.editarFilme()} />
                <LPButton titulo='Cancelar' onPress={() => this.fecharModal()} />
              </View>
            </View>
          </View >
          </View>
        </Modal>



      </View>

    )
  }

  // quando o componente foi criado/montado
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.buscarFilmes();
    });
    if(navigation.getParam('codigo', null) != null){
      this.setState({ modalVisible: true });
      this.setState({ uri: navigation.getParam('imguri', null)});
      this.setState({ codigo: navigation.getParam('codigo', null)});
    }

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
  picker: {
    width: 150,
  },
  areaFoto: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'gray'
  },
  areaBotao: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  areaInput: {
    width: '98%'
  },
  janelaModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '98%'
  },
  inputText: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'gray'
  },

});
