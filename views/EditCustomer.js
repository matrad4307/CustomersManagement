/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import MyTextInput from './components/MyTextInput'
import MyButton from './components/MyButton';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CustomersDatabase.db' });


export default class EditCustomer extends React.Component {
  constructor(props) {
    super(props);
    const id = props.navigation.getParam('id', 'nothing sent')

    this.state = {
      user_id: id,
      customer_name: '',
      customer_surname: '',
      customer_telephone_number: '',
      customer_address: '',
    };

    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM table_user where user_id = ?',
          [id],
          (tx, results) => {
            var len = results.rows.length;
            console.log('len',len);
            if (len > 0) {
              this.setState({
                customer_name:results.rows.item(0).customer_name,
              });
              this.setState({
                customer_surname:results.rows.item(0).customer_surname,
              });
              this.setState({
                customer_telephone_number:results.rows.item(0).customer_telephone_number,
              });
              this.setState({
                customer_address:results.rows.item(0).customer_address,
               });
            }else{
              alert('No user found');
              this.setState({
                customer_name: '',
                customer_surname: '',
                customer_telephone_number: '',
                customer_address: ''
              });
            }
          }
        );
      });
  }

  updateUser = () => {
    var that = this;
    const { customer_name } = this.state;
    const { customer_surname } = this.state;
    const { customer_telephone_number } = this.state;
    const { customer_address } = this.state;
    const { user_id } = this.state;
    if (customer_name) {
        db.transaction((tx)=> {
            tx.executeSql(
              'UPDATE table_user set customer_name=?, customer_surname=? , customer_telephone_number=?, customer_address=? where user_id=?',
              [customer_name, customer_surname, customer_telephone_number, customer_address,user_id],
              (tx, results) => {
                console.log('Results',results.rowsAffected);
                if(results.rowsAffected>0){
                    Alert.alert(
                        'Success',
                        'You are Update Customer Successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () =>
                         //   BackHandler.exitApp()
                              that.props.navigation.navigate('HomeScreen'),
                              
                          },
                        ],
                        { cancelable: false }
                      );
                }else{
                  alert('Updation Failed');
                }
              }
            );
          });
    } else {
      alert('Please fill Name');
    }
  };

  removeUser = () => {
    var that = this;
    const { user_id } = this.state;
        db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM  table_user where user_id=?',
              [user_id],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'User deleted successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => that.props.navigation.navigate('HomeScreen'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('Please insert a valid User Id');
                }
            }
          );
        });
};


  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <MyTextInput
              placeholder="Enter Name"
              value={this.state.customer_name}
              onChangeText={customer_name => this.setState({ customer_name })}
              style={{ padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Surname"
              value={this.state.customer_surname}
              onChangeText={customer_surname => this.setState({ customer_surname })}
              maxLength={12}
              style={{ textAlignVertical: 'top',padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Phone number"
              value={this.state.customer_telephone_number}
              onChangeText={customer_telephone_number => this.setState({ customer_telephone_number })}
              maxLength={12}
              keyboardType="numeric"
              style={{ padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Address"
              value={this.state.customer_address}
              onChangeText={customer_address => this.setState({ customer_address })}
              maxLength={225}
              numberOfLines={5}
              multiline={true}
              style={{ textAlignVertical: 'top',padding:10 }}
            />
            <MyButton
              title="Save"
              customClick={this.updateUser.bind(this)}
            />
              <MyButton
              title="Remove customer"
              customClick={this.removeUser.bind(this)}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}