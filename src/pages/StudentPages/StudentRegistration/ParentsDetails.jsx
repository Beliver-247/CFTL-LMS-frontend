
export default function ParentsDetails({ form, handleChange, errors }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        Parents' Details
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Mother's Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.mother.name}
                onChange={(e) => handleChange(e, "mother")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["mother.name"] && (
                <p className="text-red-500 text-sm">
                  {errors["mother.name"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={form.mother.occupation}
                onChange={(e) => handleChange(e, "mother")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["mother.occupation"] && (
                <p className="text-red-500 text-sm">
                  {errors["mother.occupation"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Address
              </label>
              <input
                type="text"
                name="workplaceAddress"
                value={form.mother.workplaceAddress}
                onChange={(e) => handleChange(e, "mother")}
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
                value={form.mother.mobile}
                onChange={(e) => handleChange(e, "mother")}
                maxLength={10}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["mother.mobile"] && (
                <p className="text-red-500 text-sm">
                  {errors["mother.mobile"]}
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
                value={form.mother.nic}
                onChange={(e) => handleChange(e, "mother")}
                maxLength={12}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["mother.nic"] && (
                <p className="text-red-500 text-sm">
                  {errors["mother.nic"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={form.mother.email}
                onChange={(e) => handleChange(e, "mother")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Father's Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.father.name}
                onChange={(e) => handleChange(e, "father")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["father.name"] && (
                <p className="text-red-500 text-sm">
                  {errors["father.name"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={form.father.occupation}
                onChange={(e) => handleChange(e, "father")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["father.occupation"] && (
                <p className="text-red-500 text-sm">
                  {errors["father.occupation"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Address
              </label>
              <input
                type="text"
                name="workplaceAddress"
                value={form.father.workplaceAddress}
                onChange={(e) => handleChange(e, "father")}
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
                value={form.father.mobile}
                onChange={(e) => handleChange(e, "father")}
                maxLength={10}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["father.mobile"] && (
                <p className="text-red-500 text-sm">
                  {errors["father.mobile"]}
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
                value={form.father.nic}
                onChange={(e) => handleChange(e, "father")}
                maxLength={12}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors["father.nic"] && (
                <p className="text-red-500 text-sm">
                  {errors["father.nic"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={form.father.email}
                onChange={(e) => handleChange(e, "father")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
