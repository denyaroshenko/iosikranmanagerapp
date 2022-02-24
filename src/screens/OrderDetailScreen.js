import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SafeAreaView,
	ScrollView
} from 'react-native';

import * as RootNavigation from '../helpers/RootNavigation'
import { OrderEventListItem } from '../components';
import DotsVerticalIcon from '../assets/Icons/DotsVerticalIcon';
import Spinner from 'react-native-loading-spinner-overlay';
import RNPickerSelect from 'react-native-picker-select';

import { config } from '../config';
const { API_URL } = config

const OrderDetailScreen = ({ navigation, route }) => {

	const [loading, setLoading] = useState(false)
	const [order, setOrder] = useState(null)
	const [persons, setPersons] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)

	// Получаем заказ по ID
	const fetchOrder = async (orderID) => {
		// console.log(`${API_URL}/order/getOrder?order_id=${orderID}`)
		setLoading(true)

		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/order/getOrder?order_id=${orderID}`)
				.then((response) => response.json())
				.then((json) => {
					const order = json.data
					resolve(order)
				})
				.catch((error) => {
					console.error('[ОШИБКА]', error)
					reject(error)
				})
				.finally(setLoading(false))
		})
	}

	// Изменение ответственного на заявку
	const handlerOrderPersonEditSubmit = async (person_name, person_id_1c) => {
		setLoading(true)

		const message = {
			order_id: order.id,
			person: person_name,
			person_id: person_id_1c,
		};

		// Сериализуем параметы для GET запроса
		let parameters = "";
		for (var key in message) {
			if (parameters != "") {
				parameters += "&";
			}
			parameters += key + "=" + encodeURIComponent(message[key]);
		}

		await fetch(`${API_URL}/order/updatePerson?${parameters}`, {
			method: 'GET',
		})
			.then((response) => {
				const data = JSON.stringify(response.json())
				RootNavigation.navigate('OrderEditSuccessScreen')
			})
			.finally(() => setLoading(false))
	}

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Детали заявки',
		});
	}, [navigation, 'Детали заявки']);

	React.useEffect(() => {
		// Подписываемся на событие focus экрана
		const unsubscribe = navigation.addListener('focus', () => {
			fetchOrder(id).then((order) => {
				setErrorMessage(null)
				setOrder(order)

				// Нормализуем объекты для пикера
				const personsPicker = []
				order.specialists.forEach(item => {
					personsPicker.push({
						label: `${item.last_name} ${item.first_name} ${item.middle_name}`,
						value: item.id_1c
					})
				});
				setPersons(personsPicker)

			}).catch((error) => {
				setErrorMessage('При загрузке заявки произошла ошибка')
				throw error
			})

		});

		return () => {
			unsubscribe;
		};

	}, [navigation])

	const {
		id,
		client_name,
		date,
		status,
		person,
		object_name,
		crane_name,
		reason,
		detail,
		events
	} = route.params.item

	function getStatusName(id) {
		// Статусы:
		// 1 - новая; 2 - в работе; 4 - выполнена; 8 - отклонена; 16 - отклонена клиентом
		let status = []
		status[1] = 'новая'
		status[2] = 'в работе'
		status[4] = 'выполнена'
		status[8] = 'отклонена'
		status[16] = 'отклонена клиентом'

		return status[id]
	}

	return (
		<SafeAreaView style={styles.container}>

			{/* DEBUG */}
			{/* <Text>persons: {persons ? persons.toString() : 'null'}</Text> */}

			<Spinner visible={loading} />

			{errorMessage ?
				<Text style={styles.errorMessage}>{errorMessage}</Text>
				: <></>
			}

			{order ?
				<ScrollView>

					<View style={[styles.tile, { marginTop: 15, marginBottom: 15 }]}>
						<View style={[styles.row, { marginBottom: 20 }]}>
							<View style={styles.column1}>
								<Text style={styles.name}>Заявка №{id}</Text>
								<Text style={styles.date}>{order.date}</Text>
							</View>

							{/* Статус */}
							<View style={styles.column2}>
								<Text style={[styles.status, styles['status_' + order.status]]}>{getStatusName(order.status)}</Text>
							</View>
						</View>

						<View style={styles.table}>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>Компания:</Text>
								<Text style={styles.tableValue}>{order.client_name}</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>ФИО</Text>
								<Text style={styles.tableValue}>{order.fio}</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>Объект:</Text>
								<Text style={styles.tableValue}>{order.object_name}</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>Кран:</Text>
								<Text style={styles.tableValue}>{order.crane_name}</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>Причина вызова:</Text>
								<Text style={styles.tableValue}>{order.reason}</Text>
							</View>
							<View style={styles.tableRow}>
								<Text style={styles.tableLabel}>Детали вызова:</Text>
								<Text style={styles.tableValue}>{order.detail}</Text>
							</View>
						</View>
					</View>

					<View style={[styles.orderControllerTile, { marginBottom: 15 }]}>

						{/* Редактирование статуса */}
						<TouchableOpacity
							style={styles.orderControllerItem}
							onPress={() => { navigation.navigate('OrderStatusEditScreen', { item: order }) }}
						>
							<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
								<View>
									<Text style={styles.orderControllerLabel}>Статус:</Text>
									<Text style={styles.orderControllerValue}>{getStatusName(order.status)}</Text>
								</View>

								<DotsVerticalIcon />
							</View>
						</TouchableOpacity>

						<View style={styles.orderControllerDivider} />

						{/* Ответственное лицо */}
						<TouchableOpacity
							style={styles.orderControllerItem}
							onPress={() => { navigation.navigate('OrderPersonEditScreen', { item: order }) }}
						>
							<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
								<View>
									<Text style={styles.orderControllerLabel}>Ответственное лицо:</Text>
									<Text style={styles.orderControllerValue}>{order.person ? order.person : 'не назначено'}</Text>
								</View>

								<DotsVerticalIcon />
							</View>
						</TouchableOpacity>

						{/* {persons ?
							<RNPickerSelect
								style={pickerStyle}
								placeholder={{ label: order.person ? order.person : 'Выберите ответственного', value: null }}
								doneText="Выбрать"
								useNativeAndroidPickerStyle={false}
								// Icon={() => {
								// 	return <DotsVerticalIcon style={pickerStyle.icon} />;
								// }}
								onValueChange={(value, index) => {
									handlerOrderPersonEditSubmit(persons[index - 1].label, value)
									// console.log(persons[index - 1].label, value);
								}}
								items={persons}
							/>
							: <></>
						} */}
					</View>

					{/* История изменения заявки */}
					<View style={[styles.orderControllerTile, { marginBottom: 15 }]}>
						{order.events.map((item, key) => {
							return (
								<OrderEventListItem navigation={navigation} item={item} key={key} />
							)
						})}
					</View>

				</ScrollView>
				: <></>
			}

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: StatusBar.currentHeight || 0,
		// marginTop: 15
	},

	flatList: {
		flex: 1,
		marginBottom: 20
	},

	tile: {
		marginHorizontal: 15,
		paddingVertical: 25,
		paddingHorizontal: 20,
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

	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	name: {
		color: '#000000',
		fontWeight: '500',
		fontSize: 18,
		lineHeight: 21,
		display: 'flex',
		alignItems: 'center',
		marginBottom: 10
	},

	date: {
		color: '#AEAEAE',
		fontWeight: '300',
		fontSize: 10,
		lineHeight: 12,
		display: 'flex',
		alignItems: 'center'
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

	table: {

	},

	tableRow: {
		display: 'flex',
		flexDirection: 'row',
		marginVertical: 5
	},

	tableLabel: {
		flex: 1,
		color: '#000000',
		fontWeight: '500',
		fontSize: 12,
		lineHeight: 16,
		display: 'flex',
		alignItems: 'center',
		marginRight: 5
	},

	tableValue: {
		flex: 1,
		color: '#000000',
		fontWeight: '300',
		fontSize: 12,
		lineHeight: 18,
		display: 'flex',
		alignItems: 'center',
	},

	orderControllerTile: {
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
		elevation: 8,
	},

	orderControllerDivider: {
		borderBottomColor: '#c8c8ca',
		borderBottomWidth: 1,
	},

	orderControllerItem: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		// borderBottomColor: '#c8c8ca',
		// borderBottomWidth: 1,
	},

	orderControllerLabel: {
		color: '#000000',
		fontWeight: '500',
		fontSize: 12,
		lineHeight: 14,
		display: 'flex',
		alignItems: 'center',
		// marginBottom: 5
	},

	orderControllerValue: {
		color: '#000000',
		fontWeight: '300',
		fontSize: 10,
		display: 'flex',
		alignItems: 'center'
	},

	errorMessage: {
		marginTop: 40,
		marginHorizontal: 15,
		textAlign: 'center',
	}
});

const pickerStyle = {
	inputIOS: {
		height: 60,
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginHorizontal: 20,
		marginBottom: 10,
		backgroundColor: '#fff',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4.65,
		elevation: 8,

		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},

	inputAndroid: {
		color: '#000',
		height: 60,
		// position: 'relative',
		// display: 'flex',
		// flexDirection: 'row',
		// alignItems: 'center',
		// justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginHorizontal: 20,
		marginBottom: 15,
		backgroundColor: '#fff',
		shadowColor: "#000",
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,

		elevation: 8,
	},

	placeholderColor: '#000',

	underline: { borderTopWidth: 0 },

	icon: {
		position: 'absolute',
		top: 20,
		right: 37,

		// backgroundColor: 'red',
	},
};

export default OrderDetailScreen;