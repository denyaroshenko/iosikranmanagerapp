import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	FlatList,
	ScrollView
} from 'react-native';

import { SpecialOfferListItem } from '../components';

import { config } from '../config';

const { API_URL } = config

const SpecialOfferListScreen = ({ navigation }) => {

	const [isLoading, setLoading] = useState(true);
	let [offers, setOffers] = useState([]) // Создаем переменную состояния для данных

	useEffect(() => {
		fetch(API_URL + '/offer/list')
			.then((response) => response.json())
			.then((json) => setOffers(json.data))
			.catch((error) => console.error(error))
			.finally(() => setLoading(false));
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Спецпредложения',
		});
	}, [navigation, 'Спецпредложения']);

	return (
		<View style={styles.screen}>
			<ScrollView>
				<SafeAreaView style={{ marginTop: 10 }}>

					<FlatList
						scrollEnabled={false}
						data={offers}
						renderItem={({ item, index }) => (
							<SpecialOfferListItem navigation={navigation} item={item} index={index} />
						)}
						keyExtractor={(item, index) => item.id}
					/>

				</SafeAreaView>
			</ScrollView>

		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	container: {
		flex: 1,
		margin: 20,
	},
});

export default SpecialOfferListScreen;