import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
} from 'react-native';

import { ClientItem } from '../components';

import * as RootNavigation from '../helpers/RootNavigation';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';

import BackIcon from '../assets/Icons/BackIcon'

import { config } from '../config'

const { API_URL } = config

function ObjectsScreen({ navigation }) {

	const [loading, setLoading] = useState(false)

	let [managerData, setManagerData] = useState([])
	let [clientIDs, setClientIDs] = useState([])
	let [clients, setClients] = useState([])
	let [data, setData] = useState([]) // Создаем переменную состояния для данных

	// хук запускается синхронно после всех изменений DOM
	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Клиенты',
			// headerLeft: () => <BackIcon style={{ marginLeft: 15 }} onPress={() => navigation.goBack(null)} />
		});
	}, [navigation, 'Клиенты']);

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

	// Получаем информацию о компании по ID клиента
	const getCompanyData = async (clientID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/company_info?id=${clientID}`)
				.then((response) => response.json())
				.then((json) => {

					const companyItem = {
						client_id: clientID,
						data: json.data
					}

					resolve(companyItem)
					console.log(companyItem);
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		});
	}

	const getData = async (list) => {
		return Promise.all(list.map(id => getCompanyData(id)))
	}

	// Получаем массив клиентов со всеми данными
	const getClientArray = async () => {
		return new Promise((resolve, reject) => {
			// fetch(`${API_URL}/contacts?id=${clientID}`)
			// 	.then((response) => response.json())
			// 	.then((json) => {
			// 		resolve(json.data[0])
			// 	})
			// 	.catch((error) => {
			// 		console.error(error)
			// 		reject(error)
			// 	})

			getManagerData().then((userData) => {
				setManagerData(userData)
				setClientIDs(userData.client_id)

				let clientData = []
				userData.client_id.map((clientID) => {
					// console.log(clientID);
					getClientDataByID(clientID).then((data) => clientData.push({
						client_id: clientID,
						data: data,
					}))
				})
			})
		});
	}

	useEffect(() => {
		setLoading(true)

		getManagerData().then((userData) => {
			console.log(userData.client_id) // Массив ID клиентов
			getData(userData.client_id).then(data => {
				console.log(data)
				setClients(data)
				setLoading(false)
			})
		})
	}, []);

	return (
		<View>
			<Spinner visible={loading} />

			<FlatList
				style={styles.flatList}
				data={clients}
				keyExtractor={item => item.id}
				renderItem={({ item }) => <ClientItem navigation={navigation} item={item} />}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	rowStyle: {
		flex: 1,
	},

	flatList: {
		paddingTop: 15,
		paddingBottom: 30,
		// backgroundColor: 'red',
	},
});

export default ObjectsScreen;
