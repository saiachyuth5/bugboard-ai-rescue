
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockBugs } from "../data/mockData";
import { Bug, Fix } from "../types";
import { formatDistanceToNow } from "date-fns";

const BugDetail = () => {
  const { id } = useParams<{ id: string }>();
  const bug = mockBugs.find(b => b.id === id);
  const [showFixForm, setShowFixForm] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-mono">Bug not found</h1>
          <Link to="/" className="text-green-400 hover:text-green-300 font-mono">
            ← Back to bugs
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-400 bg-red-900/20 border-red-700';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'resolved':
        return 'text-green-400 bg-green-900/20 border-green-700';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-green-400 hover:text-green-300 font-mono text-sm">
            ← Back to BugBoard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Bug Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-100 font-mono">{bug.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-sm font-mono border ${getStatusColor(bug.status)}`}>
                {bug.status.toUpperCase()}
              </span>
              <span className="text-green-400 font-mono font-bold text-xl">
                ${bug.bounty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-400 text-sm mb-4">
            <span className="font-mono">Agent: {bug.agentName}</span>
            <span className="font-mono">
              Reported {formatDistanceToNow(new Date(bug.timestamp), { addSuffix: true })}
            </span>
            <button 
              onClick={() => setUpvoted(!upvoted)}
              className={`font-mono hover:text-green-400 transition-colors ${upvoted ? 'text-green-400' : ''}`}
            >
              👍 {bug.upvotes + (upvoted ? 1 : 0)}
            </button>
          </div>

          <p className="text-gray-300 text-lg">{bug.summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input */}
            <section>
              <h2 className="text-xl font-bold mb-4 font-mono text-green-400">Agent Input</h2>
              <div className="bg-gray-800 border border-gray-700 p-4 rounded">
                <code className="text-gray-300 font-mono">{bug.input}</code>
              </div>
            </section>

            {/* Error */}
            <section>
              <h2 className="text-xl font-bold mb-4 font-mono text-red-400">Error</h2>
              <div className="bg-red-900/10 border border-red-700 p-4 rounded">
                <code className="text-red-300 font-mono">{bug.error}</code>
              </div>
            </section>

            {/* Logs */}
            <section>
              <h2 className="text-xl font-bold mb-4 font-mono text-blue-400">Logs</h2>
              <div className="bg-gray-800 border border-gray-700 p-4 rounded max-h-96 overflow-y-auto">
                {bug.logs.map((log, index) => (
                  <div key={index} className="font-mono text-sm text-gray-300 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </section>

            {/* Fixes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-mono text-purple-400">
                  Proposed Fixes {bug.fixes && `(${bug.fixes.length})`}
                </h2>
                <button
                  onClick={() => setShowFixForm(!showFixForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-mono text-sm transition-colors"
                >
                  Submit Fix
                </button>
              </div>

              {showFixForm && (
                <div className="bg-gray-800 border border-gray-700 p-6 rounded mb-6">
                  <h3 className="font-mono font-bold mb-4">Submit a Fix</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Your GitHub Username
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
                        placeholder="your-github-username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Pull Request URL
                      </label>
                      <input
                        type="url"
                        className="w-full bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
                        placeholder="https://github.com/repo/pull/123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Fix Explanation
                      </label>
                      <textarea
                        className="w-full bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
                        rows={4}
                        placeholder="Explain how your fix solves the issue..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-mono transition-colors"
                      >
                        Submit Fix
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFixForm(false)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-mono transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {bug.fixes && bug.fixes.length > 0 ? (
                <div className="space-y-4">
                  {bug.fixes.map((fix) => (
                    <div key={fix.id} className="bg-gray-800 border border-gray-700 p-4 rounded">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-mono font-semibold text-gray-100">
                            Fix by {fix.submitterName}
                          </h4>
                          <p className="text-sm text-gray-400 font-mono">
                            {formatDistanceToNow(new Date(fix.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        {fix.verified && (
                          <span className="bg-green-900/20 border border-green-700 text-green-400 px-2 py-1 rounded text-xs font-mono">
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{fix.explanation}</p>
                      <a
                        href={fix.prLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                      >
                        View Pull Request →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="font-mono">No fixes submitted yet</p>
                  <p className="text-sm mt-1">Be the first to solve this bug!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 p-4 rounded">
              <h3 className="font-mono font-bold text-green-400 mb-3">Bounty Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Amount:</span>
                  <span className="text-green-400 font-mono font-bold">${bug.bounty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Status:</span>
                  <span className="text-gray-300 font-mono">{bug.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Upvotes:</span>
                  <span className="text-gray-300 font-mono">{bug.upvotes}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-4 rounded">
              <h3 className="font-mono font-bold text-blue-400 mb-3">Agent Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400 font-mono">Name:</span>
                  <div className="text-gray-300 font-mono">{bug.agentName}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-mono">Reported:</span>
                  <div className="text-gray-300 font-mono text-xs">
                    {new Date(bug.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetail;
