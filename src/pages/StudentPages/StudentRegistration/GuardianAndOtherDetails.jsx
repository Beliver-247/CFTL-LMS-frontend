
export default function GuardianAndOtherDetails({ form, handleChange, errors }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        Guardian & Other Details
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Guardian Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.nominee.name}
                onChange={(e) => handleChange(e, "nominee")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.nominee.address}
                onChange={(e) => handleChange(e, "nominee")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={form.nominee.mobile}
                onChange={(e) => handleChange(e, "nominee")}
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["nominee.mobile"] && (
                <p className="text-red-500 text-sm">
                  {errors["nominee.mobile"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIC
              </label>
              <input
                type="text"
                name="nic"
                value={form.nominee.nic}
                onChange={(e) => handleChange(e, "nominee")}
                maxLength={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["nominee.nic"] && (
                <p className="text-red-500 text-sm">
                  {errors["nominee.nic"]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Medical Information
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications / Illness
            </label>
            <textarea
              name="medical"
              value={form.medical}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
