import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SectionList,
	SafeAreaView,
	FlatList,
	ScrollView
} from 'react-native';

import { ContactCardListItem } from '../components';

import AsyncStorage from '@react-native-async-storage/async-storage'

import store from '../store/store'
import { config } from '../config';

const ContactsScreen = ({ navigation }) => {

	const { API_URL } = config

	const [loading, setLoading] = useState([])
	const [data, setData] = useState([])

	const state = store.getState();
	const userID = state.authToken

	// Получение данных пользователя
	const getUserData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('userData')
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
			console.log('Ошибка получения данных пользователя');
		}
	}

	// Получаем данные
	useEffect(() => {
		getUserData().then(data => {
			const managerID = data.manager_id

			fetch(`${API_URL}/home2?id=${managerID}`)
				.then((response) => response.json())
				.then((json) => setData(json.data.managers))
				.catch((error) => console.error(error))
				.finally(() => setLoading(false));

		})
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Контакты',
		});
	}, [navigation, 'Контакты']);

	const renderItem = ({ item }) => {
		return (
			<ContactCardListItem item={item} />
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: StatusBar.currentHeight || 0,
		// padding: 15,
	},

	title: {
		fontSize: 15,
		lineHeight: 18,
		color: '#000000',
	},

	buttonWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: 30
	},

	button: {
		backgroundColor: '#DF5649'
	}
});

export default ContactsScreen;