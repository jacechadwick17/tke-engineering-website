import { useState } from 'react';
import { Search, FileText, Calendar, HeartPulse, Briefcase, Download } from 'lucide-react';
import { useHrDocuments } from '@/hooks/useContent';

const getIconForCategory = (category: string) => {
  switch(category.toLowerCase()) {
    case 'benefits': return HeartPulse;
    case 'time off': return Calendar;
    case 'finance': return FileText;
    default: return Briefcase;
  }
};

export default function EmployeePortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinCode, setPinCode] = useState('');
  // Renamed to hasError to ensure the build tool sees it as used
  const [hasError, setHasError] = useState(false);
  
  const { hrDocs, loading } = useHrDocuments();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '7111') { 
      setIsUnlocked(true); 
    } else { 
      setHasError(true); 
      setPinCode(''); 
    }
  };

  const filteredDocs = hrDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="w-full text-center text-2xl p-3 bg-[#0a0a0a] border border-white/20 text-white rounded-lg mb-4" 
              placeholder="••••" 
            />
            {hasError && <p className="text-red-500 text-sm mb-4">Incorrect PIN. Please try again.</p>}
            <button type="submit" className="w-full bg-[#00A0A0] text-white py-3 rounded-lg hover:bg-[#007a52] transition-colors">
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-white">TKE Employee Portal</h1>
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 text-white rounded-xl" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="grid gap-4">
          {loading ? <div className="text-white">Loading...</div> : filteredDocs.map(doc => {
            const Icon = getIconForCategory(doc.category);
            return (
              <a 
                key={doc.slug} 
                href={doc.documentFile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-6 border border-white/5 rounded-xl hover:bg-white/5 bg-[#1a1a1a] flex items-center justify-between group"
              >
                <div className="flex gap-4 items-center">
                  <div className="bg-[#00A0A0]/10 p-3 rounded-lg text-[#00A0A0]"><Icon size={24} /></div>
                  <div>
                    <span className="text-xs font-semibold text-[#00A0A0] uppercase">{doc.category}</span>
                    <h2 className="text-xl font-semibold text-white group-hover:text-[#00CCCC]">{doc.title}</h2>
                  </div>
                </div>
                <Download size={24} className="text-[#888888] group-hover:text-[#00A0A0]" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  );
}
