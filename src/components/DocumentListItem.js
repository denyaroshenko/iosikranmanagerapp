import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

import CheckSuccessIcon from '../assets/Icons/CheckSuccessIcon';
import DangerIcon from '../assets/Icons/DangerIcon';

const DocumentListItem = ({ navigation, item }) => {

	const { icon, name, typeDescription, url } = item;

	function Icon(icon) {
		if (typeDescription !== 'Неоплаченные счета') {
			return <CheckSuccessIcon style={styles.icon} />;
		} else {
			return <DangerIcon style={styles.icon} />;
		}
	}

	return (
		<TouchableOpacity
			style={styles.item}
			onPress={() => navigation.navigate('PDFScreen', { pdf: item })}
		>
			<Icon icon={icon} />
			<View style={styles.details}>
				<Text style={styles.name}>{name}</Text>
			</View>
		</TouchableOpacity >
	);
}

const styles = StyleSheet.create({
	item: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 18,
		marginHorizontal: 15,
		marginTop: 5,
		marginBottom: 5,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 2,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 8,
	},

	icon: {
		marginRight: 20
	},
	
	details: {
		flex: 1,
		flexGrow: 1
	},

	name: {
		fontSize: 15,
		lineHeight: 18,
		display: 'flex',
		alignItems: 'center',
		color: '#000',
		marginBottom: 5
	},

});

export default DocumentListItem;