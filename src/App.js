import React, { useState, useEffect } from 'react';
import {
	StatusBar,
	View,
	Alert,
	useColorScheme,
	Text,
	SafeAreaView,
	StyleSheet,
	Platform
} from 'react-native';

import 'react-native-gesture-handler';

import AppContainer from "./navigation";
import store from './store/store';
import { Provider } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

// для пушей
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';

// Стили статусбара
// StatusBar.setBackgroundColor('#FED000');
// StatusBar.setBarStyle('dark-content');

import { config } from './config';

async function saveTokenToDatabase(token) {
	// Assume user is already signed in
	const userId = auth().currentUser.uid;

	// Add the token to the users datastore
	await firestore()
		.collection('users')
		.doc(userId)
		.update({
			tokens: firestore.FieldValue.arrayUnion(token),
		});
}

// Отправка пушей на ios
const getToken = () => {
	firebase
		.messaging()
		.getToken(firebase.app().options.messagingSenderId)
		.then(token => {
			// console.log('[DEVICE TOKEN]', token)
		})
		.catch(error => console.log('[ERROR]', error));
};

const registerForRemoteMessages = () => {
	firebase
		.messaging()
		.registerDeviceForRemoteMessages()
		.then(() => {
			console.log('Registered');
			requestPermissions();
		})
		.catch(e => console.log(e));
};

const requestPermissions = () => {
	firebase
		.messaging()
		.requestPermission()
		.then((status) => {
			if (status === 1) {
				console.log('Authorized');
				onMessage();
			} else {
				console.log('Not authorized');
			}
		})
		.catch(e => console.log(e));
};

const onMessage = () => {
	firebase.messaging().onMessage(response => {
		console.log('0000000000000', response);
		showNotification(response.notification);
	});
};

const showNotification = (notification) => {
	console.log('Показываем уведомление', notification);
	console.log(JSON.stringify(notification));

	const getCorrectDate = () => {
		const date = new Date();
		date.setDate(date.getDate() + 1);
		date.setHours(23);
		date.setMinutes(54);
		return date;
	};

	PushNotificationIOS.addNotificationRequest({
		id: new Date().toString(),
		title: notification.title,
		body: notification.body,

		fireDate: getCorrectDate(),
		repeats: true,
		repeatsComponent: {
			hour: true,
			minute: true,
		},
	});
};

getToken();

if (Platform.OS === 'ios') {
	registerForRemoteMessages();
} else {
	onMessage();
}

// Создаем канал для получения пушей (обязательно)
// PushNotification.createChannel(
// 	{
// 		channelId: "channel-id", // (required)
// 		channelName: "Channel for notifications", // (required)
// 		channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
// 		playSound: true, // (optional) default: true
// 		soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
// 		importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
// 		vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
// 	},
// 	// (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
// );

export default function App() {
	const { API_URL } = config

	const [loading, setLoading] = useState(false)
	const [userData, setUserData] = useState(null)
	const [managerData, setManagerData] = useState(null)
	const [notificationCount, setNotificationCount] = useState(0)

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

	// Выводим пуш
	const getPushData = async (remoteMessage) => {
		console.warn('A new FCM message arrived!', JSON.stringify(remoteMessage));

		PushNotification.localNotification({
			channelId: "channel-id", // Обязательно
			title: remoteMessage.notification.title,
			message: remoteMessage.notification.body
		})
	}

	// Получаем токен девайса
	const getToken = async () => {
		const token = await messaging().getToken()
		// console.log('[УСТРОЙСТВО NOTIFICATION TOKEN]', token);

		const data = {
			id: userData.id,
			contact_id: userData.contact_id,
			token: token
		};

		// Формируем строку с параметрами
		let parameters = "";
		for (var key in data) {
			if (parameters != "") {
				parameters += "&";
			}
			parameters += key + "=" + encodeURIComponent(data[key]);
		}

		// console.log('[parameters]', parameters);

		await fetch(`${API_URL}/androidpushtoken/update?${parameters}`, {
			method: 'GET',
		})
			.then((response) => {
				const data = JSON.stringify(response.json())
				// console.log(data)
				// RootNavigation.navigate('OrderCreateSuccessScreen')

				Alert.alert(
					"[DEBUG] Android Push Token",
					"TOKEN: " + token,
					[
						{
							text: "Cancel",
							onPress: () => console.log("Cancel Pressed"),
							style: "cancel"
						},
						{ text: "OK", onPress: () => console.log("OK Pressed") }
					]
				);
			})
		// .finally()
	}

	useEffect(() => {
		getUserData().then(data => {
			setManagerData(data) // Устанавливаем данные менеджера

			fetchNotifications(data.manager_id).then(notifications => {
				const unreadNotifications = notifications.filter(function (el) {
					return el.status == 1;
				});
				setNotificationCount(unreadNotifications.length)
				console.log('количество уведомлений', unreadNotifications.length);
				PushNotification.setApplicationIconBadgeNumber(unreadNotifications.length)
			})

			setLoading(false)
		})
		// getToken() // получаем токен девайса

		// PushNotification.getChannels(function (channel_ids) {
		// console.log('channel_ids', channel_ids); // ['channel_id_1']
		// });
	}, []);

	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? '#red' : '#green',
	};

	const MyStatusBar = ({ backgroundColor, ...props }) => (
		<View style={[styles.statusBar, { backgroundColor }]}>
			<SafeAreaView>
				<StatusBar translucent backgroundColor={backgroundColor} {...props} />
			</SafeAreaView>
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			<MyStatusBar backgroundColor="#FED000" barStyle="dark-content" />
			<Provider store={store}>
				<AppContainer />
			</Provider>
		</View>
	);
}

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	appBar: {
		backgroundColor: '#79B45D',
		height: APPBAR_HEIGHT,
	},
	content: {
		flex: 1,
		backgroundColor: '#33373B',
	},
});