import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	SafeAreaView,
	ScrollView,
	FlatList,
	View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CommercialOfferListItem } from '../components';

import { config } from '../config';

const CommercialOfferListScreen = ({ navigation }) => {

	const { API_URL } = config

	const [loading, setLoading] = useState([])
	const [commercialOffers, setCommercialOffers] = useState([])

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Запросы КП',
		});
	}, [navigation, 'Запросы КП']);

	// Получение данных менеджера
	const getManagerData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('userData')
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
			console.log('Ошибка получения данных пользователя');
		}
	}

	// Получаем информацию о компании по ее ID
	const fetchCommercialOffers = async (managerID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/request/list?id=${managerID}`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data)
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		});
	}

	useEffect(() => {

		getManagerData().then((userData) => {
			fetchCommercialOffers(userData.manager_id).then(data => {
				console.log(data);
				setCommercialOffers(data)
			})
		})


	}, []);

	const renderItem = ({ item }) => (
		<CommercialOfferListItem navigation={navigation} item={item} key={item.id} />
	);

	return (
		<SafeAreaView style={styles.screen}>
			{/* <ScrollView style={styles.container}> */}

			{!commercialOffers.length ?
				<View style={styles.errorItem}>
					<Text style={styles.errorText}>Элементов не найдено</Text>
				</View>
				:
				<FlatList
					style={styles.flatList}
					data={commercialOffers}
					renderItem={renderItem}
					keyExtractor={item => item.id}
				/>
			}
			{/* </ScrollView> */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#F3F3F3'
	},

	container: {
		// flex: 1,
		// marginTop: StatusBar.currentHeight || 0,
		// padding: 25,
	},

	flatList: {
		paddingBottom: 30,
		// backgroundColor: 'red'
	},

	errorItem: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',

		// borderWidth: 1,
		// borderColor: 'red',
	},

	errorText: {
		marginTop: 10,
		fontWeight: '400',
		fontSize: 16,
		lineHeight: 26,
		color: '#000',
		opacity: 0.8,
		textAlign: 'center',
	}
});

export default CommercialOfferListScreen;