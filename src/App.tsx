import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrdersList from './pages/Orders/OrdersList'
import OrderDetail from './pages/Orders/OrderDetail'
import HomeDashboard from './pages/Dashboard/HomeDashboard'
import ProjectsList from './pages/Projects/ProjectsList'
import ProjectDetail from './pages/Projects/ProjectDetail'
import DevelopersList from './pages/Developers/DevelopersList'
import CoBrokerMain from './pages/CoBroker/CoBrokerMain'
import JoinRequestDetail from './pages/CoBroker/JoinRequestDetail'
import BrokerProfile from './pages/CoBroker/BrokerProfile'
import InterestDetail from './pages/CoBroker/InterestDetail'
import { mockCoBrokerData } from './data/coBrokerStore'
import CustomersList from './pages/Customers/CustomersList'
import CustomerProfile from './pages/Customers/CustomerProfile'
import { mockCustomers } from './data/customersStore'
import ResaleList from './pages/Resale/ResaleList'
import ResaleDetail from './pages/Resale/ResaleDetail'
import { mockResaleRequests } from './data/resaleStore'
import VouchersList from './pages/Vouchers/VouchersList'
import VoucherDetail from './pages/Vouchers/VoucherDetail'
import { mockVouchers } from './data/vouchersStore'
import SystemManagement from './pages/System/SystemManagement'
import NotificationsList from './pages/Notifications/Notifications'
import { 
  Home, ShoppingBag, Building2, Tag, Users, RefreshCw, 
  Map, UserCircle, Settings, Bell, ChevronLeft, ChevronRight,
  Menu, Search, User
} from 'lucide-react'
import { buildMockOrders, Order } from './data/ordersStore'
import { mockProjects } from './data/projectsStore'

const queryClient = new QueryClient()

export default function App() {
  const [activeRoute,      setActiveRoute]      = useState<string>('home');
  const [selectedOrderId,  setSelectedOrderId]  = useState<string | null>(null);
  const [selectedProjectId,setSelectedProjectId]= useState<string | null>(null);
  // CoBroker routing states
  const [cbJoinRequestId,  setCbJoinRequestId]  = useState<string | null>(null);
  const [cbBrokerId,       setCbBrokerId]       = useState<string | null>(null);
  const [cbInterestId,     setCbInterestId]     = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedResaleId, setSelectedResaleId] = useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);



  const [isCollapsed,     setIsCollapsed]      = useState<boolean>(false);
  // Single source of truth — mutable data
  const [orders, setOrders] = useState<Order[]>(buildMockOrders);
  const [resaleRequests, setResaleRequests] = useState(mockResaleRequests);

  const updateOrder = (updated: Order) =>
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));

  const updateResaleRequest = (updated: any) =>
    setResaleRequests(prev => prev.map(r => r.id === updated.id ? updated : r));

  /* ── navigation helpers ────────────────────────────────────── */
  const goToOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveRoute('orderDetail');
  };
  const goToOrders = () => {
    setSelectedOrderId(null);
    setActiveRoute('orders');
  };
  const goToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveRoute('projectDetail');
  };
  const goToProjects = () => {
    setSelectedProjectId(null);
    setActiveRoute('projects');
  };
  
  const goToCoBroker = () => {
    setCbJoinRequestId(null); setCbBrokerId(null); setCbInterestId(null);
    setActiveRoute('cobroker');
  };
  const goToJoinRequest = (id: string) => {
    setCbJoinRequestId(id); setActiveRoute('cobrokerJoin');
  };
  const goToBrokerProfile = (id: string) => {
    setCbBrokerId(id); setActiveRoute('cobrokerBroker');
  };
  const goToInterestDetail = (id: string) => {
    setCbInterestId(id); setActiveRoute('cobrokerInterest');
  };

  const goToCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setActiveRoute('customerProfile');
  };
  const goToCustomers = () => {
    setSelectedCustomerId(null);
    setActiveRoute('customers');
  };

  const goToResaleDetail = (id: string) => {
    setSelectedResaleId(id);
    setActiveRoute('resaleDetail');
  };
  const goToResale = () => {
    setSelectedResaleId(null);
    setActiveRoute('resale');
  };

  const goToVoucher = (id: string) => {
    setSelectedVoucherId(id);
    setActiveRoute('voucherDetail');
  };
  const goToVouchers = () => {
    setSelectedVoucherId(null);
    setActiveRoute('vouchers');
  };

  const navItems = [
    { id: 'home',          label: 'Home Dashboard',    icon: <Home size={18} /> },
    { id: 'orders',        label: 'Orders',            icon: <ShoppingBag size={18} /> },
    { id: 'projects',      label: 'Projects',          icon: <Building2 size={18} /> },
    { id: 'vouchers',      label: 'Vouchers',          icon: <Tag size={18} /> },
    { id: 'developers',    label: 'Developers',        icon: <Users size={18} /> },
    { id: 'resale',        label: 'Resale Requests',   icon: <RefreshCw size={18} /> },
    { id: 'cobroker',      label: 'Co-Broker',         icon: <Map size={18} /> },
    { id: 'customers',     label: 'Customers',         icon: <UserCircle size={18} /> },
    { id: 'system',        label: 'System Management', icon: <Settings size={18} /> },
    { id: 'notifications', label: 'Notifications',     icon: <Bell size={18} /> },
  ];

  /* nav click handler */
  const handleNavClick = (id: string) => {
    if (id === 'orders')   goToOrders();
    else if (id === 'projects') goToProjects();
    else if (id === 'cobroker') goToCoBroker();
    else if (id === 'customers') goToCustomers();
    else if (id === 'vouchers') goToVouchers();
    else setActiveRoute(id);
  };

  /* which nav item is "active" for highlight */
  const isNavActive = (id: string) => {
    if (id === 'orders')   return activeRoute === 'orders'   || activeRoute === 'orderDetail';
    if (id === 'projects') return activeRoute === 'projects' || activeRoute === 'projectDetail';
    if (id === 'cobroker') return activeRoute.startsWith('cobroker');
    if (id === 'customers') return activeRoute === 'customers' || activeRoute === 'customerProfile';
    if (id === 'resale') return activeRoute === 'resale' || activeRoute === 'resaleDetail';
    if (id === 'vouchers') return activeRoute === 'vouchers' || activeRoute === 'voucherDetail';
    return activeRoute === id;
  };

  const routeTitle: Record<string, string> = {
    home: 'Dashboard', orders: 'Orders', orderDetail: 'Order Details',
    projects: 'Projects', projectDetail: 'Project Details',
    vouchers: 'Vouchers & Discounts', voucherDetail: 'Voucher Detail',
    developers: 'Developers',
    resale: 'Resale Requests', resaleDetail: 'Resale Detail', cobroker: 'Co-Broker', customers: 'Customers',
    system: 'System Management', notifications: 'Notifications',
    cobrokerJoin: 'Join Request', cobrokerBroker: 'Broker Profile', cobrokerInterest: 'Interest Detail',
    customerProfile: 'Customer Profile'
  };

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-50 flex overflow-hidden">

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex md:flex-col flex-shrink-0 transition-all duration-300 relative`}>
          
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 overflow-hidden">
            {!isCollapsed && <h1 className="text-xl font-black text-brand tracking-widest uppercase truncate ml-2">SAK Admin</h1>}
            {isCollapsed && <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-black text-xl mx-auto flex-shrink-0">S</div>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 text-sm font-medium overflow-y-auto scrollbar-hide mt-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                  isNavActive(item.id)
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'hover:bg-gray-50 text-gray-500 hover:text-brand'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`flex-shrink-0 transition-transform duration-300 ${isCollapsed ? 'mx-auto scale-110' : ''}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-semibold truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand shadow-sm z-50 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Bottom Profile (Optional but good for premium feel) */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Faisal Al-Otaibi</p>
                <p className="text-[10px] text-gray-400 truncate">Super Admin</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Topbar */}
          <header className="h-16 flex-shrink-0 bg-white shadow-sm z-10 flex items-center justify-between px-6 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-primary pr-4 border-r border-gray-200">SAK</h2>
              <h2 className="text-lg font-bold text-gray-800">{routeTitle[activeRoute] ?? activeRoute}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Faisal Al-Otaibi</p>
                <p className="text-xs font-medium text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-primary text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white">FA</div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
            <div className="max-w-[1500px] mx-auto">

              {activeRoute === 'home' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <HomeDashboard orders={orders} onOrderClick={goToOrder} />
                </div>
              )}

              {activeRoute === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <OrdersList orders={orders} onOrderClick={goToOrder} />
                </div>
              )}

              {activeRoute === 'orderDetail' && selectedOrderId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <OrderDetail
                    orderId={selectedOrderId}
                    orders={orders}
                    onBack={goToOrders}
                    onUpdateOrder={updateOrder}
                  />
                </div>
              )}

              {activeRoute === 'projects' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectsList
                    onProjectClick={goToProject}
                    onOrdersFilter={name => { goToOrders(); }}
                  />
                </div>
              )}

              {activeRoute === 'projectDetail' && selectedProject && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProjectDetail
                    project={selectedProject}
                    onBack={goToProjects}
                    onOrderClick={goToOrder}
                  />
                </div>
              )}

              {activeRoute === 'vouchers' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <VouchersList 
                    onSelectVoucher={goToVoucher}
                    onCustomerClick={goToCustomer}
                    onOrderClick={goToOrder}
                  />
                </div>
              )}

              {activeRoute === 'voucherDetail' && selectedVoucherId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <VoucherDetail 
                    voucher={mockVouchers.find(v => v.id === selectedVoucherId)!}
                    onBack={goToVouchers}
                    onCustomerClick={goToCustomer}
                    onOrderClick={goToOrder}
                    onProjectClick={goToProject}
                  />
                </div>
              )}

              {activeRoute === 'resale' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ResaleList 
                    requests={resaleRequests}
                    onSelectRequest={goToResaleDetail}
                    onCustomerClick={goToCustomer}
                    onOrderClick={goToOrder}
                  />
                </div>
              )}

              {activeRoute === 'resaleDetail' && selectedResaleId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ResaleDetail 
                    request={resaleRequests.find(r => r.id === selectedResaleId)!}
                    onBack={goToResale}
                    onCustomerClick={goToCustomer}
                    onOrderClick={goToOrder}
                    onProjectClick={goToProject}
                    onUpdate={updateResaleRequest}
                  />
                </div>
              )}
              
              {activeRoute === 'cobroker' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CoBrokerMain 
                    data={mockCoBrokerData}
                    onJoinRequestClick={goToJoinRequest}
                    onBrokerClick={goToBrokerProfile}
                    onInterestClick={goToInterestDetail}
                  />
                </div>
              )}
              {activeRoute === 'cobrokerJoin' && cbJoinRequestId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <JoinRequestDetail 
                    request={mockCoBrokerData.joinRequests.find(r => r.id === cbJoinRequestId)!} 
                    onBack={goToCoBroker} 
                  />
                </div>
              )}
              {activeRoute === 'cobrokerBroker' && cbBrokerId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <BrokerProfile 
                    broker={mockCoBrokerData.activeBrokers.find(b => b.id === cbBrokerId)!} 
                    onBack={goToCoBroker} 
                    onInterestClick={goToInterestDetail}
                  />
                </div>
              )}
              {activeRoute === 'cobrokerInterest' && cbInterestId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InterestDetail 
                    interest={mockCoBrokerData.interests.find(i => i.id === cbInterestId)!} 
                    onBack={goToCoBroker} 
                    onBrokerClick={goToBrokerProfile}
                    onProjectClick={goToProject}
                    onOrderClick={goToOrder}
                  />
                </div>
              )}

              {activeRoute === 'customers' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CustomersList 
                    customers={mockCustomers}
                    onCustomerClick={goToCustomer}
                  />
                </div>
              )}

              {activeRoute === 'customerProfile' && selectedCustomerId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CustomerProfile 
                    onBack={goToCustomers}
                    customer={mockCustomers.find(c => c.id === selectedCustomerId)!}
                    onOrderClick={goToOrder}
                    onResaleClick={goToResaleDetail}
                    onProjectClick={() => {}} // Could link to specific project if needed
                  />
                </div>
              )}

              {activeRoute === 'system'        && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><SystemManagement /></div>}
              {activeRoute === 'notifications' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><NotificationsList /></div>}
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
}
