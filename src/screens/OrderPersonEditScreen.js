import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView,
} from 'react-native';

import OrderPersonEditForm from '../containers/order/OrderPersonEditForm';

const OrderPersonEditScreen = ({ navigation, route }) => {

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Изменение статуса',
		});
	}, [navigation, 'Изменение статуса']);

	return (
		<ScrollView style={styles.screen}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

				<SafeAreaView style={styles.container}>
					<Text style={styles.title}>Выберите ответственного</Text>
					<OrderPersonEditForm route={route} />
				</SafeAreaView>

			</KeyboardAvoidingView>
		</ScrollView >
	)
}

const styles = StyleSheet.create({
	screen: {
	},

	container: {
		flex: 1,
		// marginTop: StatusBar.currentHeight || 0,
		marginTop: 15
	},

	title: {
		fontWeight: 'bold',
		fontSize: 18,
		lineHeight: 28,
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		color: '#000',
		marginBottom: 20
	},
});

export default OrderPersonEditScreen;