import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SectionList,
	SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { NotificationListItem, Button } from '../components';
import { config } from '../config'
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const NotificationListScreen = ({ navigation }) => {
	const { API_URL } = config

	const [isLoading, setLoading] = useState(false);
	const [managerData, setManagerData] = useState(null)
	const [sections, setSections] = useState([])
	const [notifications, setNotifications] = useState([])
	const [unreadNotifications, setUnreadNotifications] = useState([])
	const [showReadAllButton, setShowReadAllButton] = useState(false)

	// Устанавливаем собственный заголовок экрана
	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Уведомления',
		});
	}, [navigation, 'Уведомления']);

	// Получение данных пользователя
	const getManagerData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('userData')
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
			console.log('Ошибка получения данных пользователя');
		}
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

	// Формируем список с заголовками
	const getNotificationSections = async (notifications) => {
		let notificationSections = []
		let notifications_status_1 = []
		let notifications_status_2 = []

		if (notifications) {

			// Фильтруем уведомления со статусом "Новые"
			notifications_status_1 = notifications.filter(function (el) {
				return el.status == 1;
			});

			// Фильтруем уведомления со статусом "Прочитано"
			notifications_status_2 = notifications.filter(function (el) {
				return el.status == 2;
			});

			if (notifications_status_1.length) {
				notificationSections.push({
					title: `Новые`,
					data: notifications_status_1,
				})

				setShowReadAllButton(true) // Показываем кнопку "Прочитать все"
			}

			if (notifications_status_2.length) {
				notificationSections.push({
					title: 'Прочитанные',
					data: notifications_status_2,
				})
			}
		}

		// console.log("sections", notificationSections);
		setSections(notificationSections)
	}

	// Получаем список уведомлений
	const fetchNotifications = async (contactID) => {
		setLoading(true)

		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/notificationsForManager/?manager_id=${contactID}`)
				.then((response) => response.json())
				.then((json) => {
					resolve(json.data)
				})
				.catch((error) => {
					console.error(error)
					reject(error)
				})
				.finally(() => setLoading(false))
		});
	}

	// Отмечаем одно уведомление как прочитанное
	const markAsRead = (manager_id, id) => {
		const isManager = true
		// const manager_id = null
		const notification_id = id
		const contact_id = null

		fetch(`${API_URL}/notification/read?isManager=${isManager}&manager_id=${manager_id}&notification_id=${notification_id}&contact_id=${contact_id}`)
			.then((response) => response.json())
			.then((json) => {
				const result = json
				console.log('READ', result)
			})
			.catch((error) => console.error(error))
		// .finally(() => setLoading(false));
	}

	// Отмечаем все уведомления как прочитанные
	const readAll = async (managerID) => {
		setLoading(true)

		const isManager = true
		const manager_id = managerID
		const contact_id = null

		fetch(`${API_URL}/notification/read_all?contact_id=${contact_id}&isManager=${isManager}&manager_id=${manager_id}`)
			.then((response) => response.json())
			.then((json) => {
				// const result = json
				// console.log('READ', result)

				// Обновляем количество уведомлений в иконке
				getManagerData()
					.then(userData => {
						fetchNotifications(userData.manager_id)
							.then(notifications => {
								const unreadNotifications = notifications.filter(function (el) {
									return el.status == 1;
								});

								console.log(`[INFO] Кол-во уведомлений: ${unreadNotifications.length}`);

								PushNotification.setApplicationIconBadgeNumber(unreadNotifications.length)
							})
							.catch(error => console.error(error))
					})
					.catch(error => console.error(error))

				getManagerData().then((userData) => {
					setManagerData(userData)
					fetchNotifications(managerData.manager_id).then((notifications) => {
						// console.log('notifications', notifications);
						setNotifications(notifications)
						getNotificationSections(notifications)
						getUnreadNotifications(notifications)
					})
				})

				// setSections([]) // Скрываем список секций
				// setNotifications([]) // Очищаем список уведомлений
				setShowReadAllButton(false)
			})
			.catch((error) => console.error(error))
			.finally(() => setLoading(false));
	}

	React.useEffect(() => {

		// Подписываемся на событие focus экрана
		const unsubscribe = navigation.addListener('focus', () => {
			console.log('[INFO] Открыли экран "Список уведомений"')

			getManagerData().then((managerData) => {
				setManagerData(managerData)
				fetchNotifications(managerData.manager_id).then((notifications) => {
					// console.log('notifications', notifications);
					setNotifications(notifications)
					getNotificationSections(notifications)
					getUnreadNotifications(notifications)
				})
			})
		});

		return () => {
			unsubscribe;
		};

	}, [navigation])

	return (
		<View>
			<Spinner visible={isLoading} />

			<SafeAreaView style={styles.container}>

				{!notifications.length && !isLoading ? <Text style={styles.emptyList}>Нет уведомлений</Text> :
					<View>
						{!showReadAllButton ? <Text></Text> :
							<View style={{ display: 'flex', alignItems: 'center', marginVertical: 20 }}>
								<Button onPress={() => readAll(managerData.id)}>Отметить все как прочитанные</Button>
							</View>
						}
					</View>
				}

				<SectionList
					sections={sections}
					keyExtractor={(item, index) => item.id}
					renderItem={({ item }) =>
						<NotificationListItem
							navigation={navigation}
							item={item}
						/>
					}
					renderSectionHeader={({ section: { title } }) => (
						<Text style={styles.sectionHeader}>{title}</Text>
					)}
				/>

			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		// marginHorizontal: 16
	},

	gridView: {
		paddingTop: 20,
	},

	rowStyle: {
		flex: 1,
	},

	sectionHeader: {
		color: '#000',
		fontWeight: '300',
		fontSize: 20,
		lineHeight: 23,
		display: 'flex',
		alignContent: 'center',
		paddingLeft: 15,
		marginTop: 15,
		marginBottom: 10,
	},

	// Позиционирование модальног окна
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0,0,0,0.5)'
	},

	emptyList: {
		marginTop: 40,
		marginHorizontal: 15,
		textAlign: 'center'
	}
});

export default NotificationListScreen;