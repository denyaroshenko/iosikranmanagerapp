import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import ChevronRightIcon from '../assets/Icons/ChevronRightIcon';

const CommercialOfferListItem = ({ navigation, item }) => {
  const {
    id,
    client_name,
    date,
    status,
    route
  } = item;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CommercialOfferDetailScreen', { item: item })}
      style={styles.item}
    >
      <Text style={styles.name}>Запрос на КП №{id}</Text>
      <Text style={styles.company}>{client_name}</Text>
      <Text style={styles.date}>{date}</Text>

    </TouchableOpacity>
  );
}

CommercialOfferListItem.defaultProps = {
  // key: 'Untitled',
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 15,
    // marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  company: {
    color: '#000',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5
  },

  name: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 21,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,

    // borderWidth: 1,
    // borderColor: 'red',
  },

  date: {
    color: '#AEAEAE',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 12,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },

  status: {
    color: '#DF5649',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
  },

  status_1: {
    color: '#DF5649',
    borderColor: '#DF5649',
  },

  status_2: {
    color: '#078522',
    borderColor: '#078522',
  },

  status_4: {
    color: '#AEAEAE',
    borderColor: '#AEAEAE',
  },

  status_8: {
    color: '#4761AC',
    borderColor: '#4761AC',
  },

  status_16: {
    color: '#4761AC',
    borderColor: '#4761AC',
  },

  column1: {
    flex: 1
  },
  column2: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },

  title: {

  },
  icon: {

  }
});

export default CommercialOfferListItem;