import About from './pages/About';
import AddToHomescreen from './pages/AddToHomescreen';
import BusinessInfo from './pages/BusinessInfo';
import Disclaimer from './pages/Disclaimer';
import EmergencyContacts from './pages/EmergencyContacts';
import ManageDestinations from './pages/ManageDestinations';
import ManageSubscription from './pages/ManageSubscription';
import Subscription from './pages/Subscription';
import TripHistory from './pages/TripHistory';
import Home from './pages/Home';


export const PAGES = {
    "About": About,
    "AddToHomescreen": AddToHomescreen,
    "BusinessInfo": BusinessInfo,
    "Disclaimer": Disclaimer,
    "EmergencyContacts": EmergencyContacts,
    "ManageDestinations": ManageDestinations,
    "ManageSubscription": ManageSubscription,
    "Subscription": Subscription,
    "TripHistory": TripHistory,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};