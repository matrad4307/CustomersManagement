import React, { Component } from 'react';
import { Button ,TouchableWithoutFeedback, FlatList, Text, View , StyleSheet} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CustomersDatabase.db' });

const styles = StyleSheet.create({
  bigBlue: {
    marginRight: 100,
  },
  container: {
    flex: 1,
    paddingTop: 22
   },
   item: {
     padding: 10
   },
});


export default class HomeScreen extends Component {
constructor(props){
  super(props);
  this.state = {
    ts : 0,
    FlatListItems: [],
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
      <View style={{marginRight:10}}>
      <Button
        style={styles.bigBlue}
        title="Add"
        //this is hack. I think can do it better 
        onPress={navigation.getParam('openAddUser')}
      />
      </View>
    ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ openAddUser: this._openAddUser });
  }


  handleBackPress = () => {
    return true;
  }

  componentWillUnmount() {
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
     <View style={styles.container}>
        <FlatList 
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={ () => navigate('EditCustomer', {id: item.user_id})}>
                  <View key={item.user_id} style={styles.item}>
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



