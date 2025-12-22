import AddToHomescreen from './pages/AddToHomescreen';
import BusinessInfo from './pages/BusinessInfo';
import Disclaimer from './pages/Disclaimer';
import EmergencyContacts from './pages/EmergencyContacts';
import ManageSubscription from './pages/ManageSubscription';
import TripHistory from './pages/TripHistory';
import About from './pages/About';
import Home from './pages/Home';
import ManageDestinations from './pages/ManageDestinations';
import Subscription from './pages/Subscription';


export const PAGES = {
    "AddToHomescreen": AddToHomescreen,
    "BusinessInfo": BusinessInfo,
    "Disclaimer": Disclaimer,
    "EmergencyContacts": EmergencyContacts,
    "ManageSubscription": ManageSubscription,
    "TripHistory": TripHistory,
    "About": About,
    "Home": Home,
    "ManageDestinations": ManageDestinations,
    "Subscription": Subscription,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};