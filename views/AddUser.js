/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import MyTextInput from './components/MyTextInput'
import MyButton from './components/MyButton';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CustomersDatabase.db' });
export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_name: '',
      customer_surname: '',
      customer_telephone_number: '',
      customer_address: '',
    };
    db.transaction(function(txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
          [],
          function(tx, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS table_user', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name VARCHAR(20), customer_surname VARCHAR(20),customer_telephone_number VARCHAR(12),customer_address VARCHAR(255))',
                []
              );
            }
            
          }
          );
        });
  }

  register_user = () => {
    var that = this;
    const { customer_name } = this.state;
    const { customer_surname } = this.state;
    const { customer_telephone_number } = this.state;
    const { customer_address } = this.state;
    if (customer_name) {
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO table_user (customer_name, customer_surname, customer_telephone_number, customer_address) VALUES (?,?,?,?)',
              [customer_name, customer_surname, customer_telephone_number,customer_address],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'You are Registered Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('HomeScreen'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('Registration Failed');
                }
              }
            );
          });
    } else {
      alert('Please fill Name');
    }
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
              onChangeText={customer_name => this.setState({ customer_name })}
              style={{ padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Surname"
              onChangeText={customer_surname => this.setState({ customer_surname })}
              maxLength={12}
              style={{ textAlignVertical: 'top',padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Phone number"
              onChangeText={customer_telephone_number => this.setState({ customer_telephone_number })}
              maxLength={12}
              keyboardType="numeric"
              style={{ padding:10 }}
            />
            <MyTextInput
              placeholder="Enter Address"
              onChangeText={customer_address => this.setState({ customer_address })}
              maxLength={225}
              numberOfLines={5}
              multiline={true}
              style={{ textAlignVertical: 'top',padding:10 }}
            />
            <MyButton
              title="Add customer"
              customClick={this.register_user.bind(this)}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}