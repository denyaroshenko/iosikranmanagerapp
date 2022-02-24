import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import { config } from '../config'

const { API_URL } = config
const win = Dimensions.get('window');
const ratio = win.width / 541; // 541 is actual image width

const ClientItem = ({ navigation, item }) => {

	return (
		<TouchableOpacity style={styles.clientCard} onPress={() => navigation.navigate('ObjectsScreen', {
			client_id: item.client_id,
		})}>
			<Text style={styles.clientName}>{item.data.company.company}</Text>
		</TouchableOpacity>
	);
}

ClientItem.defaultProps = {
	key: 'Untitled',
};

const styles = StyleSheet.create({
	clientCard: {
		paddingVertical: 25,
		paddingHorizontal: 20,
		marginHorizontal: 15,
		// marginTop: 10,
		marginBottom: 10,
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

	clientName: {
		fontSize: 15,
		fontWeight: '600',
		lineHeight: 21,
		color: '#000000',
	},
});

export default ClientItem;