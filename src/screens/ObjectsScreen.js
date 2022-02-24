import React, { useEffect, useState, useFocusEffect } from 'react';
import { StyleSheet, Text, View, SectionList, TouchableOpacity, BackHandler } from 'react-native';

import RubleIcon from '../assets/Icons/Header/RubleIcon';
import ArrowRightIcon from '../assets/Icons/Header/ArrowRightIcon';

import { Button } from '../components';

import * as RootNavigation from '../helpers/RootNavigation';

import { SectionTitle, ObjectBlockItem } from '../components';
import { SectionGrid } from 'react-native-super-grid';

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

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '.' + mm + '.' + yyyy;

function ObjectsScreen({ route, navigation }) {

	const { client_id } = route.params;

	// console.log(API_URL + '/objects/holding?id=' + client_id);

	// function handleBackButtonClick() {
	// 	navigation.goBack();
	// 	// navigation.popToTop();
	// 	return true;
	// }

	// useEffect(() => {
	// 	BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
	// 	return () => {
	// 		BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
	// 	};
	// }, []);

	const [loading, setLoading] = useState(false)

	// grab current state
	const state = store.getState();

	const [clientData, setClientData] = useState(null) // Создаем переменную состояния для данных
	const [data, setData] = useState([]) // Создаем переменную состояния для данных

	// хук запускается синхронно после всех изменений DOM
	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Объекты!',
			// headerLeft: () => <BackIcon style={{ marginLeft: 15 }} onPress={() => navigation.goBack(null)} />
		});
	}, [navigation, 'Объекты']);

	const userID = state.authToken

	// Получаем данные для главного экрана
	const getClientMainData = async (clientID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/home?id=${clientID}`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data)
				})
				.catch((error) => {
					console.error('Ошибка при загрузке данных клиента', error)
					reject(error)
				})
		});
	}

	useEffect(() => {
		setLoading(true)

		getClientMainData(client_id).then(data => setClientData(data))

		fetch(`${API_URL}/objects/holding?id=${client_id}`)
			.then((response) => response.json())
			.then((json) => {
				setData(json)
				console.log('json', json);
			})
			.catch((error) => console.error(error))
			.finally(() => setLoading(false));
	}, []);

	let objects = data.data;
	let objects_status_0 = [];
	let objects_status_1 = [];
	let objects_status_2 = [];
	let sections = [];

	if (objects) {

		// Фильтруем объекты со статусом 0
		objects_status_0 = objects.filter(function (el) {
			return el.status == 0;
		});

		// Фильтруем объекты со статусом 1
		objects_status_1 = objects.filter(function (el) {
			return el.status == 1;
		});

		// Фильтруем объекты со статусом 2
		objects_status_2 = objects.filter(function (el) {
			return el.status == 2;
		});

		if (objects_status_0.length) {
			sections.push({
				title: 'В работе',
				data: objects_status_0,
			})
		}

		if (objects_status_1.length) {
			sections.push({
				title: 'Планируемые',
				data: objects_status_1,
			})
		}

		if (objects_status_2.length) {
			sections.push({
				title: 'Архив',
				data: objects_status_2,
			})
		}
	}

	// Разбиваем число на разряды
	function numberWithSpaces(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	return (
		<View style={styles.screen}>
			<Spinner visible={loading} />

			{/* {clientData ?
				<View style={styles.companyCardWrapper}>
					<View style={styles.companyCardHalfBg}></View>
					<View style={styles.companyCard}>

						<TouchableOpacity onPress={() => navigation.navigate('DebtListScreen', { client_id: client_id })}>
							<Text style={styles.priceTitle}>текущая задолженность</Text>
							<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
									<Text style={styles.priceValue}>{numberWithSpaces(clientData.client.debt)}</Text>
									<RubleIcon />
								</View>

								<ArrowRightIcon />
							</View>
							<Text style={styles.priceDate}>{today}</Text>
						</TouchableOpacity>

					</View>
				</View>
				: <></>} */}

			{/* DEBUG */}
			{/* <Text>{client_id}</Text> */}

			<SectionGrid
				itemDimension={100}
				sections={sections}
				spacing={15}
				style={styles.gridView}
				additionalRowStyle={styles.rowStyle}
				keyExtractor={(item, index) => item.id}
				renderItem={({ item }) => <ObjectBlockItem navigation={navigation} client_id={client_id} item={item} />}
				renderSectionHeader={({ section: { title } }) => (
					<SectionTitle style={{ paddingLeft: 20 }}>{title}</SectionTitle>
				)}
			/>

			<View style={styles.stickyArea}>
				<Button onPress={() => navigation.navigate('ClientDetailScreen', { client_id: client_id })}>Информация о клиенте</Button>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},

	gridView: {
		marginTop: 20,
	},

	rowStyle: {
		flex: 1,
	},

	stickyArea: {
		display: 'flex',
		position: 'absolute',
		alignSelf: 'flex-end',
		bottom: 0,
		alignItems: 'center',

		width: '100%',
		padding: 20
	},

	priceTitle: {
		color: '#747474',
		fontSize: 12,
		fontWeight: '300',
		lineHeight: 14
	},
	priceValue: {
		color: '#DF5649',
		fontSize: 36,
		fontWeight: '700',
		lineHeight: 42,
		marginRight: 10
	},
	priceDate: {
		color: '#747474',
		fontSize: 9,
		lineHeight: 11,
		fontWeight: '300'
	},

	companyCardWrapper: {
		position: 'relative',
	},
	companyCardHalfBg: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		height: '50%',
		backgroundColor: '#fed000'
	},
	companyCard: {
		marginHorizontal: 15,
		paddingVertical: 25,
		paddingHorizontal: 20,
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 2,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 8,
	},
});

export default ObjectsScreen;
