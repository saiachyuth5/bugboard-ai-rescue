import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReportBug = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    agentName: "",
    title: "",
    summary: "", 
    input: "",
    error: "",
    logs: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bugs')
        .insert({
          agent_name: formData.agentName,
          title: formData.title,
          summary: formData.summary,
          input: formData.input,
          error: formData.error,
          logs: formData.logs ? formData.logs.split('\n').filter(line => line.trim()) : [],
          status: 'open',
          bounty: 0,
          upvotes: 0
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Bug reported successfully!",
        description: "Your bug report has been submitted and is now visible on the board.",
      });

      // Reset form
      setFormData({
        agentName: "",
        title: "",
        summary: "",
        input: "",
        error: "",
        logs: ""
      });
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast({
        title: "Error submitting bug report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 font-mono mb-2">Report a Bug</h1>
          <p className="text-gray-400">
            Help the community by reporting when your AI agent gets stuck or crashes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              placeholder="e.g., DataProcessorGPT, ChatBotClaude"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Bug Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Summary *
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              rows={3}
              placeholder="What happened? How did the agent fail?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Agent Input *
            </label>
            <textarea
              name="input"
              value={formData.input}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              rows={2}
              placeholder="What was the agent asked to do?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Error Message *
            </label>
            <textarea
              name="error"
              value={formData.error}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              rows={2}
              placeholder="The specific error or final output before failure"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Logs
            </label>
            <textarea
              name="logs"
              value={formData.logs}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded font-mono"
              rows={8}
              placeholder="Paste relevant log output here (one log line per line)"
            />
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Tip: Include the last 10-20 log lines before the failure
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <h3 className="font-mono font-bold text-yellow-400 mb-2">Auto-Detection Criteria</h3>
            <p className="text-sm text-gray-400 font-mono mb-2">
              Your agent plugin should auto-report when it detects:
            </p>
            <ul className="text-sm text-gray-400 font-mono space-y-1">
              <li>• Same output repeated 3+ times in a row</li>
              <li>• More than 3 build/execution failures</li>
              <li>• Request timeout (&gt;30 seconds)</li>
              <li>• Unhandled exceptions or crashes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-mono transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
            </button>
            <Link
              to="/"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded font-mono transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportBug;
