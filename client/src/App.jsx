import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Profile from './pages/Profile'
import Restaurants from './pages/Restaurants'
import Orphanages from './pages/Orphanages'
import AddOrphanage from './pages/admin/AddOrphanage'
import SingleRestaurant from './pages/user/SingleRestaurant'
import Feedbacks from './pages/admin/Feedbacks'
import AddRequest from './pages/orphanage/AddRequest'
import ViewRequests from './pages/orphanage/ViewRequests'
import DonationsRestaurant from './pages/restaurant/donationsRestaurant'
import RequestsFromOrp from './pages/restaurant/RequestsFromOrp'
import DonationHistory from './pages/user/DonationHistory'
import TakeDonation from './pages/orphanage/TakeDonation'
import UpdateOrphanage from './pages/orphanage/UpdateOrphanage'
import UpdateUser from './pages/user/UpdateUser'
import UpdateRest from './pages/restaurant/UpdateRest'


function App() {
 

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration/>} />
        <Route path="/profile" element={<Profile/>} />

        {/* admin */}
        <Route path="/feedback" element={<Feedbacks/>} />
        <Route path="/restaurants" element={<Restaurants/>} />
        <Route path="/orphanages" element={<Orphanages/>} />
        <Route path="/add-orphanages" element={<AddOrphanage/>} />
        <Route path="/add-request" element={<AddRequest/>} />
        <Route path="/view-requests" element={<ViewRequests/>} />

        <Route path="/single-rest/:id" element={<SingleRestaurant/>} />  
        <Route path="/view-donations-restarant" element={<DonationsRestaurant/>} />  
        <Route path="/view-request-restaurant" element={<RequestsFromOrp/>} />  
        <Route path="/view-donation-history" element={<DonationHistory/>} />  
        <Route path="/take-donation" element={<TakeDonation/>} />  
        <Route path="/update-orphanage" element={<UpdateOrphanage/>} />  
        <Route path="/update-user" element={<UpdateUser/>} />  
        <Route path="/update-rest" element={<UpdateRest/>} />  
      
        </Routes>
    </BrowserRouter>
   
  )
}

export default App
