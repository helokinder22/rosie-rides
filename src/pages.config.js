import About from './pages/About';
import AddToHomescreen from './pages/AddToHomescreen';
import BusinessInfo from './pages/BusinessInfo';
import Disclaimer from './pages/Disclaimer';
import EmergencyContacts from './pages/EmergencyContacts';
import Home from './pages/Home';
import ManageDestinations from './pages/ManageDestinations';
import ManageSubscription from './pages/ManageSubscription';
import Subscription from './pages/Subscription';
import TripHistory from './pages/TripHistory';


export const PAGES = {
    "About": About,
    "AddToHomescreen": AddToHomescreen,
    "BusinessInfo": BusinessInfo,
    "Disclaimer": Disclaimer,
    "EmergencyContacts": EmergencyContacts,
    "Home": Home,
    "ManageDestinations": ManageDestinations,
    "ManageSubscription": ManageSubscription,
    "Subscription": Subscription,
    "TripHistory": TripHistory,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};