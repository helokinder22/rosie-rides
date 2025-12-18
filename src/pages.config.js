import Home from './pages/Home';
import ManageDestinations from './pages/ManageDestinations';
import EmergencyContacts from './pages/EmergencyContacts';
import Subscription from './pages/Subscription';
import Disclaimer from './pages/Disclaimer';
import TripHistory from './pages/TripHistory';
import About from './pages/About';
import AddToHomescreen from './pages/AddToHomescreen';


export const PAGES = {
    "Home": Home,
    "ManageDestinations": ManageDestinations,
    "EmergencyContacts": EmergencyContacts,
    "Subscription": Subscription,
    "Disclaimer": Disclaimer,
    "TripHistory": TripHistory,
    "About": About,
    "AddToHomescreen": AddToHomescreen,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};