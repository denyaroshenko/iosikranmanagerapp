import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView
} from 'react-native';

import { config } from '../config'

const NotificationDetailsScreen = ({ route, navigation }) => {

	const { API_URL } = config
	const { id, title } = route.params.item;

	const [isLoading, setLoading] = useState(true);

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

	const markAsRead = (manager_id, notification_id) => {
		const isManager = true
		// const manager_id = null
		// const notification_id = id
		const contact_id = null

		console.log(`${API_URL}/notification/read?isManager=${isManager}&manager_id=${manager_id}&notification_id=${notification_id}&contact_id=${contact_id}`);

		fetch(`${API_URL}/notification/read?isManager=${isManager}&manager_id=${manager_id}&notification_id=${notification_id}&contact_id=${contact_id}`)
			.then((response) => response.json())
			.then((json) => {
				const result = json
				console.log('Уведомление отмечено как прочитанное', result);
			})
			.catch((error) => console.error(error))
		// .finally(() => setLoading(false));
	}

	useEffect(() => {
		getUserData().then(managerData => {
			console.log(managerData);
			// markAsRead(managerData.manager_id, id)
		})

	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': title,
		});
	}, [navigation, title]);

	return (
		<ScrollView style={styles.screen}>
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>{title}</Text>
			</SafeAreaView>
		</ScrollView>
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
		margin: 20,
	},

	title: {
		color: '#000',
		fontSize: 18,
		fontWeight: '500',
		marginBottom: 15
	},
});

export default NotificationDetailsScreen;