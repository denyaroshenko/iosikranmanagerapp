import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';

import {
  Button,
} from '../components';

import HTML from "react-native-render-html";
import BackIcon from '../assets/Icons/BackIcon';

const NewsDetailsScreen = ({ route, navigation }) => {

  const { id, title, image, text } = route.params.item;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? 'No title' : title,
      headerBackTitleVisible: false,
      // headerLeft: () => <BackIcon style={{ marginLeft: 15 }} onPress={() => navigation.goBack(null)} />
    });
  }, [navigation, title]);

  return (
    <View style={styles.screen}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.image}
            source={{
              uri: image
            }}
          />
          <Text style={styles.title}>{title}</Text>
          <HTML source={{ html: text }} />

          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={{ marginBottom: 10, display: 'flex', alignItems: 'center', width: '100%' }}>
              <Button backgroundColor='#54C2EF' color='#fff' onPress={() => navigation.navigate('NewsListScreen')}>все новости</Button>
            </View>
          </View>

        </SafeAreaView>
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    marginVertical: 20,
    marginHorizontal: 15,
  },

  image: {
    height: 180,
    width: '100%',
    marginBottom: 20
  },

  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    marginBottom: 70
  },
});

export default NewsDetailsScreen;