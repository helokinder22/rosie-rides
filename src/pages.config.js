/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AddToHomescreen from './pages/AddToHomescreen';
import BusinessInfo from './pages/BusinessInfo';
import Disclaimer from './pages/Disclaimer';
import EmergencyContacts from './pages/EmergencyContacts';
import Home from './pages/Home';
import ManageDestinations from './pages/ManageDestinations';
import ManageSubscription from './pages/ManageSubscription';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import TripHistory from './pages/TripHistory';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AddToHomescreen": AddToHomescreen,
    "BusinessInfo": BusinessInfo,
    "Disclaimer": Disclaimer,
    "EmergencyContacts": EmergencyContacts,
    "Home": Home,
    "ManageDestinations": ManageDestinations,
    "ManageSubscription": ManageSubscription,
    "Settings": Settings,
    "Subscription": Subscription,
    "TripHistory": TripHistory,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};