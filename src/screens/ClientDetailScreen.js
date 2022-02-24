import React, { useEffect, useState, useFocusEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView
} from 'react-native';

import { ClientItem } from '../components';

import * as RootNavigation from '../helpers/RootNavigation';

import { SectionTitle, ObjectBlockItem } from '../components';
import { SectionGrid } from 'react-native-super-grid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';

import BackIcon from '../assets/Icons/BackIcon'

import store from '../store/store'
import { config } from '../config'

const screenOptions = {
	headerBackTitle: 'Назад',
	headerTintColor: '#000000',
	headerStyle: {
		backgroundColor: '#FED400',
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 0,
	},
};

const { API_URL } = config

const ContactItem = ({ item }) => {

	const {
		first_name,
		last_name,
		middle_name,
		phone,
		email,
		position
	} = item

	return (
		<View style={styles.contactCard}>
			<Text style={styles.contactName}>{last_name} {first_name} {middle_name}</Text>
			<View style={styles.contactRow1}>
				<Text style={styles.contactLabel}>Телефон</Text>
				<View style={styles.contactCol}>
					{/* <TouchableOpacity onPress={() => { Linking.openURL('tel:' + phone) }}><Text style={styles.contactValue}>{phone}</Text></TouchableOpacity> */}
					<Text>{phone}</Text>
				</View>
			</View>
			<View style={styles.contactRow1}>
				<Text style={styles.contactLabel}>E-mail</Text>
				<View style={styles.contactCol}>
					<Text style={styles.contactValue}>{email}</Text>
				</View>
			</View>

			<View style={styles.contactRow}>
				<Text style={styles.contactLabel}>Должность</Text>
				<View style={styles.contactCol}>
					<Text style={styles.contactValue}>{position}</Text>
				</View>
			</View>
		</View>
	);
}

function ClientDetailScreen({ route, navigation }) {

	const { client_id } = route.params;

	const [loading, setLoading] = useState(false)

	// grab current state
	const state = store.getState();

	let [managerData, setManagerData] = useState([])
	let [clientData, setClientData] = useState()
	let [companyData, setCompanyData] = useState()
	let [data, setData] = useState([]) // Создаем переменную состояния для данных

	// хук запускается синхронно после всех изменений DOM
	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Информация о клиенте',
			// headerLeft: () => <BackIcon style={{ marginLeft: 15 }} onPress={() => navigation.goBack(null)} />
		});
	}, [navigation, 'Информация о клиенте']);

	const userID = state.authToken

	// Получаем информацию о компании по ID клиента
	const getCompanyData = async (clientID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/company_info?id=${clientID}`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data)
					console.log(json.data);
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		});
	}

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

	// Получаем информацию клиента по его ID
	const getClientDataByID = async (clientID) => {
		console.log(`${API_URL}/contacts?id=${clientID}`);
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/contacts?id=${clientID}`)
				.then(response => response.json())
				.then((responseJson) => {
					// console.log('[!!!!!]', clientID, responseJson)
					resolve(responseJson.data[0])

					// return json.data[0]
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		});
	}

	// Получаем информацию о компании по ее ID
	const getCompanyDataByID = async (clientID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/client/${clientID}`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data[0])
					// console.log('[!!!!!]', clientID_1с, json.data[0])
					// return json.data[0]
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		});
	}

	useEffect(() => {
		// setLoading(true)

		// getManagerData().then((userData) => {
		// 	console.log(userData.client_id) // Массив ID клиентов
		// 	getData(userData.client_id).then(data => {
		// 		console.log(data)
		// 		setClients(data)
		// 	})
		// })

		getCompanyData(client_id).then(data => {
			setClientData(data)
			console.log('asasd', data);
		})

		// getClientDataByID(client_id).then(data => {
		// 	setClientData(data)
		// 	// console.log(data);

		// 	// console.log('COMPANY DATA', data.id);
		// 	// getCompanyDataByID(data.id).then(data => {
		// 	// 	setCompanyData(data)
		// 	// 	console.log('COMPANY DATA', data);
		// 	// })
		// })

		// getCompanyDataByID(client_id).then(data => {
		// 	setCompanyData(data)
		// 	console.log('[!!!!!]', data)
		// })

	}, []);

	return (
		<ScrollView style={styles.screen}>
			<Spinner visible={loading} />

			{/* DEBUG */}
			{/* <Text>{client_id}</Text> */}

			{clientData ?
				<View>
					<View style={styles.contactCard}>
						<Text style={styles.contactName}>{clientData.company.company}</Text>
						<View style={styles.contactRow1}>
							<Text style={styles.contactLabel}>ИНН</Text>
							<View style={styles.contactCol}>
								{/* <TouchableOpacity onPress={() => { Linking.openURL('tel:' + phone) }}><Text style={styles.contactValue}>{phone}</Text></TouchableOpacity> */}
								<Text>{clientData.company.company_inn}</Text>
							</View>
						</View>
						<View style={styles.contactRow}>
							<Text style={styles.contactLabel}>Адрес</Text>
							<View style={styles.contactCol}>
								<Text style={styles.contactValue}>{clientData.company.company_address}</Text>
							</View>
						</View>
					</View>

					{/* <FlatList
						style={styles.flatList}
						data={clientData.contacts}
						keyExtractor={item => item.id}
						renderItem={({ item }) => <ContactItem item={item} />}
					/> */}

					{clientData.contacts.map((item, key) => {
						const statusID = Math.pow(2, key)
						return (
							<ContactItem item={item} />
						)
					})}
				</View>
				: <></>
			}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 10,
		backgroundColor: '#f5f5f5',

		// borderWidth: 1,
		// borderColor: 'red'
	},

	flatList: {
		paddingBottom: 30,
		// backgroundColor: 'red'
	},

	rowStyle: {
		flex: 1,
	},

	contactCard: {
		paddingVertical: 25,
		paddingHorizontal: 20,
		marginHorizontal: 15,
		marginTop: 5,
		marginBottom: 10,
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
		elevation: 8,
	},

	contactName: {
		fontSize: 18,
		fontWeight: '700',
		lineHeight: 21,
		color: '#000000',
		marginBottom: 20
	},

	contactRow1: {
		// flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},

	contactRow: {
		// flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	contactCol: {
		width: '50%',
	},

	contactLabel: {
		fontSize: 12,
		fontWeight: '700',
		lineHeight: 14,
		color: '#000000'
	},

	contactValue: {
		fontSize: 12,
		fontWeight: '400',
		lineHeight: 14,
		color: '#000000',
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

export default ClientDetailScreen;
