import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	FlatList,
	Text
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { config } from '../config';
import { CatalogItem } from '../components';
import store from '../store/store'

const CatalogListScreen = ({ navigation }) => {

	const { API_URL } = config

	const state = store.getState();
	const [isLoading, setLoading] = useState(true);
	let [catalog, setCatalog] = useState([]) // Создаем переменную состояния для данных

	// Получаем каталог кранов
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
		});
	}

	useEffect(() => {
		// Получаем список кранов для каталога
		fetchCatalog()
			.then(catalog => setCatalog(catalog))
			.catch(error => console.error('Ошибка получения каталога', error))
	}, []);

	React.useEffect(() => {

		// Подписываемся на событие focus экрана
		const unsubscribe = navigation.addListener('focus', () => {
			console.log('[INFO] Открыли экран "Каталог"')

			setLoading(true)

			// Получаем список кранов для каталога
			fetchCatalog()
				.then(catalog => setCatalog(catalog))
				.catch(error => console.error('Ошибка получения каталога', error))
				.finally(() => setLoading(false))
		});

		return () => {
			unsubscribe;
		};

	}, [navigation])

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Каталог кранов',
		});
	}, [navigation, 'Каталог кранов']);

	return (
		<View>
			{/* <Spinner visible={isLoading} /> */}

			<FlatList
				data={catalog}
				keyExtractor={item => item.id}
				renderItem={({ item }) => <CatalogItem navigation={navigation} item={item} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15
	},

	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
});

export default CatalogListScreen;