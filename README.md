# myProject
CoffiDa Mobile App Project...

All end points have been completed, the get user informaition request is spread out over many different pages - each using different aspects of it, for example:
Feed Page uses favourite_locations, this is just a few examples. 
Profile Page > MyReviews uses reviews
ReviewPage used liked_reviews
these are spread across the app. 

Style Guide: Airbnb 
I followed the style guide through the use of ESLint, managed to get my total errors from 2000 ish.
One of the biggest errors I came across was the PropTypes, with AirBnb, 
rather than using this.props.navigation
we would have:

const { navigation } = this.props
and then a prop type validation at the bottom of each page like the following: 
PAGENAME.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

It also involved using camelCase, wherever possible, 

If the locations isn't working for you, I have found it works in some emulators and not others, just make sure its turned on in settings. The library we used does seem to be working, however it can be temperamental, so if it does not work, go into settings turn on location services for the app to 'Ask Each Time' and then open the app, accept location, and then reload again - this happens sometimes and not others, so if it doesnt work there is the fix! 

Dark Mode Does Work: 
It was being slow in my screen cast due to recording at the same time, it works by testing the Async value of dark mode for true or false, whenever a page loads
and then sets the stylesheet dark / light accordingly. Default is light and you can change it in the settings page. This was a get around, as i had to code it myself from scratch as I did not use functional components, therefore I could not use hooks. 

There is also a button in the settings page that will close the app, this is because sometimes when working with the emulator, I couldn't click the home or back buttons to exit the app. 
