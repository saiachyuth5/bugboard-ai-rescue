
import { Link } from "react-router-dom";
import { Bug } from "../types";
import { formatDistanceToNow } from "date-fns";

interface BugCardProps {
  bug: Bug;
}

const BugCard = ({ bug }: BugCardProps) => {
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
    <Link to={`/bug/${bug.id}`} className="block">
      <div className="bg-gray-800 border border-gray-700 hover:border-gray-600 p-6 rounded transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-100 mb-2 font-mono">
              {bug.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {bug.summary}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className={`px-2 py-1 rounded text-xs font-mono border ${getStatusColor(bug.status)}`}>
              {bug.status.toUpperCase()}
            </span>
            <span className="text-green-400 font-mono font-bold">
              ${bug.bounty}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-mono">Agent: {bug.agentName}</span>
            <span className="font-mono">
              {formatDistanceToNow(new Date(bug.timestamp), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono">👍 {bug.upvotes}</span>
            {bug.fixes && bug.fixes.length > 0 && (
              <span className="font-mono">🔧 {bug.fixes.length} fixes</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BugCard;
