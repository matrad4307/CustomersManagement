import React, { Component } from 'react';
import { Button ,TouchableWithoutFeedback, FlatList, Text, View , BackHandler} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CustomersDatabase.db' });


export default class HomeScreen extends Component {
constructor(props){
  super(props);
  this.state = {
    ts : 0,
    FlatListItems: [],
    isFetching: false,
  };

  this.props.navigation.addListener('willFocus',() =>{
    this.onRefresh()
  })
  
  }

 static navigationOptions = ({ navigation }) => {
    return {
    title: 'Customers',
    headerStyle: { backgroundColor: '#f05555' },
    headerTintColor: '#ffffff',
    headerRight: (
      <Button
        title="Add"
        //this is hack. I think can do it better 
        onPress={navigation.getParam('openAddUser')}
      />
    ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ openAddUser: this._openAddUser });
   // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }


  handleBackPress = () => {
    return true;
  }

  componentWillUnmount() {

  //  BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  _openAddUser= () => {
   this.props.navigation.navigate('AddUser')
  };



  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };

  onRefresh() {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
      var temp = [];
      for (let i = 0; i < results.rows.length; ++i) {
        temp.push(results.rows.item(i));
      }
      this.setState({
        FlatListItems: temp,
      });
    });
  });
 }

  render() {
    const {navigate} = this.props.navigation;
    return (
     <View>
        <FlatList
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={ () => navigate('EditCustomer', {id: item.user_id})}>

      <View key={item.user_id} style={{ backgroundColor: 'white', padding: 20 }}>
              <Text>Id: {item.user_id}</Text>
              <Text>Name: {item.customer_name}</Text>
              <Text>Contact: {item.customer_surname}</Text>
              <Text>Phone: {item.customer_telephone_number}</Text>
              <Text>Address: {item.customer_address}</Text>
            </View>
       </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }


}



