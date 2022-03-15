import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import * as RootNavigation from '../../helpers/RootNavigation';
import { config } from '../../config';
import { Button } from '../../components';
import CheckSuccessIcon from '../../assets/Icons/CheckSuccessIcon';

const OrderPersonEditForm = ({ route }) => {

	const { id, person, specialists } = route.params.item

	const [loading, setLoading] = useState(false)
	const [selectedPersonName, setSelectedPersonName] = useState(null)
	const [selectedPersonID, setSelectedPersonID] = useState(null)

	const { API_URL } = config

	// Изменение ответственного на заявку
	const handlerOrderPersonEditSubmit = async (order_id, person_name, person_id_1c) => {
		setLoading(true)

		const message = {
			order_id: order_id,
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

	return (
		<View>
			{/* DEBUG */}
			{/* <Text>Person Current: {person}</Text>
			<Text>selectedPersonID: {selectedPersonID}</Text>
			<Text>selectedPersonName: {selectedPersonName}</Text> */}


			<Spinner visible={loading} />

			<View style={styles.radioList}>
				{JSON.parse(specialists).map((specialist, key) => {
					const personName = `${specialist.last_name} ${specialist.first_name} ${specialist.middle_name}`
					const personID = specialist.id_1c

					return (
						<View key={key}>
							{selectedPersonID == personID ?
								<TouchableOpacity style={styles.radio}>
									<Text style={styles.radioLabel}>{personName}</Text>
									<CheckSuccessIcon />
								</TouchableOpacity>
								:
								<TouchableOpacity onPress={() => {
									setSelectedPersonID(personID)
									setSelectedPersonName(personName)
								}} style={styles.radio}>
									<Text style={styles.radioLabel}>{personName}</Text>
								</TouchableOpacity>
							}

							{JSON.parse(specialists).length !== key + 1 ? <View style={styles.radioDivider} /> : null}
						</View>
					)
				})}
			</View>

			<View style={styles.buttonArea}>
				<Button
					backgroundColor='#FED400'
					color="#000"
					onPress={() => { handlerOrderPersonEditSubmit(id, selectedPersonName, selectedPersonID) }}
				>Изменить</Button>
			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	radio: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 15,
		paddingHorizontal: 20,
	},

	radioDivider: {
		display: 'flex',
		backgroundColor: '#000',
		height: 1,
		backgroundColor: '#ededed'
	},

	radioList: {
		marginHorizontal: 20,
		marginBottom: 15,
		// paddingVertical: 10,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
	},

	radioLabel: {
		fontWeight: '400',
		fontSize: 16,
		lineHeight: 24,
		color: 'rgba(117, 117, 117, 0.87)'
	},

	buttonArea: {
		display: 'flex',
		alignItems: 'center',
		padding: 20
	},
});

export default OrderPersonEditForm;