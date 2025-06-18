
import { useState } from "react";
import { Link } from "react-router-dom";
import BugCard from "../components/BugCard";
import { mockBugs } from "../data/mockData";
import { Bug } from "../types";

const Index = () => {
  const [bugs] = useState<Bug[]>(mockBugs);
  const [sortBy, setSortBy] = useState<'newest' | 'bounty' | 'status'>('newest');

  const sortedBugs = [...bugs].sort((a, b) => {
    switch (sortBy) {
      case 'bounty':
        return b.bounty - a.bounty;
      case 'status':
        return a.status === 'open' ? -1 : 1;
      case 'newest':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-400 font-mono">BugBoard AI</h1>
              <p className="text-gray-400 mt-1">When your AI agent breaks, let the internet fix it.</p>
            </div>
            <Link 
              to="/report"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-mono transition-colors"
            >
              Report Bug
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-400 font-mono">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-600 text-gray-100 px-3 py-1 rounded font-mono"
          >
            <option value="newest">Newest</option>
            <option value="bounty">Bounty</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {bugs.filter(b => b.status === 'open').length}
            </div>
            <div className="text-gray-400 font-mono">Open Bugs</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <div className="text-2xl font-bold text-blue-400 font-mono">
              ${bugs.reduce((sum, bug) => sum + bug.bounty, 0)}
            </div>
            <div className="text-gray-400 font-mono">Total Bounties</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <div className="text-2xl font-bold text-purple-400 font-mono">
              {bugs.filter(b => b.status === 'resolved').length}
            </div>
            <div className="text-gray-400 font-mono">Resolved</div>
          </div>
        </div>

        {/* Bug List */}
        <div className="space-y-4">
          {sortedBugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} />
          ))}
        </div>

        {bugs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 font-mono text-lg">No bugs reported yet</div>
            <p className="text-gray-600 mt-2">When AI agents start failing, they'll show up here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
