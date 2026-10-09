import { motion } from "framer-motion";
import { 
  Check, 
  Search, 
  Bell,
  LayoutDashboard, 
  Truck, 
  Map as MapIcon, 
  FileText, 
  CreditCard, 
  BarChart, 
  Users, 
  Settings,
  MoreHorizontal,
  Navigation,
  CheckCircle2
} from "lucide-react";
import LiveMap from "./LiveMap"; // Reusable real leaflet map

const DesktopMockup = () => {
  return (
    <div className="w-full h-full bg-[#f9fafc] rounded-2xl shadow-[0_30px_80px_rgba(22,24,29,0.12)] border border-gray-100 flex flex-col shrink-0 select-none overflow-hidden relative">
      {/* Top Header */}
      <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 w-56">
          <span className="font-serif text-2xl font-bold text-[#16181d]">Muvx<span className="text-[#d9622b]">TMS</span></span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 w-full max-w-lg border border-gray-100 text-gray-400">
            <Search className="size-4 mr-3" />
            <span className="text-sm font-medium">Search loads, drivers, customers...</span>
          </div>
        </div>
        <div className="flex items-center gap-5 justify-end">
          <Bell className="size-5 text-gray-600" />
          <div className="w-px h-6 bg-gray-200" />
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=admin_akash" alt="Admin" className="size-9 rounded-full bg-gray-100 border border-gray-200 object-cover" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none">Akashdeep</span>
              <span className="text-xs text-gray-500 mt-1">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-white flex flex-col py-4 gap-1 shrink-0">
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: FileText, label: "Loads" },
            { icon: Truck, label: "Dispatch" },
            { icon: Users, label: "Drivers" },
            { icon: MapIcon, label: "Tracking" },
            { icon: FileText, label: "Documents" },
            { icon: CreditCard, label: "Billing" },
            { icon: BarChart, label: "Reports" },
            { icon: Users, label: "Customers" },
            { icon: Truck, label: "Fleet" },
            { icon: Settings, label: "Settings" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${item.active ? 'bg-[#fff5f0] text-[#d9622b] border-r-4 border-[#d9622b]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="size-[18px]" />
              <span className={`text-sm ${item.active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f9fafc] p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar relative">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-4 gap-5 shrink-0">
            {[
              { label: "Active Loads", val: "24", sub: "+20% from last week", subColor: "text-orange-500", iconBg: "bg-orange-50", icon: <Truck className="size-5 text-orange-500" /> },
              { label: "In Transit", val: "18", sub: "On schedule", subColor: "text-green-500", iconBg: "bg-green-50", icon: <Navigation className="size-5 text-green-500" /> },
              { label: "Delivered (Today)", val: "7", sub: "+2 more than yesterday", subColor: "text-blue-500", iconBg: "bg-blue-50", icon: <CheckCircle2 className="size-5 text-blue-500" /> },
              { label: "Revenue (This Week)", val: "$24,600", sub: "+16%", subColor: "text-gray-500", iconBg: "bg-orange-50", icon: <FileText className="size-5 text-orange-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  <div className={`size-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                    {stat.icon}
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-900 mb-2 leading-none">{stat.val}</span>
                <div className="flex items-center gap-1.5">
                  <svg className={`size-3.5 ${stat.subColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-xs text-gray-500 font-medium">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 h-[320px] shrink-0">
            {/* Live Fleet Tracking Map */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-900">Live Fleet Tracking</span>
                <button className="text-xs font-semibold text-[#d9622b] hover:text-[#b84e20] transition-colors">View all &rarr;</button>
              </div>
              <div className="flex-1 rounded-lg overflow-hidden relative bg-gray-100 z-10 border border-gray-200">
                {/* Real interactive Leaflet map! */}
                <LiveMap interactive={false} />
              </div>
            </div>

            {/* Professional Load Timeline */}
            <div className="w-[340px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              {/* Header Section */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#16181d] text-white text-[9px] font-bold rounded tracking-wider uppercase">LTL</span>
                    <span className="text-sm font-extrabold text-gray-900 tracking-tight">#LD-48291</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    In Transit
                  </span>
                </div>
                
                {/* Route visualization */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 rounded-full border-2 border-gray-900 bg-white z-10" />
                    <div className="w-px h-7 bg-gray-300 my-0.5" />
                    <div className="w-2 h-2 rounded-sm border-2 border-[#d9622b] bg-white z-10" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div>
                      <div className="text-[11px] font-extrabold text-gray-900">Chicago, IL</div>
                      <div className="text-[9px] text-gray-500 font-semibold mt-0.5">Sep 28 &middot; 08:00 AM</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-gray-900">Dallas, TX</div>
                      <div className="text-[9px] text-gray-500 font-semibold mt-0.5">Sep 29 &middot; ETA 06:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Chips */}
              <div className="grid grid-cols-3 gap-px bg-gray-100 border-b border-gray-100">
                <div className="bg-white p-2.5 text-center">
                  <div className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Equipment</div>
                  <div className="text-[10px] font-bold text-gray-800">53' Reefer</div>
                </div>
                <div className="bg-white p-2.5 text-center">
                  <div className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Distance</div>
                  <div className="text-[10px] font-bold text-gray-800">1,250 mi</div>
                </div>
                <div className="bg-white p-2.5 text-center">
                  <div className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Rate</div>
                  <div className="text-[10px] font-bold text-emerald-600">$2,600</div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="p-4 flex-1 bg-white overflow-y-auto no-scrollbar">
                <div className="flex flex-col relative gap-0">
                  {[
                    { label: "Order Booked", time: "Sep 28, 10:24 AM", state: "done" },
                    { label: "Driver Dispatched", time: "Sep 28, 11:02 AM", state: "done" },
                    { label: "Picked Up (Chicago)", time: "Sep 28, 02:15 PM", state: "done" },
                    { label: "In Transit", time: "Last ping: 10 mins ago", state: "active", highlight: "ETA: On time" },
                    { label: "Delivery (Dallas)", state: "pending" },
                  ].map((step, i, arr) => (
                    <div key={i} className="flex gap-4 relative">
                      {/* Line connecting steps */}
                      {i < arr.length - 1 && (
                        <div className={`absolute left-[7px] top-[14px] bottom-[-14px] w-[2px] ${step.state === 'done' ? 'bg-gray-900' : 'bg-gray-100'}`} />
                      )}
                      
                      <div className="py-2 shrink-0 relative z-10 bg-white">
                        {step.state === 'done' && (
                          <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                        {step.state === 'active' && (
                          <div className="w-4 h-4 rounded-full border-[4px] border-[#d9622b] bg-white shadow-[0_0_0_3px_rgba(217,98,43,0.15)] animate-pulse" />
                        )}
                        {step.state === 'pending' && (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-200 bg-white" />
                        )}
                      </div>
                      
                      <div className="py-1.5 pb-4 flex flex-col">
                        <span className={`text-[11px] font-bold ${step.state === 'active' ? 'text-gray-900' : (step.state === 'pending' ? 'text-gray-400' : 'text-gray-800')}`}>{step.label}</span>
                        {step.time && <span className="text-[9px] text-gray-500 font-semibold mt-0.5">{step.time}</span>}
                        {step.highlight && (
                          <div className="mt-1.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[9px] font-bold w-fit">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {step.highlight}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col shrink-0 flex-1">
            <div className="flex border-b border-gray-100 px-6 pt-3">
              {['Active Loads', 'In Transit (18)', 'Pending (3)', 'Delivered'].map((tab, i) => (
                <div key={i} className={`text-xs font-bold px-4 py-3 cursor-pointer uppercase tracking-wider ${i === 0 ? 'text-[#16181d] border-b-[3px] border-[#16181d]' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab}
                </div>
              ))}
            </div>
            
            <div className="px-6 py-2 flex flex-col flex-1 pb-4">
              <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider py-3 border-b border-gray-100">
                <span className="w-20">Load #</span>
                <span className="w-56">Origin &rarr; Destination</span>
                <span className="w-48">Driver</span>
                <span className="w-24">Truck</span>
                <span className="w-28">Status</span>
                <span className="w-32">Pickup</span>
                <span className="w-32">Delivery</span>
                <span className="w-20 text-right">Rate</span>
              </div>

              {[
                { id: "#48291", route: "Chicago, IL \u2192 Dallas, TX", driver: "John Doe", avatar: "https://i.pravatar.cc/150?u=john", truck: "TRK-1043", status: "In Transit", statusColor: "text-green-700 bg-green-50 border-green-200", pickup: "Sep 28 10:00 AM", deliv: "Sep 29 6:32 PM", rate: "$2,600" },
                { id: "#48277", route: "Houston, TX \u2192 Austin, TX", driver: "Michael B.", avatar: "https://i.pravatar.cc/150?u=michael", truck: "TRK-2187", status: "Loading", statusColor: "text-blue-700 bg-blue-50 border-blue-200", pickup: "Sep 28 2:00 PM", deliv: "Sep 28 6:00 PM", rate: "$850" },
                { id: "#48283", route: "Dallas, TX \u2192 Phoenix, AZ", driver: "Raj Patel", avatar: "https://i.pravatar.cc/150?u=raj", truck: "TRK-3312", status: "Delayed", statusColor: "text-red-700 bg-red-50 border-red-200", pickup: "Sep 27 9:00 AM", deliv: "Sep 30 4:30 PM", rate: "$3,100" },
                { id: "#48294", route: "Seattle, WA \u2192 Portland, OR", driver: "Sarah W.", avatar: "https://i.pravatar.cc/150?u=sarah", truck: "TRK-0921", status: "At Pickup", statusColor: "text-purple-700 bg-purple-50 border-purple-200", pickup: "Sep 28 1:00 PM", deliv: "Sep 29 9:00 AM", rate: "$1,200" },
              ].map((row, i) => (
                <div key={i} className="flex items-center text-sm font-medium text-gray-700 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer rounded-lg px-2 -mx-2">
                  <span className="w-20 font-bold text-gray-900">{row.id}</span>
                  <span className="w-56 truncate pr-4 text-gray-600">{row.route}</span>
                  <span className="w-48 flex items-center gap-3 truncate pr-4">
                    <img src={row.avatar} alt={row.driver} className="size-8 rounded-full border border-gray-200 object-cover shrink-0" />
                    <span className="font-semibold text-gray-900">{row.driver}</span>
                  </span>
                  <span className="w-24 text-gray-600 font-mono text-xs">{row.truck}</span>
                  <span className="w-28"><span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider border ${row.statusColor}`}>{row.status}</span></span>
                  <span className="w-32 text-gray-500 text-xs font-medium">{row.pickup}</span>
                  <span className="w-32 text-gray-500 text-xs font-medium">{row.deliv}</span>
                  <span className="w-20 text-right font-bold text-gray-900">{row.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default function ProductShowcase() {
  return (
    <section className="w-full bg-[#f5f2ec] py-24 overflow-hidden relative flex flex-col items-center">
      
      {/* Background SVG matching "TheLine" style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 flex justify-center">
        <svg
          className="absolute inset-x-0 top-0 h-full w-[1480px] text-[#E4DDD0] left-1/2 -translate-x-1/2"
          viewBox="0 0 1481 488"
          fill="none"
          preserveAspectRatio="none"
        >
          {[30, 200, 370].map((y) => (
            <path
              key={y}
              d="M0.5 10.5C260.5 -19.5 440.5 50.5 720.5 18.5C980.5 -11.5 1160.5 46.5 1480.5 0.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              transform={`translate(-20, ${y})`}
            />
          ))}
        </svg>
      </div>

      {/* Massive Dashboard Mockup */}
      <div className="relative w-[96%] max-w-[1240px] h-[750px] px-2 lg:px-8 z-10 flex justify-center">
          {/* Desktop Layer */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <DesktopMockup />
            </motion.div>
          </motion.div>
      </div>
    </section>
  );
}
