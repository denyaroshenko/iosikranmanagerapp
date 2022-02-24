import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	SafeAreaView,
	ActivityIndicator
} from 'react-native';

import store from '../store/store'
import { config } from '../config'

import { DocumentListItem } from '../components';

const DebtListScreen = ({ navigation, route }) => {

	const client_id = route.params.client_id

	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState([]) // Создаем переменную состояния для данных

	const { API_URL } = config

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Неоплаченные счета',
		});
	}, [navigation, 'Неоплаченные счета']);

	// Получаем список неоплаченных счетов
	const fetchUnpaid = async (clientID) => {
		console.log(`${API_URL}/invoices/unpaid/holding?id=${clientID}`);
		return new Promise((resolve, reject) => {
			fetch(`${API_URL}/invoices/unpaid/holding?id=${clientID}`)
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

	// Получаем данные
	useEffect(() => {
		fetchUnpaid(client_id).then(data => {
			setData(data)
			setLoading(false)
		})
	}, []);

	const renderItem = ({ item }) => {
		const route = item.route

		return (
			<DocumentListItem
				navigation={navigation}
				route={route}
				item={item}
			/>
		);
	};

	return (
		<SafeAreaView style={styles.container}>

			{/* DEBUG */}
			{/* <Text>{client_id}</Text> */}

			{isLoading ? (
				<ActivityIndicator />
			) : (
				<FlatList
					data={data}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					style={styles.flatList}
				/>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	flatList: {
		paddingTop: 10,
	}
});

export default DebtListScreen;