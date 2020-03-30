// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import MapIcon from "@material-ui/icons/Map";
import VpnKey from "@material-ui/icons/VpnKey";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Maps from "views/Maps/Maps.jsx";
import ShipOwners from "views/Shipowners/Shipowners.jsx";
import DeviceSelect from "views/Device/DeviceSelect.jsx";
import Device from "views/Device/Device.jsx";
import PortForwarding from "views/Vessels/PortForwarding";
import RBACUsers from "../views/RBAC/RBACUsers";
import RBACRole from "../views/RBAC/RBACRole";
import RBACPermission from "../views/RBAC/RBACPermission";
import AdminCompany from "../views/Admin/Company";
import AdminVessels from "../views/Admin/Vessels";
import AdminSubCategory from "../views/Admin/SubCategory";
import AdminVesselsNoonRepArchive from "../views/Admin/NoonReportArchive";
import AdminClients from "../views/Admin/Client";
import Profile from "../views/Profile";
import CoreValues from "../views/Vessels/CoreValues";
import NetworkConfiguration from "../views/Vessels/NetworkConfiguration";
import NetworkPerformance from "../views/Vessels/NetworkPerformance";
import Parameters from "../views/Vessels/Parameters";
import Failover from "../views/Vessels/Failover";
import RemoteConsole from "../views/Vessels/RemoteConsole";
import RemoteConsoleResult from "../views/Vessels/RemoteConsoleResult";
import AlarmValues from "../views/Alarm/AlarmValues";
import AlarmConditions from "../views/Alarm/AlarmConditions";
import AlarmTriggers from "../views/Alarm/AlarmTriggers";
import AlarmState from "../views/Alarm/AlarmState";
import AlarmSummary from "../views/Alarm/AlarmSummary";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Remote Monitoring by Radio Holland",
    icon: Dashboard,
    component: DashboardPage,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/userprofile",
    sidebarName: "",
    navbarName: "User Profile",
    icon: Person,
    component: Profile,
    parent: "",
    permissionName: "",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/maps",
    sidebarName: "Maps",
    navbarName: "Maps",
    icon: MapIcon,
    component: Maps,
    parent: "",
    permissionName: "maps",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/shipowners",
    sidebarName: "Ship Owners",
    navbarName: "Ship Owners",
    icon: VpnKey,
    component: ShipOwners,
    parent: "Admin",
    permissionName: "",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/vessel/networkperformance/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Network Performance",
    icon: "",
    component: NetworkPerformance,
    parent: "",
    permissionName: "maps_device",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/failover/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Failover",
    icon: "",
    component: Failover,
    parent: "",
    permissionName: "vessel_failover",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/parameters/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Parameters",
    icon: "",
    component: Parameters,
    parent: "",
    permissionName: "vessel_parameters",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/networkconfiguration/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Network Configuration",
    icon: "",
    component: NetworkConfiguration,
    parent: "",
    permissionName: "vessel_network configuration",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/corevalues/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Core Values",
    icon: "",
    component: CoreValues,
    parent: "",
    permissionName: "vessel_core values",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/portforwarding/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Port Forwarding",
    icon: "",
    component: PortForwarding,
    parent: "",
    permissionName: "vessel_port forwarding",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: true
  },
  {
    path: "/vessel/remoteconsole/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Remote Console",
    icon: "",
    component: RemoteConsole,
    parent: "",
    permissionName: "vessel_remote console",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: false
  },
  {
    path: "/vessel/remoteconsole-result/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>Remote Console>Remote Console Result",
    icon: "",
    component: RemoteConsoleResult,
    parent: "",
    permissionName: "vessel_remote console_result",
    breadCrumbRoutes: [
      "/vessel/deviceselect/:vessel_id/:vessel_name",
      "/vessel/remoteconsole/:vessel_id/:vessel_name",
      ""
    ],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: false
  },
  {
    path: "/vessel/deviceselect/:vessel_id/:vessel_name",
    sidebarName: "",
    icon: "",
    component: DeviceSelect,
    parent: "",
    permissionName: "maps_vessel_deviceselect",
    breadCrumbRoutes: [""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    navbarName: ":vessel_name",
    withGlobalDTPicker: false
  },
  {
    path: "/device/:vessel_id/:device_id/:device_name/:vessel_name",
    sidebarName: "",
    navbarName: ":vessel_name>:device_name",
    icon: "",
    component: Device,
    parent: "",
    permissionName: "maps_device",
    breadCrumbRoutes: ["/vessel/deviceselect/:vessel_id/:vessel_name", ""],
    paramsName: {
      vessel_id: 2,
      device_id: 3,
      device_name: 4,
      vessel_name: 5
    },
    withGlobalDTPicker: true
  },
  {
    path: "/rbac/users",
    sidebarName: "",
    navbarName: "RBAC Users",
    icon: "",
    component: RBACUsers,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/rbac/role",
    sidebarName: "",
    navbarName: "RBAC Roles",
    icon: "",
    component: RBACRole,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/rbac/permission",
    sidebarName: "",
    navbarName: "RBAC Permissions",
    icon: "",
    component: RBACPermission,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/admin/company",
    sidebarName: "",
    navbarName: "Admin Company",
    icon: "",
    component: AdminCompany,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/admin/vessels",
    sidebarName: "",
    navbarName: "Admin Vessels",
    icon: "",
    component: AdminVessels,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/admin/subcategory",
    sidebarName: "",
    navbarName: "Sub Category",
    icon: "",
    component: AdminSubCategory,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/admin/noonreportarchive/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName: "Admin Vessels>:vessel_name",
    icon: "",
    component: AdminVesselsNoonRepArchive,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: ["/admin/vessels", ""],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: false
  },
  {
    path: "/admin/clients",
    sidebarName: "",
    navbarName: "Admin Clients",
    icon: "",
    component: AdminClients,
    parent: "",
    permissionName: "all",
    breadCrumbRoutes: [""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/alarms/state/:verbose_level/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName:
      ":vessel_name>Alarm Conditions>Alarm Values>Alarm Triggers>Alarm State",
    icon: "",
    component: AlarmState,
    parent: "",
    permissionName: "alarm_state",
    breadCrumbRoutes: [
      "/vessel/deviceselect/:vessel_id/:vessel_name",
      "/alarms/conditions",
      "/alarms/values",
      "/alarms/triggers",
      ""
    ],
    paramsName: {
      verbose_level: 3,
      vessel_id: 4,
      vessel_name: 5
    },
    withGlobalDTPicker: false
  },
  {
    path: "/alarms/summary/:vessel_id/:vessel_name",
    sidebarName: "",
    navbarName:
      ":vessel_name>Alarm Conditions>Alarm Values>Alarm Triggers>Alarm State",
    icon: "",
    component: AlarmSummary,
    parent: "",
    permissionName: "alarm_summary",
    breadCrumbRoutes: [
      "/vessel/deviceselect/:vessel_id/:vessel_name",
      "/alarms/conditions",
      "/alarms/values",
      "/alarms/triggers",
      ""
    ],
    paramsName: {
      vessel_id: 3,
      vessel_name: 4
    },
    withGlobalDTPicker: false
  },
  {
    path: "/alarms/values",
    sidebarName: "",
    navbarName: "Alarm Triggers>Alarm Conditions>Alarm Values",
    icon: "",
    component: AlarmValues,
    parent: "",
    permissionName: "alarm_values",
    breadCrumbRoutes: ["/alarms/triggers", "/alarms/conditions", ""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/alarms/conditions",
    sidebarName: "",
    navbarName: "Alarm Triggers>Alarm Values>Alarm Conditions",
    icon: "",
    component: AlarmConditions,
    parent: "",
    permissionName: "alarm_conditions",
    breadCrumbRoutes: ["/alarms/triggers", "/alarms/values", ""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    path: "/alarms/triggers",
    sidebarName: "",
    navbarName: "Alarm Values>Alarm Conditions>Alarm Triggers",
    icon: "",
    component: AlarmTriggers,
    parent: "",
    permissionName: "alarm_triggers",
    breadCrumbRoutes: ["/alarms/values", "/alarms/conditions", ""],
    paramsName: {},
    withGlobalDTPicker: false
  },
  {
    redirect: true,
    path: "/",
    to: "/maps",
    navbarName: "Redirect",
    breadCrumbRoutes: [""],
    paramsName: {}
  }
];

export default dashboardRoutes;
