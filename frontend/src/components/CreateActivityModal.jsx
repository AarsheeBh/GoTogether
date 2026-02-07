import { useState } from 'react';

function CreateActivityModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'grocery',
    description: '',
    location: '',
    scheduledTime: '',
    isImmediate: false,
    companionsNeeded: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If immediate, set scheduledTime to now
      const activityData = {
        ...formData,
        scheduledTime: formData.isImmediate ? new Date().toISOString() : formData.scheduledTime
      };
      await onCreate(activityData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Post New Activity</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Going to Walmart for groceries"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="grocery">Grocery</option>
                <option value="walk">Walk</option>
                <option value="carpool">Carpool</option>
                <option value="errands">Errands</option>
                <option value="shopping">Shopping</option>
                <option value="gym">Gym</option>
                <option value="dining">Dining</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Walmart, Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Any additional details..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isImmediate"
                checked={formData.isImmediate}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                id="isImmediate"
              />
              <label htmlFor="isImmediate" className="text-sm font-medium text-gray-700">
                I'm going right now (immediate)
              </label>
            </div>

            {!formData.isImmediate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  required={!formData.isImmediate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many companions do you need?
              </label>
              <input
                type="number"
                name="companionsNeeded"
                value={formData.companionsNeeded}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateActivityModal;

