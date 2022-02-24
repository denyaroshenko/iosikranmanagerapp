import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView
} from 'react-native';

import * as RootNavigation from '../helpers/RootNavigation'

import Spinner from 'react-native-loading-spinner-overlay';

import { config } from '../config';

const OrderDetailScreen = ({ route, navigation }) => {

	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'Детали запроса',
		});
	}, [navigation, 'Детали запроса']);

	const {
		id,
		date,
		client_id,
		client_1c,
		sender_fio,
		city,
		period,
		period_date,
		crane_name,
		catalog_id,
		crane_count,
		comment,
		client_name
	} = route.params.item

	return (
		<SafeAreaView style={styles.container}>

			<Spinner visible={loading} />

			<ScrollView>

				<View style={[styles.tile, { marginTop: 15, marginBottom: 15 }]}>
					<Text style={styles.name}>Запрос на КП №{id}</Text>

					<View style={styles.table}>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Название клиента</Text>
							<Text style={styles.tableValue}>{client_name}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>ФИО отправившего</Text>
							<Text style={styles.tableValue}>{sender_fio}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Дата запроса</Text>
							<Text style={styles.tableValue}>{date}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Город</Text>
							<Text style={styles.tableValue}>{city}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Срок аренды</Text>
							<Text style={styles.tableValue}>{period}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Дата начала</Text>
							<Text style={styles.tableValue}>{period_date}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Кол-во кранов</Text>
							<Text style={styles.tableValue}>{crane_count}</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={styles.tableLabel}>Название крана</Text>
							<Text style={styles.tableValue}>{crane_name}</Text>
						</View>
					</View>
				</View>

			</ScrollView>

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
		fontWeight: '700',
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
		fontWeight: '700',
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
		marginBottom: 5
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

export default OrderDetailScreen;