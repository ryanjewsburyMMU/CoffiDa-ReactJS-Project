/* eslint-disable */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // Global Styles 
    mainColour:{
        color: '#eaca97'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#eaca97',
    },
    mainHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainFooter: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingVertical: 30 //THIOS CAN BE CHANGED TO ANY VALUE IF THERE ARE ANY MISTAKES ORIG 50 
    },
    mainTitle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 30,
        fontWeight: "bold",
    },
    mainButton: {
        alignItems: "center",
        width: "100%",
        height: 40,
        backgroundColor: "#eaca97",
        padding: 10,
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    mainButtonWhite: {
        alignItems: "center",
        width: "100%",
        height: 40,
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#eaca97',
        borderWidth: 1,
    },
    textCenterBlack: {
        textAlign: 'center',
        color: '#000'
    },
    textCenterWhite: {
        textAlign: 'center',
        color: '#fff'
    },
    textCenterGrey: {
        textAlign: 'center',
        color: 'gray'
    },
    flexRow: {
        flexDirection: 'row'
    },
    flexOne: {
        flex: 1
    },
    flexTwo: {
        flex: 2,
      },
    flexEnd: {
        flex: 1,
        alignItems: 'flex-end'
    },
    containerTitle: {
        display: 'flex', // Maybe remove flex?
        color: '#eaca97',
        fontSize: 25,
        fontWeight: "bold",
    },
    subTitle: {
        textAlign: 'center',
        display: 'flex', // Maybe remove flex?
        color: '#eaca97',
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10
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
    starContainer: {
        width: '20%'
    },
    starColour: {
        color: "#eaca97"
      },
    faveColour:{
        color: "#eaca97" 
      },
    regularTextBlack:{
        color:'#000'
    },
    regularTextWhite:{
        color:'#fff'
    },

    gapTop:{
        marginTop:20
    },
    gapBottom:{
        marginBottom:20
    },


    // Screen Specific Styles


    //Login Screen
    loginContainer:{
        flex: 1,
		backgroundColor: '#eaca97',
    },
    loginHeader:{
        flex: 1,
		justifyContent: 'flex-end',
		marginLeft: 20,
		marginBottom: 10
    },
    loginFooter:{
        flex: 2,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
    },
    welcomeTitle:{
        color: '#fff',
        fontSize: 30,
        fontWeight: "bold"
    },
    loginTitle:{
        color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
    },
    loginInput:{
        marginBottom:10,
		borderColor:'#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
    },

    // Sign Up
    signupTitle:{
        color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
    },
    signupInput:{
        marginBottom:10,
		borderColor:'#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
    },

    // Search Screen
    searchBar: {
        flex: 3,
        height: 40,
        marginBottom: 10,
        borderColor: '#eaca97',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    searchButton: {
        flex: 1,
        height: 40,
        backgroundColor: "#eaca97",
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    searchIcon: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    filterRow: {
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    alignCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Feed Page//

    feedContainer: {
        alignItems: "center",
        width: "100%",
        height: 40,
        padding: 10,
        marginTop: 20,
        marginBottom: 70,
    },
    locationTitle: {
        display: 'flex',
        color: '#eaca97',
        fontSize: 20,
        fontWeight: "bold",
    },

    //Review Page
    likeButtonText: {
        textAlign: 'center',
        color: '#fff',
    },

    // Camera Page
    cameraHeader: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#eaca97',
        padding: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    cameraTitle: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    displayCamera: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    cameraBorder: {
        backgroundColor: 'rgba(234,202,151,0.7)',
        width: '100%',
        textAlign: 'center',
        padding: 10,
        marginTop: 10
    },

    //Profile Page
    detailsTitle:{
        color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center'
    },
    inputDetails:{
        marginBottom:10,
		borderColor:'#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
    },
    deleteReview:{
        alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#650D1B",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderWidth: 1,
        marginTop: 10
    },
    inputBody:{
        marginTop: 10,
        marginBottom: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
    },

    // Fave Page
    deleteFavourite:{
        alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#650D1B",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderWidth: 1,
        marginTop: 20
    },

    profileTitle:{
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
      },

    // Image
    imageDidLoad:{
        width: 192*1.5, height: 108*1.5, marginTop: 20, marginBottom: 20
    },
    imageDidNotLoad:{
        marginTop: 20, marginBottom: 20
    },
    imageCenter:{
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center' 
    },
    // Edit Review
    imageSize:{
        width: 200,
        height: 180,
        marginTop: 20
    },

    // View Image page
    viewImageSize:{
        width: '100%',
        height: '90%',
        marginTop: 20 
    },

    // Tab Bar
    tabBar:{
        color: '#fff'
    },

    //Slider 
    sliderStyle:{
        width: 150,
         height: 40 
    },

    pickerStyle:{
        height: 50,
        width: '100%',
        color: '#000'
    },

    textWhite:{
        color: '#fff'
    }

})