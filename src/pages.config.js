import Home from './pages/Home';
import ManageDestinations from './pages/ManageDestinations';
import EmergencyContacts from './pages/EmergencyContacts';
import Subscription from './pages/Subscription';
import Disclaimer from './pages/Disclaimer';
import TripHistory from './pages/TripHistory';
import About from './pages/About';


export const PAGES = {
    "Home": Home,
    "ManageDestinations": ManageDestinations,
    "EmergencyContacts": EmergencyContacts,
    "Subscription": Subscription,
    "Disclaimer": Disclaimer,
    "TripHistory": TripHistory,
    "About": About,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};