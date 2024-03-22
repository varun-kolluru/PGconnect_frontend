import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './Screens/Common/StartScreen';
import LoginScreen from './Screens/Authentication/LoginScreen';
import SignupScreen from './Screens/Authentication/SignupScreen';
import ForgotpassScreen from './Screens/Authentication/ForgotpassScreen';

import WelcomeScreen from "./Screens/Common/WelcomeScreen";
import GuestinfoScreen from './Screens/Owner/GuestinfoScreen';
import GuestaddScreen from './Screens/Owner/GuestaddScreen';
import OwnerpgScreen from "./Screens/Owner/OwnerpgScreen";
import CreatepgScreen from "./Screens/Owner/CreatepgScreen";
import OwnerTabScreen from './Screens/Owner/OwnerTabScreen';
import RoomScreen from './Screens/Owner/RoomScreen';

import GuestpgScreen from "./Screens/Guest/GuestpgScreen";
import GuestTabScreen from './Screens/Guest/GuestTabScreen';
import GuestpayconfScreen from './Screens/Guest/GuestpayconfScreen';
import PgsearchScreen from './Screens/Guest/PgsearchScreen';
import PginfoScreen from './Screens/Guest/PginfoScreen';
import PaymentHistoryScreen from './Screens/Common/PaymentHistoryScreen';

import ChatRoomScreen from './Screens/Common/ChatRoomScreen';
import GrpChatScreen from './Screens/Common/GrpChatScreen';
import GrpmembersScreen from './Screens/Common/GrpmembersScreen';

import { AppProvider } from './Screens/AppContext';


const Stack = createNativeStackNavigator();

function App() {

  return (
    <AppProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotpassScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        <Stack.Screen name="My PGs" component={OwnerpgScreen} />
        <Stack.Screen name="Create PG" component={CreatepgScreen} />  
        <Stack.Screen name="Owner Tab" component={OwnerTabScreen} />
        <Stack.Screen name="Create Guest" component={GuestaddScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
        <Stack.Screen name="Guest Info" component={GuestinfoScreen} />
        <Stack.Screen name="Payment History" component={PaymentHistoryScreen}/>

        <Stack.Screen name="Guest" component={GuestpgScreen} />
        <Stack.Screen name="Guest Tab" component={GuestTabScreen} />
        <Stack.Screen name="Guest payconf" component={GuestpayconfScreen} />
        <Stack.Screen name="PG Search" component={PgsearchScreen} />
        <Stack.Screen name="PG Info" component={PginfoScreen}/>

        <Stack.Screen name="Chat Room" component={ChatRoomScreen} />
        <Stack.Screen name="Grp Chat Room" component={GrpChatScreen} />
        <Stack.Screen name="Grp Members" component={GrpmembersScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
    </AppProvider>
  );
}

export default App;