import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import PageIFPR from "../pages/PageIFPR";
import PageEstatica from "../pages/PageEstatica";
import PageReactNative from "../pages/PageReactNative";
import PagePerfil from "../pages/PagePerfil";

const Drawer = createDrawerNavigator();

function DrawerNavigator(drawerProps) {

    function DrawerContent(props) {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Sair"
                    icon={() => <MaterialIcons name="logout" size={24} color="red" />}
                    onPress={() => props.deslogar()}
                />
            </DrawerContentScrollView>
        )
    }

    return (
        <Drawer.Navigator
            drawerContent={(navProps) =>
                <DrawerContent
                    {...navProps}
                    deslogar={() => drawerProps.deslogar()}
                />}
        >
            <Drawer.Screen name="Início" component={StackNavigator}
                options={{
                    drawerIcon: () => <Ionicons name="home" size={24} color="blue" />
                }} />

            {/* WebViews seguras */}
            <Drawer.Screen name="IFPR" component={PageIFPR}
                options={{
                    drawerIcon: () => <Ionicons name="school-outline" size={24} color="blue" />
                }} />
            <Drawer.Screen name="Página estática" component={PageEstatica}
                options={{
                    drawerIcon: () => <Ionicons name="document-text-outline" size={24} color="blue" />
                }} />
            <Drawer.Screen name="React Native" component={PageReactNative}
                options={{
                    drawerIcon: () => <Ionicons name="logo-react" size={24} color="blue" />
                }} />

            <Drawer.Screen
                name="Perfil"
                component={PagePerfil}
                options={{
                    title: "Meu Perfil",
                    drawerLabel: "Meu Perfil",
                    drawerIcon: () => <Ionicons name="person-circle-outline" size={24} color="blue" />
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;