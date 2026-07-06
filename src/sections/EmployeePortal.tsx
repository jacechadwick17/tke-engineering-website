import { useState } from 'react';
import { Search, FileText, Calendar, HeartPulse } from 'lucide-react';

const hrDocuments = [
  { id: 1, title: '401k Matching Guidelines', category: 'Benefits', icon: HeartPulse, content: 'TKE matches up to 5% of employee contributions. Vesting period begins after 90 days of continuous employment.' },
  { id: 2, title: 'PTO & Vacation Policy', category: 'Time Off', icon: Calendar, content: 'Employees accrue 3 weeks of paid vacation annually. Sick leave is calculated separately at 1 hour per 30 hours worked.' },
  { id: 3, title: 'Health Insurance Plan', category: 'Benefits', icon: HeartPulse, content: 'Details on the current medical, dental, and vision coverage through BlueCross. Open enrollment begins November 1st.' },
  { id: 4, title: 'Company Holidays 2026', category: 'Time Off', icon: Calendar, content: 'TKE observes all major federal holidays including New Years, Memorial Day, Independence Day, Labor Day, Thanksgiving, and Christmas.' },
  { id: 5, title: 'Employee Expense Reimbursement', category: 'Finance', icon: FileText, content: 'All travel and project-related expenses must be submitted via the expense portal by the last Friday of the month.' }
];

export default function EmployeePortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState(false);

  // The "Soft Lock" logic
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '2026') { // Change this pin to whatever you want
      setIsUnlocked(true);
    } else {
      setError(true);
      setPinCode('');
    }
  };

  const filteredDocs = hrDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If locked, show the PIN screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] pt-20">
        <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-md max-w-sm w-full text-center border border-white/10">
          <h2 className="text-2xl font-bold mb-2 text-white">TKE Team Portal</h2>
          <p className="text-[#888888] mb-6 text-sm">Please enter the employee PIN to access internal resources.</p>
          <form onSubmit={handleUnlock}>
            <input 
              type="password" 
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full text-center text-2xl p-3 bg-[#0a0a0a] border border-white/20 text-white rounded-lg mb-4 focus:ring-2 focus:ring-[#00A0A0] outline-none"
              placeholder="••••"
            />
            {error && <p className="text-red-500 text-sm mb-4">Incorrect PIN. Please try again.</p>}
            <button type="submit" className="w-full bg-[#00A0A0] text-white py-3 rounded-lg hover:bg-[#007a52] transition-colors font-medium">
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If unlocked, show the actual HR portal
  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-white">TKE Employee Portal</h1>
        <p className="text-[#888888] mb-8">Internal resources and HR documentation.</p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search HR documents (e.g., '401k', 'vacation')..." 
            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 text-white rounded-xl shadow-sm focus:ring-2 focus:ring-[#00A0A0] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Results Grid */}
        <div className="grid gap-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map(doc => {
              const Icon = doc.icon;
              return (
                <div key={doc.id} className="p-6 border border-white/5 rounded-xl hover:bg-white/5 transition-colors bg-[#1a1a1a] flex gap-4">
                  <div className="mt-1 bg-[#00A0A0]/10 p-3 rounded-lg h-fit text-[#00A0A0]">
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#00A0A0] uppercase tracking-wider">{doc.category}</span>
                    <h2 className="text-xl font-semibold mt-1 text-white">{doc.title}</h2>
                    <p className="text-[#888888] mt-2 text-sm leading-relaxed">{doc.content}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 text-[#888888] italic bg-[#1a1a1a] rounded-xl border border-white/5">
              No documents found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
