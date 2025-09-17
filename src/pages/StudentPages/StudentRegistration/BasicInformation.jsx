
export default function BasicInformation({ form, handleChange, errors }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <p className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md">
            To be assigned upon submission
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Date
          </label>
          <input
            type="date"
            name="registrationDate"
            value={form.registrationDate}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Fee (LKR)
          </label>
          <input
            type="number"
            name="registrationFee"
            value={form.registrationFee}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.registrationFee && (
            <p className="text-red-500 text-sm">
              {errors.registrationFee}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Fee (LKR)
          </label>
          <input
            type="number"
            name="monthlyFee"
            value={form.monthlyFee}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.monthlyFee && (
            <p className="text-red-500 text-sm">{errors.monthlyFee}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pre Budget (LKR)
          </label>
          <input
            type="number"
            name="preBudget"
            value={form.preBudget}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.preBudget && (
            <p className="text-red-500 text-sm">{errors.preBudget}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount (LKR)
          </label>
          <input
            type="number"
            name="totalAmount"
            value={form.totalAmount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.totalAmount && (
            <p className="text-red-500 text-sm">{errors.totalAmount}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name in FULL (BLOCK LETTERS)
          </label>
          <input
            type="text"
            name="nameFull"
            value={form.nameFull}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nameFull && (
            <p className="text-red-500 text-sm">{errors.nameFull}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name with Initials
          </label>
          <input
            type="text"
            name="nameInitials"
            value={form.nameInitials}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nameInitials && (
            <p className="text-red-500 text-sm">
              {errors.nameInitials}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.dob && (
            <p className="text-red-500 text-sm">{errors.dob}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Religion
          </label>
          <select
            name="religion"
            value={form.religion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Buddhism">Buddhism</option>
            <option value="Catholicism">Catholicism</option>
            <option value="Islam">Islam</option>
            <option value="Hindu">Hindu</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIC (optional)
          </label>
          <input
            type="text"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            maxLength={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm">{errors.nic}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permanent Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telephone
          </label>
          <input
            type="text"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            maxLength={10}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.telephone && (
            <p className="text-red-500 text-sm">{errors.telephone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Previous School
          </label>
          <input
            type="text"
            name="previousSchool"
            value={form.previousSchool}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subjects (comma separated)
          </label>
          <input
            type="text"
            name="subjects"
            value={form.subjects}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Mathematics, Science, English"
          />
        </div>
      </div>
    </div>
  );
}
