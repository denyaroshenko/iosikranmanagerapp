import React, { useState } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
} from 'react-native';

import PDFView from 'react-native-view-pdf';
import Spinner from 'react-native-loading-spinner-overlay';

const AboutAppScreen = ({ navigation }) => {

	React.useLayoutEffect(() => {
		navigation.setOptions({
			'title': 'О приложении',
		});
	}, [navigation, 'О приложении']);

	const [loading, setLoading] = useState(true)

	return (
		<View style={styles.container}>

			<Spinner visible={loading} />

			<PDFView
				fadeInDuration={250.0}
				style={styles.pdf}
				resource={'http://193.107.237.207/files/1_pamyatka.pdf'}
				resourceType='url'
				onLoad={() => setLoading(false)}
				onError={() => console.log('Cannot render PDF', error)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	pdf: {
		flex: 1,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	}
});

export default AboutAppScreen;