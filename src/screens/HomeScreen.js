import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
	StatusBar
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import { config } from '../config';

import store from '../store/store'

import HomeNavObjectsIcon from '../assets/Icons/HomeNavObjectsIcon';
import HomeNavKPIcon from '../assets/Icons/HomeNavKPIcon';
import HomeNavCatalogIcon from '../assets/Icons/HomeNavCatalogIcon';
import NotificationIcon from '../assets/Icons/Header/NotificationIcon';
import Logo from '../assets/Icons/Header/Logo';
import PushNotification from 'react-native-push-notification';

import { NewsListItem, Button } from '../components';

import Spinner from 'react-native-loading-spinner-overlay'

function HomeScreen({ navigation }) {

	const { API_URL } = config

	React.useLayoutEffect(() => {
		navigation.setOptions({
			title: '', // устанавливаем собственный заголовок экрана,
			headerTransparent: true,
			headerBackTitleVisible: false,
			headerStyle: {
				backgroundColor: '#FED000',
				height: StatusBar.currentHeight,
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerTitle: () => null,
			headerLeft: () => null,
		});
	}, [navigation, 'Главный']);

	const state = store.getState();

	const [isLoading, setLoading] = useState(true)
	const [managerData, setManagerData] = useState(null)
	const [news, setNews] = useState([])
	const [offers, setOffers] = useState([])
	const [userData, setUserData] = useState(null)
	const [clientCount, setClientCount] = useState(0)
	const [commercialOfferCount, setCommercialOfferCount] = useState(0)
	const [catalogCount, setCatalogCount] = useState(0)
	const [notificationCount, setNotificationCount] = useState(0)
	const [unreadNotifications, setUnreadNotifications] = useState([])
	let [data, setData] = useState([]) // Создаем переменную состояния для данных

	const userID = state.authToken // Пока в токене лежит ID пользователя

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

	// Получаем список уведомлений
	const fetchNotifications = async (contactID) => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/notificationsForContact/?contact_id=${contactID}`)
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

	// Формируем массив с новыми уведомлениями
	const getUnreadNotifications = async (notifications) => {
		let unread = []

		if (notifications) {

			// Фильтруем уведомления со статусом "Новые"
			unread = notifications.filter(function (el) {
				return el.status == 1;
			});
		}

		// console.log("sections", notificationSections);
		setUnreadNotifications(unread)
	}

	// Получаем список новостей
	const fetchNews = async () => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/news/list`)
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

	// Получаем список КП
	const fetchSpecialOffers = async () => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/offer/list`)
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

	// Получаем список кранов для каталога
	const fetchCatalog = async () => {
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/catalog/list`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data)
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
		})
	}

	useEffect(() => {
		getUserData().then(userData => {
			setManagerData(userData) // Устанавливаем данные менеджера
			setClientCount(userData.client_id.length) // Записываем кол-во клиентов

			setLoading(false)
		})

		fetchNews().then(news => setNews(news)) // Получаем список новостей
		fetchSpecialOffers().then(offers => setOffers(offers)) // Получаем список специальных предложений
		fetchCatalog().then(catalog => setCatalogCount(catalog.length)) // Получаем количество кранов в каталоге

	}, []);

	React.useEffect(() => {

		// Подписываемся на событие focus экрана
		const unsubscribe = navigation.addListener('focus', () => {
			getUserData().then(userData => {
				setManagerData(userData) // Устанавливаем данные менеджера
				setClientCount(userData.client_id.length) // Записываем кол-во клиентов

				fetchNotifications(userData.manager_id).then(notifications => {
					getUnreadNotifications(notifications)
				})

				// Устанавливаем кол-во уведомлений в иконку
				fetchNotifications(userData.manager_id)
					.then(notifications => {
						const unreadNotifications = notifications.filter(function (el) {
							return el.status == 1;
						});

						console.log(`[INFO] Кол-во уведомлений: ${unreadNotifications.length}`);

						PushNotification.setApplicationIconBadgeNumber(unreadNotifications.length)
					})
					.catch(error => console.error(error))

				setLoading(false)
			})
		});

		return () => {
			unsubscribe;
		};

	}, [navigation])

	// React.useEffect(() => {

	// 	// Подписываемся на событие focus экрана
	// 	const unsubscribe = navigation.addListener('focus', () => {
	// 		getUserData().then((userData) => {
	// 			fetchNotifications(userData.contact_id).then((notifications) => {
	// 				const unreadNotifications = notifications.filter(function (el) {
	// 					return el.status == 1;
	// 				});
	// 				setNotificationCount(unreadNotifications.length)
	// 				// console.log('количество уведомлений', unreadNotifications.length);
	// 			})
	// 		})
	// 	});

	// 	return () => {
	// 		unsubscribe;
	// 	};

	// }, [navigation])

	return (
		<SafeAreaView style={styles.container}>
			{isLoading ?
				<Spinner visible={isLoading} />
				: (
					<ScrollView>

						<View style={styles.yellowTop}>
							<Logo />
							<View style={{ display: 'flex', flexDirection: 'row' }}>
								<TouchableOpacity style={{ position: 'relative', marginRight: 20 }} onPress={() => navigation.navigate('NotificationListScreen')}>
									<NotificationIcon count={unreadNotifications.length} />
								</TouchableOpacity>
							</View>
						</View>

						{/* Карточка организации */}
						<View style={styles.companyCardWrapper}>
							<View style={styles.companyCardHalfBg}></View>

							{/* Меню */}
							<View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginHorizontal: 20 }}>

								<TouchableOpacity style={styles.homeNavItem} onPress={() => navigation.navigate('TabNavigator', { screen: 'Клиенты' })}>
									<View style={styles.homeNavItemIcon}>
										<HomeNavObjectsIcon />
										<View style={[styles.homeNavItemBadge, { backgroundColor: '#DF5649' }]}>
											<Text style={styles.homeNavItemBadgeNumber}>{clientCount}</Text>
										</View>
									</View>
									<Text style={styles.homeNavItemTitle}>Мои клиенты</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.homeNavItem} onPress={() => navigation.navigate('CommercialOfferListScreen')}>
									<View style={styles.homeNavItemIcon}>
										<HomeNavKPIcon />
									</View>
									<Text style={styles.homeNavItemTitle}>Запросы КП</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeNavItem}
									onPress={() => navigation.navigate('TabNavigator', { screen: 'Каталог' })}
								>
									<View style={styles.homeNavItemIcon}>
										<HomeNavCatalogIcon />
										<View style={[styles.homeNavItemBadge, { backgroundColor: '#FA7A25' }]}>
											<Text style={styles.homeNavItemBadgeNumber}>{catalogCount}</Text>
										</View>
									</View>
									<Text style={styles.homeNavItemTitle}>Каталог</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Новости */}
						<View style={{ marginTop: 30 }}>
							<View
								style={styles.newsContainer}
							>
								{news.slice(0, 2).map((item, key) => {
									return (
										<NewsListItem navigation={navigation} item={item} index={key} key={key} />
									)
								})}
							</View>
						</View>

						{/* Спецпредложение */}
						{offers.length ?
							(
								<TouchableOpacity style={styles.specialOffer} onPress={() => navigation.navigate('SpecialOfferDetailsScreen', { item: offers[0] })}>
									<Text style={styles.specialOfferCaption}>спецпредложение</Text>
									<Text style={styles.specialOfferText}>{offers[0].title}</Text>
								</TouchableOpacity>
							)
							: <></>
						}

						{/* Кнопки */}
						<View style={{ marginBottom: 20 }}>
							<View style={{ marginBottom: 10, display: 'flex', alignItems: 'center', width: '100%' }}>
								<Button backgroundColor='#54C2EF' color='#fff' onPress={() => navigation.navigate('NewsListScreen')}>все новости</Button>
							</View>
							<View style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
								<Button backgroundColor='#DF5649' color='#fff' onPress={() => navigation.navigate('SpecialOfferListScreen')}>все спецпредложения</Button>
							</View>
						</View>

					</ScrollView>
				)
			}

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// borderColor: 'green',
		// borderWidth: 1
	},

	yellowTop: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		paddingBottom: 24,
		backgroundColor: '#FED000',

		// borderColor: 'red',
		// borderWidth: 1
	},

	newsGridView: {
		marginTop: 10
	},

	homeNavItem: {
		width: 75,
	},

	homeNavItemIcon: {
		// position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 75,
		height: 75,
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
		marginBottom: 6,
	},
	homeNavItemIconImage: {
		width: 35,
		height: 35,
		resizeMode: 'contain'
	},
	homeNavItemTitle: {
		fontSize: 9,
		fontWeight: '400',
		lineHeight: 10,
		textAlign: 'center'
	},
	homeNavItemBadge: {
		position: 'absolute',
		bottom: 10,
		width: 18,
		height: 18,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#DF5649',
		borderRadius: 9,
		overflow: 'hidden',
		borderColor: '#fff',
		borderWidth: 2,
	},
	homeNavItemBadgeNumber: {
		color: '#fff',
		fontSize: 8,
		fontWeight: '400',
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
		marginHorizontal: 20,
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

	companyName: {
		color: '#747474',
		fontSize: 16,
		fontWeight: '300',
		lineHeight: 22,
		marginBottom: 15
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

	specialOffer: {
		flex: 1,
		backgroundColor: '#DF5649',
		padding: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		marginBottom: 20,
		marginHorizontal: 20
	},
	specialOfferCaption: {
		color: '#ffffff',
		marginBottom: 10
	},
	specialOfferText: {
		color: '#ffffff'
	},
	spinnerContainer: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		// position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},

	newsContainer: {
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'red',
		// paddingHorizontal: 20
	},

	// Точка для иконки нотификаций
	hasNotificationsDot: {
		width: 7,
		height: 7,
		borderRadius: 10,
		backgroundColor: 'red',
		position: 'absolute',
		top: 0,
		right: 0,
	}

});

export default HomeScreen;