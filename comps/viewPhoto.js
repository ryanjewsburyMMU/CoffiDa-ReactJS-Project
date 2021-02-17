import 'react-native-gesture-handler'
import React, {Component} from 'react';
import {View, Text, Image, ActivityIndicator, Alert, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';



export default class ViewPhoto extends Component{
    constructor(props){
        super(props)
        this.state = {
            review_id: 0,
            location_id : 0,
            photo: []
        }
    }
    componentDidMount() {
            const route = this.props.route
            const { id, review_id } = route.params;
            this.setState({
				location_id: id ,
                review_id: review_id
			}, () => {
                this.search_results()
			});
        }



	async search_results() {
        const navigation = this.props.navigation
		console.log("Searching the database for your search queires")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.location_id+"/review/"+this.state.review_id+"/photo",
			{
				method: 'get',
				headers: { 'Content-Type': 'image/jpeg', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				if (parseInt(response.status) == 200) {
					return response
				}
				if (parseInt(response.status) == 400) {
					Alert.alert("Incorrect Details (" + response.status + ")", "Please ensure your email and password are correct, if the problem persits please contact our team for more support.")

				}
				if (parseInt(response.status) == 500) {
					console.log("Server Error, Please try again soon.  " + response.status)
					Alert.alert("Connection Error", "We are struggling to connect with you! Please try again or contact our team for further support.")
				}
			})
			.then((responseJson) => {
                console.log(responseJson)
                if(responseJson == undefined){
                    Alert.alert("No Images", "There are no images for this review.", [{ text: "Okay", onPress: (navigation.goBack())}])
                }
                else{
                this.setState({photo: responseJson})
                }
			})
			.catch((error) => {
				console.log(error);
			})
	}
    

    render(){
        const navigation = this.props.navigation
        console.log(this.state.photo)
        if(this.state.photo == ""){
            <View>
                <ActivityIndicator/>
            </View>
        }
        return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.mainTitle}>Photos</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.loginButton} onPress={()=>{navigation.goBack()}}>
                    <Text style={styles.text}>Go Back</Text>
                    </TouchableOpacity>
            <Image
                style={{width: '100%', height:'90%', marginTop: 20}}
                    source={{
                    uri:
                        this.state.photo.url
                    }}
      />

            </View>
        </View>
        )
    }
}const styles = StyleSheet.create({
	reviewRow: {
		flexDirection: 'row'
	},
	starContainer: {
		width: '20%'
	},
	location_town: {
		marginBottom: 10,
		color: 'grey'
	},
	resultContainer: {
		backgroundColor: '#F2F2F2', 
		padding: 20,
		marginBottom: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		elevation: 6,
		width: '100%'
	},
	filterOptionsRow: {
		flexDirection: 'row',
		alignContent: 'flex-start'
	},
	container: {
		flex: 1,
		backgroundColor: '#eaca97',
	},
	guest: {
		marginTop: 10,
		textAlign: 'center'
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footer: {
		flex: 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
	},
	text: {
		textAlign: 'center',
		color: '#fff',
        padding: 10
	},
	title: {
		display: 'flex',
		color: '#eaca97',
		fontSize: 25,
		fontWeight: "bold",
	},
	mainTitle: {
		display: 'flex',
		color: '#fff',
		fontSize: 40,
		fontWeight: "bold",
	},
	loginTitle: {
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	subtitle: {
		marginBottom: 20
	},
	loginButton: {
		textAlign: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 10,
        backgroundColor: '#eaca97',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
	},
	textinput: {
		height: 40,
		flex: 3,
		marginBottom: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})
